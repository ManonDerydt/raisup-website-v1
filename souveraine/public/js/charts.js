// Graphiques SVG légers : une série par graphique, un seul axe, info-bulle au survol et au clavier.
import { h } from './ui.js';

const NS = 'http://www.w3.org/2000/svg';

function s(tag, attrs = {}, text) {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== null && v !== undefined) el.setAttribute(k, v);
  if (text !== undefined) el.textContent = text;
  return el;
}

// Indices d'étiquettes régulièrement espacés, premier et dernier compris.
export function tickIndexes(n, max) {
  if (n <= 0) return [];
  if (n <= max) return Array.from({ length: n }, (_, i) => i);
  const out = [];
  for (let k = 0; k < max; k++) out.push(Math.round((k * (n - 1)) / (max - 1)));
  return [...new Set(out)];
}

// Échelle aux graduations rondes : 0, 2 000, 4 000…
export function niceScale(maxVal, target = 4, fixedMax = null) {
  if (fixedMax) return { max: fixedMax, step: fixedMax / target };
  const v = maxVal > 0 ? maxVal : 1;
  const raw = v / target;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * p).find((x) => x >= raw);
  return { max: step * Math.ceil(v / step - 1e-9), step };
}

function attachTip(wrap, tip, n, show) {
  let idx = -1;
  const hide = () => { tip.hidden = true; idx = -1; show(-1); };
  wrap.addEventListener('pointerleave', hide);
  wrap.addEventListener('blur', hide);
  wrap.addEventListener('keydown', (e) => {
    if (!n()) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      if (idx < 0) idx = n() - 1;
      else idx = Math.max(0, Math.min(n() - 1, idx + (e.key === 'ArrowRight' ? 1 : -1)));
      show(idx);
    }
  });
  wrap.addEventListener('focus', () => { if (n()) { idx = n() - 1; show(idx); } });
  return (i) => { idx = i; };
}

function placeTip(wrap, tip, x, y, value, label) {
  tip.replaceChildren(h('strong', null, value), document.createTextNode(label));
  tip.hidden = false;
  const w = wrap.clientWidth;
  const tw = tip.offsetWidth;
  const cx = Math.max(tw / 2, Math.min(w - tw / 2, x));
  tip.style.left = `${cx}px`;
  tip.style.top = `${Math.max(0, y - 8)}px`;
}

function observe(wrap, draw) {
  let lastW = 0;
  const ro = new ResizeObserver((entries) => {
    const w = Math.round(entries[0].contentRect.width);
    if (w && w !== lastW) { lastW = w; draw(w); }
  });
  ro.observe(wrap);
}

