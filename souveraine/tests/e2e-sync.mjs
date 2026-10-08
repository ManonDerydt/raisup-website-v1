// Test de bout en bout de la connexion et de la synchronisation, avec les émulateurs Firebase.
// 1. npx firebase emulators:start --only auth,firestore --project demo-souveraine
// 2. node tests/e2e-sync.mjs
// Le test sert sa propre copie de public/ avec une config.js pointant vers les émulateurs.
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadChromium } from '../tools/pw.mjs';
const AUTH = 'http://127.0.0.1:9099';
const EMAIL = `test-${Date.now()}@exemple.fr`;
const PASSWORD = 'motdepasse-de-test';
const CONFIG = `window.SOUVERAINE_CONFIG = {
  firebase: { apiKey: 'demo-key', authDomain: 'demo-souveraine.firebaseapp.com', projectId: 'demo-souveraine', appId: 'demo' },
  emulateurs: { auth: '${AUTH}', firestoreHote: '127.0.0.1', firestorePort: 8085 },
  vapidPublicKey: null
};`;

const step = (t) => console.log(`- ${t}`);

const dir = mkdtempSync(join(tmpdir(), 'souveraine-e2e-'));
cpSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'public'), dir, { recursive: true });
writeFileSync(join(dir, 'config.js'), CONFIG);
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const server = createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '');
  try {
    const body = readFileSync(join(dir, path || 'index.html'));
    res.writeHead(200, { 'Content-Type': TYPES[extname(path || 'index.html')] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(body);
  } catch (e) { res.writeHead(404); res.end(); }
}).listen(8090);
const APP = 'http://localhost:8090/';

// Compte créé côté serveur, comme dans la console Firebase.
const res = await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD, returnSecureToken: true })
});
assert.ok(res.ok, 'création du compte');

const chromium = await loadChromium();
const browser = await chromium.launch();

async function device(name) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'fr-FR', timezoneId: 'Europe/Paris' });
  const page = await context.newPage();
  page.on('pageerror', (e) => console.error(`[${name}] ${e.message}`));
  return { context, page };
}

async function login(page) {
  await page.goto(APP);
  await page.waitForSelector('#login-email');
  await page.fill('#login-email', 'faux@exemple.fr');
  await page.fill('#login-pass', 'mauvais');
  await page.click('button[type=submit]');
  await page.waitForFunction(() => document.querySelector('.login-error').textContent.length > 0);
  assert.match(await page.textContent('.login-error'), /incorrect|impossible/i);
  await page.fill('#login-email', EMAIL);
  await page.fill('#login-pass', PASSWORD);
  await page.click('button[type=submit]');
  await page.waitForSelector('.tabbar');
}

const routineBox = (page, i) => page.locator('#vue-aujourdhui .card').nth(1).locator('input[type=checkbox]').nth(i);
const waitChecked = (page, i, timeout = 15000) => page.waitForFunction((n) => {
  const boxes = document.querySelectorAll('#vue-aujourdhui .card:nth-of-type(2) input[type=checkbox]');
  return boxes[n] && boxes[n].checked;
}, i, { timeout });

step('connexion obligatoire : mauvais mot de passe refusé, bon mot de passe accepté');
const A = await device('téléphone');
await login(A.page);
const B = await device('ordinateur');
await login(B.page);

step('une case cochée sur le téléphone apparaît sur l\'ordinateur');
await routineBox(A.page, 0).check({ force: true });
await waitChecked(B.page, 0);

step('modifications hors ligne sur le téléphone, en ligne sur l\'ordinateur');
await A.context.setOffline(true);
await A.page.waitForTimeout(500);
await routineBox(A.page, 1).check({ force: true });
await A.page.fill('#vue-aujourdhui textarea[aria-label="Le fait du jour"]', 'Écrit hors ligne sur le téléphone');
await A.page.locator('#vue-aujourdhui textarea[aria-label="Le fait du jour"]').blur();
await routineBox(B.page, 2).check({ force: true });
await B.page.fill('#vue-aujourdhui textarea[aria-label="Ma posture"]', 'Posture écrite sur l\'ordinateur');
await B.page.locator('#vue-aujourdhui textarea[aria-label="Ma posture"]').blur();
await A.page.waitForTimeout(1500);

step('rechargement du téléphone hors ligne : application et données disponibles');
await A.page.reload();
try {
  await A.page.waitForSelector('.tabbar', { timeout: 15000 });
} catch (e) {
  console.error('Contenu après rechargement :', (await A.page.evaluate(() => document.body.innerText)).slice(0, 300));
  console.error('Contrôlée par le service worker :', await A.page.evaluate(() => !!navigator.serviceWorker.controller));
  throw e;
}
assert.ok(await routineBox(A.page, 1).isChecked(), 'donnée hors ligne conservée après rechargement');
assert.equal(await A.page.inputValue('#vue-aujourdhui textarea[aria-label="Le fait du jour"]'), 'Écrit hors ligne sur le téléphone');

step('retour du réseau : les deux appareils convergent');
await A.context.setOffline(false);
await waitChecked(A.page, 2, 30000);
await waitChecked(B.page, 1, 30000);
await B.page.waitForFunction(() => document.querySelector('#vue-aujourdhui textarea[aria-label="Le fait du jour"]').value === 'Écrit hors ligne sur le téléphone', null, { timeout: 30000 });
await A.page.waitForFunction(() => document.querySelector('#vue-aujourdhui textarea[aria-label="Ma posture"]').value === 'Posture écrite sur l\'ordinateur', null, { timeout: 30000 });
for (const p of [A.page, B.page]) {
  for (const i of [0, 1, 2]) assert.ok(await routineBox(p, i).isChecked(), `case ${i}`);
}

step('les règles de sécurité refusent la lecture par un autre compte');
const other = await (await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: `autre-${Date.now()}@exemple.fr`, password: PASSWORD, returnSecureToken: true })
})).json();
const owner = await (await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD, returnSecureToken: true })
})).json();
const url = `http://127.0.0.1:8085/v1/projects/demo-souveraine/databases/(default)/documents/users/${owner.localId}/kv/cfg`;
const denied = await fetch(url, { headers: { Authorization: `Bearer ${other.idToken}` } });
assert.equal(denied.status, 403, 'lecture par un autre compte refusée');
const allowed = await fetch(url, { headers: { Authorization: `Bearer ${owner.idToken}` } });
assert.equal(allowed.status, 200, 'lecture par la propriétaire autorisée');
const anon = await fetch(url);
assert.equal(anon.status, 403, 'lecture sans connexion refusée');

step('déconnexion : retour à l\'écran de connexion');
await B.page.click('button[aria-label="Réglages"]');
await B.page.getByRole('button', { name: 'Se déconnecter' }).click();
await B.page.locator('dialog').last().getByRole('button', { name: 'Se déconnecter' }).click();
await B.page.waitForSelector('#login-email');

await browser.close();
server.close();
rmSync(dir, { recursive: true, force: true });
console.log('Synchronisation : tout est conforme.');
