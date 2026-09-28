# Nouveau projet — viser une trajectoire « fondateur seul, croissance en semaines »

## 1. Ce qui a vraiment produit ce résultat

L'histoire citée (développeur seul, ~1,5 M$ de revenus annualisés en quelques semaines, revente à 80 M$) correspond au cas Base44, racheté par Wix en 2025. Ce n'est pas un coup de chance isolé, c'est une combinaison de 5 conditions :

| # | Condition | Chez Base44 |
|---|---|---|
| 1 | **Une vague technologique au moment exact où elle devient utilisable** | Les LLM deviennent assez bons pour générer une app complète |
| 2 | **Un « wow » en moins de 2 minutes, sans commercial** | On décrit une app, elle existe |
| 3 | **Une boucle virale intégrée au produit** | Chaque app créée est partagée, montrée et utilisée par d'autres |
| 4 | **Un paiement dès le premier jour** (abonnement self-serve) | Offres payantes dès le lancement |
| 5 | **Un acheteur stratégique qui a peur d'être dépassé** | Wix, menacé par la création d'apps par l'IA |

**Les maths :** 1,5 M$ de revenus annualisés = ~6 000 abonnés à 20 $/mois, ou ~2 500 à 50 $/mois. Un tel volume en 4 semaines suppose un marché mondial, en anglais dès le premier jour. Un produit limité à la France n'y arrive quasiment jamais.

**Honnêteté :** ce type de résultat est une exception statistique. Le plan ci-dessous maximise les chances et limite la perte si ça ne prend pas (test en 30 jours, critères d'arrêt clairs).

---

## 2. Trois candidats notés sur les 5 conditions

| Projet | Vague | Wow < 2 min | Viralité produit | Paiement J1 | Acheteur | Total |
|---|---|---|---|---|---|---|
| **A. Tableur → App** (recommandé) | 5 | 5 | 4 | 4 | 5 | **23** |
| B. Agent qui fait tes démarches administratives | 4 | 4 | 3 | 3 | 3 | 17 |
| C. Réceptionniste vocale IA pour commerces | 3 | 4 | 2 | 5 | 3 | 17 |

B est limité à la France et pose des risques (identifiants, responsabilité juridique). C est déjà très concurrencé et n'a pas de viralité produit.

---

## 3. Projet recommandé : **Tableur → App**

### Le pitch
> **« Glisse ton fichier Excel. Récupère une vraie application en 60 secondes. »**

Des centaines de millions de personnes font tourner leur activité sur des tableurs : stocks, plannings, CRM, devis, suivi de chantiers, inscriptions, notes de frais. Tous savent que « ça devrait être une app », personne n'a le temps d'en faire une.

Les générateurs d'apps par IA partent d'une **page blanche et d'un prompt**. L'utilisateur doit savoir quoi demander. Ici, **le point de départ est le fichier qu'il possède déjà** :
- l'IA lit les colonnes, les formules, les onglets, les validations → elle déduit le modèle de données et la logique métier ;
- elle génère une app multi-utilisateurs : base de données, formulaires mobiles, tableaux de bord, droits d'accès, automatisations (« quand le stock < 10, m'envoyer un email ») ;
- l'utilisateur ajuste en langage naturel.

### Pourquoi ça coche les 5 conditions
1. **Vague :** les modèles savent maintenant générer et maintenir des apps fiables ; le marché a déjà été éduqué par les générateurs d'apps grand public.
2. **Wow :** l'utilisateur voit *ses propres données* devenir une app. C'est bien plus fort qu'une démo générique.
3. **Viralité :** une app interne est faite pour être partagée. Chaque app invite 3 à 20 collègues, qui découvrent le produit et importent leurs propres fichiers. Badge « Créé avec … » sur les formulaires publics.
4. **Paiement :** gratuit jusqu'à 1 app / 3 utilisateurs, puis 29–99 $/mois. Le besoin apparaît au moment précis où l'équipe adopte l'app.
5. **Acheteurs potentiels :** Microsoft, Google, Notion, Airtable, Monday, Wix, Zoho, les éditeurs de logiciels PME. Tous sont menacés par le « logiciel sur mesure généré ».

