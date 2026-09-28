# Cartographie concurrentielle : « Document → outil interactif intégrable »

*28 septembre 2026. Sources détaillées : `research_notes/Cartographie outils interactifs/`.*
*Limite : le proxy réseau a bloqué la plupart des sites éditeurs, WordPress.org et Reddit. Les chiffres viennent d'extraits de recherche, de G2/Capterra et de Latka (estimations), et doivent être revérifiés avant toute décision chiffrée.*

---

## 1. Verdict

**L'idée est pertinente comme SaaS rentable, mais pas comme pari d'hypercroissance à la Base44.**

1. **Ce n'est plus une idée neuve.** Outgrow génère déjà des projets à partir d'une URL ou d'un PDF. ConvertSite vend exactement « importe ton tableur/PDF → calculateur de devis intégrable » (25 à 100 $/mois). Framer Workshop génère des calculateurs de prix depuis mai 2025, et plusieurs plugins WordPress se présentent comme des « constructeurs de formulaires IA ».
2. **La catégorie est petite.** Après des années d'existence, les acteurs spécialisés plafonnent à quelques millions de dollars de revenus annuels (estimations Latka) : Outgrow ~7,3 M$, Interact ~5,3 M$, Riddle ~2,8 M$. Les gros revenus sont chez les constructeurs de formulaires généralistes : Jotform ~145 M$ et Typeform ~150 M$ (estimations).
3. **Générer l'outil n'est plus un avantage.** Claude, Lovable, Base44 ou Framer produisent un calculateur en quelques minutes. La plus grosse menace est **Wix + Base44** : le site, les formulaires, le CRM et un générateur IA chez le même acteur, auprès de la même clientèle.
4. **La demande est réelle mais modeste.** Selon Gartner (2026), 67 % des acheteurs B2B préfèrent un parcours sans commercial. Mais les gains de conversion annoncés viennent presque tous des éditeurs eux-mêmes ; aucune étude indépendante n'a été trouvée.

➡️ **Recommandation : ne pas y aller tel quel.** Soit on garde le terrain avec un angle nettement différent (§4), soit on revient à la liste des autres idées. Dans les deux cas, il faut accepter qu'aucune option trouvée ne garantit une trajectoire à la Base44.

---

## 2. Carte des concurrents

### Direct : document → outil intégrable
| Acteur | Ce qu'il fait | Prix | Signal |
|---|---|---|---|
| **ConvertSite** | Tableur/PDF/document → calculateur, configurateur, estimateur intégrable | 25 / 50 / 100 $/mois, paiement à la publication | Seul acteur trouvé sur ce positionnement exact ; aucun avis ni chiffre de traction ; lien possible avec ConvertCalculator (non confirmé) |
| **Outgrow** | Calculateurs, quiz, évaluations ; génération IA depuis une URL ou un PDF | ~45 $ → ~600–720 $/mois | ~7,3 M$ de revenus annuels (est.), 66 salariés ; G2 4,7/5 (332 avis). Son IA se décrit comme « co-pilote, pas pilote automatique » : les formules complexes sont à vérifier à la main |
| **Kalkulio, SpreadsheetConverter** | Tableur Excel → calculateur web, sans IA | — | Approche ancienne |
| **Calculator Studio** | Calculateurs fondés sur un tableur | — | **Fermeture annoncée au 31 août 2026** : signal d'un marché difficile |

### Constructeurs de calculateurs, quiz et tunnels (IA depuis un prompt ou une URL)
| Acteur | Prix d'entrée | Notes |
|---|---|---|
| involve.me | 29–49 $ | Agent IA en bêta depuis le 31 juillet 2025 ; calculateur jugé « basique et bogué » (Capterra) |
| Interact | 27–39 $ | Quiz ; lit le site web ; ~5,3 M$ de revenus annuels (est.) |
| ScoreApp | 29–39 $ → 799 $ | Quiz d'évaluation ; courbe d'apprentissage |
| Riddle | → 749 $ | ~2,8 M$ de revenus annuels (est.), 15 salariés |
| Heyflow | — | ~22 M$ levés (dont une série A de 16 M$ en 2024) |
| Perspective | — | Tunnels de conversion ; connecteur MCP vers Claude et ChatGPT |
| ConvertCalculator (Convert_) | Budget | Difficile sur les projets complexes |
| Calconic, uCalc, Calculoid, Common Ninja, Elfsight | 2,50–20 $ | Widgets bas de gamme ; Elfsight coupe le widget quand la limite de vues mensuelles est atteinte |
| Minform, GenZform, Embeddable | — | Nouveaux acteurs IA, pas de traction connue |

### Constructeurs de formulaires qui ajoutent l'IA (les poids lourds)
| Acteur | Revenus annuels (est.) | IA |
|---|---|---|
| Jotform | ~145 M$ | Agents IA, calculs |
| Typeform | ~150 M$ | Import de fichiers sur les plans payants (formulaires, pas de calculateurs de prix) |
| Tally | ~6 M$ (sept. 2026) | Croissance rapide, très bon marché |
| Fillout, Paperform, Zoho Forms | — | Calculs basiques |

