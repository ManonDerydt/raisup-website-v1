import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAnswer, isCorrect, generate, CATEGORIES } from '../public/js/calc.js';

test('lecture des réponses', () => {
  assert.equal(parseAnswer('360k'), 360000);
  assert.equal(parseAnswer('2,4m'), 2400000);
  assert.equal(parseAnswer('2.4M€'), 2400000);
  assert.equal(parseAnswer('1 200 €'), 1200);
  assert.equal(parseAnswer('1 200,50 €'), 1200.5);
  assert.equal(parseAnswer('12,5 %'), 12.5);
  assert.equal(parseAnswer('12.5%'), 12.5);
  assert.equal(parseAnswer('18 mois'), 18);
  assert.equal(parseAnswer('2 880 000'), 2880000);
  assert.equal(parseAnswer('1.200.000'), 1200000);
  assert.equal(parseAnswer('1.234,5'), 1234.5);
  assert.equal(parseAnswer('1,5 md'), 1.5e9);
  assert.equal(parseAnswer('3 millions'), 3e6);
  assert.ok(Number.isNaN(parseAnswer('')));
  assert.ok(Number.isNaN(parseAnswer('abc')));
});

test('tolérance de 2 % et 0,5 point', () => {
  assert.ok(isCorrect(98, 100));
  assert.ok(!isCorrect(97.9, 100));
  assert.ok(isCorrect(20.5, 20, true));
  assert.ok(!isCorrect(20.6, 20, true));
  assert.ok(isCorrect(48.9, 48, true));
  assert.ok(isCorrect(2.83e6, 2.88e6));
  assert.ok(!isCorrect(NaN, 10));
});

test('les questions sont cohérentes avec leur formule', () => {
  let seed = 1;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (const c of CATEGORIES) {
    for (let i = 0; i < 300; i++) {
      const q = generate(c.id, rnd);
      assert.ok(isFinite(q.answer) && q.answer > 0, `${c.id} ${q.prompt}`);
      assert.ok(q.method.length > 10);
      assert.ok(!/[—–]/.test(q.prompt + q.method), 'pas de tiret long');
      if (c.id !== 'tout') assert.equal(q.cat, c.id);
      assert.equal(q.pct, q.unit === '%');
    }
  }
});

test('formules de la spécification', () => {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 200; i++) {
    const q = generate('levees', rnd);
    const nums = [...q.prompt.matchAll(/([\d,]+) (M€|k€)/g)].map((m) => parseFloat(m[1].replace(',', '.')) * (m[2] === 'M€' ? 1e6 : 1e3));
    if (q.prompt.startsWith('Levée')) {
      const [lev, pre] = nums;
      assert.ok(Math.abs(q.answer - (lev / (pre + lev)) * 100) < 0.01);
    } else {
      const avant = parseFloat(q.prompt.match(/détiens ([\d,]+)/)[1].replace(',', '.'));
      const [lev, pre] = nums;
      assert.ok(Math.abs(q.answer - (avant * pre) / (pre + lev)) < 0.01);
    }
  }
});
