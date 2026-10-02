/**
 * ═══════════════════════════════════════════════════════════════════
 *  BUDGET FAMILIAL — Script Google Apps Script (API de l'application)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Où le coller : Google Sheet → Extensions → Apps Script
 *                 (remplacer tout le contenu de « Code.gs »)
 *
 *  Déploiement  : Déployer → Nouveau déploiement → ⚙️ Application Web
 *                 • Exécuter en tant que : Moi
 *                 • Qui a accès          : Tout le monde
 *
 *  ⚠️ APRÈS TOUTE MODIFICATION DE CE FICHIER, IL FAUT REDÉPLOYER :
 *     Déployer → Gérer les déploiements → ✏️ (crayon)
 *     → Version : « Nouvelle version » → Déployer
 *     (l'URL reste la même, rien à changer dans l'application)
 *
 *  API (réponses en JSON) :
 *    GET  ?action=getAll&month=AAAA-MM&code=…  → config + opérations du mois
 *    POST (corps JSON envoyé en text/plain)     → { action, code, … }
 *         action = init | addOperation | deleteOperation | saveConfig
 * ═══════════════════════════════════════════════════════════════════
 */

// 👉 ÉTAPE À FAIRE : remplacez CHANGEZ-MOI par votre « code famille ».
//    C'est ce code que Paul et Laurie saisiront une seule fois dans l'app.
//    (majuscules / minuscules et espaces autour ne comptent pas)
const ACCESS_CODE = 'CHANGEZ-MOI';

// Identifiant du Google Sheet (utilisé seulement si le script n'est pas
// rattaché directement au classeur).
const SHEET_ID = '1qFHaOW76NInualINsOGFXUR7TEASou69cTYPqkCFKpI';

const ONGLET_OPERATIONS  = 'Opérations';
const ONGLET_CONFIG      = 'Config';
const ENTETES_OPERATIONS = ['id', 'date', 'categorie', 'libelle', 'montant', 'auteur'];
const ENTETES_CONFIG     = ['type', 'nom', 'montant', 'groupe', 'ordre', 'fixe'];

// Version de l'API : l'app s'en sert pour savoir si ce script gère la colonne « fixe »
const API_VERSION = 2;


// ── POINTS D'ENTRÉE WEB ─────────────────────────────────────────────

function doGet(e) {
  return repondre_(traiter_((e && e.parameter) || {}));
}

function doPost(e) {
  let params;
  try {
    params = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return repondre_({ ok: false, error: 'invalid', message: 'Requête illisible' });
  }
  return repondre_(traiter_(params));
}

// Réponse JSON. Les applications Web Apps Script ajoutent d'elles-mêmes
// l'en-tête CORS « Access-Control-Allow-Origin: * » ; l'app envoie ses POST
// en text/plain pour éviter la requête préalable (preflight) non gérée ici.
function repondre_(objet) {
  objet.apiVersion = API_VERSION;
  return ContentService
    .createTextOutput(JSON.stringify(objet))
    .setMimeType(ContentService.MimeType.JSON);
}

function traiter_(p) {
  try {
    if (!normaliserCode_(ACCESS_CODE) || ACCESS_CODE === 'CHANGEZ-MOI') {
      return { ok: false, error: 'config', message: "Le code d'accès n'a pas été choisi dans le script (ACCESS_CODE)." };
    }
    if (normaliserCode_(p.code) !== normaliserCode_(ACCESS_CODE)) {
      return { ok: false, error: 'code', message: 'Code famille incorrect' };
    }
    switch (p.action) {
      case 'getAll':          return lireTout_(p.month);
      case 'init':            return avecVerrou_(function () { return initialiser_(p.config); });
      case 'addOperation':    return avecVerrou_(function () { return ajouterOperation_(p.op); });
      case 'deleteOperation': return avecVerrou_(function () { return supprimerOperation_(p.id); });
      case 'saveConfig':      return avecVerrou_(function () { return enregistrerConfig_(p.config, p.renames); });
      default:
        return { ok: false, error: 'invalid', message: 'Action inconnue : ' + p.action };
    }
  } catch (err) {
    if (err && err.invalide) return { ok: false, error: 'invalid', message: err.message };
    return { ok: false, error: 'server', message: String((err && err.message) || err) };
  }
}


// ── ACTIONS ─────────────────────────────────────────────────────────

