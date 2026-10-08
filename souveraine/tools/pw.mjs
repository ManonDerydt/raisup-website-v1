// Charge Playwright : dépendance locale si présente, sinon installation globale.
import { createRequire } from 'node:module';

export async function loadChromium() {
  try {
    return (await import('playwright')).chromium;
  } catch (e) {
    const require = createRequire(import.meta.url);
    for (const p of ['/opt/node22/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright']) {
      try { return require(p).chromium; } catch (e2) { /* suivant */ }
    }
    throw new Error('Playwright introuvable : npm i -D playwright');
  }
}
