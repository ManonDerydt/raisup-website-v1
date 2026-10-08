// Parcours principaux de l'application, en mode local.
// Prérequis : npm run serve. Usage : node tests/e2e-app.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadChromium } from '../tools/pw.mjs';

const APP = process.env.SOUVERAINE_URL || 'http://localhost:8080/';
const step = (t) => console.log(`- ${t}`);
const chromium = await loadChromium();
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'fr-FR', timezoneId: 'Europe/Paris', acceptDownloads: true, permissions: ['notifications'] });
await context.addInitScript(() => localStorage.setItem('souveraine:mode-local', '1'));
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.clock.install();
await page.goto(APP);
await page.waitForSelector('.tabbar');
const data = async () => { await page.clock.runFor(300); return page.evaluate(() => JSON.parse(localStorage.getItem('souveraine:local:data')).docs); };
const tab = (id) => page.click(`.tab[data-tab="${id}"]`);

step('routine : cocher met à jour le compteur et l\'indicateur « Enregistré »');
await page.locator('#vue-aujourdhui .card').nth(1).locator('label.check').first().click();
assert.equal(await page.locator('#vue-aujourdhui .card').nth(1).locator('.counter').textContent(), '1/5');
await page.clock.runFor(400);
assert.equal(await page.textContent('.save-state'), 'Enregistré');

step('programme : semaine 1 en cours, navigation entre semaines');
assert.match(await page.textContent('.week-label'), /Semaine 1 sur 12/);
await page.click('button[aria-label="Semaine suivante"]');
assert.match(await page.textContent('.week-label'), /Semaine 2 sur 12/);

step('discipline : ajout puis suppression par appui long');
await page.fill('input[aria-label="Nouvelle habitude"]', 'Méditation 10 minutes');
await page.click('#vue-aujourdhui .add-row button');
const habit = page.locator('.habit', { hasText: 'Méditation 10 minutes' });
await habit.waitFor();
const box = await habit.boundingBox();
await page.mouse.move(box.x + 60, box.y + box.height / 2);
await page.mouse.down();
await page.clock.runFor(700);
await page.mouse.up();
await page.locator('dialog').getByRole('button', { name: 'Supprimer' }).click();
await page.waitForFunction(() => ![...document.querySelectorAll('.habit')].some((h) => h.textContent.includes('Méditation')));

step('vocabulaire : retourner, « À revoir » puis « Je le maîtrise »');
await tab('vocabulaire');
const first = await page.textContent('.flash-term');
await page.getByRole('button', { name: 'Voir la définition' }).click();
await page.getByRole('button', { name: 'À revoir' }).click();
assert.notEqual(await page.textContent('.flash-term'), first, 'la fiche à revoir passe après d\'autres');
let d = await data();
const againId = Object.keys(d.vocab)[0];
assert.equal(d.vocab[againId].v.l, 0);
await page.getByRole('button', { name: 'Voir la définition' }).click();
await page.getByRole('button', { name: 'Je le maîtrise' }).click();
d = await data();
const mastered = Object.values(d.vocab).find((x) => x.v.l === 1);
assert.ok(mastered, 'niveau 1 après « Je le maîtrise »');
const tomorrow = await page.evaluate(() => { const t = new Date(); t.setDate(t.getDate() + 1); return t.toLocaleDateString('sv-SE'); });
assert.equal(mastered.v.due, tomorrow, 'prochaine révision dans 1 jour');

step('vocabulaire : ajout d\'un mot personnel');
await page.getByRole('button', { name: 'Ajouter un mot' }).click();
await page.locator('dialog input').first().fill('Ratchet');
await page.locator('dialog textarea').first().fill('Clause anti-dilution totale.');
await page.locator('dialog').getByRole('button', { name: 'Enregistrer' }).click();
await page.locator('.word-term', { hasText: 'Ratchet' }).waitFor();

step('calcul : saisie, correction, méthode, question suivante');
await tab('calcul');
const prompt = await page.textContent('.q-prompt');
await page.clock.runFor(3200);
assert.match(await page.textContent('.chrono'), /00:03/);
await page.fill('.q-input', '42');
await page.keyboard.press('Enter');
await page.locator('.verdict').waitFor();
assert.match(await page.textContent('.verdict'), /Bonne réponse/);
assert.match(await page.textContent('.method'), /Méthode/);
await page.keyboard.press('Enter');
await page.waitForFunction((p) => document.querySelector('.q-prompt').textContent !== p || !document.querySelector('.verdict'), prompt);
assert.equal(await page.locator('.verdict').count(), 0);
assert.match(await page.locator('#vue-calcul .stat').first().textContent(), /\/1/);

step('discours : une séance arrêtée ne compte pas, une séance complète compte');
await tab('discours');
await page.locator('.rec-toggle').click();
await page.getByRole('button', { name: '1 min', exact: true }).click();
await page.getByRole('button', { name: 'Démarrer' }).click();
await page.clock.runFor(5000);
await page.getByRole('button', { name: 'Arrêter' }).click();
assert.match(await page.textContent('#entrainement .card-aside'), /0 séance/);
await page.getByRole('button', { name: 'Démarrer' }).click();
await page.clock.runFor(61000);
await page.waitForFunction(() => /1 séance/.test(document.querySelector('#entrainement .card-aside').textContent));

step('discours : anecdote ajoutée');
await page.getByRole('button', { name: 'Ajouter une anecdote' }).click();
await page.locator('dialog textarea').fill('La signature à minuit.');
await page.locator('dialog').getByRole('button', { name: 'Enregistrer' }).click();
await page.locator('.anec-text', { hasText: 'La signature à minuit.' }).waitFor();

step('pilotage : objectif À venir, En cours, Fait');
await tab('pilotage');
const obj = page.locator('.obj').first();
await obj.click();
assert.match(await obj.textContent(), /En cours/);
await obj.click();
assert.match(await obj.textContent(), /Fait/);
assert.match(await page.locator('.pillar .counter').first().textContent(), /^1\//);

step('pilotage : revenus, objectif et autonomie');
await page.fill('#rv-conferences', '3000');
await page.locator('#rv-conferences').blur();
await page.clock.runFor(800);
assert.match(await page.textContent('.gap-line'), /Il manque 2\s000\s€/);
const capital = page.locator('#vue-pilotage .card').last().locator('input').first();
await capital.fill('40000');
await capital.blur();
await page.clock.runFor(800);
assert.match(await page.textContent('.autonomy'), /20 mois d'autonomie/);

step('réglages : export puis import JSON');
await page.click('button[aria-label="Réglages"]');
const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Exporter (JSON)' }).click()]);
const exported = JSON.parse(readFileSync(await download.path(), 'utf8'));
assert.equal(exported.format, 'souveraine');
assert.ok(exported.donnees.vocab && exported.donnees.rev);
await page.setInputFiles('#import-file', { name: 'sauvegarde.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(exported)) });
await page.locator('dialog').last().getByRole('button', { name: 'Importer' }).click();
await page.waitForFunction(() => /importés/.test(document.body.textContent));

step('réglages : rappel quotidien activé');
await page.fill('#rappel-heure', '07:30');
await page.getByRole('button', { name: 'Activer' }).click();
await page.waitForFunction(() => /Rappel actif chaque jour à 07:30/.test(document.body.textContent));

assert.deepEqual(errors, [], 'aucune erreur JavaScript');
await browser.close();
console.log('Parcours : tout est conforme.');
