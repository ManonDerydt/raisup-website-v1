// Fonction planifiée : envoie chaque jour la notification « Ta routine de 45 minutes. »
// à l'heure choisie dans l'application (Réglages > Rappel quotidien).
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { defineSecret, defineString } = require('firebase-functions/params');
const { logger } = require('firebase-functions');
const admin = require('firebase-admin');
const webpush = require('web-push');
const { isDue } = require('./rappel');

admin.initializeApp();

const VAPID_PUBLIC_KEY = defineString('VAPID_PUBLIC_KEY');
const VAPID_CONTACT = defineString('VAPID_CONTACT', { default: 'mailto:admin@example.com' });
const VAPID_PRIVATE_KEY = defineSecret('VAPID_PRIVATE_KEY');
const TEXTE = 'Ta routine de 45 minutes.';

exports.rappelQuotidien = onSchedule(
  { schedule: 'every 5 minutes', region: 'europe-west1', timeZone: 'Europe/Paris', secrets: [VAPID_PRIVATE_KEY], retryCount: 0 },
  async () => {
    webpush.setVapidDetails(VAPID_CONTACT.value(), VAPID_PUBLIC_KEY.value(), VAPID_PRIVATE_KEY.value());
    const db = admin.firestore();
    const subs = await db.collectionGroup('push').get();
    const parUtilisatrice = new Map();
    subs.forEach((d) => {
      if (!d.get('actif') || !d.get('abonnement')) return;
      const uid = d.ref.parent.parent.id;
      if (!parUtilisatrice.has(uid)) parUtilisatrice.set(uid, []);
      parUtilisatrice.get(uid).push(d);
    });

    for (const [uid, abonnements] of parUtilisatrice) {
      const cfg = await db.doc(`users/${uid}/kv/cfg`).get();
      const rappel = cfg.exists ? cfg.get('f.rappel.v') : null;
      const etatRef = db.doc(`users/${uid}/meta/rappel`);
      const etat = await etatRef.get();
      const jour = isDue(new Date(), rappel, etat.exists ? etat.get('dernier') : null);
      if (!jour) continue;
      await etatRef.set({ dernier: jour }, { merge: true });
      await Promise.all(abonnements.map(async (d) => {
        try {
          await webpush.sendNotification(d.get('abonnement'), JSON.stringify({ title: 'Souveraine', body: TEXTE, tag: 'rappel-routine', url: './#aujourdhui' }), { TTL: 3600, urgency: 'normal' });
        } catch (e) {
          if (e.statusCode === 404 || e.statusCode === 410) await d.ref.set({ actif: false }, { merge: true });
          else logger.warn('Envoi impossible', { statusCode: e.statusCode });
        }
      }));
    }
  }
);
