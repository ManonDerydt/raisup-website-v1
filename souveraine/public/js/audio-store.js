// Enregistrements audio : conservés sur l'appareil uniquement (IndexedDB), jamais synchronisés.

const DB = 'souveraine-audio';
const STORE = 'enregistrements';

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx(mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const out = fn(t.objectStore(STORE));
    t.oncomplete = () => resolve(out && 'result' in out ? out.result : undefined);
    t.onerror = () => reject(t.error);
  });
}

export const saveRecording = (rec) => tx('readwrite', (s) => s.put(rec));
export const deleteRecording = (id) => tx('readwrite', (s) => s.delete(id));
export async function listRecordings(ns) {
  const all = await tx('readonly', (s) => s.getAll());
  return (all || []).filter((r) => r.ns === ns).sort((a, b) => b.date - a.date);
}

export function pickMime() {
  if (typeof MediaRecorder === 'undefined') return null;
  for (const m of ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus']) {
    if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) return m;
  }
  return '';
}

export function canRecord() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && typeof MediaRecorder !== 'undefined');
}

// Démarre l'enregistrement ; renvoie une fonction d'arrêt qui fournit le fichier.
export async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
  const mime = pickMime();
  const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
  const chunks = [];
  rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
  rec.start(1000);
  return () => new Promise((resolve) => {
    rec.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      resolve(new Blob(chunks, { type: rec.mimeType || mime || 'audio/webm' }));
    };
    if (rec.state !== 'inactive') rec.stop(); else rec.onstop();
  });
}
