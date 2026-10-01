# Diagnostic automatisation : le document livré

C'est le document que le client reçoit pour 490 €. Il a deux fonctions : être réellement utile (le client le garde même s'il ne continue pas), et faire choisir un Sprint. 6 à 8 pages, pas plus. Mise en page sobre, le logo du client en première page à côté du vôtre.

Règle d'écriture : aucun terme technique. Pas d'API, pas de webhook. On parle en heures, en euros, en incidents évités.

---

## Page 1 : couverture

**Diagnostic automatisation**
[Marque]
Réalisé par Rouage, [date]
Pour [Prénom Nom, poste]

---

## Page 2 : l'essentiel en une page

*(La seule page que le dirigeant lira en entier. Tout le document tient là.)*

**Ce qu'on a trouvé**

[Marque] consacre aujourd'hui environ **[21] heures par semaine** à des tâches manuelles qu'un système peut faire seul, soit **[26 000] € par an** en temps d'équipe, plus [3] incidents cités sur les 6 derniers mois ([survente d'août, commande fournisseur oubliée en juin, 40 tickets SAV « où est ma commande » par semaine]).

**Les 3 automatisations qui rapportent le plus**

| # | Automatisation | Heures gagnées / semaine | Valeur / an | Prix fixe | Délai |
|---|---|---|---|---|---|
| 1 | [Synchro stock Shopify, Amazon, entrepôt] | [15] h | [19 000] € | 2 490 € HT | 5 jours |
| 2 | [Réponses automatiques « où est ma commande »] | [4] h | [5 000] € | 2 490 € HT | 5 jours |
| 3 | [Commandes fournisseurs sur seuil] | [2] h + ruptures évitées | [2 500] € + [ventes perdues] | 2 490 € HT | 5 jours |

**Notre recommandation**

Commencer par la n° 1 : c'est celle qui rapporte le plus, et elle rend les deux autres plus simples ensuite. Retour sur investissement : [moins de 2 mois]. Le diagnostic (490 €) est déduit : [2 000] € HT.

**Apps à résilier dès maintenant** : [Stocky (gratuit mais inutile ensuite), app X à 49 € par mois dont vous n'utilisez qu'une fonction]. Économie : [588] € par an.

---

## Page 3 : comment ça se passe aujourd'hui

*(Le flux réel, tel qu'observé pendant l'atelier. Le client doit se reconnaître. C'est ce qui prouve qu'on a compris.)*

**Le stock, aujourd'hui**

1. Une vente part sur Amazon. [Prénom] le voit dans Seller Central [le matin et le soir].
2. [Prénom] ouvre le tableur « Stock global », retire la quantité, puis va dans Shopify modifier la quantité du produit.
3. Quand l'entrepôt reçoit une livraison, [Nom] envoie un email avec le bon de réception ; [Prénom] ressaisit les quantités dans le tableur, puis dans Shopify, puis dans Amazon.
4. Entre deux mises à jour, le stock affiché est faux. [En août, 40 unités de [produit] ont été vendues deux fois.]

Temps mesuré : [2] personnes, [1 h 30] par jour chacune, 5 jours par semaine = **[15] h par semaine**.

*(Répéter en plus court pour les process 2 et 3.)*

---

## Page 4 : automatisation n° 1 en détail

**[Synchro stock Shopify, Amazon, entrepôt]**

*Ce que ça fait, en une phrase :* un seul stock, à jour partout, toutes les 5 minutes, sans que personne ne touche à rien.

*Concrètement :*
- Une vente sur Amazon baisse le stock Shopify dans les 5 minutes, et inversement.
- Le fichier de réception de l'entrepôt est lu automatiquement ; les quantités montent partout.
- Quand un produit passe sous [10] unités, [Prénom] reçoit un email.
- Un tableau de bord simple montre le stock par canal et les dernières mises à jour.

*Ce que ça change :*
- [15] h par semaine libérées, soit [19 000] € par an.
- Plus de survente : chaque canal voit le même chiffre.
- [Prénom] peut [préparer les fêtes / lancer Faire], ce que vous avez cité comme priorité.

*Ce qu'il faut de votre côté :* un accès Shopify, l'accès API Amazon, le format du fichier de réception (celui que vous utilisez déjà), 1 heure de tests avec [Prénom] le jour 4.

*Ce que ça ne fait pas :* les prix, les fiches produit, Faire et Ankorstore. Possible dans un Sprint suivant.

*Prix fixe : 2 490 € HT. Délai : 5 jours ouvrés. Support : 30 jours. Le code et les accès vous appartiennent.*

---

## Pages 5 et 6 : automatisations n° 2 et n° 3

Même structure, une page chacune.

---

## Page 7 : vos apps aujourd'hui

| App | Coût / mois | Utilisée pour | Recommandation |
|---|---|---|---|
| [Klaviyo] | [150] € | Emails | Garder |
| [App X] | [49] € | [Une seule fonction] | Résilier après l'automatisation n° 2 |
| [Stocky] | 0 € | Stock | Inutile après la n° 1 |

Économie possible : [588] € par an.

---

## Page 8 : la suite

**Si vous lancez l'automatisation n° 1**

| Étape | Quand |
|---|---|
| Devis signé et acompte | [date] |
| Démarrage | [lundi suivant] |
| Tests avec [Prénom] | jour 4 |
| Mise en production | jour 5 |
| Mesure du temps gagné, ensemble | semaine suivante |

Prix : 2 490 € HT, moins le diagnostic : **2 000 € HT**. Devis joint.

**Si vous préférez attendre**

Ce document vous appartient. Vous pouvez le confier à votre agence ou à un développeur ; il contient tout ce qu'il faut pour chiffrer. Le prix du diagnostic reste déduit d'un Sprint commandé dans les 60 jours.

**Une question ?** [email], [téléphone].

---

## Notes pour vous

- La restitution de 30 minutes se fait en visio, en lisant la page 2 ensemble. On termine par : « Laquelle des trois vous voulez lancer en premier ? » Pas « est-ce que vous voulez continuer ». Le choix est entre les trois, pas entre oui et non.
- Les chiffres de la page 2 doivent être ceux du client, validés pendant l'atelier. Jamais une estimation de votre côté sans qu'il ait dit « oui, c'est à peu près ça ».
- Si le diagnostic montre qu'une app à 20 € par mois suffit, l'écrire. Le client vous rappellera pour autre chose, et il en parlera autour de lui.
- Le document doit être prêt à envoyer en 5 jours. Prévoir : atelier 1 h, analyse 2 h, rédaction 2 h, relecture 30 min. C'est 490 € pour une demi-journée, et c'est la porte vers 2 490 €.
