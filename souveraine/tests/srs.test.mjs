import test from 'node:test';
import assert from 'node:assert/strict';
import { master, again, buildQueue, requeue, stats } from '../public/js/srs.js';

const cards = Array.from({ length: 30 }, (_, i) => ({ id: 'v' + i, categorie: i < 15 ? 'a' : 'b' }));

test('intervalles 1, 3, 7, 21, 60 jours', () => {
  let p = null;
  const expected = ['2026-10-09', '2026-10-11', '2026-10-15', '2026-10-29', '2026-12-07'];
  for (let i = 0; i < 5; i++) {
    p = master(p, '2026-10-08');
    assert.equal(p.l, i + 1);
    assert.equal(p.due, expected[i]);
  }
  p = master(p, '2026-10-08');
  assert.equal(p.l, 5);
  assert.equal(again(p, '2026-10-08').l, 0);
  assert.equal(again(p, '2026-10-08').due, '2026-10-08');
});

test('file : mots dus puis 10 nouveaux maximum', () => {
  const day = '2026-10-08';
  const progress = {
    v3: { l: 1, due: '2026-10-07', first: '2026-10-01', last: '2026-10-06' },
    v5: { l: 2, due: '2026-10-08', first: '2026-10-01', last: '2026-10-05' },
    v7: { l: 3, due: '2026-10-20', first: '2026-10-01', last: '2026-10-07' }
  };
  const q = buildQueue(cards, progress, day);
  assert.deepEqual(q.slice(0, 2), ['v3', 'v5']);
  assert.equal(q.length, 12);
  assert.ok(!q.includes('v7'));
  progress.v0 = { l: 1, due: '2026-10-09', first: day, last: day };
  progress.v1 = { l: 0, due: day, first: day, last: day };
  const q2 = buildQueue(cards, progress, day);
  assert.equal(q2.filter((id) => !progress[id]).length, 8);
  assert.ok(q2.includes('v1'));
  assert.deepEqual(buildQueue(cards, progress, day, { category: 'b' }).every((id) => Number(id.slice(1)) >= 15), true);
});

test('« À revoir » revient après d\'autres fiches', () => {
  assert.deepEqual(requeue(['a', 'b', 'c', 'd', 'e'], 'a'), ['b', 'c', 'd', 'a', 'e']);
  assert.deepEqual(requeue(['a', 'b'], 'a'), ['b', 'a']);
  assert.deepEqual(requeue(['a'], 'a'), ['a']);
});

test('statistiques', () => {
  const s = stats(cards, { v1: { l: 3, due: '2026-10-20', first: '2026-10-01', last: '2026-10-08' } }, '2026-10-08');
  assert.equal(s.mastered, 1);
  assert.equal(s.total, 30);
  assert.equal(s.reviewedToday, 1);
});
