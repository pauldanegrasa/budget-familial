// Données budget initiales (issues de budget-data.json).
// Elles ne servent qu'au tout premier lancement : si l'onglet « Config »
// du Google Sheet est vide, l'app les y envoie. Ensuite, c'est le Sheet
// qui fait foi (modifications via l'onglet ⚙️ Paramètres).
window.BUDGET_DATA = {
  revenus: [
    { nom: "Salaire Paul",         montant: 2217 },
    { nom: "Salaire Laurie (PTZ)", montant: 1732 }
  ],
  groupes: [
    "🏠 Logement & crédits",
    "🛡️ Assurances",
    "⚡ Charges maison",
    "📱 Abonnements",
    "💰 Épargne",
    "👶 Famille",
    "🚗 Transport",
    "🛒 Vie courante",
    "👤 Personnel"
  ],
  depenses: [
    { groupe: "🏠 Logement & crédits", nom: "Crédit Maison",           montant: 814 },
    { groupe: "🏠 Logement & crédits", nom: "PTZ",                     montant: 156 },
    { groupe: "🏠 Logement & crédits", nom: "Crédit Travaux",          montant: 198 },
    { groupe: "🏠 Logement & crédits", nom: "Impôt foncier",           montant: 100 },

    { groupe: "🛡️ Assurances",         nom: "Assurance crédit Paul",   montant: 16 },
    { groupe: "🛡️ Assurances",         nom: "Assurance crédit Laurie", montant: 23 },
    { groupe: "🛡️ Assurances",         nom: "Assurance famille",       montant: 13 },
    { groupe: "🛡️ Assurances",         nom: "Assurance Maison",        montant: 67 },
    { groupe: "🛡️ Assurances",         nom: "Assurance BMW iX1",       montant: 95 },

    { groupe: "⚡ Charges maison",      nom: "Électricité",             montant: 300 },
    { groupe: "⚡ Charges maison",      nom: "Eau",                     montant: 62 },
    { groupe: "⚡ Charges maison",      nom: "Alarme",                  montant: 56 },
    { groupe: "⚡ Charges maison",      nom: "Internet + Téléphone",    montant: 95 },

    { groupe: "📱 Abonnements",         nom: "Netflix",                 montant: 13 },
    { groupe: "📱 Abonnements",         nom: "Amazon",                  montant: 7 },
    { groupe: "📱 Abonnements",         nom: "Darty Max",               montant: 17 },
    { groupe: "📱 Abonnements",         nom: "Deezer",                  montant: 15 },

    { groupe: "💰 Épargne",             nom: "Casden Paul",             montant: 10 },
    { groupe: "💰 Épargne",             nom: "Casden Laurie",           montant: 10 },
    { groupe: "💰 Épargne",             nom: "PEL Laurie",              montant: 50 },
    { groupe: "💰 Épargne",             nom: "Cotisations",             montant: 22 },

    { groupe: "👶 Famille",             nom: "Nounou",                  montant: 239 },
    { groupe: "👶 Famille",             nom: "Couches Lison",           montant: 52 },

    { groupe: "🚗 Transport",           nom: "Voitures",                montant: 352 },

    { groupe: "🛒 Vie courante",        nom: "Courses alimentaires",    montant: 400 },
    { groupe: "🛒 Vie courante",        nom: "Animaux",                 montant: 180 },
    { groupe: "🛒 Vie courante",        nom: "Imprévus",                montant: 100 },

    { groupe: "👤 Personnel",           nom: "Laurie",                  montant: 200 },
    { groupe: "👤 Personnel",           nom: "Paul",                    montant: 100 },
    { groupe: "👤 Personnel",           nom: "Lison",                   montant: 100 },
    { groupe: "👤 Personnel",           nom: "Poterie",                 montant: 74 }
  ]
};
