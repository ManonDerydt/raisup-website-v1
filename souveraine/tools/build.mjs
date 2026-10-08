// Génère public/precache-manifest.js : liste des fichiers à garder hors ligne et numéro de version.
// À lancer après chaque modification, avant le déploiement (npm run build).
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const pub = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const skip = new Set(['sw.js', 'precache-manifest.js', 'vendor/VERSIONS.txt']);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(pub)
  .map((p) => relative(pub, p).split('\\').join('/'))
  .filter((f) => !skip.has(f) && !f.startsWith('.') && !f.endsWith('.map'))
  .sort();
const hash = createHash('sha256');
for (const f of files) hash.update(f).update(readFileSync(join(pub, f)));
const version = hash.digest('hex').slice(0, 12);
writeFileSync(join(pub, 'precache-manifest.js'), `// Fichier généré par tools/build.mjs : ne pas modifier.\nself.PRECACHE = ${JSON.stringify({ version, files: ['./', ...files] }, null, 1)};\n`);
console.log(`Version ${version}, ${files.length} fichiers.`);
