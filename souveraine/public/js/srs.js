// Répétition espacée.
// Niveau de 0 à 5. « Je le maîtrise » : niveau + 1, révision à 1, 3, 7, 21 puis 60 jours.
// « À revoir » : niveau 0, la fiche revient dans la même session après d'autres fiches.
import { addDays } from './dates.js';

export const DEFAULT_INTERVALS = [1, 3, 7, 21, 60];
export const MASTERED_LEVEL = 3;
export const REQUEUE_GAP = 3;

export function master(p, day, intervals = DEFAULT_INTERVALS) {
  const l = Math.min(5, ((p && p.l) || 0) + 1);
  return { l, due: addDays(day, intervals[l - 1]), last: day, first: (p && p.first) || day };
}

export function again(p, day) {
  return { l: 0, due: day, last: day, first: (p && p.first) || day };
}

export function newToday(progress, day) {
  return Object.values(progress).filter((p) => p && p.first === day).length;
}

// Ordre : d'abord les mots déjà vus et dus, puis les nouveaux (10 par jour au maximum).
export function buildQueue(cards, progress, day, { perDay = 10, category = null } = {}) {
  const pool = category ? cards.filter((c) => c.categorie === category) : cards;
  const due = pool
    .filter((c) => progress[c.id] && progress[c.id].due <= day)
    .sort((a, b) => {
      const pa = progress[a.id], pb = progress[b.id];
      return pa.due < pb.due ? -1 : pa.due > pb.due ? 1 : (pa.l || 0) - (pb.l || 0);
    });
  const allowance = Math.max(0, perDay - newToday(progress, day));
  const fresh = pool.filter((c) => !progress[c.id]).slice(0, allowance);
  return [...due.map((c) => c.id), ...fresh.map((c) => c.id)];
}

// Replace une fiche « À revoir » plus loin dans la file.
export function requeue(queue, id, gap = REQUEUE_GAP) {
  const rest = queue.filter((x) => x !== id);
  const pos = Math.min(rest.length, gap);
  rest.splice(pos, 0, id);
  return rest;
}

export function stats(cards, progress, day, perDay = 10) {
  const ids = new Set(cards.map((c) => c.id));
  let mastered = 0, reviewedToday = 0;
  for (const [id, p] of Object.entries(progress)) {
    if (!ids.has(id) || !p) continue;
    if ((p.l || 0) >= MASTERED_LEVEL) mastered++;
    if (p.last === day) reviewedToday++;
  }
  const dueToday = buildQueue(cards, progress, day, { perDay }).length;
  return { mastered, dueToday, total: cards.length, reviewedToday };
}
