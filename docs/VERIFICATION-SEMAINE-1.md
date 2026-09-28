# Agent-Ready — Vérification de la semaine 1

*28 septembre 2026. Sources détaillées : `research_notes/Vérification semaine 1/`. La plupart des pages officielles étaient bloquées par le réseau : les constats viennent d'extraits de recherche des pages citées, et les chiffres des éditeurs sont déclaratifs.*

## Verdict

**La version « GO énorme » (connecter ChatGPT/Claude aux agendas des salons hors Fresha) n'est pas viable comme entreprise à fort potentiel.** Les plateformes le font elles-mêmes, et les accès techniques restants se font salon par salon.

**Agent-Ready tel que conçu (score de visibilité IA) est à arrêter** : la mesure de visibilité dans les IA est déjà vendue aux agences par des acteurs financés ou très bon marché.

Il reste **une niche étroite** : un test de « réservabilité » par les IA, de bout en bout, vendu aux agences. Petite activité possible, pas une trajectoire de forte croissance.

## 1. Les plateformes construisent déjà l'accès des IA à la réservation

| Plateforme | Ce qui existe | Date |
|---|---|---|
| Fresha | Réservation native dans ChatGPT et Claude | 4 août 2026 |
| Square | App ChatGPT et plugin Claude (restaurants en ligne, rendez-vous « bientôt ») ; serveur MCP officiel en bêta | 1er juillet 2026 |
| Google AI Mode | Réserve des rendez-vous beauté via Booksy, Fresha et Vagaro ; étendu aux services locaux à Google I/O 2026 | Août 2025 → 2026 |
| Wix | Serveur MCP sur les sites, Wix Bookings relié à Google | 2026 |

## 2. Accès techniques des autres plateformes

| Plateforme | Peut créer des réservations via API | Accès | Opportunité pour un connecteur tiers |
|---|---|---|---|
| Acuity | Oui | Inscription partenaire + salon en offre Premium | Moyenne à élevée (peu de salons) |
| Vagaro | Oui (point exact non confirmé) | Chaque salon demande l'accès, ~10 $/mois | Moyenne |
| Mindbody / Booker | Oui | Validation partenaire + code d'activation par salon + frais à l'appel | Moyenne |
| Zenoti, Phorest | Oui | Par salon, sur demande | Moyenne |
| Setmore, SimplyBook.me | Oui | Facile, mais peu de salons américains | Moyenne à faible |
| Square | Oui, le plus simple | Libre-service | **Faible** : Square le fait lui-même |
| Boulevard | Oui | Clients Enterprise seulement | Faible |
| Booksy | Partenaires négociés seulement | Fermé | Faible |
| GlossGenius, StyleSeat | Pas d'API publique | Fermé | Très faible |

**Conclusion :** tout accès passe par une autorisation salon par salon. Impossible de réserver « n'importe quel salon ». Les plus grosses bases beauté hors Fresha (GlossGenius, StyleSeat, Booksy) sont fermées.

## 3. Concurrents vérifiés

| Acteur | Ce qu'il fait | Prix |
|---|---|---|
| BrightLocal | Visibilité IA locale incluse dans ses offres (ChatGPT, AI Overviews, AI Mode), score sur 100 ; 6 000+ agences | Dès 29–39 $/mois |
| Local Falcon | Part de voix IA, API, MCP, connecteur Claude | 24,99 à 199,99 $/mois |
| Peec AI | Visibilité IA pour marques et agences, ~15 M$ de revenu annuel | 95 à 495 $/mois |
| Search Atlas | SEO + visibilité IA | 99 à 999 $/mois |
| Profound | Leader, 1,8 Md$ de valorisation (septembre 2026) | Entreprises |
| Atlas Visibility | Visibilité IA « clé en main » pour commerces locaux (sans réservation) | 89 $/mois |
| Zoca | Marketing IA pour salons, dont la visibilité ChatGPT (6 M$ levés, Accel) | — |
| AgentHermes, TiltStack, Capconvert, AI Page Ready | Petits audits de « préparation aux agents », non financés | Gratuit à sur devis |

**Aucune startup financée trouvée** qui teste de bout en bout si une IA peut réserver un commerce et le vend en marque blanche aux agences.

## 4. Faits corrigés

| Affirmation | Réalité |
|---|---|
| 45 % des consommateurs ont utilisé l'IA pour une recommandation locale (BrightLocal) | **Vrai** (1 002 adultes américains) |
| « 18 % contactent directement », « 75 % vérifient sur Google » | **Faux tels quels** : l'étude dit que **88 %** des utilisateurs vérifient avant d'agir |
| « 20–33 % de recouvrement entre deux recherches » | **Non vérifiable**. Une autre étude (SparkToro) indique que les listes de recommandations IA se répètent moins de 1 % du temps : le score de visibilité est très instable |
| Instant Checkout d'OpenAI | Lancé en septembre 2025, retiré début mars 2026, remplacé par les apps des marchands |
| Multiples de revente (Acquire.com) | Médiane ~3,9 × le profit ; ~2,6 × le revenu en prix demandé (pas en prix de vente) |

## 5. Ce qui reste possible

| Option | Potentiel | Pour | Contre |
|---|---|---|---|
| **A. Test de « réservabilité » pour agences** : des IA essaient réellement de réserver, on diagnostique ce qui bloque, on donne un plan de correction ou de migration | Petite activité (quelques k$/mois) | Personne de financé dessus ; réutilise le prototype | Facile à copier par BrightLocal ou Local Falcon ; fenêtre ~6–12 mois |
| **B. Service pour salons multi-établissements** sur Zenoti, Vagaro, Mindbody, Phorest | Petite à moyenne activité de services | Accès techniques possibles, clients à plus gros budget | Intégration salon par salon, vente lente ; fenêtre ~6–18 mois |
| **C. Changer de piste** : conformité au Cyber Resilience Act (échéance légale au 11 décembre 2027) | À analyser | Demande imposée par la loi, peu d'outils pour PME | Moins viral, vente B2B, rien de construit |

## Recommandation

1. **Arrêter d'investir dans Agent-Ready comme projet principal.** Garder le prototype, le moteur de scan et la chaîne de prospection : ils sont réutilisables.
2. **Si tu veux une petite activité rapide :** tester l'option A en 2 semaines, pour moins de 500 $, auprès de 30 agences, en vendant un audit « réservabilité » fait en partie à la main. Seuil : 3 agences qui paient.
3. **Pour le projet principal :** analyser sérieusement l'option C (ou une autre piste à obligation légale), avec la même méthode : recherche, cartographie, avis de plusieurs IA, puis test payant.
