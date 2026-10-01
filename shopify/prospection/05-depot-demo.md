# Dépôt GitHub de démo : ce qu'il doit contenir

Il remplace le portfolio Shopify que vous n'avez pas encore. Il sert aux marques (lien dans les emails), aux agences et aux entretiens de mission. Prévoir 1 jour. Compte Shopify Partners nécessaire pour créer une boutique de développement gratuite.

Nom suggéré : `shopify-automation-kit`, public, README en anglais (les agences UK et US le liront aussi), avec une section en français.

## 1. Une Shopify Function de réduction (2 h)

- Créer l'app avec `shopify app init`, template Remix, puis `shopify app generate extension --type discount_function` (JavaScript).
- Règle simple mais réaliste : 10 % sur le panier à partir de 3 articles de la collection « bundle », plafonnée à 30 €.
- Montrer dans le README le avant (Script Ruby équivalent, 10 lignes) et le après (Function). C'est exactement la question posée en entretien : « comment tu migres un Script vers une Function ».

## 2. Une Checkout UI Extension (2 h)

- `shopify app generate extension --type ui_extension`, cible `purchase.checkout.block.render`.
- Bloc « Livraison estimée » qui lit l'adresse et affiche un délai. Peu importe la logique, ce qui compte est de montrer : lecture du contexte checkout, rendu avec les composants Shopify, configuration dans l'éditeur de checkout.
- Bonus 30 min : un Web Pixel qui envoie l'événement `checkout_completed` vers un endpoint factice, pour prouver que vous savez remettre le tracking après la coupure checkout.liquid.

## 3. Un connecteur Admin API avec webhooks (3 h)

- Petit service Node (Fastify ou Express) qui :
  - reçoit le webhook `inventory_levels/update`,
  - vérifie la signature HMAC,
  - pousse la quantité vers une « cible » (un simple fichier JSON ou une table SQLite qui simule Amazon ou un ERP),
  - et dans l'autre sens, expose une route qui met à jour Shopify via `inventorySetQuantities` (GraphQL Admin API 2025-07 ou plus récente).
- README : schéma du flux, gestion des doublons (idempotence par `inventory_item_id` + horodatage), limites de débit.

## 4. Le README (1 h)

- Trois paragraphes : qui, pourquoi ce dépôt, comment lancer en local.
- Une capture de la Function en action dans la boutique de dev et une du bloc checkout.
- Lien vers la page Rouage.
- Une ligne : « Available for agency overflow work: Functions, Checkout Extensibility, ERP and 3PL integrations. »

## Ce qu'on vous demandera en entretien, à préparer avec le dépôt

- Différence Scripts / Functions, limites des Functions (pas d'appel réseau, exécution en WebAssembly, limites de taille et de temps).
- Checkout Extensibility : ce qu'on peut et ne peut pas modifier, cibles de rendu, différence avec les apps thème.
- Admin API : versions trimestrielles, limite de débit par points de coût en GraphQL, webhooks avec vérification HMAC.
- Theme app extensions vs modification du thème.
