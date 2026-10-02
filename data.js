// Données budget initiales (issues de budget-data.json).
// Elles ne servent qu'au tout premier lancement : si l'onglet « Config »
// du Google Sheet est vide, l'app les y envoie. Ensuite, c'est le Sheet
// qui fait foi (modifications via l'onglet ⚙️ Paramètres).
// fixe : true = charge fixe (bleu), false = charge variable (violet).
window.BUDGET_DATA = {
  revenus: [
    { nom: "Salaire Paul",         montant: 2217 },
    { nom: "Salaire Laurie (PTZ)", montant: 1732 }
  ],
  groupes: [
    "🛒 Vie courante",
    "👤 Personnel",
    "🚗 Transport",
    "👶 Famille",
    "📱 Abonnements",
    "⚡ Charges maison",
    "🛡️ Assurances",
    "💰 Épargne",
    "🏠 Logement & crédits"
  ],
  depenses: [
    { groupe: "🏠 Logement & crédits", nom: "Crédit Maison",           montant: 814, fixe: true  },
    { groupe: "🏠 Logement & crédits", nom: "PTZ",                     montant: 156, fixe: true  },
    { groupe: "🏠 Logement & crédits", nom: "Crédit Travaux",          montant: 198, fixe: true  },
    { groupe: "🏠 Logement & crédits", nom: "Impôt foncier",           montant: 100, fixe: true  },

    { groupe: "🛡️ Assurances",         nom: "Assurance crédit Paul",   montant: 16, fixe: true  },
    { groupe: "🛡️ Assurances",         nom: "Assurance crédit Laurie", montant: 23, fixe: true  },
    { groupe: "🛡️ Assurances",         nom: "Assurance famille",       montant: 13, fixe: true  },
    { groupe: "🛡️ Assurances",         nom: "Assurance Maison",        montant: 67, fixe: true  },
    { groupe: "🛡️ Assurances",         nom: "Assurance BMW iX1",       montant: 95, fixe: true  },

    { groupe: "⚡ Charges maison",      nom: "Électricité",             montant: 300, fixe: true  },
    { groupe: "⚡ Charges maison",      nom: "Eau",                     montant: 62, fixe: true  },
    { groupe: "⚡ Charges maison",      nom: "Alarme",                  montant: 56, fixe: true  },
    { groupe: "⚡ Charges maison",      nom: "Internet + Téléphone",    montant: 95, fixe: true  },

    { groupe: "📱 Abonnements",         nom: "Netflix",                 montant: 13, fixe: true  },
    { groupe: "📱 Abonnements",         nom: "Amazon",                  montant: 7, fixe: true  },
    { groupe: "📱 Abonnements",         nom: "Darty Max",               montant: 17, fixe: true  },
    { groupe: "📱 Abonnements",         nom: "Deezer",                  montant: 15, fixe: true  },

    { groupe: "💰 Épargne",             nom: "Casden Paul",             montant: 10, fixe: true  },
    { groupe: "💰 Épargne",             nom: "Casden Laurie",           montant: 10, fixe: true  },
    { groupe: "💰 Épargne",             nom: "PEL Laurie",              montant: 50, fixe: true  },
    { groupe: "💰 Épargne",             nom: "Cotisations",             montant: 22, fixe: true  },

    { groupe: "👶 Famille",             nom: "Nounou",                  montant: 239, fixe: true  },
    { groupe: "👶 Famille",             nom: "Couches Lison",           montant: 52, fixe: false },

    { groupe: "🚗 Transport",           nom: "Voitures",                montant: 352, fixe: false },

    { groupe: "🛒 Vie courante",        nom: "Courses alimentaires",    montant: 400, fixe: false },
    { groupe: "🛒 Vie courante",        nom: "Animaux",                 montant: 180, fixe: false },
    { groupe: "🛒 Vie courante",        nom: "Imprévus",                montant: 100, fixe: false },

    { groupe: "👤 Personnel",           nom: "Laurie",                  montant: 200, fixe: false },
    { groupe: "👤 Personnel",           nom: "Paul",                    montant: 100, fixe: false },
    { groupe: "👤 Personnel",           nom: "Lison",                   montant: 100, fixe: false },
    { groupe: "👤 Personnel",           nom: "Poterie",                 montant: 74, fixe: false }
  ]
};
