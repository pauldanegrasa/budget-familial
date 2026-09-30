// ─────────────────────────────────────────────────────────────
//  config.js — FACULTATIF, pour tester l'app sur votre ordinateur
// ─────────────────────────────────────────────────────────────
//  Copiez ce fichier sous le nom « config.js » et remplissez-le.
//  config.js n'est jamais publié sur GitHub (il est dans .gitignore).
//
//  • SCRIPT_URL  : l'URL de l'Application Web Apps Script (se termine
//                  par /exec). Si vide, l'app utilise script-url.js.
//  • ACCESS_CODE : le code famille choisi dans Code.gs. S'il est rempli,
//                  l'app ne le demande pas au démarrage.
//
//  Sur les téléphones, ce fichier n'existe pas : l'URL vient de
//  script-url.js et le code famille est saisi une fois au 1er lancement.
// ─────────────────────────────────────────────────────────────
window.BUDGET_CONFIG = {
  SCRIPT_URL: '',
  ACCESS_CODE: ''
};
