// Décide si le rappel quotidien doit partir maintenant.
// rappel = { on, heure: 'HH:MM', tz: 'Europe/Paris' } ; dernier = date locale du dernier envoi.
// Renvoie la date locale du jour (AAAA-MM-JJ) si l'envoi est dû, sinon null.

function localParts(date, tz) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t).value;
  return { day: `${get('year')}-${get('month')}-${get('day')}`, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

function isDue(now, rappel, dernier, fenetreMinutes = 120) {
  if (!rappel || !rappel.on || !/^\d{2}:\d{2}$/.test(rappel.heure || '')) return null;
  let p;
  try { p = localParts(now, rappel.tz || 'Europe/Paris'); } catch (e) { p = localParts(now, 'Europe/Paris'); }
  if (dernier === p.day) return null;
  const [H, M] = rappel.heure.split(':').map(Number);
  const retard = p.minutes - (H * 60 + M);
  if (retard < 0 || retard > fenetreMinutes) return null;
  return p.day;
}

module.exports = { isDue, localParts };
