// Extraction du contenu de souveraine.html vers public/data/*.json.
//
// Usage :
//   node tools/extract-souveraine.mjs chemin/vers/souveraine.html            rapport seul
//   node tools/extract-souveraine.mjs chemin/vers/souveraine.html --ecrire   écrit les fichiers reconnus
//   node tools/extract-souveraine.mjs chemin/vers/souveraine.html --inventaire inventaire.json
//
// Méthode : la page est ouverte dans Chromium, chaque variable déclarée dans ses scripts
// (const, let, var) est lue, puis reconnue par sa forme (nombre d'éléments, champs).
// Le texte est repris tel quel, sans modification. Tout ce qui n'est pas reconnu avec
// certitude est signalé dans le rapport et le fichier correspondant reste inchangé.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadChromium } from './pw.mjs';

const [, , input, ...flags] = process.argv;
if (!input) {
  console.error('Indique le chemin de souveraine.html');
  process.exit(1);
}
const write = flags.includes('--ecrire');
const invIdx = flags.indexOf('--inventaire');
const dataDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'data');

// 1. Noms déclarés dans les scripts de la page
const html = readFileSync(input, 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join('\n');
const names = [...new Set([...scripts.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/g)].map((m) => m[1]))];

// 2. Lecture des valeurs dans la page
const chromium = await loadChromium();
const browser = await chromium.launch();
const page = await browser.newPage();
page.on('dialog', (d) => d.dismiss());
await page.goto(pathToFileURL(resolve(input)).href);
await page.waitForTimeout(800);
const values = await page.evaluate((list) => {
  const out = {};
  for (const n of list) {
    try {
      // eslint-disable-next-line no-eval
      const v = (0, eval)(`typeof ${n} === 'undefined' ? undefined : ${n}`);
      if (v && typeof v === 'object') out[n] = JSON.parse(JSON.stringify(v));
      else if (typeof v === 'string' && v.length > 20) out[n] = v;
    } catch (e) { /* variable inaccessible */ }
  }
  return out;
}, names);
const domText = await page.evaluate(() => document.body.innerText);
await browser.close();

if (invIdx >= 0) {
  writeFileSync(flags[invIdx + 1] || 'inventaire.json', JSON.stringify({ variables: values, texte: domText }, null, 1));
  console.log(`Inventaire écrit : ${Object.keys(values).length} variables.`);
}

// 3. Reconnaissance par la forme
const isObjArr = (v) => Array.isArray(v) && v.length && v.every((x) => x && typeof x === 'object' && !Array.isArray(x));
const isStrArr = (v) => Array.isArray(v) && v.length && v.every((x) => typeof x === 'string');
const pickKey = (obj, candidates) => Object.keys(obj).find((k) => candidates.includes(k.toLowerCase()));
const all = Object.entries(values);
const found = {};
const report = [];

function claim(file, name, data, note) {
  found[file] = data;
  report.push(`OK  ${file}.json  <- ${name}${note ? ` (${note})` : ''}`);
}

// Vocabulaire : 119 objets avec terme et définition
for (const [name, v] of all) {
  if (!isObjArr(v) || v.length < 100) continue;
  const s = v[0];
  const kt = pickKey(s, ['terme', 'term', 'mot', 'word', 't', 'w']);
  const kd = pickKey(s, ['definition', 'déf', 'def', 'd', 'sens']);
  const ke = pickKey(s, ['exemple', 'example', 'ex', 'e']);
  const kc = pickKey(s, ['categorie', 'catégorie', 'category', 'cat', 'c']);
  if (!kt || !kd) continue;
  const cats = [...new Set(v.map((x) => x[kc]))];
  const slug = (c) => String(c).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  claim('vocabulaire', name, {
    provisoire: false, source: 'souveraine.html',
    items: v.map((x, i) => ({ id: `v${String(i + 1).padStart(3, '0')}`, categorie: slug(x[kc]), terme: x[kt], definition: x[kd], exemple: ke ? x[ke] || '' : '' }))
  }, `${v.length} fiches, ${cats.length} catégories`);
  if (kc) {
    claim('categories', `${name} (catégories)`, {
      provisoire: false, source: 'souveraine.html',
      items: cats.map((c) => ({ id: slug(c), label: c, langue: /english|anglais/i.test(c) ? 'en' : 'fr' }))
    }, 'ordre de première apparition');
  }
  break;
}

// Programme : 12 semaines avec un thème et des tâches
for (const [name, v] of all) {
  if (!isObjArr(v) || v.length !== 12) continue;
  const s = v[0];
  const kth = pickKey(s, ['theme', 'thème', 'titre', 'title', 't']);
  const kts = Object.keys(s).find((k) => isStrArr(s[k]));
  if (!kth || !kts) continue;
  claim('programme', name, { provisoire: false, source: 'souveraine.html', items: v.map((x, i) => ({ semaine: i + 1, theme: x[kth], taches: x[kts] })) });
  break;
}