### Substituts et risque de plateforme
| Source | Niveau de menace | Pourquoi |
|---|---|---|
| **Wix + Base44** | 🔴 Élevé | Site, formulaires, CRM et générateur IA réunis. Pas encore de fonction « calculateur IA » annoncée |
| **Framer Workshop** | 🟠 | Génère calculateurs, formulaires en plusieurs étapes et quiz (depuis mai 2025) |
| Plugins WordPress (Calculated Fields Form, 40 000+ installations ; Cost Calculator Builder, 20 000+) | 🟠 | Déjà installés sur des millions de sites, génération IA en cours d'ajout |
| Lovable, Base44, Claude | 🟡 | Le font très bien, mais demandent de savoir formuler ; hébergement, collecte de prospects et mises à jour restent à la charge de l'utilisateur |
| ChatGPT Canvas, Gemini Canvas | 🟢 Faible | Pas de publication sur le web, pas d'intégration dans un site |
| HubSpot (Breeze, devis) | 🟢 | Côté vente, pas de calculateurs publics sur le site |
| Logiciels métiers (Roofle en toiture, Aurora en solaire, Housecall Pro) | Terrain à éviter | Ils s'appuient sur des données externes (géométrie du toit, etc.) |

---

## 3. Ce que les clients reprochent aux outils existants

1. **Des paliers de prix brutaux** : l'entrée coûte 25–50 $, puis il faut passer à 500–800 $.
2. **Des limites de prospects** (100 à 1 000 par mois), et **le retrait de la marque de l'éditeur** réservé au 2ᵉ palier.
3. **Formules et logique compliquées à paramétrer**, et l'IA actuelle se trompe sur les calculs complexes.
4. **Des calculateurs jugés basiques ou bogués.**
5. **Des widgets coupés** quand la limite de vues est atteinte.

Ces plaintes dessinent l'ouverture : **la justesse des calculs et la simplicité de mise à jour, pas la génération.**

---

## 4. Si on garde ce terrain : l'angle différenciant

**« Ton catalogue de prix devient un moteur de devis. Toujours à jour, toujours juste. »** C'est une version simplifiée des logiciels de devis d'entreprise (CPQ), pour les PME B2B.

- **Entrée :** la grille tarifaire réelle (Excel, PDF, catalogue) avec ses options, remises, minimums et règles.
- **Justesse garantie :** l'IA extrait les règles, puis le produit **génère des cas de test et les montre au client pour validation** avant publication. C'est la réponse directe au « co-pilote, pas pilote automatique » d'Outgrow.
- **Mise à jour :** quand le client change son tableur, tous les outils se mettent à jour automatiquement.
- **Trois usages depuis le même moteur :** un calculateur public sur le site, un devis PDF pour les commerciaux, et une app MCP pour que ChatGPT ou Claude puissent donner un prix juste.
- **Cibles** (prix déjà dans un document, pas de spécialiste dominant) : agences et services B2B, fabricants avec grilles d'options, imprimeurs, traiteurs et événementiel, nettoyage et déménagement, formation.
- **Prix :** 99–299 $/mois. Au-delà de 250 $/mois, la rétention est bien meilleure (données ChartMogul), et on se différencie du bas de gamme.

**Conséquence honnête :** cet angle est plus défendable, mais **moins viral**. Le badge « Propulsé par » fonctionne moins bien sur du B2B, et la vente est plus lente. Ça donne un bon SaaS rentable (quelques millions de dollars de revenus annuels possibles), pas une hypercroissance en quelques semaines.

---

## 5. Test proposé (14 jours, avant d'écrire du code)

1. **J1–3 :** s'inscrire à ConvertSite, Outgrow et involve.me et leur soumettre **10 vraies grilles tarifaires complexes**. Noter le taux de résultats justes sans retouche. *S'ils réussissent déjà plus de 70 % des cas, l'angle « justesse » ne tient pas → arrêter.*
2. **J4–10 :** 20 entretiens avec des PME des secteurs cibles. Question clé : « Combien de temps passez-vous à faire des devis, et combien paieriez-vous pour que ce soit instantané et juste ? »
3. **J11–14 :** page de pré-vente avec une démo vidéo. *Continuer seulement si au moins 5 préventes ou lettres d'intention sont obtenues à ≥ 99 $/mois.*

---

## 6. Si l'objectif reste l'hypercroissance

Aucune des pistes étudiées ne remplit toutes les conditions d'un succès à la Base44 sans concurrent sérieux. Les options restantes, par ordre de potentiel viral :
- **Suivi de la visibilité d'une PME dans les réponses des IA** : c'est la catégorie d'outils IA qui monte le plus vite, mais des concurrents arrivent déjà et les prix sont bas.
- **Agent de relance des impayés pour freelances** : douleur forte, mais l'effet « wow » est lent.

On peut faire la même cartographie pour l'une de ces deux pistes avant de choisir.
