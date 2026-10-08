// Petits outils d'interface, sans dépendance.

export function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'on') for (const [ev, fn] of Object.entries(v)) el.addEventListener(ev, fn);
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k in el && typeof v !== 'string') el[k] = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
  }
  append(el, children);
  return el;
}

function append(el, children) {
  for (const c of children) {
    if (c === null || c === undefined || c === false) continue;
    if (Array.isArray(c)) append(el, c);
    else el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

// Les chiffres en IBM Plex Mono : enveloppe chaque suite de chiffres.
export function mono(text) {
  const frag = document.createDocumentFragment();
  const parts = String(text).split(/(\d[\d\s  .,:/]*\d|\d)/);
  for (const p of parts) {
    if (!p) continue;
    if (/^\d/.test(p)) frag.append(h('span', { class: 'num', text: p }));
    else frag.append(document.createTextNode(p));
  }
  return frag;
}

export function num(text, cls = '') {
  return h('span', { class: `num ${cls}`.trim(), text: String(text) });
}

const nf = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });
export const fmtInt = (n) => nf.format(Math.round(n || 0)).replace(/ /g, ' ');
export const fmt1 = (n) => nf1.format(n || 0).replace(/ /g, ' ');
export const fmtEUR = (n) => `${fmtInt(n)} €`;

// Bloc de section
export function section(title, opts = {}, ...children) {
  return h('section', { class: `card ${opts.class || ''}`.trim(), 'aria-labelledby': opts.id ? `${opts.id}-t` : null, id: opts.id || null },
    h('div', { class: 'card-head' },
      h('h2', { class: 'card-title', id: opts.id ? `${opts.id}-t` : null }, mono(title)),
      opts.aside ? h('div', { class: 'card-aside' }, opts.aside) : null
    ),
    ...children
  );
}

// Case à cocher accessible (cible de 44 px).
export function check(label, checked, onChange, opts = {}) {
  const id = `c${Math.random().toString(36).slice(2, 9)}`;
  const input = h('input', { type: 'checkbox', id, checked: !!checked, class: 'check-input' });
  const row = h('label', { class: `check ${checked ? 'is-done' : ''} ${opts.class || ''}`.trim(), for: id },
    input,
    h('span', { class: 'check-box', 'aria-hidden': 'true' }),
    h('span', { class: 'check-label' }, typeof label === 'string' ? mono(label) : label),
    opts.after || null
  );
  input.addEventListener('change', () => {
    row.classList.toggle('is-done', input.checked);
    onChange(input.checked);
  });
  return row;
}

export function gauge(value, max, label) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return h('div', { class: `gauge ${value >= max && max > 0 ? 'is-full' : ''}`, role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(max), 'aria-valuenow': String(value), 'aria-label': label || null },
    h('span', { class: 'gauge-fill', style: { width: `${pct}%` } })
  );
}

export function counter(value, max) {
  return h('span', { class: 'counter num' }, `${value}/${max}`);
}

export function button(label, onClick, opts = {}) {
  return h('button', { type: opts.type || 'button', class: `btn ${opts.class || ''}`.trim(), on: onClick ? { click: onClick } : null, 'aria-label': opts.aria || null, disabled: opts.disabled || null, 'aria-pressed': opts.pressed === undefined ? null : String(!!opts.pressed) }, opts.icon ? icon(opts.icon) : null, label ? h('span', null, label) : null);
}

export function chips(items, active, onPick, label) {
  return h('div', { class: 'chips', role: 'group', 'aria-label': label },
    items.map((it) => h('button', {
      type: 'button',
      class: `chip ${it.id === active ? 'is-active' : ''}`,
      'aria-pressed': String(it.id === active),
      on: { click: () => onPick(it.id) }
    }, mono(it.label)))
  );
}

// Champ texte enregistré automatiquement.
export function field(opts) {
  const { label, value = '', placeholder = '', onInput, multiline = false, type = 'text', inputmode, rows = 3, cls = '' } = opts;
  const id = `f${Math.random().toString(36).slice(2, 9)}`;
  const input = multiline
    ? h('textarea', { id, rows, placeholder, class: `input ${cls}`.trim() })
    : h('input', { id, type, placeholder, inputmode: inputmode || null, class: `input ${cls}`.trim(), autocomplete: 'off' });
  input.value = value;
  if (multiline && opts.autogrow) {
    const fit = () => { input.style.height = 'auto'; input.style.height = `${input.scrollHeight}px`; };
    input.addEventListener('input', fit);
    requestAnimationFrame(fit);
    if (typeof ResizeObserver !== 'undefined') {
      let w = 0;
      new ResizeObserver(([e]) => { if (Math.round(e.contentRect.width) !== w) { w = Math.round(e.contentRect.width); fit(); } }).observe(input);
    }
  }
  let timer = null;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => onInput(input.value), 300);
  });
  input.addEventListener('blur', () => { clearTimeout(timer); onInput(input.value); });
  if (!label) {
    if (opts.aria) input.setAttribute('aria-label', opts.aria);
    return input;
  }
  return h('div', { class: 'field' }, h('label', { class: 'field-label', for: id }, typeof label === 'string' ? mono(label) : label), input);
}

