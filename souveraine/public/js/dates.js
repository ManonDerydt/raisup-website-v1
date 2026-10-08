// Dates locales au format AAAA-MM-JJ (jamais en UTC, pour suivre la journée réelle).

const pad = (n) => String(n).padStart(2, '0');

export function iso(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parse(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d || 1, 12);
}

export function today(now = new Date()) {
  return iso(now);
}

export function addDays(isoDate, n) {
  const d = parse(isoDate);
  d.setDate(d.getDate() + n);
  return iso(d);
}

export function diffDays(a, b) {
  return Math.round((parse(b) - parse(a)) / 86400000);
}

export function lastDays(n, end = today()) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) out.push(addDays(end, -i));
  return out;
}

export function monthKey(isoDate) {
  return isoDate.slice(0, 7);
}

export function addMonths(month, n) {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(y, m - 1 + n, 1, 12);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

export function addMonthsToDate(isoDate, n) {
  const d = parse(isoDate);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, last));
  return iso(d);
}

const longFmt = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const shortFmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' });
const mediumFmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
const monthFmt = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' });
const weekdayFmt = new Intl.DateTimeFormat('fr-FR', { weekday: 'narrow' });

export function fmtLong(isoDate) {
  return longFmt.format(parse(isoDate));
}

export function fmtShort(isoDate) {
  return shortFmt.format(parse(isoDate));
}

export function fmtMedium(isoDate) {
  return mediumFmt.format(parse(isoDate));
}

export function fmtMonth(month) {
  return monthFmt.format(parse(month + '-01'));
}

const MONTHS_SHORT = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
export function fmtMonthShort(month) {
  return MONTHS_SHORT[Number(month.slice(5, 7)) - 1];
}

export function fmtWeekday(isoDate) {
  return weekdayFmt.format(parse(isoDate)).toUpperCase();
}

// Semaine du programme : semaine 1 = 7 premiers jours, plafonnée à 12.
export function programWeek(start, current = today()) {
  const days = diffDays(start, current);
  return Math.min(12, Math.max(1, Math.floor(days / 7) + 1));
}
