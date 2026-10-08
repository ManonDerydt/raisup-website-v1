// Prépare les dépendances embarquées : SDK Firebase (un seul module ES) et polices.
// À relancer après une mise à jour des versions dans package.json.
import { build } from 'esbuild';
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');

const entry = `
export { initializeApp } from 'firebase/app';
export {
  getAuth, initializeAuth, indexedDBLocalPersistence, browserLocalPersistence,
  onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, connectAuthEmulator
} from 'firebase/auth';
export {
  initializeFirestore, memoryLocalCache, collection, doc, setDoc, query, where,
  onSnapshot, serverTimestamp, Timestamp, enableNetwork, disableNetwork, connectFirestoreEmulator
} from 'firebase/firestore';
`;

await build({
  stdin: { contents: entry, resolveDir: root, loader: 'js' },
  bundle: true,
  format: 'esm',
  minify: true,
  target: ['es2020', 'safari15'],
  outfile: join(pub, 'vendor', 'firebase.js'),
  legalComments: 'eof',
  logLevel: 'info'
});

const fonts = [
  ['source-serif-4', ['400', '600']],
  ['ibm-plex-sans', ['400', '500', '600']],
  ['ibm-plex-mono', ['400', '500']]
];
mkdirSync(join(pub, 'fonts'), { recursive: true });
for (const [family, weights] of fonts) {
  for (const w of weights) {
    for (const subset of ['latin', 'latin-ext']) {
      const name = `${family}-${subset}-${w}-normal.woff2`;
      copyFileSync(join(root, 'node_modules', '@fontsource', family, 'files', name), join(pub, 'fonts', name));
    }
  }
}
writeFileSync(join(pub, 'vendor', 'VERSIONS.txt'), 'firebase 10.14.1, @fontsource 5.1.1 (licences OFL pour les polices, Apache 2.0 pour Firebase)\n');
console.log('Polices copiées.');