export function stat(label, value, sub) {
  return h('div', { class: 'stat' },
    h('div', { class: 'stat-value num' }, value),
    h('div', { class: 'stat-label' }, mono(label)),
    sub ? h('div', { class: 'stat-sub' }, sub) : null
  );
}

// Appui long (suppression d'une habitude).
export function longPress(el, fn, ms = 600) {
  let timer = null;
  let fired = false;
  const start = (e) => {
    fired = false;
    clearTimeout(timer);
    timer = setTimeout(() => { fired = true; navigator.vibrate && navigator.vibrate(20); fn(e); }, ms);
  };
  const cancel = () => clearTimeout(timer);
  el.addEventListener('pointerdown', start);
  el.addEventListener('pointerup', cancel);
  el.addEventListener('pointerleave', cancel);
  el.addEventListener('pointercancel', cancel);
  el.addEventListener('contextmenu', (e) => { e.preventDefault(); if (!fired) { cancel(); fn(e); } });
  el.addEventListener('click', (e) => { if (fired) { e.preventDefault(); e.stopPropagation(); fired = false; } }, true);
}

// Fenêtre de confirmation accessible.
export function confirmBox(message, { ok = 'Confirmer', cancel = 'Annuler', danger = false } = {}) {
  return new Promise((resolve) => {
    const dlg = h('dialog', { class: 'dialog' },
      h('form', { method: 'dialog', class: 'dialog-body' },
        h('p', { class: 'dialog-text' }, message),
        h('div', { class: 'dialog-actions' },
          h('button', { value: 'non', class: 'btn btn-ghost' }, cancel),
          h('button', { value: 'oui', class: `btn ${danger ? 'btn-danger' : 'btn-primary'}` }, ok)
        )
      )
    );
    dlg.addEventListener('close', () => { resolve(dlg.returnValue === 'oui'); dlg.remove(); });
    document.body.append(dlg);
    dlg.showModal();
  });
}

export function promptBox(title, fields, { ok = 'Enregistrer' } = {}) {
  return new Promise((resolve) => {
    const inputs = {};
    const body = fields.map((f) => {
      const id = `p${Math.random().toString(36).slice(2, 9)}`;
      const el = f.multiline
        ? h('textarea', { id, rows: f.rows || 3, class: 'input', placeholder: f.placeholder || '' })
        : h('input', { id, type: 'text', class: 'input', placeholder: f.placeholder || '', autocomplete: 'off' });
      el.value = f.value || '';
      if (f.required) el.required = true;
      inputs[f.name] = el;
      return h('div', { class: 'field' }, h('label', { class: 'field-label', for: id }, f.label), el);
    });
    const dlg = h('dialog', { class: 'dialog' },
      h('form', { method: 'dialog', class: 'dialog-body' },
        h('h2', { class: 'dialog-title' }, title),
        body,
        h('div', { class: 'dialog-actions' },
          h('button', { value: 'non', class: 'btn btn-ghost', formnovalidate: true }, 'Annuler'),
          h('button', { value: 'oui', class: 'btn btn-primary' }, ok)
        )
      )
    );
    dlg.addEventListener('close', () => {
      const res = dlg.returnValue === 'oui' ? Object.fromEntries(Object.entries(inputs).map(([k, el]) => [k, el.value.trim()])) : null;
      dlg.remove();
      resolve(res);
    });
    document.body.append(dlg);
    dlg.showModal();
  });
}

const ICONS = {
  today: '<path d="M4 5h16v15H4z"/><path d="M4 9h16M9 3v4M15 3v4"/>',
  vocab: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
  calc: '<rect x="5" y="3" width="14" height="18"/><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"/>',
  speech: '<rect x="9" y="3" width="6" height="11"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6"/>',
  pilot: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  left: '<path d="M15 5l-7 7 7 7"/>',
  right: '<path d="M9 5l7 7-7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  play: '<path d="M7 4l13 8-13 8z"/>',
  stop: '<rect x="6" y="6" width="12" height="12"/>',
  sound: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>',
  mic: '<rect x="9" y="3" width="6" height="11"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  shuffle: '<path d="M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>'
};

export function icon(name, cls = '') {
  const span = document.createElement('span');
  span.className = `icon ${cls}`.trim();
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter">${ICONS[name] || ''}</svg>`;
  return span;
}

export function empty(text) {
  return h('p', { class: 'empty' }, text);
}

export function uid(prefix = '') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
