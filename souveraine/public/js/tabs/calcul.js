// Onglet 3 : Calcul
import { h, mono, section, chips, stat, fmt1 } from '../ui.js';
import { CATEGORIES, generate, parseAnswer, isCorrect, withUnit, fmtSeconds } from '../calc.js';
import { lastDays, fmtShort } from '../dates.js';
import { calcDay, calcRange, logCalc } from '../model.js';
import { lineChart, dataTable } from '../charts.js';

const state = { filter: 'tout', q: null, startedAt: 0, result: null, draft: '' };
let ticker = null;

function newQuestion() {
  state.q = generate(state.filter);
  state.startedAt = performance.now();
  state.result = null;
  state.draft = '';
}

function clock(ms) {
  const t = Math.max(0, ms) / 1000;
  const m = Math.floor(t / 60);
  const s = t - m * 60;
  return `${String(m).padStart(2, '0')}:${s.toFixed(1).padStart(4, '0').replace('.', ',')}`;
}

export function stop() {
  clearInterval(ticker);
  ticker = null;
}

export function render(ctx) {
  const { store, day, device } = ctx;
  stop();
  if (!state.q) newQuestion();

  const t = calcDay(store, day);
  const week = calcRange(store, lastDays(7, day));
  const statsRow = h('div', { class: 'stats' },
    stat('Justes aujourd\'hui', `${t.ok}/${t.n}`),
    stat('Justesse sur 7 jours', week.n ? `${Math.round((week.ok / week.n) * 100)} %` : '0 %'),
    stat('Temps moyen par question', week.n ? fmtSeconds(week.ms / week.n) : '0 s')
  );

  const filters = chips(CATEGORIES, state.filter, (id) => {
    state.filter = id;
    newQuestion();
    ctx.refresh({ focus: '.q-input' });
  }, 'Type de calcul');

  // Question
  const q = state.q;
  const res = state.result;
  const chrono = h('span', { class: `chrono ${res ? 'is-stopped' : ''}`, role: 'timer', 'aria-label': 'Chronomètre' }, clock(res ? res.ms : performance.now() - state.startedAt));
  const input = h('input', {
    class: `input q-input ${res ? (res.ok ? 'is-ok' : 'is-ko') : ''}`, type: 'text', inputmode: 'text',
    autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false', enterkeyhint: 'go',
    placeholder: q.unit === '%' ? 'Ex. 12,5 %' : q.unit === 'mois' ? 'Ex. 18 mois' : 'Ex. 360k ou 2,4m',
    'aria-label': 'Ma réponse', readonly: res ? true : null
  });
  input.value = res ? res.raw : state.draft;
  input.addEventListener('input', () => { state.draft = input.value; });

  const submit = (e) => {
    e && e.preventDefault();
    if (state.result) {
      newQuestion();
      ctx.refresh({ focus: '.q-input' });
      return;
    }
    const raw = input.value.trim();
    if (!raw) { input.focus(); return; }
    const value = parseAnswer(raw);
    if (!isFinite(value)) {
      hint.textContent = 'Réponse illisible. Exemples : 360k, 2,4m, 12,5 %.';
      input.focus();
      return;
    }
    const ms = performance.now() - state.startedAt;
    const ok = isCorrect(value, q.answer, q.pct);
    state.result = { raw, value, ok, ms };
    logCalc(store, device, day, ok, ms);
    ctx.refresh({ focus: '.q-next' });
  };

  const hint = h('p', { class: 'key-hint', 'aria-live': 'polite' }, res ? 'Valider à nouveau pour passer à la question suivante.' : 'Accepte 360k, 2,4m, virgule ou point, avec ou sans €, % ou mois.');
  const verdict = res
    ? h('div', { class: 'verdict', 'aria-live': 'polite' },
        h('p', { class: `verdict-title ${res.ok ? 'verdict-ok' : 'verdict-ko'}` }, res.ok ? 'Juste' : 'Faux'),
        h('dl', { class: 'verdict-lines' },
          h('dt', null, 'Bonne réponse'), h('dd', { class: 'num' }, withUnit(q.answer, q.unit)),
          h('dt', null, 'Ma réponse'), h('dd', { class: 'num' }, withUnit(res.value, q.unit)),
          h('dt', null, 'Temps'), h('dd', { class: 'num' }, fmtSeconds(res.ms))
        ),
        h('p', { class: 'method' }, h('span', { class: 'label', style: { display: 'block', marginBottom: '2px' } }, 'Méthode'), mono(q.method))
      )
    : null;

  const form = h('form', { class: 'card', on: { submit }, novalidate: true },
    h('div', { class: 'q-head' }, h('span', { class: 'label' }, (CATEGORIES.find((c) => c.id === q.cat) || {}).label || ''), chrono),
    h('p', { class: 'q-prompt' }, mono(q.prompt)),
    input,
    verdict,
    h('div', { class: 'q-actions' }, h('button', { type: 'submit', class: `btn btn-primary btn-wide ${res ? 'q-next' : ''}` }, res ? 'Valider : question suivante' : 'Valider')),
    hint
  );

  if (!res) {
    ticker = setInterval(() => {
      if (!chrono.isConnected) { stop(); return; }
      chrono.textContent = clock(performance.now() - state.startedAt);
    }, 100);
  }

  // Progression sur 30 jours
  const days = lastDays(30, day);
  const rows = days.map((d) => ({ d, ...calcDay(store, d) }));
  const acc = rows.map((r) => ({ label: fmtShort(r.d), value: r.n ? Math.round((r.ok / r.n) * 100) : null, tip: `${fmtShort(r.d)} : ${r.ok}/${r.n}` }));
  const time = rows.map((r) => ({ label: fmtShort(r.d), value: r.n ? Math.round(r.ms / r.n / 100) / 10 : null, tip: fmtShort(r.d) }));
  const played = rows.filter((r) => r.n);
  const progress = section('Progression sur 30 jours', {},
    played.length
      ? [
          h('p', { class: 'chart-title', style: { marginTop: '0' } }, 'Justesse par jour, en %'),
          lineChart({ data: acc, yMax: 100, format: (v, tip) => `${Math.round(v)}${tip ? '\u00a0%' : ''}`, ariaLabel: 'Justesse par jour sur 30 jours' }),
          h('p', { class: 'chart-title' }, 'Temps moyen par question, en secondes'),
          lineChart({ data: time, tone: 'brass', format: (v, tip) => (tip ? `${fmt1(v)}\u00a0s` : fmt1(v)), ariaLabel: 'Temps moyen par question sur 30 jours' }),
          dataTable('Voir les valeurs', ['Jour', 'Justes', 'Justesse', 'Temps moyen'], [...played].reverse().map((r) => [fmtShort(r.d), `${r.ok}/${r.n}`, `${Math.round((r.ok / r.n) * 100)}\u00a0%`, fmtSeconds(r.ms / r.n)]))
        ]
      : h('p', { class: 'empty' }, 'Les courbes apparaissent après les premières questions.')
  );

  return h('div', null,
    h('header', { class: 'page-head' }, h('h1', { class: 'page-title' }, 'Calcul')),
    statsRow, filters, form, progress
  );
}
