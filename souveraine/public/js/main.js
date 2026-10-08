// Souveraine : démarrage, connexion, navigation.
import { createStore, deviceId } from './store.js';
import { loadContent } from './content.js';
import * as cloud from './cloud.js';
import { h, icon } from './ui.js';
import { today } from './dates.js';
import { ensureStart } from './model.js';
import { openSettings } from './settings.js';
import * as notify from './notify.js';
import * as aujourdhui from './tabs/aujourdhui.js';
import * as vocabulaire from './tabs/vocabulaire.js';
import * as calcul from './tabs/calcul.js';
import * as discours from './tabs/discours.js';
import * as pilotage from './tabs/pilotage.js';

const TABS = [
  { id: 'aujourdhui', label: 'Aujourd\'hui', icon: 'today', mod: aujourdhui },
  { id: 'vocabulaire', label: 'Vocabulaire', icon: 'vocab', mod: vocabulaire },
  { id: 'calcul', label: 'Calcul', icon: 'calc', mod: calcul },
  { id: 'discours', label: 'Discours', icon: 'speech', mod: discours },
  { id: 'pilotage', label: 'Pilotage', icon: 'pilot', mod: pilotage }
];
const LOCAL_FLAG = 'souveraine:mode-local';

const config = window.SOUVERAINE_CONFIG || {};
const root = document.getElementById('root');
const store = createStore();
const ctx = {
  store, config, content: null, device: deviceId(), day: today(),
  cloud: null, uid: null, email: null,
  go, refresh, refreshSoon, logout, toast
};

let current = null;
let stopSync = null;
let reminderTimer = null;
let views = {};
let saveEl = null;
let pendingRefresh = false;
let offline = false;

let updateReady = false;
function registerSW() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController) updateReady = true; });
  navigator.serviceWorker.register('sw.js').catch((e) => console.warn('Service worker non enregistré', e));
}

async function boot() {
  registerSW();
  try {
    ctx.content = await loadContent();
  } catch (e) {
    root.replaceChildren(h('div', { class: 'login' }, h('p', null, 'Contenu indisponible. Vérifie la connexion puis recharge.')));
    return;
  }
  if (cloud.isConfigured(config)) {
    await cloud.initCloud(config);
    ctx.cloud = cloud;
    cloud.watchAuth((user) => {
      if (user) startApp(user.uid, user.email);
      else { stopApp(); showLogin(); }
    });
  } else if (localStorage.getItem(LOCAL_FLAG) === '1') {
    startApp('local', null);
  } else {
    showLogin();
  }
}

// Connexion
function showLogin() {
  const err = h('p', { class: 'login-error', role: 'alert' });
  if (!ctx.cloud) {
    root.replaceChildren(h('div', { class: 'login' }, h('div', { class: 'login-box' },
      h('p', { class: 'login-brand' }, 'Souveraine'),
      h('h1', { class: 'login-title' }, 'Synchronisation non configurée'),
      h('p', { class: 'muted' }, 'Renseigne config.js pour activer la connexion et la synchronisation. En attendant, les données restent sur cet appareil.'),
      h('button', { type: 'button', class: 'btn btn-primary', on: { click: () => { localStorage.setItem(LOCAL_FLAG, '1'); startApp('local', null); } } }, 'Continuer sur cet appareil')
    )));
    return;
  }
  const email = h('input', { class: 'input', type: 'email', id: 'login-email', autocomplete: 'username', required: true, inputmode: 'email' });
  const pass = h('input', { class: 'input', type: 'password', id: 'login-pass', autocomplete: 'current-password', required: true });
  const submit = h('button', { type: 'submit', class: 'btn btn-primary' }, 'Se connecter');
  const form = h('form', { class: 'login-box', novalidate: true },
    h('p', { class: 'login-brand' }, 'Souveraine'),
    h('h1', { class: 'login-title' }, 'Connexion'),
    h('div', { class: 'field' }, h('label', { class: 'field-label', for: 'login-email' }, 'Adresse électronique'), email),
    h('div', { class: 'field' }, h('label', { class: 'field-label', for: 'login-pass' }, 'Mot de passe'), pass),
    submit, err,
    h('button', { type: 'button', class: 'btn btn-link', on: { click: async () => {
      if (!email.value.trim()) { err.textContent = 'Saisis ton adresse, puis touche « Mot de passe oublié ».'; email.focus(); return; }
      try { await cloud.resetPassword(email.value); err.textContent = 'Un lien de réinitialisation vient d\'être envoyé.'; }
      catch (e) { err.textContent = cloud.authMessage(e); }
    } } }, 'Mot de passe oublié')
  );
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.textContent = '';
    submit.disabled = true;
    try { await cloud.signIn(email.value, pass.value); }
    catch (e2) { err.textContent = cloud.authMessage(e2); }
    finally { submit.disabled = false; }
  });
  root.replaceChildren(h('div', { class: 'login' }, form));
  email.focus();
}

// Application
function startApp(ns, email) {
  if (ctx.uid === ns && current) return;
  stopApp();
  ctx.uid = ns;
  ctx.email = email;
  store.load(ns);
  ctx.day = today();
  ensureStart(store, ctx.day);
  renderShell();
  if (ctx.cloud) {
    stopSync = cloud.startSync(store, ns, { onStatus: (s) => { offline = !!s.offline; drawStatus(); } });
  }
  reminderTimer = notify.startLoop(ctx);
  const initial = (location.hash || '').slice(1);
  go(TABS.some((t) => t.id === initial) ? initial : 'aujourdhui', { replace: true });
}