// Configuration + opérations d'un mois donné (AAAA-MM)
function lireTout_(mois) {
  if (!/^\d{4}-\d{2}$/.test(String(mois || ''))) throw invalide_('Mois invalide');
  const ops = lireOperations_().filter(function (o) { return o.date.slice(0, 7) === mois; });
  return { ok: true, config: lireConfig_(), ops: ops, serverTime: new Date().toISOString() };
}

// Premier lancement : remplit l'onglet Config s'il est vide
function initialiser_(config) {
  if (!lireConfig_()) ecrireConfig_(nettoyerConfig_(config));
  return { ok: true, config: lireConfig_() };
}

function ajouterOperation_(op) {
  op = op || {};
  const id = texte_(op.id);
  const date = texte_(op.date);
  const categorie = texte_(op.categorie);
  const montant = nombre_(op.montant);
  if (!id || id.length > 64) throw invalide_('Identifiant invalide');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw invalide_('Date invalide');
  if (!categorie) throw invalide_('Catégorie manquante');
  if (!(montant > 0)) throw invalide_('Montant invalide');

  const sh = onglet_(ONGLET_OPERATIONS, ENTETES_OPERATIONS);
  // Déjà enregistrée (envoi rejoué après une coupure réseau) : on ne double pas
  if (trouverLigne_(sh, id) > 0) return { ok: true, doublon: true };

  const ligne = sh.getLastRow() + 1;
  const plage = sh.getRange(ligne, 1, 1, 6);
  // Colonnes en « texte brut » pour que Sheets ne transforme pas les valeurs
  plage.setNumberFormats([['@', '@', '@', '@', '#,##0.00', '@']]);
  plage.setValues([[id, date, categorie, texte_(op.libelle).slice(0, 200),
                    Math.round(montant * 100) / 100, texte_(op.auteur).slice(0, 40)]]);
  return { ok: true };
}

function supprimerOperation_(id) {
  id = texte_(id);
  if (!id) throw invalide_('Identifiant manquant');
  const sh = onglet_(ONGLET_OPERATIONS, ENTETES_OPERATIONS);
  const ligne = trouverLigne_(sh, id);
  if (ligne > 0) sh.deleteRow(ligne);
  return { ok: true };
}

// Remplace toute la configuration ; « renames » = [{from, to}] renomme aussi
// la catégorie dans les opérations déjà saisies.
function enregistrerConfig_(config, renames) {
  const propre = nettoyerConfig_(config);
  const renommages = (Array.isArray(renames) ? renames : [])
    .map(function (r) { return { from: texte_(r && r.from), to: texte_(r && r.to) }; })
    .filter(function (r) { return r.from && r.to && r.from !== r.to; });

  if (renommages.length) {
    const sh = onglet_(ONGLET_OPERATIONS, ENTETES_OPERATIONS);
    const n = sh.getLastRow() - 1;
    if (n > 0) {
      const plage = sh.getRange(2, 3, n, 1);
      const valeurs = plage.getValues();
      let modifie = false;
      valeurs.forEach(function (ligne) {
        let cat = String(ligne[0]);
        renommages.forEach(function (r) { if (cat === r.from) { cat = r.to; modifie = true; } });
        ligne[0] = cat;
      });
      if (modifie) {
        plage.setNumberFormat('@');
        plage.setValues(valeurs);
      }
    }
  }
  ecrireConfig_(propre);
  return { ok: true, config: lireConfig_() };
}


// ── LECTURE / ÉCRITURE DU SHEET ─────────────────────────────────────

function lireOperations_() {
  const sh = onglet_(ONGLET_OPERATIONS, ENTETES_OPERATIONS);
  const n = sh.getLastRow() - 1;
  if (n <= 0) return [];
  const valeurs = sh.getRange(2, 1, n, 6).getValues();
  const ops = [];
  const sansId = [];
  valeurs.forEach(function (r, i) {
    const date = texteDate_(r[1]);
    if (!date) return; // ligne vide ou incomplète
    let id = texte_(r[0]);
    if (!id) { // ligne ajoutée à la main dans le Sheet : on lui donne un id
      id = 'm' + Utilities.getUuid().replace(/-/g, '').slice(0, 12);
      sansId.push({ ligne: i + 2, id: id });
    }
    ops.push({
      id: id,
      date: date,
      categorie: texte_(r[2]),
      libelle: texte_(r[3]),
      montant: nombre_(r[4]),
      auteur: texte_(r[5])
    });
  });
  if (sansId.length) {
    avecVerrou_(function () {
      sansId.forEach(function (s) {
        sh.getRange(s.ligne, 1).setNumberFormat('@').setValue(s.id);
      });
    });
  }
  return ops;
}

