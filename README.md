# 🌿 Budget Familial

Application de suivi du budget de Paul et Laurie, installée sur vos deux téléphones
et partagée en temps réel grâce à votre Google Sheet.

- **📊 Budget** : chaque catégorie avec le prévu, le dépensé, le restant et une barre de couleur
  (vert → orange au-delà de 80 % → rouge si dépassé). Touchez une catégorie pour y saisir une dépense.
- **➕ Saisir** : catégorie, libellé, montant, date, et qui saisit (Paul ou Laurie).
- **📋 Journal** : les dépenses du mois, avec suppression (confirmation dans la page).
- **⚙️ Paramètres** : revenus, groupes et catégories (ajouter, renommer, modifier, supprimer).
- Fonctionne **sans réseau** : les saisies sont gardées sur le téléphone et envoyées dès le retour du réseau.

Comptez environ **30 minutes** pour la mise en place, à faire **une seule fois**.

> 🔄 **Vous avez déjà installé l'app et voulez la mettre à jour ?** Suivez le guide
> [MISE-A-JOUR.md](MISE-A-JOUR.md).

---

## Ce qu'il y a dans ce dossier

| Fichier | Rôle |
|---|---|
| `index.html` | L'application |
| `apps-script/Code.gs` | Le script à coller dans le Google Sheet (étapes 1 à 3) |
| `script-url.js` | L'adresse du script, **à remplir** (étape 4) |
| `data.js` | Le budget de départ (utilisé une seule fois, au tout premier lancement) |
| `manifest.json`, `sw.js`, `icons/` | Ce qui rend l'app installable et utilisable hors ligne |
| `config.example.js` | Facultatif : modèle de `config.js` pour tester sur ordinateur |
| `design-ref.html`, `budget-data.json`, `CLAUDE.md` | Fichiers de référence (pas nécessaires en ligne) |

> 🔐 **Le code famille n'est écrit nulle part sur GitHub.** Il est dans le script Google (privé)
> et chacun le saisit une fois sur son téléphone.

---

## 1. Coller le script dans le Google Sheet

1. Ouvrez votre Google Sheet :
   https://docs.google.com/spreadsheets/d/1qFHaOW76NInualINsOGFXUR7TEASou69cTYPqkCFKpI
2. Menu **Extensions → Apps Script**. Un nouvel onglet s'ouvre avec un fichier `Code.gs`.
3. Effacez tout son contenu, puis collez **tout** le contenu du fichier `apps-script/Code.gs`
   (ouvrez-le avec le Bloc-notes : clic droit → Ouvrir avec → Bloc-notes, puis Ctrl+A, Ctrl+C).
4. Cliquez sur l'icône 💾 (Enregistrer).

## 2. Choisir votre code famille

1. Tout en haut du script, trouvez la ligne :
   ```
   const ACCESS_CODE = 'CHANGEZ-MOI';
   ```
2. Remplacez `CHANGEZ-MOI` par un code de votre choix, **en gardant les apostrophes**. Exemple :
   ```
   const ACCESS_CODE = 'Lison-Poterie-2026';
   ```
   Choisissez quelque chose de difficile à deviner (pas « 1234 »). Les majuscules ne comptent pas.
3. Enregistrez (💾).
4. Dans la barre du haut, choisissez la fonction **`installer`** dans la liste déroulante,
   puis cliquez sur **▶ Exécuter**.
5. Google demande une autorisation (c'est normal, c'est votre propre script) :
   **Examiner les autorisations** → choisissez votre compte →
   « Google n'a pas validé cette application » → **Paramètres avancés** →
   **Accéder à … (non sécurisé)** → **Autoriser**.
6. En bas, le journal doit afficher « ✅ Onglets prêts ». Les onglets **Opérations** et **Config**
   sont créés dans le Sheet s'ils n'existaient pas.

## 3. Publier le script en « Application Web »

1. En haut à droite : **Déployer → Nouveau déploiement**.
2. Cliquez sur la roue ⚙️ à côté de « Sélectionner le type » → **Application Web**.
3. Remplissez :
   - Description : `Budget`
   - **Exécuter en tant que : Moi**
   - **Qui a accès : Tout le monde** ⚠️ (pas « Tout le monde avec un compte Google »)
4. **Déployer**, puis **copiez l'URL de l'application Web** (elle se termine par `/exec`).
5. Petit test : collez cette URL dans votre navigateur en ajoutant à la fin
   `?action=getAll&month=2026-09&code=VOTRE-CODE`.
   Vous devez voir un texte qui commence par `{"ok":true`. 👍

> ⚠️ **Si vous modifiez un jour le script**, il faut le republier :
> **Déployer → Gérer les déploiements → ✏️ → Version : Nouvelle version → Déployer**.
> L'URL ne change pas.

## 4. Relier l'application au script

