# Raisup — Vision & plan d'exécution 117 jours

> Période : **28 septembre 2026 → 23 janvier 2027 (J117)**
> Point de départ : le site actuel (Score IA, matching 240+ fonds, génération de documents, simulateur secondary, dashboard B2B white-label, programme Pioneer 50 places).

---

## 0. Le constat sans filtre

1. **Les « zéro barrières » n'existent pas.** On ne supprime pas un obstacle : on choisit le terrain où il est le plus bas, on contourne ceux qui coûtent cher *légalement*, et on transforme les autres en fossé défensif contre les suivants.
2. **Raisup vend aujourd'hui la partie la plus encombrée du marché** (pitch decks IA, matching VC) : c'est là que la concurrence est la plus forte et que la volonté de payer est la plus faible. Un fondateur ne paie pas pour un deck ; il paie pour **de l'argent sur son compte**.
3. **La faille la plus sous-exploitée est le financement non-dilutif.** Subventions (Bpifrance, régions, EIC Accelerator, Horizon Europe), crédits d'impôt (CIR, CII, statut JEI), prêts d'honneur et avances remboursables. Ce marché est :
   - **énorme** (le CIR représente à lui seul un coût public de l'ordre de 7 Md€/an ; l'EIC Accelerator distribue plusieurs centaines de M€/an — ordres de grandeur à vérifier avant usage public) ;
   - **fragmenté** (des centaines de dispositifs aux critères illisibles) ;
   - **servi par des cabinets chers et lents** (honoraires au succès souvent de l'ordre de 15 à 30 %) ;
   - **non soumis au régime des services d'investissement** : aider à obtenir une subvention ou un crédit d'impôt ne relève ni de MiFID II ni du règlement européen du financement participatif.

   **C'est le point d'entrée où les trois barrières (réglementaire, financière, concurrentielle) sont simultanément les plus basses.** Et c'est le produit qui paie le reste.

---

## 1. La vision : l'OS du financement des startups européennes

Raisup devient **la couche de données et d'exécution entre les startups et tout le capital disponible** — dilutif et non-dilutif.

```
                 ┌─────────────────────────────────────────────────┐
  Startups  ───▶ │  Raisup Score (standard ouvert, méthodo publique) │ ◀─── Données publiques
  (gratuit)      │  + Dossier unique (1 saisie → N candidatures)    │      (BODACC, INPI, CORDIS,
                 └───────────────┬─────────────────────────────────┘       Pappers, data.gouv)
                                 │
       ┌─────────────────────────┼───────────────────────────────┐
       ▼                         ▼                               ▼
  NON-DILUTIF (cash engine)  DILUTIF (réseau)             INTERMÉDIAIRES (distribution)
  Subventions, CIR/CII/JEI,  Matching VC/BA, data room,   Incubateurs, accélérateurs,
  prêts d'honneur            deal-flow scoré pour fonds    banques, experts-comptables
  → success fee              → SaaS investisseurs          → white-label par siège
```

**Principe économique :** la startup ne paie rien d'avance. Ceux qui paient sont (a) la startup *uniquement quand l'argent arrive*, (b) les fonds qui veulent du deal-flow qualifié, (c) les structures d'accompagnement qui veulent piloter leur portefeuille.

---

## 2. Chaque barrière, et comment elle tombe

### 2.1 Barrière financière (côté client) → **paiement au résultat**

| Offre | Prix indicatif | Pourquoi ça lève l'objection |
|---|---|---|
| Score + recommandations | Gratuit | Acquisition, données, effet réseau |
| Pack non-dilutif (dossiers subventions / CIR / JEI) | 0 € d'avance, **8–10 % au succès** | Moitié prix des cabinets, zéro risque pour le fondateur |
| Premium (docs, matching, data room) | 49–99 €/mois | Upsell une fois la confiance établie |
| White-label partenaires | 300–1 500 €/mois selon portefeuille | Remplace des tableurs + du temps de chargé d'affaires |
| Feed deal-flow investisseurs | 300–800 €/mois/fonds | Startups **opt-in** uniquement, scorées et à jour |

### 2.2 Barrière financière (côté Raisup) → **pas de capital requis pour démarrer**

- Le non-dilutif génère du cash en 60–120 jours (versement subvention / remboursement CIR) : c'est le financement de l'entreprise elle-même.
- Raisup doit **appliquer sa propre recette** : JEI, CII sur le moteur de scoring, prêt d'honneur, Bourse French Tech, i-Nov. Le produit est validé en l'utilisant sur soi.
- Aucun modèle entraîné from scratch : orchestration de LLM via API, coût marginal par dossier de quelques euros.

### 2.3 Barrière technique → **orchestrer, ne pas inventer**

- **Stack minimale** : front existant + backend serverless, base Postgres, LLM via API (génération, extraction, résumé), stockage documents chiffré, signature électronique via prestataire.
- **Base « dispositifs »** : un référentiel structuré des aides (critères, montants, calendriers, pièces) alimenté par l'IA puis validé humainement. C'est l'actif le plus précieux et le plus ennuyeux à construire — donc le moins copié.
- **« Dossier unique »** : la startup renseigne une fois (équipe, marché, R&D, financiers) ; l'IA décline automatiquement vers chaque formulaire (Bpifrance, région, EIC, CIR). Le coût de la N-ième candidature tend vers zéro.
- **Humain dans la boucle** : chaque dossier non-dilutif est relu par un expert (freelance au départ) avant dépôt. La qualité, pas le volume, crée la réputation.

### 2.4 Barrière de données & de crédibilité du Score → **la faille des publications légales**

La plupart des scores startups sont des opinions. Le Raisup Score peut devenir **une mesure calibrée sur des résultats réels**, gratuitement :

- Les **augmentations de capital** des sociétés françaises sont publiées (BODACC, actes INPI, accessibles via API — Pappers, Annuaire des Entreprises). Autrement dit : on sait, a posteriori et sans rien demander à personne, **quelles startups ont réellement levé, quand, et combien**.
- **CORDIS** publie les bénéficiaires des financements européens (Horizon, EIC).
- → On construit un jeu de données « profil au temps T → a levé / a obtenu une aide dans les 12 mois ». Le score est **backtesté** et sa précision publiée.
- **Méthodologie ouverte** + backtest publié = le score devient un standard qu'on cite, pas un gadget marketing. Co-signature avec un réseau d'accompagnement reconnu pour accélérer la légitimité.

### 2.5 Barrière réglementaire → **se positionner en éditeur de logiciel, adosser le régulé à des partenaires licenciés**

Ce qu'on fait librement :
- Logiciel d'aide à la préparation, scoring d'**entreprises**, génération de documents, simulateurs.
- Montage de dossiers de subventions et crédits d'impôt (activité de conseil non réglementée).

Ce qui déclenche un agrément — **on ne le fait pas soi-même, on l'adosse** :
- Mettre en relation investisseurs et offres de titres avec recommandation personnalisée, ou encaisser des fonds → régime **PSFP / ECSP** (règlement UE 2020/1503) ou prestataire de services d'investissement. → Partenariat avec une plateforme agréée ; Raisup reste la couche logicielle et de préparation.
- Intermédiation de **crédit** (prêts, revenue-based financing) → statut **IOBSP** (enregistrement ORIAS, accessible en tant que mandataire). Envisageable en phase 2, pas avant.
- **Secondary** : le simulateur est un outil de calcul, il reste un outil de calcul. L'exécution passe par un acteur agréé.

Et aussi :
- **RGPD** : les données des fondateurs sont des données personnelles ; partage aux investisseurs uniquement sur opt-in explicite, DPA avec chaque partenaire, hébergement UE.
- **AI Act** : noter des *entreprises* n'est pas dans les usages à haut risque visés pour l'évaluation de solvabilité des *personnes physiques* — mais la transparence (explicabilité du score, contestation possible) coûte peu et sert la crédibilité. À faire valider par un avocat en une consultation.

> Ce n'est pas du « contournement » : c'est choisir l'architecture où l'agrément est porté par ceux dont c'est le métier, pendant que Raisup capte la valeur logicielle et les données.

### 2.6 Barrière concurrentielle → **attaquer là où les autres ne regardent pas**

- Les outils de pitch deck IA et de matching VC sont nombreux ; Dealroom / Crunchbase / Harmonic servent les fonds, pas les fondateurs early-stage.
- Les cabinets CIR/subventions sont lents, chers, sans produit.
- **Personne ne relie non-dilutif + dilutif + accompagnateurs dans un même dossier.** C'est la position.
- **Fossé défensif** : (1) base de dispositifs maintenue, (2) données de résultats (qui a obtenu quoi), (3) réseau de partenaires white-label qui amène les cohortes, (4) historique des dossiers déposés qui améliore les suivants.

### 2.7 Barrière d'acquisition (CAC) → **B2B2C via ceux qui ont déjà les startups**

- Incubateurs, accélérateurs, French Tech, Réseau Entreprendre, Initiative France, pôles de compétitivité, SATT, chargés d'affaires bancaires, experts-comptables.
- Offre partenaire : **dashboard gratuit pendant 90 jours** pour leur cohorte, en échange de l'onboarding de leurs startups. Chaque partenaire = 10–50 startups à CAC ≈ 0.
- Les experts-comptables sont un canal sous-estimé : ils voient les éligibilités CIR/JEI de leurs clients et n'ont pas l'outil pour les exploiter → **commission de rétrocession** sur les dossiers apportés.

---

## 3. Objectif J117 (23 janvier 2027)

**Objectif maximal réaliste** — à ajuster selon les ressources réelles de l'équipe :

| Indicateur | Cible J117 |
|---|---|
| Startups avec un score actif | 500 |
| Partenaires white-label signés (payants ou en pilote convertible) | 15 |
| Dossiers non-dilutifs déposés | 60 |
| Financements non-dilutifs obtenus par les clients (accords notifiés) | 1,5 M€ |
| Revenus contractés (success fees à encaisser + MRR annualisé) | 150 k€ |
| Fonds abonnés au feed deal-flow | 5 |
| Backtest du Score publié (précision mesurée sur données publiques) | Oui |

**North star** : euros de financement obtenus par les startups via Raisup. Tout le reste est un moyen.

---

## 4. Plan d'exécution

### Phase 1 — J1 à J14 (28 sept → 11 oct) : Fondations & preuve
- [ ] Assainir le site (voir §6) : retirer les chiffres non sourcés, corriger le compteur à 0.
- [ ] Construire la **base dispositifs v1** : 40 aides les plus fréquentes pour startups FR (Bpifrance Bourse French Tech, i-Nov, prêts d'amorçage, aides régionales Île-de-France/AURA/Occitanie, CIR, CII, JEI, EIC Accelerator).
- [ ] Moteur d'**éligibilité** : questionnaire 10 min → liste des aides + montant estimé. C'est le nouveau produit d'appel (« Combien d'argent non-dilutif vous laissez sur la table ? »).
- [ ] Pipeline de données publiques : extraction des augmentations de capital (BODACC/INPI) et des bénéficiaires CORDIS.
- [ ] Consultation avocat (1 demi-journée) : périmètre non réglementé, CGU, mandat de dépôt, clause de success fee.
- [ ] Recruter 2 experts dossiers freelances (anciens chargés d'affaires Bpifrance / consultants CIR).
- **Kill criteria** : si < 30 % des 50 Pioneer ont au moins 1 aide éligible > 30 k€, revoir le ciblage.

### Phase 2 — J15 à J45 (12 oct → 11 nov) : Cash engine
- [ ] Convertir les 50 Pioneer vers le pack non-dilutif (0 € d'avance, success fee).
- [ ] **Dossier unique** v1 : génération automatique de 3 formats (Bpifrance, aide régionale, mémoire CIR/CII).
- [ ] Déposer les **20 premiers dossiers**.
- [ ] Déposer les propres dossiers de Raisup (JEI, Bourse French Tech ou équivalent régional).
- [ ] Démarcher 40 structures d'accompagnement ; objectif 8 pilotes signés.
- [ ] Démarcher 30 cabinets d'expertise comptable ; objectif 5 apporteurs actifs.
- **Kill criteria** : taux de pilotes partenaires < 10 % des contacts → retravailler l'offre partenaire avant d'élargir.

### Phase 3 — J46 à J90 (12 nov → 26 déc) : Réseau & standard
- [ ] Onboarding des cohortes partenaires → 300 startups scorées.
- [ ] **Backtest du Score** sur les données publiques ; publication de la méthodologie et des résultats (article + page dédiée).
- [ ] Lancer le **feed deal-flow** investisseurs (startups opt-in, score ≥ seuil) auprès de 30 fonds seed ; objectif 3 abonnés.
- [ ] Signer le partenariat avec une plateforme agréée (PSFP) pour la mise en relation dilutive — Raisup en couche de préparation.
- [ ] 40 dossiers non-dilutifs cumulés déposés.
- [ ] Préparer la campagne EIC Accelerator (fenêtres de dépôt début 2027 — vérifier le calendrier officiel).

### Phase 4 — J91 à J117 (27 déc → 23 janv) : Conversion & levier
- [ ] Convertir les pilotes partenaires en contrats payants (objectif 15).
- [ ] 60 dossiers déposés ; premières notifications d'accord → **études de cas publiées** (avec accord des startups).
- [ ] Remplacer les chiffres marketing par les **chiffres réels** : montants obtenus, taux d'acceptation, délai moyen.
- [ ] Préparer la levée de Raisup elle-même, **avec sa propre plateforme** : score, dossier unique, matching — la démo *est* la preuve.
- [ ] Décision phase 2 : statut IOBSP pour le financement par dette / RBF, extension Allemagne ou Espagne (commencer par un seul pays).

---

## 5. Organisation minimale

| Rôle | Charge | Profil |
|---|---|---|
| Produit / tech | 1–2 ETP | Full-stack + intégration LLM et pipelines de données |
| Dossiers non-dilutifs | 2 freelances à la mission | Ex-Bpifrance, ex-cabinet CIR |
| Partenariats & ventes | 1 ETP (fondatrice/fondateur) | Réseaux d'accompagnement, experts-comptables |
| Juridique | À l'acte | Avocat fintech/réglementaire |

Rituel hebdomadaire unique : **revue des 7 indicateurs de la §3** + décisions go/kill.

---

## 6. Correctifs immédiats sur le site actuel (`index.html`)

Ces points exposent Raisup à un risque de crédibilité auprès des investisseurs et à un risque juridique (pratiques commerciales trompeuses) :

- **Chiffres non étayés** : « 5× plus de chances de lever », « 3× plus de levées réussies », « 73 % améliorent leur dossier », « +340 h économisées », « 90 K€ identifiés en moyenne », « 68 score moyen des portefeuilles partenaires », « 14 startups gérées en moyenne ». Avant de disposer de données réelles, les remplacer par des promesses vérifiables (« Votre éligibilité en 10 minutes ») ou les présenter comme des objectifs.
- **« Unique en Europe » / « Le standard de référence »** : affirmations difficiles à prouver ; préférer « Méthodologie ouverte et backtestée » une fois la phase 3 réalisée.
- **Compteur « 0 startups analysées »** : s'affiche à 0 si l'animation ne se déclenche pas — mauvais signal.
- **Simulateur secondary** : ajouter une mention claire « outil de simulation, ne constitue pas une offre ni un conseil en investissement ».
- **Repositionner le hero** autour du non-dilutif : *« Trouvez l'argent que vous n'avez pas à rendre. Puis levez le reste. »*

---

## 7. Ce qui ferait échouer le plan

1. Vouloir tout livrer (5 piliers) en même temps → **le non-dilutif d'abord**, le reste suit.
2. Dossiers de mauvaise qualité déposés en volume → réputation grillée auprès des financeurs publics. La relecture humaine est non négociable.
3. Faire de l'intermédiation financière réglementée sans agrément → risque pénal et fin de l'entreprise. L'adossement à un partenaire agréé est la seule voie rapide.
4. Promettre des chiffres qu'on ne peut pas prouver → c'est exactement ce que les investisseurs (et la DGCCRF) vérifient.
