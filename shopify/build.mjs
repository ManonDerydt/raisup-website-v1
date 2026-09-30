// Génère dist/ à partir de src/ en remplaçant les variables {{...}} de config.json.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';

const cfg = JSON.parse(readFileSync('config.json', 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const css = readFileSync('src/style.css', 'utf8').replace(/\s*\n\s*/g, '');

mkdirSync('dist', { recursive: true });
let photo = `<div class="photo" aria-hidden="true">${esc(String(cfg.STUDIO || 'S').charAt(0).toUpperCase())}</div>`;
if (cfg.PHOTO) {
  const name = 'photo' + cfg.PHOTO.slice(cfg.PHOTO.lastIndexOf('.'));
  if (/^https?:/.test(cfg.PHOTO)) photo = `<img class="photo" src="${esc(cfg.PHOTO)}" alt="L'équipe" width="220" height="240" loading="lazy">`;
  else if (existsSync(cfg.PHOTO)) { copyFileSync(cfg.PHOTO, 'dist/' + name); photo = `<img class="photo" src="${name}" alt="L'équipe" width="240" height="240" loading="lazy">`; }
}

const vars = { ...Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, esc(v)])), CSS: css, STUDIO_INITIALE: esc(String(cfg.STUDIO || 'S').charAt(0).toUpperCase()), PHOTO_HTML: photo };
const footer = readFileSync('src/footer.html', 'utf8');
const render = t => t.replace('{{FOOTER}}', footer).replace(/\{\{(\w+)\}\}/g, (m, k) => {
  if (!(k in vars)) throw new Error('Variable inconnue : ' + m);
  return vars[k];
});

for (const f of ['index.html', 'mentions-legales.html']) {
  const out = render(readFileSync('src/' + f, 'utf8'));
  if (out.includes('—')) throw new Error('Tiret cadratin trouvé dans ' + f);
  writeFileSync('dist/' + f, out);
}
copyFileSync('src/favicon.svg', 'dist/favicon.svg');
copyFileSync('src/og.png', 'dist/og.png');
writeFileSync('dist/CNAME', cfg.DOMAINE + '\n');
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: https://${cfg.DOMAINE}/sitemap.xml\n`);
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://${cfg.DOMAINE}/</loc></url><url><loc>https://${cfg.DOMAINE}/mentions-legales.html</loc></url></urlset>\n`);
console.log('dist/ généré pour', cfg.DOMAINE);
