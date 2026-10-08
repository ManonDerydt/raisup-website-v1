// Onglet 2 : Vocabulaire
import { h, mono, section, button, chips, stat, icon, promptBox, confirmBox, uid, empty } from '../ui.js';
import { buildQueue, master, again, requeue, stats } from '../srs.js';
import { allCards, categories, vocabProgress } from '../model.js';

const state = { filter: 'tout', queue: null, builtFor: null, flipped: false };

function speak(text, lang) {
  if (!('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === 'en' ? 'en-GB' : 'fr-FR';
  const voices = synth.getVoices();
  const prefix = lang === 'en' ? 'en' : 'fr';
  const voice = voices.find((v) => v.lang && v.lang.replace('_', '-').toLowerCase() === u.lang.toLowerCase())
    || voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(prefix));
  if (voice) u.voice = voice;
  u.rate = 0.92;
  synth.speak(u);
}

export function render(ctx) {
  const { store, content, day } = ctx;
  const P = content.parametres;
  const cards = allCards(content, store);
  const byId = Object.fromEntries(cards.map((c) => [c.id, c]));
  const cats = categories(content);
  const catById = Object.fromEntries(cats.map((c) => [c.id, c]));
  const progress = vocabProgress(store);
  const perDay = P.nouveauxMotsParJour;
  const intervals = P.intervallesRevision;

  const signature = `${day}|${state.filter}`;
  if (!state.queue || state.builtFor !== signature) {
    state.queue = buildQueue(cards, progress, day, { perDay, category: state.filter === 'tout' ? null : state.filter });
    state.builtFor = signature;
    state.flipped = false;
  } else {
    // Une fiche traitée sur un autre appareil quitte la file.
    state.queue = state.queue.filter((id) => byId[id] && (!progress[id] || progress[id].due <= day));
  }

  const st = stats(cards, progress, day, perDay);
  const statsRow = h('div', { class: 'stats' },
    stat('Mots maîtrisés', String(st.mastered)),
    stat('À revoir aujourd\'hui', String(st.dueToday)),
    stat('Total', String(st.total))
  );

  const filters = chips([{ id: 'tout', label: 'Toutes' }, ...cats.map((c) => ({ id: c.id, label: c.label }))], state.filter, (id) => {
    state.filter = id;
    ctx.refresh();
  }, 'Filtrer par catégorie');

  let cardBox;
  const id = state.queue[0];
  if (!id) {
    cardBox = h('section', { class: 'card done-box', 'aria-live': 'polite' },
      h('h3', null, 'Session terminée'),
      h('p', { class: 'muted' }, mono(st.reviewedToday ? `${st.reviewedToday} mot${st.reviewedToday > 1 ? 's' : ''} revu${st.reviewedToday > 1 ? 's' : ''} aujourd'hui. Rien d'autre n'est dû.` : 'Rien n\'est dû pour le moment.'))
    );
  } else {
    const c = byId[id];
    const p = progress[id];
    const level = (p && p.l) || 0;
    const cat = catById[c.categorie] || { label: c.categorie, langue: 'fr' };
    const isNew = !p;
    const listen = 'speechSynthesis' in window
      ? button('', () => speak(c.terme, cat.langue), { class: 'btn-icon btn-ghost', icon: 'sound', aria: `Écouter la prononciation de ${c.terme}` })
      : null;

    const answer = (ok) => {
      const next = ok ? master(p, day, intervals) : again(p, day);
      store.set('vocab', id, next);
      state.queue = ok ? state.queue.slice(1) : requeue(state.queue, id);
      state.flipped = false;
      ctx.refresh({ focus: '.flash-focus' });
    };

    const back = state.flipped
      ? h('div', { class: 'flash-back' },
          h('p', { class: 'flash-def' }, c.definition),
          c.exemple ? h('p', { class: 'flash-ex' }, c.exemple) : null,
          h('div', { class: 'btn-row flash-actions' },
            button('À revoir', () => answer(false), { class: 'btn-again' }),
            button('Je le maîtrise', () => answer(true), { class: 'btn-primary flash-focus' })
          )
        )
      : h('div', { class: 'flash-actions' },
          button('Voir la définition', () => { state.flipped = true; ctx.refresh({ focus: '.flash-focus' }); }, { class: 'btn-primary btn-wide flash-focus' })
        );

    cardBox = h('section', { class: 'card flash', 'aria-live': 'polite' },
      h('div', { class: 'flash-meta' },
        h('span', { class: 'label' }, cat.label),
        h('span', { class: 'levels', role: 'img', 'aria-label': `Niveau ${level} sur 5` },
          h('span', { class: 'small muted num' }, `${level}/5`),
          [1, 2, 3, 4, 5].map((n) => h('i', { class: n <= level ? 'on' : '' }))
        )
      ),
      h('div', { class: 'flash-row' },
        h('h2', { class: 'flash-term', lang: cat.langue === 'en' ? 'en' : null }, c.terme),
        listen
      ),
      back,
      h('p', { class: 'hint', style: { textAlign: 'center', marginTop: '12px' } }, mono(`${isNew ? 'Nouveau mot. ' : ''}${state.queue.length} fiche${state.queue.length > 1 ? 's' : ''} dans la session`))
    );
  }

  // Mes mots
  const mine = cards.filter((c) => c.perso);
  const editWord = async (w) => {
    const res = await promptBox(w ? 'Modifier le mot' : 'Ajouter un mot', [
      { name: 'terme', label: 'Terme', value: w ? w.terme : '', required: true },
      { name: 'definition', label: 'Définition', value: w ? w.definition : '', multiline: true },
      { name: 'exemple', label: 'Exemple', value: w ? w.exemple : '', multiline: true, rows: 2 }
    ]);
    if (!res || !res.terme) return;
    store.set('mots', w ? w.id : uid('m'), { terme: res.terme, definition: res.definition, exemple: res.exemple });
    if (!w) state.builtFor = null;
    ctx.refresh();
  };
  const myWords = section(P.categorieMesMots.label, { aside: h('span', { class: 'counter' }, String(mine.length)) },
    mine.length
      ? h('div', null, mine.map((w) => h('div', { class: 'word' },
          h('div', null, h('div', { class: 'word-term' }, w.terme), w.definition ? h('div', { class: 'word-def' }, w.definition) : null),
          h('div', { class: 'word-actions' },
            button('', () => editWord(w), { class: 'btn-icon btn-ghost', icon: 'edit', aria: `Modifier ${w.terme}` }),
            button('', async () => {
              if (await confirmBox(`Supprimer « ${w.terme} » ?`, { ok: 'Supprimer', danger: true })) {
                store.set('mots', w.id, null);
                ctx.refresh();
              }
            }, { class: 'btn-icon btn-ghost', icon: 'trash', aria: `Supprimer ${w.terme}` })
          )
        )))
      : empty('Ajoute ici tes propres mots : ils entrent dans la répétition espacée.'),
    h('div', { class: 'card-foot' }, button('Ajouter un mot', () => editWord(null), { icon: 'plus' }))
  );

  return h('div', null,
    h('header', { class: 'page-head' }, h('h1', { class: 'page-title' }, 'Vocabulaire')),
    statsRow, filters, cardBox, myWords
  );
}