// Conférences : 3 objets avec un plan
for (const [name, v] of all) {
  if (!isObjArr(v) || v.length !== 3) continue;
  const s = v[0];
  const kplan = Object.keys(s).find((k) => Array.isArray(s[k]) && s[k].length >= 3);
  const kti = pickKey(s, ['titre', 'title', 't', 'nom']);
  const kpu = pickKey(s, ['public', 'audience', 'cible']);
  const kth = pickKey(s, ['these', 'thèse', 'thesis', 'idee', 'idée']);
  if (!kplan || !kti) continue;
  claim('conferences', name, {
    provisoire: false, source: 'souveraine.html',
    items: v.map((x, i) => ({
      id: `c${i + 1}`, titre: x[kti], public: kpu ? x[kpu] : '', these: kth ? x[kth] : '',
      plan: x[kplan].map((p) => (typeof p === 'string' ? { debut: '', fin: '', partie: p } : { debut: p.debut ?? p.start ?? p.de ?? '', fin: p.fin ?? p.end ?? p.a ?? '', partie: p.partie ?? p.titre ?? p.label ?? p.t ?? JSON.stringify(p) }))
    }))
  }, 'vérifier le format du minutage');
  break;
}

// Piliers : 6 objets contenant des objectifs (23 au total)
for (const [name, v] of all) {
  if (!isObjArr(v) || v.length !== 6) continue;
  const s = v[0];
  const kobj = Object.keys(s).find((k) => Array.isArray(s[k]));
  const kti = pickKey(s, ['titre', 'title', 'nom', 'name', 't', 'pilier']);
  if (!kobj || !kti) continue;
  const total = v.reduce((n, p) => n + p[kobj].length, 0);
  let n = 0;
  claim('piliers', name, {
    provisoire: false, source: 'souveraine.html',
    items: v.map((p, i) => ({ id: `p${i + 1}`, titre: p[kti], objectifs: p[kobj].map((o) => ({ id: `o${String(++n).padStart(2, '0')}`, label: typeof o === 'string' ? o : o.label || o.titre || o.t })) }))
  }, `${total} objectifs`);
  break;
}

// Listes simples, reconnues par leur longueur (à confirmer dans le rapport)
const HINTS = {
  routine: /routine/i, 'mise-en-place': /etape|étape|step|mise|setup|place/i, sujets: /sujet|topic|theme/i,
  fondations: /fond|base|principe/i, portrait: /portrait|deviens|become/i, 'sources-revenus': /source|revenu|income/i, habitudes: /habit|discipline/i
};
const simple = [
  ['routine', 5, (x, i) => (typeof x === 'string' ? { id: `r${i + 1}`, label: x } : { id: `r${i + 1}`, label: x.label || x.t || x.titre, minutes: x.minutes || x.min || x.duree })],
  ['mise-en-place', 10, (x) => (typeof x === 'string' ? x : x.label || x.t || x.titre)],
  ['sujets', 12, (x) => (typeof x === 'string' ? x : x.label || x.t || x.sujet)],
  ['fondations', 5, (x) => (typeof x === 'string' ? { titre: x, texte: '' } : { titre: x.titre || x.t || x.title, texte: x.texte || x.d || x.text || '' })],
  ['portrait', 7, (x) => (typeof x === 'string' ? x : x.label || x.t)],
  ['sources-revenus', 9, (x, i) => (typeof x === 'string' ? { id: `s${i + 1}`, label: x } : { id: x.id || `s${i + 1}`, label: x.label || x.t || x.nom })],
  ['habitudes', 5, (x, i) => (typeof x === 'string' ? { id: `h${i + 1}`, label: x } : { id: `h${i + 1}`, label: x.label || x.t || x.nom })]
];
const used = new Set(report.map((r) => r.split('<- ')[1].split(' ')[0]));
for (const [file, len, map] of simple) {
  let cands = all.filter(([n, v]) => !used.has(n) && Array.isArray(v) && v.length === len);
  if (cands.length > 1) {
    const named = cands.filter(([n]) => HINTS[file].test(n));
    if (named.length === 1) cands = named;
  }
  if (cands.length === 1) {
    const [name, v] = cands[0];
    used.add(name);
    const items = v.map(map);
    claim(file, name, file === 'portrait'
      ? { provisoire: false, source: 'souveraine.html', titre: 'Celle que je deviens', items }
      : file === 'routine'
        ? { provisoire: false, source: 'souveraine.html', titre: 'Ma routine de 45 minutes', items }
        : { provisoire: false, source: 'souveraine.html', items }, 'reconnu par sa longueur, à vérifier');
  } else {
    report.push(`??  ${file}.json  ${cands.length ? `plusieurs candidats : ${cands.map(([n]) => n).join(', ')}` : 'non trouvé dans les scripts'}`);
  }
}

for (const f of ['vocabulaire', 'categories', 'programme', 'conferences', 'piliers']) {
  if (!found[f]) report.push(`??  ${f}.json  non trouvé`);
}

console.log(`Variables lues : ${Object.keys(values).length}`);
console.log(report.join('\n'));
if (write) {
  for (const [file, data] of Object.entries(found)) {
    writeFileSync(join(dataDir, `${file}.json`), `${JSON.stringify(data, null, 1)}\n`);
  }
  console.log(`\n${Object.keys(found).length} fichiers écrits dans public/data. Relire chaque fichier, puis npm run build.`);
} else {
  console.log('\nRapport seul. Ajouter --ecrire pour écrire les fichiers reconnus.');
}
