// Onglet 4 : Discours
import { h, mono, section, check, counter, button, field, confirmBox, promptBox, uid, empty } from '../ui.js';
import { parolesDay, logParole } from '../model.js';
import { canRecord, startRecording, saveRecording, listRecordings, deleteRecording } from '../audio-store.js';

const state = {
  open: new Set(),
  minutes: 3,
  topic: null,
  running: false,
  endAt: 0,
  remaining: null,
  finished: false,
  record: true,
  stopRec: null,
  recError: '',
  wake: null
};
let ticker = null;
let els = {};
let ctxRef = null;
let audioUrls = [];

const fmtClock = (ms) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

function pickTopic(topics, avoid) {
  if (topics.length < 2) return 0;
  let i;
  do { i = Math.floor(Math.random() * topics.length); } while (i === avoid);
  return i;
}

async function keepAwake(on) {
  try {
    if (on && 'wakeLock' in navigator) state.wake = await navigator.wakeLock.request('screen');
    else if (!on && state.wake) { await state.wake.release(); state.wake = null; }
  } catch (e) { /* facultatif */ }
}

async function finishRecording(completed) {
  if (!state.stopRec) return;
  const stop = state.stopRec;
  state.stopRec = null;
  try {
    const blob = await stop();
    if (blob.size && ctxRef) {
      const topics = ctxRef.content.sujets.items;
      await saveRecording({
        id: uid('a'), ns: ctxRef.store.namespace, date: Date.now(), blob, mime: blob.type,
        sujet: topics[state.topic] || '', minutes: state.minutes, termine: completed,
        duree: Math.round((state.minutes * 60000 - Math.max(0, state.remaining || 0)) / 1000)
      });
    }
  } catch (e) {
    console.warn('Enregistrement non conservé', e);
  }
  ctxRef && ctxRef.refreshSoon();
}

function tick() {
  if (!state.running) return;
  state.remaining = state.endAt - Date.now();
  if (state.remaining <= 0) {
    complete();
    return;
  }
  if (els.clock && els.clock.isConnected) els.clock.textContent = fmtClock(state.remaining);
}

function complete() {
  clearInterval(ticker);
  ticker = null;
  state.running = false;
  state.finished = true;
  state.remaining = 0;
  keepAwake(false);
  if (navigator.vibrate) navigator.vibrate([300, 120, 300]);
  if (ctxRef) logParole(ctxRef.store, ctxRef.device, ctxRef.day);
  finishRecording(true);
  ctxRef && ctxRef.refreshSoon();
}

async function start() {
  state.finished = false;
  state.recError = '';
  if (state.record && canRecord()) {
    try {
      state.stopRec = await startRecording();
    } catch (e) {
      state.recError = 'Micro indisponible : la séance continue sans enregistrement.';
    }
  }
  state.running = true;
  state.endAt = Date.now() + state.minutes * 60000;
  state.remaining = state.minutes * 60000;
  keepAwake(true);
  clearInterval(ticker);
  ticker = setInterval(tick, 250);
  ctxRef.refresh({ focus: '.timer-toggle' });
}

function stopEarly() {
  clearInterval(ticker);
  ticker = null;
  state.running = false;
  state.remaining = Math.max(0, state.endAt - Date.now());
  keepAwake(false);
  finishRecording(false);
  ctxRef.refresh({ focus: '.timer-toggle' });
}

document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });

