// Captures d'écran de validation, en largeur iPhone (390 px), en clair et en sombre.
// Utilise les données d'exemple de public/js/exemple.js, injectées en mode local.
// Prérequis : npm run serve (http://localhost:8080). Usage : npm run captures
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadChromium } from './pw.mjs';
import { exampleData } from '../public/js/exemple.js';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'captures');
mkdirSync(out, { recursive: true });
const BASE = process.env.SOUVERAINE_URL || 'http://localhost:8080/';


const chromium = await loadChromium();
const browser = await chromium.launch({ args: ['--lang=fr-FR', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });

async function newPage(scheme) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    locale: 'fr-FR', timezoneId: 'Europe/Paris', colorScheme: scheme, permissions: ['microphone']
  });
  const data = JSON.stringify(exampleData());
  await context.addInitScript((d) => {
    if (!localStorage.getItem('souveraine:demo')) {
      localStorage.setItem('souveraine:mode-local', '1');
      localStorage.setItem('souveraine:appareil', 'demo01');
      localStorage.setItem('souveraine:local:data', d);
      localStorage.setItem('souveraine:demo', '1');
    }
    // Tirages reproductibles
    let s = 42;
    Math.random = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  }, data);
  const page = await context.newPage();
  page.on('pageerror', (e) => console.error('Erreur de page :', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.error('Console :', m.text()); });
  await page.goto(BASE);
  await page.waitForSelector('.tabbar');
  await page.evaluate(() => document.fonts.ready);
  return { page, context };
}

async function fullShot(page, name) {
  await page.evaluate(() => window.scrollTo(0, 0));
  const h = await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
  await page.setViewportSize({ width: 390, height: Math.max(844, h) });
  await page.waitForTimeout(350);
  await page.screenshot({ path: join(out, name) });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(150);
  console.log('  ', name);
}

async function viewportShot(page, name, selector) {
  // Fait défiler jusqu'à la carte qui contient l'élément, juste sous l'en-tête.
  if (selector) await page.evaluate((sel) => { const el = document.querySelector(sel).closest('.card') || document.querySelector(sel); const y = el.getBoundingClientRect().top + window.scrollY - 64; window.scrollTo(0, Math.max(0, y)); }, selector);
  await page.waitForTimeout(250);
  await page.screenshot({ path: join(out, name) });
  console.log('  ', name);
}

const TABS = ['aujourdhui', 'vocabulaire', 'calcul', 'discours', 'pilotage'];
for (const scheme of ['light', 'dark']) {
  const { page, context } = await newPage(scheme);
  const suffix = scheme === 'light' ? 'clair' : 'sombre';
  for (const t of TABS) {
    await page.click(`.tab[data-tab="${t}"]`);
    await page.waitForTimeout(400);
    await fullShot(page, `${t}-${suffix}.png`);
  }
  await context.close();
}

// États particuliers (clair)
{
  const { page, context } = await newPage('light');
  // Fiche retournée
  await page.click('.tab[data-tab="vocabulaire"]');
  await page.getByRole('button', { name: 'Voir la définition' }).click();
  await page.waitForTimeout(200);
  await viewportShot(page, 'fiche-retournee.png', '.flash');

  // Question de calcul corrigée
  await page.click('.tab[data-tab="calcul"]');
  await page.waitForTimeout(2600);
  await page.fill('.q-input', '2,4m');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(250);
  await viewportShot(page, 'calcul-corrige.png', '.q-head');

  // Chronomètre en cours
  await page.click('.tab[data-tab="discours"]');
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Démarrer' }).click();
  await page.waitForTimeout(4300);
  await viewportShot(page, 'chrono-en-cours.png', '.timer');
  await page.getByRole('button', { name: 'Arrêter' }).click();
  await context.close();
}

await browser.close();
console.log(`Captures enregistrées dans ${out}`);
