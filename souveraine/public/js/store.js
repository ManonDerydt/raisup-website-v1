// Stockage local d'abord.
// Chaque clé est une carte de champs : { champ: { v, t } }.
// La fusion se fait champ par champ, la dernière écriture gagne (horodatage t),
// ce qui permet d'éditer hors ligne sur deux appareils sans perdre de données.

const PREFIX = 'souveraine';

export function createStore({ storage = globalThis.localStorage, now = () => Date.now() } = {}) {
  let ns = 'local';
  let docs = {};          // clé -> { champ: { v, t } }
  let dirty = {};         // clé -> révision locale non encore confirmée par le serveur
  let meta = {};          // données techniques (dernière synchro…)
  let lastT = 0;
  let saveTimer = null;
  const listeners = new Set();
  const dirtyListeners = new Set();
  const savedListeners = new Set();

  function clock() {
    lastT = Math.max(now(), lastT + 1);
    return lastT;
  }

  function storageKey() {
    return `${PREFIX}:${ns}:data`;
  }

  function load(namespace) {
    ns = namespace || 'local';
    docs = {}; dirty = {}; meta = {};
    try {
      const raw = storage && storage.getItem(storageKey());
      if (raw) {
        const parsed = JSON.parse(raw);
        docs = parsed.docs || {};
        dirty = parsed.dirty || {};
        meta = parsed.meta || {};
      }
    } catch (e) {
      console.warn('Lecture du stockage local impossible', e);
    }
    for (const d of Object.values(docs)) {
      for (const f of Object.values(d)) if (f.t > lastT) lastT = f.t;
    }
    emit(Object.keys(docs), 'load');
  }

  function persistNow() {
    clearTimeout(saveTimer);
    saveTimer = null;
    try {
      storage && storage.setItem(storageKey(), JSON.stringify({ docs, dirty, meta }));
      for (const fn of savedListeners) fn();
    } catch (e) {
      console.error('Écriture du stockage local impossible', e);
    }
  }

  function persist() {
    if (saveTimer) return;
    saveTimer = setTimeout(persistNow, 150);
  }

  function emit(keys, origin) {
    for (const fn of listeners) fn(keys, origin);
  }

  function markDirty(key) {
    dirty[key] = (dirty[key] || 0) + 1;
    for (const fn of dirtyListeners) fn(key);
  }

  // Lecture
  function get(key, field, fallback) {
    const f = docs[key] && docs[key][field];
    return f && f.v !== null && f.v !== undefined ? f.v : fallback;
  }

  function has(key, field) {
    const f = docs[key] && docs[key][field];
    return !!f;
  }

  function map(key) {
    const out = {};
    const d = docs[key];
    if (!d) return out;
    for (const [k, f] of Object.entries(d)) if (f.v !== null && f.v !== undefined) out[k] = f.v;
    return out;
  }

  function keys(prefix = '') {
    return Object.keys(docs).filter((k) => k.startsWith(prefix));
  }

  // Écriture locale
  function set(key, field, value) {
    setMany(key, { [field]: value });
  }

  function setMany(key, values) {
    const t = clock();
    const d = docs[key] || (docs[key] = {});
    for (const [field, value] of Object.entries(values)) {
      d[field] = { v: value === undefined ? null : value, t };
    }
    markDirty(key);
    persist();
    emit([key], 'local');
  }

  function remove(key, field) {
    set(key, field, null);
  }

  // Fusion d'une version distante
  function winner(a, b) {
    if (!a) return b;
    if (!b) return a;
    if (a.t !== b.t) return a.t > b.t ? a : b;
    return JSON.stringify(a.v) >= JSON.stringify(b.v) ? a : b;
  }

  function applyRemote(key, remoteFields) {
    if (!remoteFields || typeof remoteFields !== 'object') return false;
    const local = docs[key] || {};
    const merged = { ...local };
    let changedLocal = false;
    let localAhead = false;
    for (const [field, rf] of Object.entries(remoteFields)) {
      if (!rf || typeof rf.t !== 'number') continue;
      if (rf.t > lastT) lastT = rf.t;
      const w = winner(local[field], rf);
      if (w === rf && (!local[field] || local[field].t !== rf.t || JSON.stringify(local[field].v) !== JSON.stringify(rf.v))) {
        merged[field] = { v: rf.v, t: rf.t };
        changedLocal = true;
      }
    }
    for (const [field, lf] of Object.entries(local)) {
      const rf = remoteFields[field];
      if (!rf || (winner(lf, rf) === lf && (rf.t !== lf.t || JSON.stringify(rf.v) !== JSON.stringify(lf.v)))) localAhead = true;
    }
    if (changedLocal) docs[key] = merged;
    if (localAhead && !dirty[key]) markDirty(key);
    if (changedLocal) {
      persist();
      emit([key], 'remote');
    }
    return changedLocal;
  }

  function raw(key) {
    return docs[key] ? JSON.parse(JSON.stringify(docs[key])) : {};
  }

  function dirtyKeys() {
    return Object.keys(dirty);
  }

  function revision(key) {
    return dirty[key] || 0;
  }

  function markClean(key, rev) {
    if (dirty[key] === rev) {
      delete dirty[key];
      persist();
    }
  }

  function getMeta(k, fallback) {
    return k in meta ? meta[k] : fallback;
  }

  function setMeta(k, v) {
    meta[k] = v;
    persist();
  }

  // Export / import
  function exportAll() {
    return { format: 'souveraine', version: 1, exporte: new Date(now()).toISOString(), donnees: JSON.parse(JSON.stringify(docs)) };
  }

  function importAll(payload) {
    if (!payload || payload.format !== 'souveraine' || typeof payload.donnees !== 'object') {
      throw new Error('Fichier non reconnu');
    }
    const t = clock();
    const changed = [];
    for (const [key, fields] of Object.entries(payload.donnees)) {
      if (!fields || typeof fields !== 'object') continue;
      const d = docs[key] || (docs[key] = {});
      for (const [field, f] of Object.entries(fields)) {
        if (!f || !('v' in f)) continue;
        d[field] = { v: f.v, t };
      }
      markDirty(key);
      changed.push(key);
    }
    persistNow();
    emit(changed, 'import');
    return changed.length;
  }

  function clear() {
    try { storage && storage.removeItem(storageKey()); } catch (e) { /* rien */ }
    docs = {}; dirty = {}; meta = {};
    emit([], 'clear');
  }

  return {
    load, get, has, map, keys, set, setMany, remove, applyRemote, raw,
    dirtyKeys, revision, markClean, getMeta, setMeta, exportAll, importAll,
    clear, flush: persistNow,
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    onDirty(fn) { dirtyListeners.add(fn); return () => dirtyListeners.delete(fn); },
    onSaved(fn) { savedListeners.add(fn); return () => savedListeners.delete(fn); },
    get namespace() { return ns; }
  };
}

export function deviceId(storage = globalThis.localStorage) {
  const k = `${PREFIX}:appareil`;
  let id = null;
  try { id = storage.getItem(k); } catch (e) { /* rien */ }
  if (!id) {
    id = Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
    try { storage.setItem(k, id); } catch (e) { /* rien */ }
  }
  return id;
}
