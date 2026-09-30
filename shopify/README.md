# One-page Sprint automatisation Shopify

Site statique, sans dépendance ni cookie. Tout le texte est dans `src/`.

## Configurer
Toutes les variables (`LIEN_CAL`, `EMAIL`, `LINKEDIN`, `PHOTO`, `DOMAINE`, `NUMERO_ENTREPRISE`, `ADRESSE`, nom, statut, hébergeur) sont dans **`config.json`**.
`PHOTO` accepte un chemin local (ex. `src/photo.jpg`, copié au build) ou une URL. Vide = pastille avec l'initiale.

## Construire
```
node build.mjs      # génère dist/ (HTML avec CSS inline, CNAME, robots.txt, sitemap.xml)
```
Le build échoue si une variable est inconnue ou si un tiret cadratin apparaît.

## Déployer sur {{DOMAINE}}
- **GitHub Pages** : workflow `.github/workflows/deploy-shopify.yml` (Settings > Pages > Source : GitHub Actions), puis enregistrement DNS `CNAME www -> <user>.github.io` ou A vers les IP GitHub Pages.
- **Netlify / Vercel / Cloudflare Pages** : commande `node build.mjs`, dossier `dist`, répertoire racine `shopify`. Penser à mettre à jour l'hébergeur dans `config.json`.

## Livrables
`livrables/` : captures 375px et 1440px, page Mentions légales, rapport Lighthouse mobile (100/100/100/100).
