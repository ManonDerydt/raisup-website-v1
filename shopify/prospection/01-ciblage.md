# Grille de ciblage : 30 marques pour le test

Deux angles, 15 marques chacun. Ne pas mélanger : chaque marque reçoit un seul angle.

## Angle A : checkout cassé (15 marques)

Qui : boutiques Shopify (plan Advanced ou Plus) qui utilisaient des réductions personnalisées, un pixel ou GTM dans le checkout avant le 26 août 2026.

Filtres Store Leads (storeleads.app, 75 $ le mois, résilier ensuite) :
- Pays : France (puis Belgique, Suisse si moins de 15 résultats)
- Plan : Shopify Plus OU Advanced
- Effectifs : 10 à 50
- Apps installées : au moins une parmi Google Analytics 4 / GTM, Meta Pixel, Klaviyo, une app de réductions (Discount Ninja, Bold Discounts, Shopify Scripts visible)
- Chiffre d'affaires estimé : 1 à 20 M$

Vérification manuelle, 1 minute par boutique :
1. Ouvrir la boutique, ajouter un produit au panier, aller jusqu'au paiement.
2. Regarder si l'URL du checkout est `checkout.shopify.com` ou `/checkouts/cn/` (nouveau checkout) : si oui, la migration est faite, passer à la suivante.
3. Ouvrir les outils de développement, onglet Réseau, filtrer `gtm` ou `fbevents` sur la page de paiement : s'il n'y a rien alors que la page produit en a, c'est un signal fort. Noter la capture.

Si la vérification n'est pas concluante, garder la marque quand même : le message demande, il n'affirme pas.

Sans Store Leads : chercher sur Google `site:*.myshopify.com` ne marche plus bien ; utiliser plutôt LinkedIn, recherche « e-commerce manager » + « Shopify » en France, 10 à 50 salariés, puis vérifier la boutique.

## Angle B : stock ressaisi à la main (15 marques)

Qui : marques qui vendent sur Shopify ET au moins un autre canal (Amazon, Faire, Ankorstore, boutiques physiques) et qui n'ont pas de dev en interne.

Filtres Store Leads :
- Pays : France
- Effectifs : 10 à 50
- Apps installées : une app marketplace (Amazon by Codisto, Shopify Marketplace Connect) OU une app de point de vente (Shopify POS) OU une app de gestion de stock de base (Stocky)
- Pas d'ERP visible (si Odoo, NetSuite, Cegid apparaissent, exclure : ils ont déjà quelqu'un)

Signaux bonus, à chercher sur LinkedIn :
- Offre d'emploi récente « responsable logistique », « ops manager », « assistant e-commerce » : ils cherchent un humain pour faire ce qu'un script ferait.
- Aucun profil « développeur » dans l'entreprise.

## Qui contacter

Dans cet ordre, selon la taille :
- 10 à 20 salariés : le ou la fondatrice.
- 20 à 50 salariés : responsable e-commerce, directeur ou directrice des opérations, sinon le fondateur.

Trouver l'email : mentions légales du site, page contact, puis Hunter.io (gratuit, 25 recherches par mois). Format le plus courant en France : `prenom@marque.fr` ou `prenom.nom@marque.fr`. En dernier recours, le formulaire de contact du site, avec le même texte.

## Colonnes à remplir dans `04-suivi.csv`

Marque, URL, angle (A ou B), contact, poste, email, signal observé, date envoi, relance 1, relance 2, réponse, appel, montant discuté.