// Retourne { revenus:[{nom,montant}], groupes:[nom], depenses:[{nom,montant,groupe}] }
// ou null si l'onglet Config est vide.
function lireConfig_() {
  const sh = onglet_(ONGLET_CONFIG, ENTETES_CONFIG);
  const n = sh.getLastRow() - 1;
  if (n <= 0) return null;
  const valeurs = sh.getRange(2, 1, n, 6).getValues();
  const revenus = [], groupes = [], depenses = [];
  valeurs.forEach(function (r, i) {
    const type = texte_(r[0]).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const nom = texte_(r[1]);
    if (!nom) return;
    const ordre = (r[4] === '' || r[4] === null || isNaN(Number(r[4]))) ? 100000 + i : Number(r[4]);
    if (type === 'revenu') revenus.push({ nom: nom, montant: nombre_(r[2]), ordre: ordre });
    else if (type === 'groupe') groupes.push({ nom: nom, ordre: ordre });
    else if (type === 'depense') depenses.push({ nom: nom, montant: nombre_(r[2]), groupe: texte_(r[3]) || 'Autres', ordre: ordre, fixe: lireFixe_(r[5]) });
  });
  if (!revenus.length && !groupes.length && !depenses.length) return null;
  const parOrdre = function (a, b) { return a.ordre - b.ordre; };
  revenus.sort(parOrdre); groupes.sort(parOrdre); depenses.sort(parOrdre);

  const nomsGroupes = groupes.map(function (g) { return g.nom; });
  depenses.forEach(function (d) { if (nomsGroupes.indexOf(d.groupe) < 0) nomsGroupes.push(d.groupe); });
  return {
    revenus: revenus.map(function (r) { return { nom: r.nom, montant: r.montant }; }),
    groupes: nomsGroupes,
    depenses: depenses.map(function (d) { return { nom: d.nom, montant: d.montant, groupe: d.groupe, fixe: d.fixe }; })
  };
}

// Colonne « fixe » : OUI → true, NON → false, vide → null (pas encore renseigné)
function lireFixe_(v) {
  if (v === true || v === false) return v;
  const s = texte_(v).toUpperCase();
  if (s === 'OUI' || s === 'O' || s === 'VRAI' || s === 'TRUE' || s === 'X') return true;
  if (s === 'NON' || s === 'N' || s === 'FAUX' || s === 'FALSE') return false;
  return null;
}

function ecrireConfig_(config) {
  const sh = onglet_(ONGLET_CONFIG, ENTETES_CONFIG);
  const derniere = sh.getLastRow();
  if (derniere > 1) sh.getRange(2, 1, derniere - 1, 6).clearContent();

  const ouiNon = function (f) { return f === true ? 'OUI' : f === false ? 'NON' : ''; };
  const lignes = [];
  config.revenus.forEach(function (r, i)  { lignes.push(['revenu', r.nom, r.montant, '', i + 1, '']); });
  config.groupes.forEach(function (g, i)  { lignes.push(['groupe', g, '', '', i + 1, '']); });
  config.depenses.forEach(function (d, i) { lignes.push(['depense', d.nom, d.montant, d.groupe, i + 1, ouiNon(d.fixe)]); });
  if (!lignes.length) return;

  const plage = sh.getRange(2, 1, lignes.length, 6);
  plage.setNumberFormats(lignes.map(function () { return ['@', '@', '#,##0.00', '@', '0', '@']; }));
  plage.setValues(lignes);
}

