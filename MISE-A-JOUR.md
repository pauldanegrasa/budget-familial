# 🔄 Mettre à jour l'application — version « familles + lignes »

Ce guide installe la nouvelle version de l'onglet 📊 Budget :
- un widget par famille, avec ses catégories en lignes en dessous ;
- les couleurs **bleu = charge fixe** et **rose = charge variable** ;
- la coche « payé en une fois » ;
- le bouton **↕ Réorganiser**.

⏱️ Comptez **15 minutes**. Faites les étapes **dans l'ordre**.

> **Vos données ne risquent rien.** Les dépenses déjà saisies ne sont pas touchées. Dans l'onglet
> **Config** du Google Sheet, une seule colonne est ajoutée à droite (**F « fixe »**) ; les autres
> colonnes ne bougent pas.

---

## Avant de commencer : afficher les noms complets des fichiers

Windows cache la fin des noms de fichiers (`.html`, `.js`…). Pour bien les reconnaître :

1. Ouvrez le dossier **Budget** sur votre Bureau.
2. En haut, cliquez sur l'onglet **Affichage**.
3. Cochez **Extensions de noms de fichiers**.

Vous voyez maintenant `index.html`, `sw.js`, `data.js`, etc.

---

## Étape 1 — Mettre à jour le script Google (≈ 5 min)

### 1.a Noter votre code famille actuel

1. Ouvrez votre Google Sheet :
   https://docs.google.com/spreadsheets/d/1qFHaOW76NInualINsOGFXUR7TEASou69cTYPqkCFKpI
2. Menu **Extensions → Apps Script**.
3. Tout en haut du script, repérez la ligne :
   ```
   const ACCESS_CODE = 'votre-code';
   ```
   📝 **Notez votre code** sur un papier (ce qui est entre les apostrophes). Vous en aurez besoin au point 1.b.

### 1.b Remplacer le script

1. Sur votre ordinateur, ouvrez le dossier **Budget → apps-script**.
2. Faites un clic droit sur **Code.gs** → **Ouvrir avec** → **Bloc-notes**.
3. Dans le Bloc-notes : **Ctrl + A** (tout sélectionner), puis **Ctrl + C** (copier).
4. Revenez dans Apps Script, cliquez dans le texte du script, puis :
   **Ctrl + A** (tout sélectionner) et **Ctrl + V** (coller). L'ancien script est remplacé.
5. ⚠️ **Tout en haut, remettez votre code famille** à la place de `CHANGEZ-MOI` :
   ```
   const ACCESS_CODE = 'votre-code';
   ```
   (gardez les apostrophes ; c'est le code noté au point 1.a)
6. Cliquez sur l'icône 💾 (**Enregistrer**).

> ❗ Si vous oubliez le point 5, les téléphones afficheront « Code famille refusé » ou
> « Code non choisi dans le script ». Il suffit alors de corriger le code et de refaire le point 1.c.

### 1.c Publier la nouvelle version du script

Sans ce point, l'ancien script continue de tourner.

1. En haut à droite, cliquez sur **Déployer** → **Gérer les déploiements**.
2. Dans la fenêtre, cliquez sur l'icône ✏️ (**Modifier**), en haut à droite.
3. Dans la liste **Version**, choisissez **Nouvelle version**.
4. Cliquez sur **Déployer**, puis sur **OK**.

L'adresse du script ne change pas : vous n'avez rien à modifier dans l'application.

---

## Étape 2 — Envoyer les nouveaux fichiers sur GitHub (≈ 5 min)

> Le site GitHub est en anglais : les boutons sont indiqués **tels qu'ils s'affichent**, avec la traduction entre parenthèses.

1. Allez sur https://github.com et connectez-vous.
2. Ouvrez votre dépôt **budget-familial** : cliquez sur votre photo en haut à droite →
   **Your repositories** (Vos dépôts) → **budget-familial**.
3. Au-dessus de la liste des fichiers, cliquez sur le bouton **Add file** (Ajouter un fichier),
   puis sur **Upload files** (Envoyer des fichiers).
4. Dans l'Explorateur Windows, ouvrez le dossier **Budget**. Sélectionnez ces **6 éléments**
   en maintenant la touche **Ctrl** et en cliquant sur chacun :

   | À envoyer | Pourquoi |
   |---|---|
   | `index.html` | l'application elle-même |
   | `sw.js` | pour que les téléphones prennent la nouvelle version |
   | `data.js` | données de départ (nouvel ordre des familles, fixe/variable) |
   | `README.md` | guide mis à jour |
   | `MISE-A-JOUR.md` | ce guide |
   | le **dossier** `apps-script` | copie du nouveau script (pour archive) |

   ⛔ **N'envoyez pas** `config.js` (il ne doit pas exister ; s'il est là, ne le sélectionnez pas).

