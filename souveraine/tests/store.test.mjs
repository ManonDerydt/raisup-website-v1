import test from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../public/js/store.js';

function memStorage() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}

test('fusion champ par champ, la dernière écriture gagne', () => {
  let t = 1000;
  const a = createStore({ storage: memStorage(), now: () => t });
  const b = createStore({ storage: memStorage(), now: () => t });
  a.load('u'); b.load('u');
  t = 2000; a.set('d:2026-10-08', 'r0', true);
  t = 2100; b.set('d:2026-10-08', 'r1', true);
  t = 2200; b.set('d:2026-10-08', 'fait', 'B');
  t = 2300; a.set('d:2026-10-08', 'fait', 'A');
  b.applyRemote('d:2026-10-08', a.raw('d:2026-10-08'));
  a.applyRemote('d:2026-10-08', b.raw('d:2026-10-08'));
  assert.deepEqual(a.map('d:2026-10-08'), { r0: true, r1: true, fait: 'A' });
  assert.deepEqual(b.map('d:2026-10-08'), a.map('d:2026-10-08'));
});

test('suivi des clés à envoyer', () => {
  const s = createStore({ storage: memStorage() });
  s.load('u');
  s.set('cfg', 'posture', 'x');
  assert.deepEqual(s.dirtyKeys(), ['cfg']);
  const rev = s.revision('cfg');
  s.set('cfg', 'posture', 'y');
  s.markClean('cfg', rev);
  assert.deepEqual(s.dirtyKeys(), ['cfg'], 'une modification plus récente reste à envoyer');
  s.markClean('cfg', s.revision('cfg'));
  assert.deepEqual(s.dirtyKeys(), []);
});

test('une version distante plus ancienne relance l\'envoi', () => {
  let t = 5000;
  const s = createStore({ storage: memStorage(), now: () => t });
  s.load('u');
  s.set('cfg', 'posture', 'récent');
  s.markClean('cfg', s.revision('cfg'));
  s.applyRemote('cfg', { posture: { v: 'ancien', t: 10 } });
  assert.equal(s.get('cfg', 'posture'), 'récent');
  assert.deepEqual(s.dirtyKeys(), ['cfg']);
});

test('export puis import', () => {
  const a = createStore({ storage: memStorage() });
  a.load('u');
  a.set('rev', '2026-10:conferences', 4000);
  a.set('anec', 'x1', null);
  const dump = JSON.parse(JSON.stringify(a.exportAll()));
  const b = createStore({ storage: memStorage() });
  b.load('v');
  assert.equal(b.importAll(dump), 2);
  assert.equal(b.get('rev', '2026-10:conferences'), 4000);
  assert.deepEqual(b.map('anec'), {});
  assert.throws(() => b.importAll({ format: 'autre' }));
});

test('persistance locale', async () => {
  const st = memStorage();
  const a = createStore({ storage: st });
  a.load('u');
  a.set('cfg', 'posture', 'P');
  a.flush();
  const b = createStore({ storage: st });
  b.load('u');
  assert.equal(b.get('cfg', 'posture'), 'P');
  assert.deepEqual(b.dirtyKeys(), ['cfg']);
});
