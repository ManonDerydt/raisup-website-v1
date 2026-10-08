# Souveraine

Application web mobile installable (PWA), à usage strictement personnel : une seule utilisatrice, connexion obligatoire, données privées synchronisées entre téléphone et ordinateur, fonctionnement hors ligne avec synchronisation au retour du réseau.

Cinq onglets : Aujourd'hui, Vocabulaire, Calcul, Discours, Pilotage. Les captures de validation sont dans `captures/` (largeur iPhone, clair et sombre).

## État du contenu

Le fichier `souveraine.html` n'a pas été transmis avec la demande. Les fichiers de `public/data/` contiennent donc un **contenu provisoire** (marqué `"provisoire": true`) qui respecte les quantités demandées : 119 fiches, 10 catégories, 5 tâches de routine, 12 semaines, 3 conférences, 10 étapes, 12 sujets, 5 fondations, 7 points du portrait, 6 piliers et 23 objectifs, 9 sources de revenus, 5 habitudes. Tant qu'un fichier est provisoire, l'application l'indique en haut de chaque écran.

`champs-conference.json` et `parametres.json` reprennent le cahier des charges (titres, posture par défaut, jalons Instagram, objectifs de revenus, texte du rappel) et ne sont pas provisoires.

Pour reprendre le contenu à l'identique :

```sh
npm install
node tools/extract-souveraine.mjs chemin/vers/souveraine.html            # rapport
node tools/extract-souveraine.mjs chemin/vers/souveraine.html --ecrire   # écrit public/data/*.json
npm run build
```

L'outil lit les variables des scripts de la page, les reconnaît par leur forme et recopie le texte sans le modifier. Il signale ce qu'il n'a pas reconnu avec certitude ; relire chaque fichier écrit.

Important : la progression du vocabulaire est rattachée à l'identifiant de chaque fiche (`v001` à `v119`). Commencer à réviser après le remplacement du contenu.

## Fonctionnement

- **Stockage local d'abord.** Chaque modification est enregistrée immédiatement sur l'appareil (indicateur « Enregistré » en haut), puis envoyée au serveur.
- **Synchronisation champ par champ.** Chaque case, chaque champ, chaque compteur porte son propre horodatage : deux appareils modifiés hors ligne se rejoignent sans perte. Les compteurs (calculs, séances) sont tenus par appareil puis additionnés.
- **Hors ligne.** Le service worker garde l'application, les polices et le contenu. La connexion reste valable hors ligne après la première connexion.
- **Enregistrements audio.** Conservés sur l'appareil uniquement (IndexedDB), jamais envoyés ni exportés.
- **Export et import** de toutes les données en JSON (Réglages, icône en haut à droite).

## Mise en service

### 1. Projet Firebase

1. Créer un projet sur https://console.firebase.google.com.
2. **Authentication** : activer la méthode « Adresse e-mail/Mot de passe ». Dans **Utilisateurs**, ajouter le compte (adresse et mot de passe). Dans **Paramètres > Actions des utilisateurs**, décocher « Activer la création (inscription) » : personne d'autre ne pourra créer de compte.
3. **Firestore Database** : créer la base, en mode production, région `europe-west`.
4. **Paramètres du projet > Vos applications** : ajouter une application Web, puis recopier sa configuration dans `public/config.js` :

```js
window.SOUVERAINE_CONFIG = {
  firebase: { apiKey: '…', authDomain: '…', projectId: '…', appId: '…' },
  vapidPublicKey: null
};
```

Ces valeurs ne sont pas secrètes ; l'accès aux données est protégé par la connexion et par `firestore.rules` (chaque compte ne lit et n'écrit que ses propres données).

### 2. Déploiement

```sh
npx firebase-tools login
npx firebase-tools use --add          # choisir le projet
npm run build                         # liste des fichiers hors ligne
npx firebase-tools deploy --only hosting,firestore:rules
```

L'adresse publiée est de la forme `https://<projet>.web.app`.

### 3. Rappel quotidien (notification)

Le rappel « Ta routine de 45 minutes. » part à l'heure choisie dans Réglages. Application fermée, il est envoyé par une fonction planifiée (`functions/`), ce qui demande le plan Blaze (paiement à l'usage ; à ce volume, une exécution toutes les 5 minutes reste dans la gratuité).