// Courbe : data = [{ label, value (nombre ou null), tip }]
export function lineChart(opts) {
  const { data, height = 140, format = String, yMax: fixedMax, ariaLabel, tone = 'accent', ticks = 4 } = opts;
  const tip = h('div', { class: 'tip', hidden: true });
  const wrap = h('div', { class: 'chart', tabindex: '0', role: 'img', 'aria-label': ariaLabel }, tip);
  let svg = null;
  let pts = [];
  let cross = null, dot = null;

  const draw = (W) => {
    const m = { l: 44, r: 14, t: 14, b: 22 };
    const iw = W - m.l - m.r, ih = height - m.t - m.b;
    const vals = data.map((d) => d.value).filter((v) => v !== null && v !== undefined);
    const scale = niceScale(Math.max(...vals, 0), ticks, fixedMax);
    const yMax = scale.max;
    const x = (i) => m.l + (data.length <= 1 ? iw / 2 : (i * iw) / (data.length - 1));
    const y = (v) => m.t + ih - (v / yMax) * ih;
    svg && svg.remove();
    svg = s('svg', { width: W, height, viewBox: `0 0 ${W} ${height}`, 'aria-hidden': 'true' });
    const grid = s('g', { class: 'grid' });
    const axis = s('g', { class: 'axis' });
    for (let v = 0; v <= yMax + 1e-9; v += scale.step) {
      grid.append(s('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v) }));
      axis.append(s('text', { x: m.l - 6, y: y(v) + 3, 'text-anchor': 'end' }, format(v)));
    }
    for (const i of tickIndexes(data.length, Math.max(2, Math.floor(iw / 80)))) {
      if (!data[i].label) continue;
      axis.append(s('text', { x: x(i), y: height - 6, 'text-anchor': i === 0 && data.length > 1 ? 'start' : i === data.length - 1 && data.length > 1 ? 'end' : 'middle' }, data[i].label));
    }
    svg.append(grid, axis);

    pts = data.map((d, i) => ({ i, d, x: x(i), y: d.value === null || d.value === undefined ? null : y(d.value) }));
    // Segments continus (les jours sans donnée coupent la courbe).
    let path = '';
    let prev = false;
    for (const p of pts) {
      if (p.y === null) { prev = false; continue; }
      path += `${prev ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      prev = true;
    }
    svg.append(s('path', { class: `series ${tone === 'brass' ? 'series-brass' : ''}`, d: path }));
    // Points isolés visibles
    pts.forEach((p, k) => {
      if (p.y === null) return;
      const before = pts[k - 1], after = pts[k + 1];
      const alone = (!before || before.y === null) && (!after || after.y === null);
      if (alone) svg.append(s('circle', { class: `dot ${tone === 'brass' ? 'dot-brass' : ''}`, cx: p.x, cy: p.y, r: 3.5 }));
    });
    const last = [...pts].reverse().find((p) => p.y !== null);
    if (last) {
      svg.append(s('circle', { class: `dot ${tone === 'brass' ? 'dot-brass' : ''}`, cx: last.x, cy: last.y, r: 4 }));
    }
    cross = s('line', { class: 'cross', y1: m.t, y2: m.t + ih, x1: 0, x2: 0, visibility: 'hidden' });
    dot = s('circle', { class: `dot ${tone === 'brass' ? 'dot-brass' : ''}`, r: 5, visibility: 'hidden' });
    svg.append(cross, dot);
    wrap.prepend(svg);
  };

  const show = (i) => {
    if (!cross) return;
    if (i < 0 || !pts[i]) { cross.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden'); tip.hidden = true; return; }
    const p = pts[i];
    cross.setAttribute('x1', p.x); cross.setAttribute('x2', p.x); cross.setAttribute('visibility', 'visible');
    if (p.y !== null) { dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y); dot.setAttribute('visibility', 'visible'); } else dot.setAttribute('visibility', 'hidden');
    placeTip(wrap, tip, p.x, p.y === null ? 20 : p.y, p.d.value === null || p.d.value === undefined ? 'Aucune donnée' : format(p.d.value, true), p.d.tip || p.d.label || '');
  };
  const setIdx = attachTip(wrap, tip, () => pts.length, show);
  wrap.addEventListener('pointermove', (e) => {
    if (!pts.length) return;
    const r = wrap.getBoundingClientRect();
    const px = e.clientX - r.left;
    let best = 0;
    for (const p of pts) if (Math.abs(p.x - px) < Math.abs(pts[best].x - px)) best = p.i;
    setIdx(best);
    show(best);
  });
  observe(wrap, draw);
  return wrap;
}

// Barres : data = [{ label, value, tip, current }], ref = { value, label }
export function barChart(opts) {
  const { data, height = 160, format = String, ariaLabel, ref } = opts;
  const tip = h('div', { class: 'tip', hidden: true });
  const wrap = h('div', { class: 'chart', tabindex: '0', role: 'img', 'aria-label': ariaLabel }, tip);
  let svg = null;
  let cols = [];

  const draw = (W) => {
    const m = { l: 44, r: 8, t: 18, b: 22 };
    const iw = W - m.l - m.r, ih = height - m.t - m.b;
    const scale = niceScale(Math.max(ref ? ref.value * 1.1 : 1, ...data.map((d) => d.value || 0)), 4);
    const yMax = scale.max;
    const y = (v) => m.t + ih - (v / yMax) * ih;
    const band = iw / data.length;
    const bw = Math.min(24, band * 0.62);
    svg && svg.remove();
    svg = s('svg', { width: W, height, viewBox: `0 0 ${W} ${height}`, 'aria-hidden': 'true' });
    const grid = s('g', { class: 'grid' });
    const axis = s('g', { class: 'axis' });
    for (let v = 0; v <= yMax + 1e-9; v += scale.step) {
      grid.append(s('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v) }));
      axis.append(s('text', { x: m.l - 6, y: y(v) + 3, 'text-anchor': 'end' }, format(v)));
    }
    svg.append(grid, axis);
    const every = Math.max(1, Math.ceil(30 / band));
    cols = data.map((d, i) => {
      const cx = m.l + band * i + band / 2;
      const v = d.value || 0;
      const top = y(v), base = y(0);
      const r = Math.min(2, (base - top) / 2);
      if (v > 0) {
        const x0 = cx - bw / 2, x1 = cx + bw / 2;
        const p = `M${x0},${base}V${top + r}Q${x0},${top} ${x0 + r},${top}H${x1 - r}Q${x1},${top} ${x1},${top + r}V${base}Z`;
        svg.append(s('path', { class: `colbar ${d.current ? 'is-current' : ''}`, d: p }));
      }
      if ((data.length - 1 - i) % every === 0) axis.append(s('text', { x: cx, y: height - 6, 'text-anchor': 'middle' }, d.label));
      return { cx, top, d, i };
    });
    if (ref) {
      const ry = y(ref.value);
      svg.append(s('line', { class: 'ref', x1: m.l, x2: W - m.r, y1: ry, y2: ry }));
      svg.append(s('text', { class: 'ref-label', x: m.l + 4, y: ry - 4 }, ref.label));
    }
    wrap.prepend(svg);
  };

  const show = (i) => {
    svg && svg.querySelectorAll('.colbar').forEach((b) => b.classList.remove('is-hot'));
    if (i < 0 || !cols[i]) { tip.hidden = true; return; }
    const c = cols[i];
    placeTip(wrap, tip, c.cx, c.top, format(c.d.value || 0, true), c.d.tip || c.d.label);
  };
  const setIdx = attachTip(wrap, tip, () => cols.length, show);
  wrap.addEventListener('pointermove', (e) => {
    if (!cols.length) return;
    const r = wrap.getBoundingClientRect();
    const px = e.clientX - r.left;
    let best = 0;
    for (const c of cols) if (Math.abs(c.cx - px) < Math.abs(cols[best].cx - px)) best = c.i;
    setIdx(best);
    show(best);
  });
  observe(wrap, draw);
  return wrap;
}

// Vue tableau, pour lire les valeurs sans survol.
export function dataTable(summary, headers, rows) {
  return h('details', { class: 'table-toggle' },
    h('summary', null, summary),
    h('table', { class: 'table' },
      h('thead', null, h('tr', null, headers.map((th, i) => h('th', { class: i ? 'num' : '' }, th)))),
      h('tbody', null, rows.map((r) => h('tr', null, r.map((td, i) => h('td', { class: i ? 'num' : '' }, td)))))
    )
  );
}
