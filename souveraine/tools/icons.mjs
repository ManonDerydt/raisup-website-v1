// Génère les icônes de l'application (PNG) à partir des polices embarquées.
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadChromium } from './pw.mjs';

const pub = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const font = pathToFileURL(join(pub, 'fonts', 'source-serif-4-latin-600-normal.woff2')).href;
mkdirSync(join(pub, 'icons'), { recursive: true });

const page = (size, { pad = 0, transparent = false, ink = '#f3f1ec', bg = '#241c16' } = {}) => `<!doctype html><html><head><style>
@font-face { font-family: S; src: url(${font}) format('woff2'); font-weight: 600; }
html, body { margin: 0; width: ${size}px; height: ${size}px; background: ${transparent ? 'transparent' : bg}; }
.c { position: absolute; inset: ${pad}px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.s { font-family: S; font-weight: 600; color: ${ink}; font-size: ${(size - 2 * pad) * 0.62}px; line-height: 1; transform: translateY(-${(size - 2 * pad) * 0.03}px); }
.r { width: ${(size - 2 * pad) * 0.28}px; height: ${Math.max(2, Math.round((size - 2 * pad) * 0.022))}px; background: ${transparent ? ink : '#c9a565'}; margin-top: ${(size - 2 * pad) * 0.04}px; }
</style></head><body><div class="c"><div class="s">S</div><div class="r"></div></div></body></html>`;

const chromium = await loadChromium();
const browser = await chromium.launch();
const jobs = [
  ['icon-192.png', 192, {}],
  ['icon-512.png', 512, {}],
  ['maskable-512.png', 512, { pad: 64 }],
  ['apple-touch-icon.png', 180, {}],
  ['badge-72.png', 72, { transparent: true, ink: '#ffffff' }]
];
for (const [name, size, opts] of jobs) {
  const p = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await p.setContent(page(size, opts));
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: join(pub, 'icons', name), omitBackground: !!opts.transparent });
  await p.close();
}
await browser.close();
console.log('Icônes générées.');
