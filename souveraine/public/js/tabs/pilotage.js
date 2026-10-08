// Onglet 5 : Pilotage
import { h, mono, section, button, field, promptBox, confirmBox, longPress, uid, fmtInt, fmt1, fmtEUR, num } from '../ui.js';
import { diffDays, fmtMedium, fmtMonth, fmtMonthShort, fmtShort, addMonths, addMonthsToDate, monthKey } from '../dates.js';
import { revenueMonth, revenueTarget } from '../model.js';
import { lineChart, barChart, dataTable } from '../charts.js';

const STATES = ['À venir', 'En cours', 'Fait'];
const NETWORKS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'videos', label: 'Vidéos à plus de 100 000 vues' }
];
const state = { month: null };

const parseAmount = (v) => {
  const n = parseFloat(String(v).replace(/[\s  €]/g, '').replace(',', '.'));
  return isFinite(n) ? n : null;
};

function numberField({ label, value, onCommit, suffix = '' }) {
  return field({
    label, type: 'text', inputmode: 'decimal', cls: 'num',
    value: value === null || value === undefined ? '' : String(value).replace('.', ','),
    placeholder: suffix ? `0 ${suffix}` : '0',
    onInput: (v) => onCommit(v.trim() === '' ? null : parseAmount(v))
  });
}

