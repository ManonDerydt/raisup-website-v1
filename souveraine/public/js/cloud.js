// Connexion et synchronisation avec Firebase (Authentication + Firestore).
// Le SDK n'est chargé que si config.js contient une configuration.
// Données : users/{uid}/kv/{clé} = { f: { champ: { v, t } }, st: horodatage serveur }

let fb = null;
let app = null;
let auth = null;
let db = null;

export function isConfigured(config) {
  return !!(config && config.firebase && config.firebase.apiKey && config.firebase.projectId);
}

export async function initCloud(config) {
  fb = await import('../vendor/firebase.js');
  app = fb.initializeApp(config.firebase);
  auth = fb.initializeAuth(app, { persistence: [fb.indexedDBLocalPersistence, fb.browserLocalPersistence] });
  db = fb.initializeFirestore(app, { localCache: fb.memoryLocalCache() });
  // Émulateurs locaux, pour les tests uniquement.
  if (config.emulateurs) {
    fb.connectAuthEmulator(auth, config.emulateurs.auth, { disableWarnings: true });
    fb.connectFirestoreEmulator(db, config.emulateurs.firestoreHote, config.emulateurs.firestorePort);
  }
  return { auth };
}

export function watchAuth(cb) {
  return fb.onAuthStateChanged(auth, cb);
}

export async function signIn(email, password) {
  return fb.signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function resetPassword(email) {
  return fb.sendPasswordResetEmail(auth, email.trim());
}

export async function logOut() {
  return fb.signOut(auth);
}

export function authMessage(err) {
  const code = (err && err.code) || '';
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) return 'Adresse ou mot de passe incorrect.';
  if (code.includes('too-many-requests')) return 'Trop de tentatives. Réessaie dans quelques minutes.';
  if (code.includes('network-request-failed')) return 'Pas de connexion réseau. La première connexion doit se faire en ligne.';
  if (code.includes('invalid-email')) return 'Adresse électronique invalide.';
  if (code.includes('missing-password')) return 'Saisis ton mot de passe.';
  return 'Connexion impossible. Réessaie.';
}

// Synchronisation : envoie les clés modifiées, écoute les changements distants.
export function startSync(store, uid, { onStatus = () => {} } = {}) {
  const col = fb.collection(db, 'users', uid, 'kv');
  let pushTimer = null;
  let pushing = false;
  let stopped = false;

  const report = () => {
    if (stopped) return;
    const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
    onStatus({ offline, pending: store.dirtyKeys().length });
  };

  async function pushAll() {
    if (pushing || stopped) return;
    pushing = true;
    try {
      const keys = store.dirtyKeys();
      await Promise.all(keys.map(async (key) => {
        const rev = store.revision(key);
        const data = { f: store.raw(key), st: fb.serverTimestamp() };
        try {
          await fb.setDoc(fb.doc(col, key), data, { merge: true });
          store.markClean(key, rev);
        } catch (e) {
          console.warn('Envoi différé', key, e && e.code);
        }
      }));
    } finally {
      pushing = false;
      report();
      if (store.dirtyKeys().length && navigator.onLine !== false) schedulePush(3000);
    }
  }

  function schedulePush(delay = 400) {
    clearTimeout(pushTimer);
    pushTimer = setTimeout(pushAll, delay);
  }

  const offDirty = store.onDirty(() => { report(); schedulePush(); });

  // Écoute des changements distants depuis la dernière synchronisation (marge d'une minute).
  const since = Math.max(0, store.getMeta('vu', 0) - 60000);
  const q = fb.query(col, fb.where('st', '>', fb.Timestamp.fromMillis(since)));
  const unsub = fb.onSnapshot(q, (snap) => {
    let maxSeen = store.getMeta('vu', 0);
    for (const ch of snap.docChanges()) {
      if (ch.type === 'removed') continue;
      const data = ch.doc.data({ serverTimestamps: 'none' });
      if (data.st && data.st.toMillis) maxSeen = Math.max(maxSeen, data.st.toMillis());
      store.applyRemote(ch.doc.id, data.f);
    }
    store.setMeta('vu', maxSeen);
    report();
  }, (err) => {
    console.warn('Écoute interrompue', err && err.code);
    onStatus({ error: true, pending: store.dirtyKeys().length });
  });

  const onOnline = () => { report(); schedulePush(100); };
  const onOffline = () => report();
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  schedulePush(200);
  report();

  return function stop() {
    stopped = true;
    clearTimeout(pushTimer);
    offDirty();
    unsub();
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

// Abonnement aux notifications de cet appareil, lu par la fonction planifiée.
export async function savePushSubscription(uid, device, subscription) {
  const ref = fb.doc(db, 'users', uid, 'push', device);
  if (!subscription) {
    await fb.setDoc(ref, { actif: false, maj: fb.serverTimestamp() }, { merge: true });
    return;
  }
  await fb.setDoc(ref, { actif: true, abonnement: JSON.parse(JSON.stringify(subscription)), maj: fb.serverTimestamp() }, { merge: true });
}