function stopApp() {
  stopSync && stopSync();
  stopSync = null;
  clearInterval(reminderTimer);
  current = null;
}

async function logout() {
  stopApp();
  store.clear();
  ctx.uid = null;
  if (ctx.cloud) await cloud.logOut();
  else { localStorage.removeItem(LOCAL_FLAG); showLogin(); }
}

function renderShell() {
  saveEl = h('span', { class: 'save-state', role: 'status', 'aria-live': 'polite' });
  const top = h('header', { class: 'topbar' }, h('div', { class: 'topbar-inner' },
    h('span', { class: 'brand' }, 'Souveraine'),
    h('div', { class: 'topbar-right' },
      saveEl,
      h('button', { type: 'button', class: 'btn btn-icon btn-ghost', style: { border: '0' }, 'aria-label': 'Réglages', on: { click: () => openSettings(ctx) } }, icon('settings'))
    )
  ));
  views = {};
  const main = h('main', { id: 'main' });
  if (ctx.content.provisoire.length) {
    main.append(h('p', { class: 'notice' }, 'Contenu provisoire : à remplacer par celui de souveraine.html.'));
  }
  for (const t of TABS) {
    views[t.id] = h('div', { class: 'view', id: `vue-${t.id}`, hidden: true, role: 'region', 'aria-label': t.label });
    main.append(views[t.id]);
  }
  const nav = h('nav', { class: 'tabbar', 'aria-label': 'Navigation principale' }, h('div', { class: 'tabbar-inner' },
    TABS.map((t) => h('button', { type: 'button', class: 'tab', 'data-tab': t.id, on: { click: () => go(t.id) } }, icon(t.icon), h('span', null, t.label)))
  ));
  root.replaceChildren(h('div', { class: 'app' }, top, main, nav));
  window.addEventListener('scroll', () => top.classList.toggle('is-scrolled', window.scrollY > 4), { passive: true });
}

let savedTimer = null;
function drawStatus(justSaved) {
  if (!saveEl) return;
  clearTimeout(savedTimer);
  if (offline) {
    saveEl.className = 'save-state is-offline';
    saveEl.textContent = justSaved ? 'Enregistré hors ligne' : 'Hors ligne';
    return;
  }
  if (justSaved) {
    saveEl.className = 'save-state is-visible';
    saveEl.textContent = 'Enregistré';
    savedTimer = setTimeout(() => { saveEl.className = 'save-state'; }, 1800);
  } else {
    saveEl.className = 'save-state';
  }
}

function go(id, { replace = false } = {}) {
  if (!views[id]) return;
  if (current && current !== id) {
    const prev = TABS.find((t) => t.id === current);
    prev.mod.stop && prev.mod.stop();
  }
  const changed = current !== id;
  current = id;
  for (const t of TABS) {
    views[t.id].hidden = t.id !== id;
    const btn = root.querySelector(`.tab[data-tab="${t.id}"]`);
    if (btn) { if (t.id === id) btn.setAttribute('aria-current', 'page'); else btn.removeAttribute('aria-current'); }
  }
  if (replace) history.replaceState(null, '', `#${id}`);
  else if (changed) history.pushState(null, '', `#${id}`);
  draw();
  if (changed) window.scrollTo(0, 0);
}

function draw(opts = {}) {
  const tab = TABS.find((t) => t.id === current);
  if (!tab) return;
  const y = window.scrollY;
  pendingRefresh = false;
  views[current].replaceChildren(tab.mod.render(ctx));
  if (opts.keepScroll !== false) window.scrollTo(0, y);
  if (opts.focus) {
    const el = views[current].querySelector(opts.focus);
    el && el.focus({ preventScroll: true });
  }
}

function refresh(opts = {}) {
  draw(opts);
}

// Rafraîchit dès que la saisie en cours est terminée (changement distant, graphique à redessiner).
function editing() {
  const a = document.activeElement;
  return a && views[current] && views[current].contains(a) && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) || document.querySelector('dialog[open]');
}
function refreshSoon() {
  pendingRefresh = true;
  setTimeout(() => { if (pendingRefresh && !editing()) draw(); }, 350);
}
document.addEventListener('focusout', () => { if (pendingRefresh) setTimeout(() => { if (pendingRefresh && !editing()) draw(); }, 50); });

function toast(text) {
  const t = h('div', { class: 'toast', role: 'status' }, text);
  document.body.append(t);
  setTimeout(() => t.remove(), 2600);
}

store.onSaved(() => drawStatus(true));
store.subscribe((keys, origin) => {
  if (!current) return;
  if (origin === 'remote' || origin === 'import') {
    if (current === 'discours' && discours.isBusy()) { pendingRefresh = true; return; }
    refreshSoon();
  }
});

window.addEventListener('popstate', () => {
  const id = (location.hash || '').slice(1);
  if (current && TABS.some((t) => t.id === id) && id !== current) go(id, { replace: true });
});
window.addEventListener('pagehide', () => store.flush());
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { store.flush(); return; }
  // Nouvelle version installée : rechargement discret au retour dans l'application.
  if (updateReady && !discours.isBusy() && !editing()) { store.flush(); location.reload(); return; }
  const d = today();
  if (current && d !== ctx.day) { ctx.day = d; ensureStart(store, d); draw(); }
});
setInterval(() => {
  const d = today();
  if (current && d !== ctx.day && !editing()) { ctx.day = d; draw(); }
}, 60000);

boot();
