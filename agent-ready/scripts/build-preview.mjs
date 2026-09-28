// Builds a static, server-less preview of the site (sample report, in-browser fix generator).
// Usage: node scripts/build-preview.mjs <outDir>
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { demoReport } from '../src/demo.js';
import { scoreCardSvg } from '../src/card.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = process.argv[2];
if (!out) throw new Error('Usage: node scripts/build-preview.mjs <outDir>');
await mkdir(join(out, 'vendor/three'), { recursive: true });

const relative = (html) => html
  .replace(/(href|src)="\/(?!\/)/g, '$1="')
  .replace(/"\/vendor\/three\//g, '"./vendor/three/')
  .replace(/href=""/g, 'href="./"');

let index = await readFile(join(root, 'public/index.html'), 'utf8');
index = index
  .replace(/<!doctype html>\s*<html[^>]*>\s*<head>/i, '')
  .replace(/<\/head>\s*<body>/i, '')
  .replace(/<\/body>\s*<\/html>\s*$/i, '')
  .replace('<script type="module" src="/app.js"></script>', '<script>window.AGENT_READY_STATIC = true;</script>\n  <script type="module" src="/app.js"></script>')
  .replace('content="/api/card.svg?score=72&name=Your%20salon"', 'content="demo-card.svg"')
  .replace(/<title>[^<]*<\/title>/, '<title>Agent-Ready</title>');
await writeFile(join(out, 'index.html'), relative(index));

for (const page of ['methodology.html', 'terms.html', 'privacy.html']) {
  await writeFile(join(out, page), relative(await readFile(join(root, 'public', page), 'utf8')));
}
for (const file of ['styles.css', 'app.js', 'orb.js', 'favicon.svg']) await copyFile(join(root, 'public', file), join(out, file));
await copyFile(join(root, 'src/fix.js'), join(out, 'fix.js'));
for (const file of ['three.module.js', 'three.core.js']) {
  await copyFile(join(root, 'node_modules/three/build', file), join(out, 'vendor/three', file));
}
const sample = demoReport();
await writeFile(join(out, 'demo.json'), JSON.stringify(sample));
await writeFile(join(out, 'demo-card.svg'), scoreCardSvg({ score: sample.score, name: sample.business.name, city: sample.business.city }));
console.log(`Preview written to ${out}`);
