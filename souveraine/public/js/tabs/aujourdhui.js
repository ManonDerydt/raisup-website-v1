// Onglet 1 : Aujourd'hui
import { h, mono, section, check, gauge, counter, button, icon, field, longPress, confirmBox, uid, num } from '../ui.js';
import { fmtLong, fmtShort, programWeek } from '../dates.js';
import { dayKey, calcDay, parolesDay, reviewedToday, startDate, habits, habitWeek, lastFacts } from '../model.js';

let viewedWeek = null;
let viewedFor = null;

export function render(ctx) {
  const { store, content, day } = ctx;
  const P = content.parametres;
  const dk = dayKey(day);

  // En-tête
  const head = h('header', { class: 'page-head' },
    h('p', { class: 'overline page-date' }, mono(fmtLong(day))),
    h('h1', { class: 'page-title' }, P.titreJour)
  );

  // Entraînement du jour
  const goals = P.objectifsEntrainement;
  const items = [
    { tab: 'vocabulaire', name: 'Mots revus aujourd\'hui', value: reviewedToday(store, day), max: goals.mots },
    { tab: 'calcul', name: 'Calculs justes aujourd\'hui', value: calcDay(store, day).ok, max: goals.calculs },
    { tab: 'discours', name: 'Prises de parole terminées', value: parolesDay(store, day), max: goals.paroles }
  ];
  const training = section('Entraînement du jour', {},
    h('div', { class: 'train' }, items.map((it) =>
      h('button', { type: 'button', class: 'train-item', on: { click: () => ctx.go(it.tab) }, 'aria-label': `${it.name} : ${it.value} sur ${it.max}. Ouvrir l'onglet` },
        h('span', { class: 'train-name' }, it.name),
        counter(Math.min(it.value, 999), it.max),
        gauge(it.value, it.max, it.name)
      )
    ))
  );

  // Routine
  const routine = content.routine.items;
  const rCount = () => routine.filter((r) => store.get(dk, `r:${r.id}`)).length;
  const rCounter = counter(rCount(), routine.length);
  const routineCard = section(content.routine.titre, { aside: rCounter },
    h('div', { class: 'check-list' }, routine.map((r) =>
      check(r.label, store.get(dk, `r:${r.id}`), (v) => {
        store.set(dk, `r:${r.id}`, v);
        rCounter.textContent = `${rCount()}/${routine.length}`;
      }, { after: r.minutes ? num(`${r.minutes} min`, 'muted small') : null })
    ))
  );

  // Programme
  const start = startDate(store) || day;
  const current = programWeek(start, day);
  if (viewedFor !== day || viewedWeek === null) { viewedWeek = current; viewedFor = day; }
  const weeks = content.programme.items;
  const progTotal = weeks.reduce((s, w) => s + w.taches.length, 0);
  const progDone = () => weeks.reduce((s, w) => s + w.taches.filter((_, i) => store.get('prog', `s${w.semaine}-${i}`)).length, 0);
  const pCounter = counter(progDone(), progTotal);
  const weekBox = h('div');
  const drawWeek = () => {
    const w = weeks.find((x) => x.semaine === viewedWeek) || weeks[0];
    weekBox.replaceChildren(
      h('div', { class: 'week-nav' },
        h('button', { type: 'button', class: 'btn btn-icon btn-ghost', 'aria-label': 'Semaine précédente', disabled: viewedWeek <= 1, on: { click: () => { viewedWeek--; drawWeek(); } } }, icon('left')),
        h('div', { class: 'week-label' },
          h('div', { class: 'label' }, mono(`Semaine ${w.semaine} sur ${weeks.length}`)),
          viewedWeek === current ? h('span', { class: 'tag tag-accent' }, 'En cours') : null
        ),
        h('button', { type: 'button', class: 'btn btn-icon btn-ghost', 'aria-label': 'Semaine suivante', disabled: viewedWeek >= weeks.length, on: { click: () => { viewedWeek++; drawWeek(); } } }, icon('right'))
      ),
      h('p', { class: 'week-theme' }, w.theme),
      h('div', { class: 'check-list' }, w.taches.map((t, i) =>
        check(t, store.get('prog', `s${w.semaine}-${i}`), (v) => {
          store.set('prog', `s${w.semaine}-${i}`, v);
          pCounter.textContent = `${progDone()}/${progTotal}`;
        })
      ))
    );
  };
  drawWeek();
  const programme = section('Mon programme', { aside: pCounter }, weekBox);

  // Posture
  const posture = section('Ma posture', {},
    field({ multiline: true, rows: 3, cls: 'posture', aria: 'Ma posture', value: store.get('cfg', 'posture', P.postureDefaut), onInput: (v) => { if (v !== store.get('cfg', 'posture', P.postureDefaut)) store.set('cfg', 'posture', v); } })
  );

  // Trois actions
  const actions = section('Trois actions', {},
    h('div', null, P.indicationsActions.map((ph, i) => {
      const row = h('div', { class: `action ${store.get(dk, `ad${i}`) ? 'is-done' : ''}` });
      const box = check(h('span', { class: 'sr-only' }, `Action ${i + 1} faite`), store.get(dk, `ad${i}`), (v) => { store.set(dk, `ad${i}`, v); row.classList.toggle('is-done', v); });
      const input = field({ multiline: true, autogrow: true, rows: 1, value: store.get(dk, `a${i}`, ''), placeholder: ph, cls: 'input-inline', aria: `Action ${i + 1}`, onInput: (v) => { if (v !== store.get(dk, `a${i}`, '')) store.set(dk, `a${i}`, v); } });
      row.append(box, input);
      return row;
    }))
  );

  // Discipline
  const list = habits(content, store);
  const habitRows = h('div', null, list.map((hb) => {
    const week = habitWeek(store, hb.id, day);
    const bars = h('div', { class: 'bars', 'aria-hidden': 'true' }, week.map((w) => h('span', { class: `bar ${w.on ? 'is-on' : ''} ${w.day === day ? 'is-today' : ''}`, title: fmtShort(w.day) })));
    const done7 = week.filter((w) => w.on).length;
    const row = h('div', { class: 'habit' },
      check(hb.label, store.get(dk, `h:${hb.id}`), (v) => {
        store.set(dk, `h:${hb.id}`, v);
        bars.lastChild.classList.toggle('is-on', v);
      }),
      h('div', { title: `${done7} jours sur 7` }, bars, h('span', { class: 'sr-only' }, `${done7} jours sur les 7 derniers`))
    );
    longPress(row, async () => {
      if (await confirmBox(`Supprimer l'habitude « ${hb.label} » ?`, { ok: 'Supprimer', danger: true })) {
        store.set('habits', hb.id, null);
        ctx.refresh();
      }
    });
    return row;
  }));
  const newHabit = h('input', { class: 'input', type: 'text', placeholder: 'Nouvelle habitude', 'aria-label': 'Nouvelle habitude', enterkeyhint: 'done' });
  const addHabit = () => {
    const label = newHabit.value.trim();
    if (!label) return;
    store.set('habits', uid('hc'), label);
    ctx.refresh();
  };
  newHabit.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addHabit(); } });
  const discipline = section('Discipline', { aside: h('span', { class: 'small muted' }, '7 derniers jours') },
    list.length ? habitRows : h('p', { class: 'empty' }, 'Aucune habitude.'),
    h('div', { class: 'add-row' }, newHabit, button('Ajouter', addHabit, { icon: 'plus' })),
    h('p', { class: 'hint' }, 'Appui long sur une habitude pour la supprimer.')
  );

  // Fait du jour
  const facts = lastFacts(store, day, 5);
  const fait = section('Le fait du jour', {},
    field({ multiline: true, rows: 3, aria: 'Le fait du jour', placeholder: 'Ce que je retiens d\'aujourd\'hui', value: store.get(dk, 'fait', ''), onInput: (v) => { if (v !== store.get(dk, 'fait', '')) store.set(dk, 'fait', v); } }),
    facts.length
      ? h('div', { class: 'facts' }, facts.map((f) => h('div', { class: 'fact' }, h('span', { class: 'fact-date' }, fmtShort(f.day)), h('span', null, f.text))))
      : null
  );

  // Portrait
  const portrait = section(content.portrait.titre, { class: 'portrait' },
    h('ol', null, content.portrait.items.map((p) => h('li', null, p)))
  );

  return h('div', null, head, training, routineCard, programme, posture, actions, discipline, fait, portrait);
}