### Concurrence et angle défendable
Glide, Softr, Airtable ou les générateurs d'apps IA existent. L'angle : **import-first** (partir du fichier réel, y compris les formules et les tableurs chaotiques) + **go-to-market par cas d'usage** (une page et une vidéo par métier : « ton planning de chantier Excel → app », « ton suivi de stock → app »). Chaque page est une porte d'entrée SEO et un contenu court pour les réseaux sociaux.

### Architecture pour un fondateur seul
- Front : générateur d'app sur un template de composants maison (tables, formulaires, graphiques, kanban). L'IA **assemble et configure** ; elle n'écrit pas du code libre. C'est ce qui garantit la fiabilité.
- Back : Postgres multi-tenant, authentification, stockage de fichiers, envoi d'emails ; tout en services managés.
- IA : API de modèles frontière pour l'analyse du fichier et la génération de la configuration ; petit modèle rapide pour les ajustements.
- Paiement : Stripe, self-serve, avec facturation en dollars et en euros.
- Coût d'infrastructure au lancement : quelques centaines d'euros par mois.

---

## 4. Plan de 30 jours (lancement puis verdict)

### Jours 1–10 : construire le cœur
- [ ] Import .xlsx/.csv/Google Sheets → modèle de données déduit par l'IA.
- [ ] 5 composants : table, formulaire, tableau de bord, kanban, vue mobile.
- [ ] Partage par lien + invitations.
- [ ] Stripe opérationnel dès le premier jour.
- [ ] Récupérer 30 vrais tableurs (réseau, forums de PME) pour tester l'import. **C'est le vrai risque technique.**

### Jours 11–20 : bêta privée et contenu
- [ ] 100 bêta-testeurs, dont des personnes de métiers terrain (BTP, restauration, associations, agences, logistique).
- [ ] Filmer chaque transformation « avant/après » (vidéo de 30 s) → stock de 50 vidéos pour le lancement.
- [ ] 20 pages SEO par cas d'usage.
- [ ] Mesurer : % d'imports réussis sans correction, temps avant le « wow », nombre d'invitations par app.

### Jours 21–30 : lancement public mondial
- [ ] Lancement coordonné : Product Hunt, Hacker News (« Show HN »), X/LinkedIn en build in public, TikTok/Reels avec les vidéos avant/après, Reddit (communautés Excel et PME).
- [ ] Publier les chiffres chaque semaine (utilisateurs, revenus) : c'est le carburant du récit.

### Critères de décision à J30
| Indicateur | Continuer | Pivoter | Arrêter |
|---|---|---|---|
| Imports réussis sans aide | > 70 % | 40–70 % | < 40 % |
| Invitations par app active | > 2 | 1–2 | < 1 |
| Conversion gratuit → payant (à 14 jours) | > 4 % | 2–4 % | < 2 % |
| Revenus mensuels récurrents | > 10 k$ | 3–10 k$ | < 3 k$ |

La trajectoire exceptionnelle (plus de 100 k$ de revenus mensuels en un mois) ne se voit **qu'après** le lancement public. Si les trois premiers indicateurs sont au vert, on met tout sur la distribution.

---

## 5. Pourquoi ce choix plutôt qu'une idée « liée à Raisup »

Raisup vise un marché de niche (startups qui lèvent), à cycle long et avec de la réglementation. C'est un bon business, mais pas une trajectoire en semaines. Le nouveau projet doit être **horizontal, mondial, self-serve et viral par construction**. Si tu veux capitaliser sur ton expertise « financement », la variante serait **Tableur → App pour les cabinets et les directions financières**. Mais c'est plus lent, et je la déconseille pour l'objectif visé.
