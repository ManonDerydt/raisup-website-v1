# Campagne Agent-Ready — Plan d'action

*Objectif : atteindre le scénario médian, soit ~26 k$ de revenu mensuel récurrent à 12 mois, et décider au mois 3 si on accélère (> 4 k$/mois) ou si on change d'angle (< 2 k$/mois).*

---

## 1. Le principe

On n'envoie jamais d'email générique. Chaque commerce reçoit **son propre score**, calculé avant l'envoi, avec un lien vers **son rapport personnel** :

> *Bella Hair Co. — ChatGPT can find you, but can't book you. Your score: 34/100.*

La chaîne est automatisée (`src/campaign/build.js`) :

```
Liste de commerces (Google) → scan de chaque site → rapport sauvegardé (/r/<id>)
→ email de contact publié sur le site → fichier CSV prêt à importer dans l'outil d'envoi
```

---

## 2. Cibles

| Vague | Pays | Métiers | Villes (exemples) | Pourquoi |
|---|---|---|---|---|
| **1 (mois 1–2)** | États-Unis | Salons de coiffure, instituts, barbiers | Austin, Denver, Atlanta, Nashville, Phoenix, Charlotte, Tampa, San Diego | Prospection B2B par email autorisée avec désinscription (CAN-SPAM) ; villes en croissance, beaucoup de salons indépendants |
| 2 (mois 3–4) | États-Unis | + spas, ongleries, esthétique médicale, cliniques dentaires | 25 plus grandes métropoles | Même produit, prix et réservation en ligne courants |
| 3 (mois 4+) | Canada, Australie | Mêmes métiers | Toronto, Vancouver, Sydney, Melbourne | **Uniquement après validation juridique** (CASL, Spam Act : consentement implicite sous conditions) |
| Continu | Royaume-Uni, Union européenne | Agences web uniquement | — | Emails aux indépendants très encadrés : on passe par les agences et le partage |

**Agences (toutes vagues) :** agences web et marketing qui servent des salons, spas et commerces locaux (sites Wix/Squarespace/WordPress, référencement local).

---

## 3. Calendrier

| Semaine | Actions | Livrable | Qui |
|---|---|---|---|
| S0 | Acheter le nom de domaine principal + 3 à 5 domaines d'envoi (ex. `getagentready.com`, `tryagentready.com`) ; créer 10–15 boîtes mail ; lancer le préchauffage | Infrastructure d'envoi en préchauffage | 👤 |
| S0 | Héberger le site (Render ou Fly.io), ajouter les clés d'API | Site en ligne, scans réels | 👤 + 🤖 |
| S0–S1 | **10 conversations** (5 salons, 5 agences) avec le rapport d'exemple — script : `scripts-conversations.md` | Validation du message et du prix | 👤 |
| S1 | Premier lot : 200 salons à Austin → calibration du score | `summary.json` + ajustements | 🤖 |
| S2 | Premiers envois : 500 salons + 100 agences (boîtes encore en montée) | Taux d'ouverture des rapports | 👤 envoie · 🤖 prépare |
| S2 | Publier le classement d'Austin (top 10 seulement) + chiffre choc (« X % des salons d'Austin ne peuvent pas être réservés par une IA ») | Contenu LinkedIn / X / Reddit / presse locale | 🤖 rédige · 👤 publie |
| **S2 fin (J14)** | **Décision** : ≥ 15 % d'ouvertures de rapport et ≥ 5 agences intéressées ? | Go / ajustement | 👤 + 🤖 |
| S3–S4 | Montée à ~3 000 envois/semaine ; paiement Stripe ouvert | Premiers clients payants | 🤖 + 👤 |
| **J30** | ≥ 30 salons payants ou ≥ 3 agences sous contrat ? | Go / pivot | 👤 + 🤖 |
| Mois 2–3 | 15 000 envois/mois salons + 1 300 agences ; 2 nouvelles villes par semaine | ~4 k$/mois à M3 (scénario médian) | |
| **M3** | **Décision** : > 4 k$/mois → accélérer (vague 2, recrutement) ; < 2 k$/mois → pivoter vers l'offre agences | | |

---

## 4. Infrastructure d'envoi

