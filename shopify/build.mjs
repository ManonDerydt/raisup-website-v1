// Génère dist/ à partir de src/ en remplaçant les variables {{...}} de config.json.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';

const cfg = JSON.parse(readFileSync('config.json', 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const css = readFileSync('src/style.css', 'utf8').replace(/\s*\n\s*/g, '');

mkdirSync('dist', { recursive: true });
// DOMAINE : nom nu (rouage.fr), URL complète, ou placeholder [DOMAINE]
const site = /^(https?:|\[)/.test(cfg.DOMAINE) ? cfg.DOMAINE : 'https://' + cfg.DOMAINE;
const placeholder = cfg.DOMAINE.startsWith('[');
// Tant que LIEN_CAL n'est pas renseigné, tous les boutons mènent au formulaire de contact
const ctaHref = String(cfg.LIEN_CAL).startsWith('[') ? '#contact' : cfg.LIEN_CAL;
// Réalisations : logo dans src/logos/<slug>.(svg|png|jpg|webp) si présent, sinon wordmark
import { readdirSync } from 'node:fs';
const WORKS = [['raisup','Raisup'],['dueria','Dueria'],['fundherz','Fundherz'],['tabascocity','TabascoCity'],['tuveuxunexpert','Tu veux un expert']];
mkdirSync('dist/logos', { recursive: true });
const logoFiles = existsSync('src/logos') ? readdirSync('src/logos') : [];
const logosHtml = WORKS.map(([slug, name]) => {
  const f = logoFiles.find(x => x.replace(/\.[^.]+$/, '') === slug);
  if (f) { copyFileSync('src/logos/' + f, 'dist/logos/' + f); return `<li><img src="logos/${f}" alt="" loading="lazy"><span class="wordmark">${esc(name)}</span></li>`; }
  return `<li><span class="wordmark">${esc(name)}</span></li>`;
}).join('');

const vars = { ...Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, esc(v)])), CSS: css, STUDIO_INITIALE: esc(String(cfg.STUDIO || 'S').charAt(0).toUpperCase()), DOMAINE: esc(site), LOGOS_HTML: logosHtml, CTA: esc(ctaHref) };
const footer = readFileSync('src/footer.html', 'utf8');
const render = t => t.replace('{{FOOTER}}', footer).replace(/\{\{(\w+)\}\}/g, (m, k) => {
  if (!(k in vars)) throw new Error('Variable inconnue : ' + m);
  return vars[k];
});

for (const f of ['index.html', 'agences.html', 'mentions-legales.html']) {
  const out = render(readFileSync('src/' + f, 'utf8'));
  if (out.includes('—')) throw new Error('Tiret cadratin trouvé dans ' + f);
  writeFileSync('dist/' + f, out);
}
copyFileSync('src/favicon.svg', 'dist/favicon.svg');
copyFileSync('src/og.png', 'dist/og.png');
if (!placeholder) writeFileSync('dist/CNAME', site.replace(/^https?:\/\//, '') + '\n');
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`);
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site}/</loc></url><url><loc>${site}/agences.html</loc></url><url><loc>${site}/mentions-legales.html</loc></url></urlset>\n`);
console.log('dist/ généré pour', cfg.DOMAINE);