export function render(ctx) {
  const { store, content, day } = ctx;
  const P = content.parametres;
  const thisMonth = monthKey(day);
  if (!state.month) state.month = thisMonth;

  // Jour J
  const jourJ = store.get('pil', 'jourJ', '');
  const dateInput = h('input', { type: 'date', class: 'input', id: 'jourj', value: jourJ });
  dateInput.addEventListener('change', () => { store.set('pil', 'jourJ', dateInput.value || null); ctx.refresh(); });
  let countdown;
  if (jourJ) {
    const d = diffDays(day, jourJ);
    countdown = h('div', null,
      h('div', { class: 'dday' },
        h('span', { class: 'dday-value' }, d === 0 ? '0' : fmtInt(Math.abs(d))),
        h('span', { class: 'muted' }, d > 0 ? `jour${d > 1 ? 's' : ''} avant la cession` : d === 0 ? 'C\'est aujourd\'hui.' : `jour${d < -1 ? 's' : ''} depuis la cession`)
      ),
      h('p', { class: 'small muted' }, mono(`Cession le ${fmtMedium(jourJ)}`))
    );
  } else {
    countdown = h('p', { class: 'empty' }, 'Indique la date de la cession pour lancer le compte à rebours.');
  }
  const dday = section('Le jour J', {},
    countdown,
    h('div', { class: 'field' }, h('label', { class: 'field-label', for: 'jourj' }, 'Date de la cession'), dateInput)
  );

  // Ma carte
  const objStates = store.map('obj');
  const custom = Object.entries(store.map('objc')).filter(([, o]) => o && o.label);
  const pillars = content.piliers.items.map((p) => {
    const list = [
      ...p.objectifs.map((o) => ({ ...o, perso: false })),
      ...custom.filter(([, o]) => o.pilier === p.id).sort(([a], [b]) => (a < b ? -1 : 1)).map(([id, o]) => ({ id, label: o.label, perso: true }))
    ];
    const done = () => list.filter((o) => (store.get('obj', o.id, 0)) === 2).length;
    const cnt = h('span', { class: 'counter' }, `${done()}/${list.length}`);
    const rows = list.map((o) => {
      let st = objStates[o.id] || 0;
      const badge = h('span', { class: `state state-${st}` }, STATES[st]);
      const btn = h('button', { type: 'button', class: `obj ${st === 2 ? 'is-done' : ''}`, 'aria-label': `${o.label} : ${STATES[st]}. Toucher pour changer l'état` },
        h('span', { class: 'obj-label' }, mono(o.label)), badge);
      btn.addEventListener('click', () => {
        st = (st + 1) % 3;
        store.set('obj', o.id, st);
        badge.className = `state state-${st}`;
        badge.textContent = STATES[st];
        btn.classList.toggle('is-done', st === 2);
        btn.setAttribute('aria-label', `${o.label} : ${STATES[st]}. Toucher pour changer l'état`);
        cnt.textContent = `${done()}/${list.length}`;
      });
      if (o.perso) {
        longPress(btn, async () => {
          if (await confirmBox(`Supprimer l'objectif « ${o.label} » ?`, { ok: 'Supprimer', danger: true })) { store.set('objc', o.id, null); ctx.refresh(); }
        });
      }
      return btn;
    });
    const add = async () => {
      const res = await promptBox(`Nouvel objectif : ${p.titre}`, [{ name: 'label', label: 'Objectif', required: true }], { ok: 'Ajouter' });
      if (res && res.label) { store.set('objc', uid('oc'), { pilier: p.id, label: res.label }); ctx.refresh(); }
    };
    return h('div', { class: 'pillar' },
      h('div', { class: 'pillar-head' }, h('h3', { class: 'pillar-title' }, p.titre), cnt),
      h('div', null, rows),
      button('Ajouter un objectif', add, { class: 'btn-link', icon: 'plus' })
    );
  });
  const carte = section('Ma carte', {},
    h('div', { class: 'certain' }, h('span', { class: 'label' }, 'Sûr et certain'), P.certitude.replace(/^Sûr et certain\s*:\s*/, '')),
    pillars,
    custom.length ? h('p', { class: 'hint' }, 'Appui long sur un objectif ajouté pour le supprimer.') : null
  );

  // Audience
  const aud = store.map('aud');
  const saveAud = (id, v) => {
    if (v === (aud[id] ?? null)) return;
    aud[id] = v;
    store.set('aud', id, v);
    const snap = {};
    for (const n of NETWORKS) if (typeof aud[n.id] === 'number') snap[n.id] = aud[n.id];
    store.set('audh', day, snap);
  };
  const insta = Number(aud.instagram) || 0;
  const milestones = P.jalonsInstagram.map((j) => {
    const date = j.date || (jourJ ? addMonthsToDate(jourJ, j.mois) : null);
    let status, cls;
    if (insta >= j.cible) { status = 'Atteint'; cls = 'status-ok'; }
    else if (date && date < day) { status = 'En retard'; cls = 'status-late'; }
    else { status = 'À venir'; cls = 'status-next'; }
    return h('div', { class: 'milestone' },
      h('div', null, h('div', null, mono(j.label)), h('div', { class: 'small muted' }, date ? mono(fmtMedium(date)) : 'Date du jour J à définir')),
      num(fmtInt(j.cible)),
      h('span', { class: `status ${cls}` }, status)
    );
  });
  const hist = Object.entries(store.map('audh')).filter(([, v]) => v && typeof v === 'object').sort(([a], [b]) => (a < b ? -1 : 1));
  const instaHist = hist.filter(([, v]) => typeof v.instagram === 'number');
  const audience = section('Audience', {},
    h('div', { class: 'grid-2' }, NETWORKS.map((n) => numberField({ label: n.label, value: aud[n.id], onCommit: (v) => saveAud(n.id, v) }))),
    h('p', { class: 'chart-title' }, 'Jalons Instagram'),
    h('div', null, milestones),
    h('p', { class: 'chart-title' }, 'Historique Instagram'),
    instaHist.length
      ? lineChart({ data: instaHist.map(([d, v]) => ({ label: fmtShort(d), value: v.instagram, tip: fmtShort(d) })), format: (v, tip) => (tip ? fmtInt(v) : v >= 1000 ? `${fmt1(v / 1000)}k` : fmtInt(v)), ariaLabel: 'Abonnés Instagram au fil des saisies', tone: 'brass' })
      : h('p', { class: 'empty' }, 'Chaque saisie est conservée et tracée ici.'),
    hist.length
      ? dataTable('Voir l\'historique', ['Date', 'Instagram', 'TikTok', 'LinkedIn', 'Vidéos'], [...hist].reverse().map(([d, v]) => [fmtShort(d), ...NETWORKS.map((n) => (typeof v[n.id] === 'number' ? fmtInt(v[n.id]) : ''))]))
      : null
  );

  // Revenus HT
  const month = state.month;
  const rev = revenueMonth(content, store, month);
  const target = revenueTarget(content, month);
  const totalEl = num(fmtEUR(rev.total));
  const gapEl = h('p', { class: 'gap-line' });
  const updateGap = (total) => {
    const missing = target - total;
    gapEl.className = `gap-line ${missing <= 0 ? 'is-ok' : 'is-short'}`;
    gapEl.replaceChildren(missing <= 0 ? mono(`Objectif de ${fmtEUR(target)} atteint.`) : mono(`Il manque ${fmtEUR(missing)} pour l'objectif de ${fmtEUR(target)}.`));
  };
  updateGap(rev.total);
  const revRows = content.sources.items.map((s) => {
    const id = `rv-${s.id}`;
    const input = h('input', { id, class: 'input num', type: 'text', inputmode: 'decimal', autocomplete: 'off', placeholder: '0', value: rev.bySource[s.id] ? String(rev.bySource[s.id]).replace('.', ',') : '' });
    let timer = null;
    const commit = () => {
      const v = input.value.trim() === '' ? null : parseAmount(input.value);
      if (v === (store.get('rev', `${month}:${s.id}`) ?? null)) return;
      store.set('rev', `${month}:${s.id}`, v);
      const r = revenueMonth(content, store, month);
      totalEl.textContent = fmtEUR(r.total);
      updateGap(r.total);
    };
    input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(commit, 400); });
    input.addEventListener('blur', () => { clearTimeout(timer); commit(); ctx.refreshSoon(); });
    return h('div', { class: 'rev-row' }, h('label', { for: id }, s.label), input);
  });
  const last12 = Array.from({ length: 12 }, (_, i) => addMonths(thisMonth, i - 11));
  const bars = last12.map((m) => ({ label: fmtMonthShort(m), value: revenueMonth(content, store, m).total, tip: fmtMonth(m), current: m === month }));
  const revenus = section('Revenus HT', {},
    h('div', { class: 'month-nav' },
      button('', () => { state.month = addMonths(month, -1); ctx.refresh(); }, { class: 'btn-icon btn-ghost', icon: 'left', aria: 'Mois précédent' }),
      h('span', { class: 'month-label' }, mono(fmtMonth(month))),
      button('', () => { state.month = addMonths(month, 1); ctx.refresh(); }, { class: 'btn-icon btn-ghost', icon: 'right', aria: 'Mois suivant' })
    ),
    h('div', null, revRows),
    h('div', { class: 'total-row' }, h('span', null, 'Total du mois'), totalEl),
    gapEl,
    h('p', { class: 'chart-title' }, '12 derniers mois'),
    barChart({ data: bars, ref: { value: P.minimumRevenus, label: 'Minimum 5K' }, format: (v, tip) => (tip ? fmtEUR(v) : v >= 1000 ? `${fmt1(v / 1000)}k` : fmtInt(v)), ariaLabel: 'Revenus HT des 12 derniers mois' }),
    dataTable('Voir les valeurs', ['Mois', 'Total HT'], bars.map((b) => [b.tip, fmtEUR(b.value)]))
  );

  // Autonomie
  const capital = store.get('pil', 'capital', null);
  const depenses = store.get('pil', 'depenses', P.depensesDefaut);
  const auto = h('div', { class: 'autonomy', 'aria-live': 'polite' });
  const drawAuto = () => {
    const cap = store.get('pil', 'capital', null);
    const dep = store.get('pil', 'depenses', P.depensesDefaut) || 0;
    const r = revenueMonth(content, store, month).total;
    const net = dep - r;
    if (net <= 0) {
      auto.replaceChildren(h('p', { class: 'covered' }, 'Couvert'), h('p', { class: 'small muted' }, mono(`Les revenus de ${fmtMonth(month)} (${fmtEUR(r)}) couvrent les dépenses (${fmtEUR(dep)}).`)));
      return;
    }
    if (cap === null) {
      auto.replaceChildren(h('p', { class: 'empty' }, 'Indique le capital disponible.'));
      return;
    }
    const months = cap / net;
    const end = addMonths(thisMonth, Math.floor(months));
    auto.replaceChildren(
      h('p', null, h('span', { class: 'autonomy-value' }, months >= 100 ? fmtInt(months) : fmt1(months)), ' ', h('span', { class: 'muted' }, 'mois d\'autonomie')),
      h('p', { class: 'small' }, mono(`Jusqu'en ${fmtMonth(end)}.`)),
      h('p', { class: 'small muted' }, mono(`${fmtEUR(cap)} / (${fmtEUR(dep)} − ${fmtEUR(r)} de revenus en ${fmtMonth(month)})`))
    );
  };
  drawAuto();
  const autonomie = section('Autonomie', {},
    h('div', { class: 'grid-2' },
      numberField({ label: 'Capital disponible (€ net)', value: capital, onCommit: (v) => { if (v !== store.get('pil', 'capital', null)) { store.set('pil', 'capital', v); drawAuto(); } } }),
      numberField({ label: 'Dépenses par mois (€)', value: depenses, onCommit: (v) => { const val = v === null ? P.depensesDefaut : v; if (val !== store.get('pil', 'depenses', P.depensesDefaut)) { store.set('pil', 'depenses', val); drawAuto(); } } })
    ),
    auto,
    h('p', { class: 'hint' }, mono(`Calcul sur les revenus de ${fmtMonth(month)}, le mois choisi dans Revenus HT.`))
  );

  return h('div', null,
    h('header', { class: 'page-head' }, h('h1', { class: 'page-title' }, 'Pilotage')),
    dday, carte, audience, revenus, autonomie
  );
}

