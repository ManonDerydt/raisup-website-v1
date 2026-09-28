# Agent-Ready — Ce qu'il faut mettre en place

*Objectif : lancer le test de 30 jours (verdict intermédiaire à J14) décrit dans `docs/BESOINS-A-VENIR.md`.*
*Légende : 👤 = à faire par toi · 🤖 = je m'en occupe · 🤝 = ensemble.*

---

## 1. Décisions à prendre (J0)

| # | Décision | Ma recommandation | Qui |
|---|---|---|---|
| 1 | **Nom et domaine** | Nom court en anglais, domaine en `.com` ou `.ai` libre. Pistes à vérifier : *AgentReady*, *Bookable*, *Askable*, *ReadyForAI*. Vérifier la disponibilité de la marque (USPTO, UKIPO, EUIPO) avant d'acheter | 👤 |
| 2 | **Premier métier ciblé** | **Salons de coiffure et instituts de beauté** : prix standardisés (coupe, couleur), réservation en ligne courante, très nombreux, beaucoup d'agences qui les servent | 👤 |
| 3 | **Villes de test** | **3 villes américaines** (ex. Austin, Denver, Atlanta) plutôt que britanniques : la prospection B2B par email y est autorisée avec désinscription (CAN-SPAM). Au Royaume-Uni, les entreprises individuelles (très fréquentes dans la coiffure) exigent un consentement préalable (PECR) | 👤 |
| 4 | **Structure juridique pour le test** | Utiliser une société existante pour le test, créer une entité dédiée seulement si les seuils J30 sont atteints | 👤 |
| 5 | **Dépôt de code** | Nouveau dépôt GitHub dédié (ex. `agent-ready`). En attendant, je construis le prototype dans le dossier `agent-ready/` de ce dépôt et on le déplacera | 👤 crée le dépôt · 🤖 déplace le code |

---

## 2. Comptes et clés d'API (J0–J2)

| Service | Usage | Coût estimé pendant le test | Nom de la variable d'environnement |
|---|---|---|---|
| **OpenAI API** | Interroger ChatGPT : « Est-ce que l'IA te recommande ? Connaît-elle tes prix ? » | 50–150 $ | `OPENAI_API_KEY` |
| **Google AI Studio (Gemini API)** | Même test côté Gemini | 0–50 $ (offre gratuite généreuse) | `GEMINI_API_KEY` |
| **Perplexity API (Sonar)** | Même test côté Perplexity (réponses avec sources web) | 20–50 $ | `PERPLEXITY_API_KEY` |
| **Google Cloud – Places API (New)** | Lire la fiche Google du commerce (horaires, site, catégorie, note) = la « vérité » à comparer | 0–100 $ (crédit mensuel gratuit) | `GOOGLE_PLACES_API_KEY` |
| Hébergement (Vercel, Render ou Fly.io) | Mettre le scan en ligne | 0–20 $/mois | — |
| Nom de domaine | Site public | 10–70 $/an | — |
| Email transactionnel (Resend ou Postmark) | Envoyer les rapports de score | 0–20 $/mois | `RESEND_API_KEY` |
| Outil d'emailing de prospection (Instantly, Smartlead…) + domaine d'envoi séparé | Envoyer les scores aux 500 commerces (J8–14) | 40–100 $/mois | — |
| Analyse d'audience (Plausible ou PostHog) | Mesurer les ouvertures de rapport et les conversions | 0–20 $/mois | — |
| **Stripe** | Paiement à partir de J25 | Commission seulement | `STRIPE_SECRET_KEY` (plus tard) |

**Budget total du test : environ 300 à 600 $.**

**Comment me transmettre les clés :** ne les colle jamais dans la conversation. Ajoute-les dans les paramètres de l'environnement cloud (menu de l'environnement dans la barre de titre de la session → *Edit* → variables d'environnement), avec exactement les noms ci-dessus. Elles seront prises en compte dans une nouvelle session.

---

## 3. Documents juridiques (J0–J7)

| Document | Contenu clé | Qui |
|---|---|---|
| **Conditions d'utilisation** | Le score est un indicateur, pas une garantie ; les réponses des IA varient ; pas de garantie de classement ni de réservations | 🤖 rédige un brouillon · 👤 fait valider par un avocat |
| **Politique de confidentialité** | Données traitées : informations publiques d'entreprises, emails des personnes qui demandent un rapport. RGPD, UK GDPR et CCPA. Durées de conservation, sous-traitants (OpenAI, Google, hébergeur) | 🤖 brouillon · 👤 validation |
| **Méthodologie publique du score** | Ce qui est mesuré, les pondérations, les limites. Indispensable pour la crédibilité et pour éviter toute accusation de pratique trompeuse | 🤖 |
| **Mentions dans les emails de prospection** | Identité de l'expéditeur, adresse postale, lien de désinscription fonctionnel (CAN-SPAM) | 🤖 |
| **Vérification des conditions Google Maps Platform** | Limites sur la conservation et l'affichage des données de fiches Google. On stocke l'identifiant de la fiche, pas son contenu, au-delà de ce qui est autorisé | 🤝 |
| **Respect des robots.txt** | Le scanner de site s'identifie avec son propre nom et respecte `robots.txt` | 🤖 |

---

## 4. Documents opérationnels à produire

| Document | Pour quoi | Quand | Qui |
|---|---|---|---|
| Méthodologie et grille du score (v1) | Base du produit | J1 | 🤖 |
| **Prototype du scan** (en ligne) | Tester 200 commerces | J1–7 | 🤖 |
| Modèle de rapport de score (page web + email) | Ce que reçoit le commerçant | J5 | 🤖 |
| Liste des 200 commerces de test (3 villes) | Calibrer le score | J3–6 | 🤝 (je génère depuis l'API Google, tu valides le ciblage) |
| Page d'accueil (anglais) | Lancement, capture d'emails | J7 | 🤖 |
| Séquence d'emails de prospection (3 emails) | Envoi des scores aux 500 commerces | J8 | 🤖 rédige · 👤 envoie |
| Présentation d'une page pour les agences | Recruter les 50 agences | J8 | 🤖 rédige · 👤 contacte |
| Classement public d'une ville | Contenu viral et référencement | J10 | 🤖 |
| **Tableau de suivi du test** | Suivre les seuils J7, J14, J24, J30 | J1 | 🤖 |
| Correction en un clic (données structurées, `llms.txt`, point d'accès MCP) | Le produit payant | J15–24 | 🤖 |

---

## 5. Les seuils de décision (rappel)

| Étape | Seuil pour continuer |
|---|---|
| J7 | Le score révèle de vraies erreurs chez ≥ 50 % des 200 commerces |
| J14 | ≥ 15 % des commerces ouvrent leur rapport ; ≥ 5 agences demandent un accès |
| J24 | La correction fait monter le score de ≥ 20 points en moyenne |
| J30 | ≥ 30 établissements payants ou ≥ 3 agences sous contrat |

---

## 6. Ce que je peux faire dès maintenant, sans rien attendre

- La méthodologie du score v1.
- Le prototype du scan qui fonctionne **sans clé d'API** : analyse technique du site (données structurées, horaires, prix, lien de réservation, accès des robots d'IA, `llms.txt`). Les tests auprès de ChatGPT, Gemini et Perplexity s'activent automatiquement dès que les clés sont ajoutées.
- Les brouillons des conditions d'utilisation et de la politique de confidentialité.
