const test = require('node:test');
const assert = require('node:assert/strict');
const { isDue } = require('./rappel');

const rappel = { on: true, heure: '07:30', tz: 'Europe/Paris' };

test('envoi à l\'heure choisie, heure de Paris', () => {
  // 8 octobre 2026, 05:31 UTC = 07:31 à Paris (heure d'été)
  assert.equal(isDue(new Date('2026-10-08T05:31:00Z'), rappel, null), '2026-10-08');
  assert.equal(isDue(new Date('2026-10-08T05:29:00Z'), rappel, null), null);
});

test('une seule fois par jour', () => {
  assert.equal(isDue(new Date('2026-10-08T05:40:00Z'), rappel, '2026-10-08'), null);
  assert.equal(isDue(new Date('2026-10-09T05:40:00Z'), rappel, '2026-10-08'), '2026-10-09');
});

test('pas d\'envoi tardif au-delà de deux heures', () => {
  assert.equal(isDue(new Date('2026-10-08T08:00:00Z'), rappel, null), null);
});

test('heure d\'hiver', () => {
  // 15 décembre 2026, 06:30 UTC = 07:30 à Paris
  assert.equal(isDue(new Date('2026-12-15T06:30:00Z'), rappel, null), '2026-12-15');
});

test('désactivé ou incomplet', () => {
  assert.equal(isDue(new Date(), { ...rappel, on: false }, null), null);
  assert.equal(isDue(new Date(), null, null), null);
  assert.equal(isDue(new Date(), { on: true, heure: '7h' }, null), null);
});