export function render(ctx) {
  ctxRef = ctx;
  const { store, content, day } = ctx;
  const champs = content.champs.items;
  const topics = content.sujets.items;
  if (state.topic === null) state.topic = pickTopic(topics, -1);

  // Fondations
  const fondations = section('Les fondations', {},
    h('div', null, content.fondations.items.map((f, i) => h('div', { class: 'foundation' },
      h('p', { class: 'foundation-title' }, mono(`${i + 1}. ${f.titre}`)),
      f.texte ? h('p', { class: 'foundation-text' }, f.texte) : null
    )))
  );

  // Conférences
  const conferences = section('Mes conférences', {},
    content.conferences.items.map((c) => {
      const d = h('details', { class: 'acc', open: state.open.has(c.id) },
        h('summary', null, h('span', { class: 'acc-title' }, c.titre)),
        h('div', { class: 'acc-body' },
          h('dl', { class: 'kv' },
            h('dt', null, 'Public'), h('dd', null, c.public),
            h('dt', null, 'Thèse'), h('dd', { class: 'these' }, c.these),
            h('dt', null, 'Plan minuté'),
            h('dd', null, h('ol', { class: 'plan' }, c.plan.map((p) => h('li', null,
              h('span', { class: 'num' }, `${p.debut} à ${p.fin} min`),
              h('span', null, p.partie)
            ))))
          ),
          champs.map((ch) => field({
            label: ch.label, multiline: true, rows: 2, placeholder: ch.indication || '',
            value: store.get('conf', `${c.id}:${ch.id}`, ''),
            onInput: (v) => { if (v !== store.get('conf', `${c.id}:${ch.id}`, '')) store.set('conf', `${c.id}:${ch.id}`, v); }
          }))
        )
      );
      d.addEventListener('toggle', () => { if (d.open) state.open.add(c.id); else state.open.delete(c.id); });
      return d;
    })
  );

  // Mise en place
  const steps = content.miseEnPlace.items;
  const sDone = () => steps.filter((_, i) => store.get('setup', `e${i}`)).length;
  const sCounter = counter(sDone(), steps.length);
  const setup = section('La mise en place', { aside: sCounter },
    h('div', { class: 'check-list' }, steps.map((s, i) => check(s, store.get('setup', `e${i}`), (v) => {
      store.set('setup', `e${i}`, v);
      sCounter.textContent = `${sDone()}/${steps.length}`;
    })))
  );

  // S'entraîner
  const doneToday = parolesDay(store, day);
  const remaining = state.running ? state.endAt - Date.now() : state.finished ? 0 : state.minutes * 60000;
  els.clock = h('div', { class: `timer-value ${state.running ? 'is-running' : state.finished ? 'is-done' : ''}`, role: 'timer', 'aria-live': 'off' }, fmtClock(remaining));
  const durations = h('div', { class: 'seg', role: 'group', 'aria-label': 'Durée de la séance' },
    content.parametres.dureesParole.map((m) => h('button', {
      type: 'button', 'aria-pressed': String(state.minutes === m), disabled: state.running || null,
      on: { click: () => { state.minutes = m; state.finished = false; state.remaining = null; ctx.refresh(); } }
    }, `${m} min`))
  );
  const recordBox = canRecord()
    ? check('Enregistrer la séance (micro)', state.record, (v) => { state.record = v; }, { class: 'rec-toggle' })
    : h('p', { class: 'hint' }, 'Enregistrement audio non disponible sur cet appareil.');
  const trainer = section('S\'entraîner', { id: 'entrainement', aside: h('span', { class: 'small muted' }, mono(`${doneToday} séance${doneToday > 1 ? 's' : ''} aujourd'hui`)) },
    h('div', { class: 'trainer-controls' },
      durations,
      h('p', { class: 'topic', 'aria-live': 'polite' }, topics[state.topic]),
      button('Autre sujet', () => { state.topic = pickTopic(topics, state.topic); ctx.refresh(); }, { class: 'btn-ghost', icon: 'shuffle', disabled: state.running }),
      h('div', { class: 'timer' }, els.clock),
      state.running && state.stopRec ? h('p', { class: 'rec-state' }, h('span', { class: 'rec-dot' }), 'Enregistrement en cours') : null,
      state.finished ? h('p', { class: 'small', style: { color: 'var(--ok)' } }, 'Séance terminée et comptée.') : null,
      state.recError ? h('p', { class: 'hint' }, state.recError) : null,
      state.running
        ? button('Arrêter', stopEarly, { class: 'btn-wide timer-toggle', icon: 'stop' })
        : button('Démarrer', start, { class: 'btn-primary btn-wide timer-toggle', icon: 'play' }),
      state.running ? h('p', { class: 'hint' }, 'Une séance compte seulement si le temps va au bout.') : recordBox
    )
  );

  // Enregistrements (sur cet appareil)
  audioUrls.forEach((u) => URL.revokeObjectURL(u));
  audioUrls = [];
  const recList = h('div', null, h('p', { class: 'empty' }, 'Chargement…'));
  const recordings = section('Mes enregistrements', { aside: h('span', { class: 'small muted' }, 'Sur cet appareil') }, recList);
  if (typeof indexedDB !== 'undefined') {
    listRecordings(store.namespace).then((list) => {
      if (!list.length) { recList.replaceChildren(empty('Les séances enregistrées apparaissent ici.')); return; }
      recList.replaceChildren(...list.map((r) => {
        const url = URL.createObjectURL(r.blob);
        audioUrls.push(url);
        const when = new Date(r.date);
        const label = `${when.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}, ${when.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
        return h('div', { class: 'recording' },
          h('div', { class: 'recording-head' },
            h('div', null,
              h('div', { class: 'small' }, mono(`${label} · ${r.minutes} min${r.termine ? '' : ', interrompue'}`)),
              h('div', { class: 'small muted' }, r.sujet)
            ),
            button('', async () => {
              if (await confirmBox('Supprimer cet enregistrement ?', { ok: 'Supprimer', danger: true })) {
                await deleteRecording(r.id);
                ctx.refresh();
              }
            }, { class: 'btn-icon btn-ghost', icon: 'trash', aria: 'Supprimer l\'enregistrement' })
          ),
          h('audio', { controls: true, preload: 'metadata', src: url })
        );
      }));
    }).catch(() => recList.replaceChildren(empty('Enregistrements indisponibles.')));
  }

  // Banque d'anecdotes
  const anecs = Object.entries(store.map('anec')).filter(([, a]) => a && a.texte).sort(([, a], [, b]) => (b.cree || 0) - (a.cree || 0));
  const editAnec = async (id, a) => {
    const res = await promptBox(a ? 'Modifier l\'anecdote' : 'Nouvelle anecdote', [
      { name: 'texte', label: 'Anecdote', value: a ? a.texte : '', multiline: true, rows: 5, required: true }
    ]);
    if (!res || !res.texte) return;
    store.set('anec', id || uid('n'), { texte: res.texte, cree: a ? a.cree : Date.now() });
    ctx.refresh();
  };
  const bank = section('Banque d\'anecdotes', { aside: h('span', { class: 'counter' }, String(anecs.length)) },
    anecs.length
      ? h('div', null, anecs.map(([id, a]) => h('div', { class: 'anec' },
          h('p', { class: 'anec-text' }, a.texte),
          h('div', { class: 'word-actions' },
            button('', () => editAnec(id, a), { class: 'btn-icon btn-ghost', icon: 'edit', aria: 'Modifier l\'anecdote' }),
            button('', async () => {
              if (await confirmBox('Supprimer cette anecdote ?', { ok: 'Supprimer', danger: true })) { store.set('anec', id, null); ctx.refresh(); }
            }, { class: 'btn-icon btn-ghost', icon: 'trash', aria: 'Supprimer l\'anecdote' })
          )
        )))
      : empty('Aucune anecdote pour l\'instant.'),
    h('div', { class: 'card-foot' }, button('Ajouter une anecdote', () => editAnec(null, null), { icon: 'plus' }))
  );

  return h('div', null,
    h('header', { class: 'page-head' }, h('h1', { class: 'page-title' }, 'Discours')),
    fondations, conferences, setup, trainer, recordings, bank
  );
}

export function isBusy() {
  return state.running;
}

