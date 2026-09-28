Tu es un investisseur early-stage expérimenté (SaaS B2B pour PME, IA, marketplaces locales) et un opérateur qui a déjà lancé des produits en self-serve. Je veux un avis indépendant et sans complaisance sur un projet. Ton rôle n'est pas de m'encourager : c'est de trouver ce qui peut le tuer, puis de dire s'il mérite quand même d'être lancé.

Règles :
- Si tu as accès au web, vérifie les faits marqués [À VÉRIFIER] et cite tes sources avec leur date. Si tu ne peux pas vérifier, dis-le clairement au lieu de supposer.
- Distingue toujours : fait vérifié / estimation / opinion.
- Ne reformule pas le projet, attaque-le. Sois précis et chiffré quand c'est possible.
- Réponds en français.

---

## LE PROJET : « Agent-Ready »

**En une phrase :** aider les commerces de service locaux (salons de coiffure et instituts de beauté d'abord, aux États-Unis) à être compris, recommandés et réservés par les assistants IA (ChatGPT, Gemini, Perplexity, Siri). On donne un score gratuit sur 100, puis on corrige leur site contre un abonnement.

**Thèse :** de plus en plus de consommateurs demandent à une IA « le meilleur salon près de chez moi, réservable cette semaine ». L'IA ne recommande que ce qu'elle comprend (services, prix, horaires, lien de réservation). La plupart des sites de salons sont illisibles pour elle (prix en image, pas de lien de réservation exploitable, robots d'IA bloqués dans robots.txt). Le commerçant perd des clients sans le savoir.

**Pourquoi maintenant (faits avancés) :**
- Shopify a rendu ~5,6 M de boutiques accessibles aux agents IA (ChatGPT, Copilot, Gemini) en mars 2026 [À VÉRIFIER]. Les commerces de *service* n'ont pas d'équivalent.
- OpenAI aurait fermé l'achat direct dans ChatGPT (« Instant Checkout ») vers mars 2026 [À VÉRIFIER] → le modèle serait « découvert via l'IA, réservé chez le commerçant ».
- Visa et Mastercard lancent des paiements pour agents IA (juin–juillet 2026) [À VÉRIFIER].
- Cloudflare bloque les robots d'IA par défaut depuis septembre 2026 [À VÉRIFIER].
- ~49 % des adultes américains utilisent des chatbots IA (Pew, février 2026) [À VÉRIFIER].
- Fenêtre estimée avant que Google, Wix ou les plateformes de réservation ne le fassent eux-mêmes : 12 à 18 mois [OPINION].

**Produit (déjà construit en prototype) :**
1. Scan gratuit : 12 vérifications techniques du site (données structurées schema.org/JSON-LD, horaires, prix, lien vers plus de 30 plateformes de réservation, accès des robots d'IA dans robots.txt, fichier llms.txt, sitemap, HTTPS, vitesse, mobile) + interrogation de ChatGPT, Gemini et Perplexity (« recommande 5 salons à [ville] », « que sais-tu de [salon] ? »). Score = 60 % technique + 40 % visibilité IA. Note A–F.
2. Rapport : ce que chaque IA dit du salon, 3 corrections prioritaires gratuites, les autres contre un email.
3. Générateur de corrections : à partir des horaires, prestations et lien de réservation, produit la fiche JSON-LD, un llms.txt et les lignes robots.txt à coller (instructions Wix, Squarespace, WordPress).
4. Offre payante « Fix & Monitor » : 29 $/mois par établissement (corrections hébergées, re-scan mensuel, alertes quand une IA se trompe).
5. Offre agences web : 299 $/mois, marque blanche, scans illimités, corrections pour 25 établissements (pas encore construite).

**Acquisition prévue :**
- Emailing à froid personnalisé aux États-Unis (CAN-SPAM) : chaque salon reçoit SON score et un lien vers SON rapport. Séquence de 3 emails sur 8 jours. Cible : 15 000 emails/mois en régime de croisière, avec 3–5 domaines d'envoi et 10–15 boîtes préchauffées.
- Agences web locales : on scanne un client de leur portefeuille et on leur envoie son score ; pilote gratuit 5 clients puis 299 $/mois.
- Contenu par ville (« X % des salons d'Austin ne peuvent pas être réservés par une IA » + top 10), partage des scores.
- Royaume-Uni/UE uniquement via agences (règles d'emailing plus strictes).

**Hypothèses de conversion utilisées :** 5 % des emails → ouverture du rapport ; 4 % des rapports ouverts → client payant ; 3 % de réponses des agences, 10 % de signature.

**Projection (hypothèses : 29 $/salon, 299 $/agence, 3–6 % de clients perdus/mois) :**

| Scénario | M3 | M6 | M12 | M18 |
|---|---|---|---|---|
| Prudent | 1 k$/mois | 2,7 k$ | 5 k$ | 7 k$ |
| Médian | 4 k$/mois | 11 k$ | 26 k$ | 46 k$ |
| Ambitieux | 11 k$/mois | 31 k$ | 98 k$ | 260 k$ |

**Valorisation visée :** ~1,5 à 4 M$ à 18–24 mois dans le scénario médian (3–6× le revenu annuel) ; 10–30 M$ en rachat stratégique dans le scénario ambitieux. Acheteurs imaginés : Wix, GoDaddy, Squarespace, Yelp, Fresha, Booksy, Mindbody, Yext, BrightLocal, Semrush.

**Concurrence identifiée :** outils de visibilité IA pour marques (Profound, valorisé ~1 Md$ [À VÉRIFIER] ; Peec AI) qui *mesurent* sans corriger et visent les équipes marketing ; outils de référencement local (Yext, BrightLocal) ; plateformes de réservation (Fresha, Booksy, Vagaro, GlossGenius) ; créateurs de sites (Wix, Squarespace).

**Risques déjà identifiés par l'équipe :**
1. Les plateformes de réservation rendent d'un coup tous leurs salons lisibles par les IA (comme Shopify l'a fait).
2. Les gérants de salon ne ressentent pas encore la douleur et ne paieront pas pour « la visibilité IA ».
3. Le score est instable (les IA ne répondent pas deux fois pareil).
4. Délivrabilité de l'emailing à froid.
5. Google ou Wix intègrent la fonction.

**Équipe et moyens :** une fondatrice non technique (expérience : plateforme de levée de fonds pour startups avec un « score d'investissabilité »), un assistant IA pour le code. Budget ~5–10 k$ sur 6 mois. Plan de validation : 10 entretiens (5 salons, 5 agences), puis test de 30 jours avec seuils (J14 : ≥ 15 % des salons ouvrent leur rapport et ≥ 5 agences intéressées ; J30 : ≥ 30 salons payants ou ≥ 3 agences sous contrat ; M3 : > 4 k$/mois pour accélérer, < 2 k$/mois pour pivoter vers l'offre agences).

---

## CE QUE JE TE DEMANDE

Réponds exactement avec les sections suivantes.

**1. Verdict en 3 lignes**
GO / GO SOUS CONDITIONS / NO GO, avec la raison principale.
Puis, sur une ligne à part : **« J'y crois à X % »**, où X est ta confiance (de 0 à 100 %) que cette piste est solide et mérite d'être lancée.

**2. Vérification des faits**
Tableau : fait avancé | vrai / faux / non vérifiable | source et date | impact sur la thèse.

**3. La demande est-elle réelle ?**
- Existe-t-il des preuves que les consommateurs réservent déjà des services locaux via des assistants IA, et à quelle échelle ?
- Les gérants de petits commerces paient-ils aujourd'hui pour de la visibilité (SEO local, avis, fiches) ? Combien, et via qui ?
- Le « pain » est-il ressenti, ou faut-il l'éduquer ? Combien de temps et d'argent coûte cette éducation ?

**4. Les 5 raisons les plus probables d'échec**, classées par probabilité, avec pour chacune un signal d'alerte précoce mesurable.

**5. Le risque plateforme**
Fresha, Booksy, Vagaro, GlossGenius, Square, Google Business Profile, Wix : lesquels ont déjà annoncé ou livré une intégration avec les agents IA (ChatGPT apps, MCP, protocoles de réservation/commerce d'agents) ? Que reste-t-il comme espace si c'est le cas ?

**6. Concurrence réelle**
Qui fait déjà « score de visibilité IA + correction » pour les commerces locaux / PME (y compris petites startups, outils gratuits, fonctionnalités d'outils existants) ? Prix, traction, date de lancement.

**7. Critique des chiffres**
- Les taux de conversion supposés (5 % → 4 %, agences 3 % → 10 %) sont-ils réalistes pour de l'emailing à froid vers des salons américains en 2026 ?
- Le churn de 3–6 %/mois est-il crédible pour un abonnement à 29 $ vendu à des PME ?
- Quel scénario te paraît le plus probable, et pourquoi ?
- Les multiples de valorisation annoncés sont-ils réalistes pour ce type d'entreprise ?

**8. Meilleure version du projet**
Si tu devais garder l'idée mais changer une seule chose majeure (cible, prix, canal, positionnement, modèle), laquelle et pourquoi ?

**9. Alternatives**
Y a-t-il une piste voisine plus solide avec les mêmes actifs (score, scanner, campagne automatisée, compétence en scoring) ?

**10. Plan de validation**
Le test proposé (10 entretiens + 30 jours avec seuils) est-il suffisant ? Qu'ajouterais-tu ou changerais-tu pour savoir en moins de 30 jours et moins de 2 000 $ si ça vaut le coup ?

**11. Note finale**
Note sur 10 pour chacun : taille du marché, urgence du besoin, défendabilité, faisabilité par une petite équipe, potentiel de revente. Puis une note globale sur 10.

**12. Probabilités (en %)**, chacune avec une phrase de justification :
- que le test de 30 jours atteigne ses seuils (≥ 30 salons payants ou ≥ 3 agences sous contrat) ;
- d'atteindre au moins 10 k$ de revenu mensuel récurrent en 12 mois ;
- d'atteindre au moins 40 k$ de revenu mensuel récurrent en 18 mois (scénario médian) ;
- de revendre l'entreprise plus de 1 M$ d'ici 24 mois ;
- qu'une plateforme (Google, Wix, Fresha, Booksy…) rende le produit inutile d'ici 18 mois.

**13. Résumé final sur une seule ligne**, exactement dans ce format, pour que je puisse comparer les réponses de plusieurs IA :
`Verdict : [GO / GO SOUS CONDITIONS / NO GO] | J'y crois à : X % | Test 30 j : X % | 10 k$/mois à 12 mois : X % | Revente > 1 M$ à 24 mois : X % | Note globale : X/10`
