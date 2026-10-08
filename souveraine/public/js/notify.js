// Rappel quotidien : notification « Ta routine de 45 minutes. » à l'heure choisie.
// Application fermée : notification push envoyée par la fonction planifiée (functions/).
// Application ouverte : la page affiche elle-même la notification.
import { today } from './dates.js';

export function supported() {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

export function settings(ctx) {
  const P = ctx.content.parametres.rappel;
  return ctx.store.get('cfg', 'rappel', null) || { on: false, heure: P.heureDefaut };
}

function urlB64ToUint8Array(base64) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export async function enable(ctx, heure) {
  if (!supported()) throw new Error('Les notifications ne sont pas prises en charge ici. Sur iPhone, installe d\'abord l\'application sur l\'écran d\'accueil.');
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') throw new Error('Notifications refusées. Autorise-les dans les réglages du téléphone.');
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  ctx.store.set('cfg', 'rappel', { on: true, heure, tz });
  if (ctx.cloud && ctx.config.vapidPublicKey && 'PushManager' in window) {
    try {
      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlB64ToUint8Array(ctx.config.vapidPublicKey) });
      await ctx.cloud.savePushSubscription(ctx.uid, ctx.device, sub);
      return 'push';
    } catch (e) {
      console.warn('Abonnement push impossible', e);
      return 'local';
    }
  }
  return 'local';
}

export async function disable(ctx) {
  const cur = settings(ctx);
  ctx.store.set('cfg', 'rappel', { ...cur, on: false });
  if (ctx.cloud && 'PushManager' in window) {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();
      await ctx.cloud.savePushSubscription(ctx.uid, ctx.device, null);
    } catch (e) { /* rien */ }
  }
}

export function startLoop(ctx) {
  const check = async () => {
    const r = ctx.store.get('cfg', 'rappel', null);
    if (!r || !r.on || !supported() || Notification.permission !== 'granted') return;
    const now = new Date();
    const [H, M] = r.heure.split(':').map(Number);
    const late = now.getHours() * 60 + now.getMinutes() - (H * 60 + M);
    if (late < 0 || late > 120) return;
    const d = today(now);
    if (ctx.store.getMeta('rappelVu') === d) return;
    ctx.store.setMeta('rappelVu', d);
    const texte = ctx.content.parametres.rappel.texte;
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) await reg.showNotification('Souveraine', { body: texte, tag: 'rappel-routine', icon: 'icons/icon-192.png', badge: 'icons/badge-72.png' });
      else new Notification('Souveraine', { body: texte, tag: 'rappel-routine' });
    } catch (e) { /* rien */ }
  };
  check();
  return setInterval(check, 30000);
}

// Solution de secours : un rappel quotidien dans le calendrier du téléphone.
export function icsFile(heure, texte, day = today()) {
  const [H, M] = heure.split(':');
  const date = day.replace(/-/g, '');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Souveraine//Rappel//FR', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT', `UID:rappel-routine-${date}@souveraine`, `DTSTAMP:${stamp}`,
    `DTSTART:${date}T${H}${M}00`, 'DURATION:PT45M', 'RRULE:FREQ=DAILY', `SUMMARY:${texte}`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${texte}`, 'TRIGGER:PT0M', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR', ''
  ].join('\r\n');
}
