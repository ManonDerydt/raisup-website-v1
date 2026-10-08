// Lectures partagées entre les onglets.
import { lastDays } from './dates.js';

export const dayKey = (day) => `d:${day}`;

export function sumFields(m, prefix) {
  let s = 0;
  for (const [k, v] of Object.entries(m)) if (k.startsWith(prefix) && typeof v === 'number') s += v;
  return s;
}

// Compteurs par appareil, additionnés : aucune perte si deux appareils travaillent hors ligne.
export function calcDay(store, day) {
  const m = store.map(dayKey(day));
  return { n: sumFields(m, 'cn:'), ok: sumFields(m, 'ck:'), ms: sumFields(m, 'cms:') };
}

export function calcRange(store, days) {
  const out = { n: 0, ok: 0, ms: 0 };
  for (const d of days) {
    const c = calcDay(store, d);
    out.n += c.n; out.ok += c.ok; out.ms += c.ms;
  }
  return out;
}

export function logCalc(store, device, day, correct, ms) {
  const key = dayKey(day);
  store.setMany(key, {
    [`cn:${device}`]: store.get(key, `cn:${device}`, 0) + 1,
    [`ck:${device}`]: store.get(key, `ck:${device}`, 0) + (correct ? 1 : 0),
    [`cms:${device}`]: store.get(key, `cms:${device}`, 0) + Math.round(ms)
  });
}

export function parolesDay(store, day) {
  return sumFields(store.map(dayKey(day)), 'pa:');
}

export function logParole(store, device, day) {
  const key = dayKey(day);
  store.set(key, `pa:${device}`, store.get(key, `pa:${device}`, 0) + 1);
}

export function vocabProgress(store) {
  return store.map('vocab');
}

export function allCards(content, store) {
  const base = content.vocabulaire.items;
  const mine = Object.entries(store.map('mots'))
    .filter(([, w]) => w && w.terme)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([id, w]) => ({ id, categorie: content.parametres.categorieMesMots.id, terme: w.terme, definition: w.definition || '', exemple: w.exemple || '', perso: true }));
  return [...base, ...mine];
}

export function categories(content) {
  return [...content.categories.items, content.parametres.categorieMesMots];
}

export function reviewedToday(store, day) {
  return Object.values(vocabProgress(store)).filter((p) => p && p.last === day).length;
}

// Date de première ouverture : chaque appareil note la sienne, la plus ancienne compte.
export function startDate(store) {
  const dates = Object.keys(store.map('cfg')).filter((k) => k.startsWith('debut-')).map((k) => k.slice(6)).sort();
  return dates[0] || null;
}

export function ensureStart(store, day) {
  if (!startDate(store)) store.set('cfg', `debut-${day}`, true);
}

// Habitudes : celles par défaut, sauf supprimées, puis les miennes.
export function habits(content, store) {
  const m = store.map('habits');
  const out = [];
  for (const d of content.habitudes.items) {
    if (store.has('habits', d.id) && !m[d.id]) continue;
    out.push({ id: d.id, label: m[d.id] || d.label });
  }
  for (const [id, label] of Object.entries(m).sort(([a], [b]) => (a < b ? -1 : 1))) {
    if (content.habitudes.items.some((d) => d.id === id)) continue;
    if (label) out.push({ id, label });
  }
  return out;
}

export function habitWeek(store, id, day) {
  return lastDays(7, day).map((d) => ({ day: d, on: !!store.get(dayKey(d), `h:${id}`) }));
}

export function lastFacts(store, day, n = 5) {
  return store.keys('d:')
    .map((k) => k.slice(2))
    .filter((d) => d < day)
    .sort()
    .reverse()
    .map((d) => ({ day: d, text: store.get(dayKey(d), 'fait', '') }))
    .filter((f) => f.text && f.text.trim())
    .slice(0, n);
}

export function revenueMonth(content, store, month) {
  const m = store.map('rev');
  let total = 0;
  const bySource = {};
  for (const s of content.sources.items) {
    const v = Number(m[`${month}:${s.id}`]) || 0;
    bySource[s.id] = v;
    total += v;
  }
  return { total, bySource };
}

export function revenueTarget(content, month) {
  const rules = content.parametres.objectifRevenus;
  for (const r of rules) {
    if (r.avant && month < r.avant) return r.montant;
    if (r.aPartirDe && month >= r.aPartirDe) return r.montant;
  }
  return rules[rules.length - 1].montant;
}