// Vérifie et nettoie une configuration envoyée par l'app
function nettoyerConfig_(config) {
  if (!config || typeof config !== 'object') throw invalide_('Configuration manquante');
  const revenus = (Array.isArray(config.revenus) ? config.revenus : [])
    .map(function (r) { return { nom: texte_(r && r.nom).slice(0, 80), montant: arrondi_(nombre_(r && r.montant)) }; })
    .filter(function (r) { return r.nom; });
  const depenses = (Array.isArray(config.depenses) ? config.depenses : [])
    .map(function (d) {
      return { nom: texte_(d && d.nom).slice(0, 80), montant: arrondi_(nombre_(d && d.montant)),
               groupe: texte_(d && d.groupe).slice(0, 80) || 'Autres',
               fixe: d && typeof d.fixe === 'boolean' ? d.fixe : null };
    })
    .filter(function (d) { return d.nom; });
  const groupes = [];
  (Array.isArray(config.groupes) ? config.groupes : []).forEach(function (g) {
    g = texte_(g).slice(0, 80);
    if (g && groupes.indexOf(g) < 0) groupes.push(g);
  });
  depenses.forEach(function (d) { if (groupes.indexOf(d.groupe) < 0) groupes.push(d.groupe); });
  if (!revenus.length && !depenses.length) throw invalide_('Configuration vide');
  return { revenus: revenus, groupes: groupes, depenses: depenses };
}


// ── OUTILS ──────────────────────────────────────────────────────────

function classeur_() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) return ss;
  } catch (e) { /* script non rattaché : on ouvre par ID */ }
  return SpreadsheetApp.openById(SHEET_ID);
}

// Renvoie l'onglet demandé, en le créant (avec ses en-têtes) si besoin
function onglet_(nom, entetes) {
  const ss = classeur_();
  let sh = ss.getSheetByName(nom);
  if (!sh) sh = ss.insertSheet(nom);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, entetes.length).setValues([entetes]).setFontWeight('bold');
    sh.setFrozenRows(1);
  } else {
    // Onglet existant : on complète seulement les en-têtes manquants à droite
    // (ex. la colonne « fixe »), sans toucher aux colonnes déjà présentes
    const ligne1 = sh.getRange(1, 1, 1, entetes.length).getValues()[0];
    entetes.forEach(function (nom, i) {
      if (texte_(ligne1[i]) === '') sh.getRange(1, i + 1).setValue(nom).setFontWeight('bold');
    });
  }
  return sh;
}

// Numéro de ligne (≥ 2) de l'opération « id », ou 0 si absente
function trouverLigne_(sh, id) {
  const n = sh.getLastRow() - 1;
  if (n <= 0) return 0;
  const ids = sh.getRange(2, 1, n, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).trim() === id) return i + 2;
  }
  return 0;
}

// Une seule écriture à la fois (Paul et Laurie en même temps)
function avecVerrou_(fn) {
  const verrou = LockService.getScriptLock();
  verrou.waitLock(20000);
  try {
    const resultat = fn();
    SpreadsheetApp.flush();
    return resultat;
  } finally {
    verrou.releaseLock();
  }
}

function texteDate_(v) {
  if (v instanceof Date && !isNaN(v)) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  const s = texte_(v);
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return m[1] + '-' + m[2] + '-' + m[3];
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); // saisie à la main : 05/09/2026
  if (m) return m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2);
  return '';
}

function texte_(v) {
  return v === null || v === undefined ? '' : String(v).trim();
}

function nombre_(v) {
  if (typeof v === 'number') return isFinite(v) ? v : 0;
  const n = parseFloat(texte_(v).replace(/[\s  €]/g, '').replace(',', '.'));
  return isFinite(n) ? n : 0;
}

function arrondi_(n) {
  return Math.max(0, Math.round(n * 100) / 100);
}

function normaliserCode_(c) {
  return texte_(c).toLowerCase();
}

function invalide_(message) {
  const e = new Error(message);
  e.invalide = true;
  return e;
}


// ── À LANCER À LA MAIN (menu ▶ Exécuter) ────────────────────────────

// Crée les onglets si besoin et vérifie que tout fonctionne.
// Lancez-la une fois : Google vous demandera l'autorisation d'accéder au Sheet.
function installer() {
  onglet_(ONGLET_OPERATIONS, ENTETES_OPERATIONS);
  onglet_(ONGLET_CONFIG, ENTETES_CONFIG);
  const mois = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM');
  const r = lireTout_(mois);
  Logger.log('✅ Onglets prêts. Catégories dans Config : ' + (r.config ? r.config.depenses.length : 0) +
             ' — opérations ce mois-ci : ' + r.ops.length);
  if (ACCESS_CODE === 'CHANGEZ-MOI') Logger.log('⚠️ Pensez à choisir votre code famille (ACCESS_CODE, en haut du fichier).');
}