5. **Faites glisser** la sélection dans la grande zone **Drag files here to add them to your repository**
   (Glissez vos fichiers ici). Les fichiers existants seront remplacés par les nouveaux.
6. Attendez que la liste des fichiers s'affiche sous la zone.
7. Tout en bas, cliquez sur le bouton vert **Commit changes** (Enregistrer les modifications).
8. Patientez **2 minutes** : le site se met à jour tout seul.

---

## Étape 3 — Vérifier sur votre téléphone (≈ 3 min)

1. Ouvrez l'application **Budget** depuis son icône.
2. Si vous voyez encore l'ancien affichage (sans widgets de famille), **fermez complètement l'app**
   puis rouvrez-la :
   - **iPhone** : balayez du bas de l'écran vers le haut en vous arrêtant au milieu, puis
     faites glisser la fenêtre de l'app vers le haut ;
   - **Android** : bouton ▢ (applications récentes), puis faites glisser l'app vers le haut.

   Rouvrez-la. Si besoin, recommencez une fois.
3. Vous devez voir, dans l'onglet **📊 Budget** :
   - un **widget par famille**, et les **catégories en lignes** en dessous ;
   - des lignes **bleues** (Fixe) et **roses** (Variable) ;
   - les boutons **ⓘ Légende** et **↕ Réorganiser** en haut.
4. Allez dans **⚙️ Paramètres** → rubrique **Groupes et catégories** :
   - chaque catégorie a un interrupteur **Fixe / Variable** ;
   - ⚠️ s'il y a un message « *Le script Google n'est pas à jour* », c'est que l'**étape 1.c**
     n'a pas été faite (ou pas en **Nouvelle version**) : refaites-la.
5. (Facultatif) Dans le Google Sheet, onglet **Config** : une colonne **fixe** est apparue
   avec des **OUI** / **NON**. Elle se remplit automatiquement à la première ouverture de l'app.

---

## Étape 4 — Ranger les familles dans votre ordre (≈ 2 min)

À faire **une seule fois**, sur **un seul** téléphone : Laurie verra le même ordre.

1. Onglet **📊 Budget** → bouton **↕ Réorganiser**. Les widgets se mettent à trembler.
2. **Posez le doigt sur le widget d'une famille**, gardez-le appuyé une demi-seconde, puis
   **glissez** vers le haut ou le bas. Les autres familles se replient pendant le déplacement.
3. Ordre souhaité :
   1. 🛒 Vie courante
   2. 👤 Personnel
   3. 🚗 Transport
   4. 👶 Famille
   5. 📱 Abonnements
   6. ⚡ Charges maison
   7. 🛡️ Assurances
   8. 💰 Épargne
   9. 🏠 Logement & crédits
4. Vous pouvez aussi déplacer une **catégorie** (une ligne) dans sa famille, ou vers une autre famille.
5. Appuyez sur **✓ Terminé**. Le message « Ordre enregistré » s'affiche.

💡 Astuce : un **tap sur le widget d'une famille** replie ou déplie ses lignes (en dehors du mode Réorganiser).

---

## Étape 5 — Le téléphone de Laurie

Rien à installer : Laurie ouvre simplement l'app. Si l'ancien affichage apparaît, elle la ferme
complètement et la rouvre (comme à l'étape 3.2). Le nouvel ordre et les coches « payé » arrivent
tout seuls, en moins de 30 secondes.

---

## En cas de problème

| Ce que vous voyez | Que faire |
|---|---|
| Toujours l'ancien affichage | Attendez 2–3 minutes après l'étape 2, puis fermez et rouvrez complètement l'app. Vérifiez sur GitHub que `index.html` indique une modification « now » ou « il y a quelques minutes ». |
| « ⚠️ Code famille refusé » | Le code dans le script ne correspond pas : refaites 1.b point 5 avec **le même code qu'avant**, enregistrez, puis 1.c. |
| « ⚠️ Code non choisi dans le script » | Il reste `CHANGEZ-MOI` dans le script : refaites 1.b point 5, puis 1.c. |
| Message « Le script Google n'est pas à jour » dans Paramètres | Refaites l'étape 1.c en choisissant bien **Nouvelle version**. |
| Les interrupteurs Fixe/Variable reviennent tout seuls à l'ancienne position | Même cause : étape 1.c pas faite. |
| « Serveur injoignable » alors que le téléphone a internet | Dans 1.c, vérifiez que l'accès est toujours **Tout le monde**. |

Une fois tout vérifié, cette mise à jour est terminée ✅