```sh
npx web-push generate-vapid-keys      # clé publique et clé privée
```

- clé publique : dans `public/config.js` (`vapidPublicKey`) et dans `functions/.env` ;
- clé privée : `npx firebase-tools functions:secrets:set VAPID_PRIVATE_KEY`.

`functions/.env` :

```
VAPID_PUBLIC_KEY=la-cle-publique
VAPID_CONTACT=mailto:mon-adresse
```

```sh
npm --prefix functions install
npm run build
npx firebase-tools deploy --only functions,hosting
```

Sans la fonction, le rappel s'affiche quand l'application est ouverte, et le bouton « Ajouter au calendrier » crée un rappel quotidien dans le calendrier du téléphone.

### 4. Installation sur iPhone

Ouvrir l'adresse dans Safari, toucher Partager puis « Sur l'écran d'accueil ». Ouvrir l'application depuis l'écran d'accueil, se connecter, puis Réglages > Rappel quotidien > Activer (iOS 16.4 ou plus récent ; les notifications ne sont proposées qu'une fois l'application installée).

Sur ordinateur, Chrome et Edge proposent l'installation depuis la barre d'adresse.

## Développement

```sh
npm install
npm run vendor     # SDK Firebase en un module et polices dans public/ (déjà fait)
npm run build      # après chaque modification de public/
npm run serve      # http://localhost:8080
```

Sans configuration Firebase, l'application propose un mode local (données sur l'appareil, sans connexion), utile pour le développement.

### Tests

```sh
npm test                               # calcul, répétition espacée, fusion des données
npm --prefix functions test            # heure du rappel
node tests/e2e-app.mjs                 # parcours complets dans Chromium (npm run serve d'abord)
node tests/e2e-sync.mjs                # connexion et synchronisation entre deux appareils
npm run captures                       # captures d'écran de validation
```

`e2e-sync.mjs` utilise les émulateurs Firebase :
`npx firebase-tools emulators:start --only auth,firestore --project demo-souveraine`.
Il vérifie : connexion refusée avec un mauvais mot de passe, synchronisation en direct, modifications hors ligne, rechargement hors ligne, convergence au retour du réseau, refus d'accès d'un autre compte, déconnexion.

## Structure

```
public/
  index.html, manifest.webmanifest, sw.js, config.js
  css/app.css              palette clair et sombre, rayon 2 px
  data/*.json              contenu, séparé du code
  js/store.js              stockage local et fusion champ par champ
  js/cloud.js              connexion et synchronisation Firebase
  js/srs.js, js/calc.js    répétition espacée, générateurs de calcul
  js/tabs/*.js             les cinq onglets
  fonts/, icons/, vendor/  polices (licence OFL), icônes, SDK Firebase
functions/                 fonction planifiée du rappel
firestore.rules            accès réservé à la propriétaire des données
tools/                     extraction, captures, icônes, construction
tests/                     tests unitaires et de bout en bout
```

## Choix de calcul

- Semaine du programme : semaine 1 = 7 premiers jours depuis la première ouverture, plafonnée à 12. Si deux appareils ont été ouverts pour la première fois à des dates différentes, la plus ancienne compte.
- Vocabulaire : « Je le maîtrise » fait monter d'un niveau (maximum 5) avec une révision à 1, 3, 7, 21 puis 60 jours ; « À revoir » remet au niveau 0 et replace la fiche trois fiches plus loin. Mots maîtrisés : niveau 3 et plus. 10 nouveaux mots par jour au maximum, toutes catégories confondues.
- Calcul : tolérance de 2 % de la bonne réponse, au minimum 0,5 point pour les pourcentages. Le taux de justesse et le temps moyen portent sur les 7 derniers jours.
- Autonomie : capital / (dépenses mensuelles − revenus du mois choisi dans Revenus HT), avec le mois de fin compté depuis le mois en cours ; « Couvert » si les revenus couvrent les dépenses.
- Jalons Instagram : « Atteint » si la valeur saisie atteint la cible, « En retard » si la date est passée, sinon « À venir ». Les dates J + 3, 5 et 7 mois sont calculées depuis le jour J.