1. Ouvrez le fichier `script-url.js` avec le Bloc-notes.
2. Collez l'URL copiée entre les apostrophes :
   ```
   window.BUDGET_SCRIPT_URL = 'https://script.google.com/macros/s/AKfy…/exec';
   ```
3. Enregistrez.

*(Facultatif, pour tester sur ordinateur : copiez `config.example.js` en `config.js` et remplissez-le.
`config.js` ne doit jamais être envoyé sur GitHub.)*

## 5. Mettre l'application en ligne (GitHub Pages, gratuit)

### Méthode simple, sans rien installer (recommandée)

> ℹ️ **Le site GitHub n'existe qu'en anglais.** Les noms des boutons sont donc donnés
> **en anglais, tels qu'ils apparaissent à l'écran**, avec leur traduction entre parenthèses.
> (N'utilisez pas la traduction automatique du navigateur : les boutons ne correspondraient plus.)

**A. Créer le compte**

1. Allez sur https://github.com et cliquez sur **Sign up** (S'inscrire), en haut à droite.
2. Saisissez votre e-mail, un mot de passe et un nom d'utilisateur (ex. `pauldg`), puis suivez les étapes
   (un code de vérification est envoyé par e-mail).
   ➜ Ce nom d'utilisateur fera partie de l'adresse de l'app : `https://pauldg.github.io/…`

**B. Créer le « dépôt » (le dossier en ligne qui contiendra l'app)**

3. Une fois connecté, cliquez sur le bouton **＋** en haut à droite de la page (à côté de votre photo de profil),
   puis sur **New repository** (Nouveau dépôt).
4. Sur la page **Create a new repository** (Créer un nouveau dépôt) :
   - **Repository name** (Nom du dépôt) : tapez `budget-familial`
   - Juste en dessous, laissez coché **Public** (obligatoire pour la publication gratuite)
   - Ne cochez rien d'autre
   - Tout en bas, cliquez sur le bouton vert **Create repository** (Créer le dépôt).

**C. Envoyer les fichiers**

5. Vous arrivez sur une page intitulée **Quick setup** (Démarrage rapide).
   Dans la phrase « …or create a new file or **uploading an existing file** », cliquez sur le lien bleu
   **uploading an existing file** (envoyer un fichier existant).
6. Une grande zone **Drag files here to add them to your repository** (Glissez vos fichiers ici) s'affiche.
   Ouvrez le dossier `Budget` de votre Bureau dans l'Explorateur Windows, sélectionnez
   ces éléments (Ctrl + clic) et **faites-les glisser dans la zone** :
   `index.html`, `manifest.json`, `sw.js`, `data.js`, `script-url.js`, `config.example.js`,
   `.gitignore`, `README.md`, et les **dossiers** `icons` et `apps-script`.
   ⛔ **N'envoyez pas `config.js`** s'il existe.
   *(Le fichier `.gitignore` est caché par Windows : si vous ne le voyez pas, ce n'est pas grave.)*
7. Attendez que la liste des fichiers apparaisse sous la zone, puis tout en bas cliquez sur le bouton vert
   **Commit changes** (Enregistrer les modifications).

**D. Activer la publication (GitHub Pages)**

8. En haut de la page du dépôt, sous son nom, il y a une rangée d'onglets :
   **Code · Issues · Pull requests · Actions · … · Settings**.
   Cliquez sur **Settings** (Paramètres), avec l'icône ⚙️, tout à droite.
9. Dans le menu à gauche, rubrique **Code and automation**, cliquez sur **Pages**.
10. Dans le cadre **Build and deployment** (Construction et déploiement) :
    - **Source** : laissez **Deploy from a branch** (Déployer depuis une branche)
    - **Branch** (Branche) : cliquez sur le bouton **None** (Aucune) et choisissez **main** ;
      à côté, laissez **/ (root)** (racine)
    - Cliquez sur **Save** (Enregistrer).
11. Attendez 1 à 2 minutes puis rechargez la page (touche F5). En haut apparaît :
    **Your site is live at https://VOTRE-NOM.github.io/budget-familial/** (Votre site est en ligne)
    avec un bouton **Visit site** (Voir le site). Cliquez dessus pour vérifier : c'est l'adresse
    à installer sur les téléphones.

### Méthode avec Git (si vous l'installez un jour : https://git-scm.com)

Dans le dossier du projet (clic droit → « Open Git Bash here ») :

```bash
git init
```
```bash
git add .
```
```bash
git commit -m "Budget Familial"
```
```bash
git branch -M main
```
```bash
git remote add origin https://github.com/VOTRE-NOM/budget-familial.git
```
```bash
git push -u origin main
```

Puis activez GitHub Pages comme au point 6 ci-dessus. (`config.js` est automatiquement exclu grâce à `.gitignore`.)

### Mettre à jour l'application plus tard

Sur la page du dépôt (onglet **Code**), cliquez sur le bouton **Add file** (Ajouter un fichier)
→ **Upload files** (Envoyer des fichiers), glissez les fichiers modifiés, puis **Commit changes**.
Les téléphones récupèrent la nouvelle version tout seuls à la prochaine ouverture (avec réseau).

## 6. Installer sur iPhone

1. Ouvrez l'adresse de l'app dans **Safari** (pas Chrome : sur iPhone, seul Safari sait installer).
2. Touchez le bouton **Partager** (carré avec une flèche vers le haut).
3. Faites défiler → **Sur l'écran d'accueil** → **Ajouter**.
4. Ouvrez l'app depuis sa nouvelle icône 🌿, choisissez **Paul** ou **Laurie**,
   tapez le **code famille** → **Commencer**.

> Important : faites cette dernière étape **depuis l'icône**, pas dans Safari
> (sur iPhone, l'app installée a sa propre mémoire).

## 7. Installer sur Android

1. Ouvrez l'adresse de l'app dans **Chrome**.
2. Menu **⋮** (en haut à droite) → **Ajouter à l'écran d'accueil** (ou **Installer l'application**) → **Installer**.
3. Ouvrez l'app depuis l'icône, choisissez votre prénom, tapez le code famille → **Commencer**.

## 8. Envoyer l'app à Laurie

Envoyez-lui par SMS **l'adresse de l'app** (`https://VOTRE-NOM.github.io/budget-familial/`)
et, **séparément** (de vive voix, c'est encore mieux), **le code famille**.
Elle suit l'étape 6 (iPhone) ou 7 (Android). C'est tout !

Au tout premier lancement, l'onglet **Config** du Google Sheet se remplit automatiquement
avec votre budget de départ (31 catégories, 2 revenus).

---

## 9. Ça ne synchronise pas ? Checklist de dépannage

Regardez la petite ligne sous le titre de l'app (touchez-la pour relancer une synchronisation) :

| Message | Que faire |
|---|---|
| **À jour · 14:32** | Tout va bien ✅ |
| **Hors ligne – 2 opérations en attente** | Pas de réseau. Rien à faire : l'envoi se fera tout seul au retour du réseau. |
| **Serveur injoignable** alors que le téléphone a internet | Le script n'est pas accessible : vérifiez l'étape 3 (**Qui a accès : Tout le monde**) et l'URL dans `script-url.js` (étape 4, elle doit finir par `/exec`). |
| **⚠️ Code non choisi dans le script** | Vous avez gardé `CHANGEZ-MOI` : refaites l'étape 2, puis **republiez** (encadré de l'étape 3). |
| **⚠️ Code famille refusé** | Le code a changé dans le script. L'app redemande le code : saisissez le nouveau. |
| **⚠️ Réponse inattendue du script** | Le déploiement a un souci : refaites **Déployer → Gérer les déploiements → Nouvelle version**. |
| **Mode local (non relié au Google Sheet)** | `script-url.js` est vide sur GitHub : refaites l'étape 4, puis renvoyez ce fichier (étape 5). |

Autres vérifications :

1. **Le test de l'étape 3.5** affiche-t-il `{"ok":true…}` ? Sinon, le problème est côté script.
2. **Vous avez modifié le script ?** Il faut **toujours** publier une **nouvelle version** (étape 3, encadré).
3. **Les deux téléphones ont-ils le même mois affiché ?** (bouton du mois en haut)
4. **Le Sheet** : ne renommez pas les onglets `Opérations` et `Config`, et ne changez pas l'ordre des colonnes.
   Vous pouvez en revanche ajouter une dépense à la main dans `Opérations` (date au format `2026-09-30`
   ou `30/09/2026`) : l'app la verra.
5. **En dernier recours** : dans l'app, **⚙️ Paramètres → Code famille**, ressaisissez le code.
   Sur iPhone, vous pouvez aussi supprimer l'icône et refaire l'étape 6 (les données sont dans le Sheet,
   rien n'est perdu — sauf d'éventuelles saisies « en attente » faites hors ligne).

---

## Pour info : comment sont rangées les données dans le Sheet

**Onglet Opérations** : `id | date | categorie | libelle | montant | auteur`

**Onglet Config** : `type | nom | montant | groupe | ordre | fixe`, où `type` vaut :
- `revenu` — un revenu mensuel,
- `depense` — une catégorie de dépense (avec son montant prévu et son groupe),
- `groupe` — un groupe (permet de garder un groupe même quand il est encore vide, et son ordre d'affichage).

`ordre` donne la position des familles et des catégories dans l'onglet 📊 Budget (bouton **Réorganiser**).
`fixe` vaut `OUI` (charge fixe, ligne bleue) ou `NON` (charge variable, ligne rose).

Les dépenses créées par la coche « payé en une fois » ont un identifiant qui commence par `auto-`
et le libellé « Paiement mensuel » : décocher ne supprime que celles-là.

Si Paul et Laurie modifient les **Paramètres** exactement en même temps, c'est la dernière
modification enregistrée qui l'emporte. Les **dépenses**, elles, ne se marchent jamais dessus.