| Élément | Recommandation | Coût estimé |
|---|---|---|
| Domaines d'envoi | 3 à 5, **jamais le domaine principal** ; redirection vers le site | 10–15 $/an chacun |
| Boîtes mail | 10 à 15 (Google Workspace ou Microsoft 365), 2–3 par domaine | ~6–8 $/mois chacune |
| Authentification | SPF, DKIM, DMARC configurés sur chaque domaine | — |
| Préchauffage | 2 à 3 semaines avant le premier envoi | Inclus dans l'outil |
| Volume | ~30–40 emails/jour/boîte, montée progressive | — |
| Outil d'envoi | Instantly, Smartlead ou lemlist (import CSV, rotation des boîtes, désinscription automatique) | ~40–100 $/mois |
| Liste de commerces | Google Places API (`build.js --cities`) ou fournisseur de données (import `--input`) | ~0–200 $/mois |
| IA pour les scores | OpenAI + Gemini + Perplexity | ~0,05–0,10 $ par scan (estimation) |

**Budget mensuel en régime de croisière : ~500 à 1 500 $** (estimation).

---

## 5. Règles juridiques (à faire valider par un avocat)

- **États-Unis (CAN-SPAM)** : identité réelle de l'expéditeur, objet non trompeur, **adresse postale** dans chaque email, **lien de désinscription** traité sous 10 jours ouvrés. On n'écrit qu'aux adresses que le commerce publie lui-même sur son propre site.
- **Liste de suppression** : toute désinscription ou demande de retrait va dans `data/suppression.txt` (email, domaine email ou domaine du site). `build.js` exclut automatiquement ces contacts de toutes les campagnes suivantes.
- **Google Places** : vérifier les conditions de conservation des données ; ne garder que ce qui sert la campagne.
- **Classements publics** : on ne publie **que le haut du classement** ; jamais un score faible nommément.
- **Pas de faux semblant** : pas de logo OpenAI/Google, scores présentés comme des estimations datées.

---

## 6. Indicateurs et seuils

Suivi automatique : `node src/campaign/kpi.js --sent <nombre d'emails envoyés>` (lit les ouvertures de rapports, partages, corrections générées, emails laissés).

| Indicateur | Seuil J14 | Seuil J30 | Cible M3 | Cible M12 (médian) |
|---|---|---|---|---|
| Rapports ouverts / emails envoyés | ≥ 15 % | ≥ 15 % | ≥ 5 % à grand volume | ≥ 5 % |
| Agences intéressées | ≥ 5 | ≥ 3 sous contrat | 12 clientes | ~40 clientes |
| Corrections générées / rapports ouverts | — | ≥ 10 % | ≥ 10 % | ≥ 10 % |
| Salons payants | — | ≥ 30 | ~60 | ~475 |
| Revenu mensuel récurrent | — | ~1 k$ | ~4 k$ | ~26 k$ |
| Partages de score | Suivi | Suivi | ≥ 5 % des rapports | Moteur viral |

Tableau hebdomadaire à remplir : `kpi-tracker.csv`.

---

## 7. Fichiers de la campagne

| Fichier | Contenu |
|---|---|
| `sequence-salons.md` | Séquence de 3 emails aux salons (anglais), variantes d'objet, champs personnalisés |
| `sequence-agencies.md` | Séquence de 3 emails + messages LinkedIn aux agences (anglais) |
| `scripts-conversations.md` | Script des 10 conversations de validation (S0–S1) |
| `content-city-launch.md` | Modèles de publications pour le lancement de chaque ville |
| `kpi-tracker.csv` | Tableau de suivi hebdomadaire |

## 8. Commandes

```bash
# 1. Construire une vague (Google Places)
BASE_URL=https://agentready.example GOOGLE_PLACES_API_KEY=… \
  node src/campaign/build.js --category "hair salon" --cities "Austin, TX;Denver, CO" --max 200

# 1 bis. À partir d'une liste existante (colonnes : name, website, city)
node src/campaign/build.js --input prospects.csv --category "hair salon"

# 2. Importer campaign/out/<date>/send-salons.csv dans l'outil d'envoi

# 3. Suivre les résultats
node src/campaign/kpi.js --since 2026-10-06 --sent 500
```
