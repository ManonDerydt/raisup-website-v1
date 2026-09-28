import { createOrb, prefersReducedMotion, bandColor } from './orb.js';

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));

/* ---------- Hero motion ---------- */
let heroOrb = null;
let motionOn = !prefersReducedMotion();
const words = ['ChatGPT', 'Gemini', 'Perplexity', 'Siri', 'Claude'];
let wordIndex = 0;
const rotWord = $('.rot-word');
setInterval(() => {
  if (!motionOn) return;
  rotWord.classList.add('out');
  setTimeout(() => {
    wordIndex = (wordIndex + 1) % words.length;
    rotWord.textContent = words[wordIndex];
    rotWord.classList.remove('out');
  }, 350);
}, 2600);

const motionToggle = $('#motion-toggle');
function setMotion(on) {
  motionOn = on;
  motionToggle.setAttribute('aria-pressed', String(!on));
  motionToggle.textContent = on ? 'Pause animation' : 'Play animation';
  document.querySelector('.chat-float').style.animationPlayState = on ? 'running' : 'paused';
  if (heroOrb) (on ? heroOrb.play() : heroOrb.pause());
}
motionToggle.addEventListener('click', () => setMotion(!motionOn));
if (!motionOn) setMotion(false);

idle(async () => {
  const stage = $('#hero-orb');
  heroOrb = await createOrb(stage, { score: Number(stage.dataset.score) });
  heroOrb.setScore(Number(stage.dataset.score));
  if (!motionOn) heroOrb.pause();
});

/* ---------- Scan flow ---------- */
const form = $('#scan-form');
const errorEl = $('#form-error');
const progress = $('#progress');
const results = $('#results');
let progressOrb = null;
let resultOrb = null;
let lastReport = null;

function runSteps(city) {
  progress.querySelectorAll('[data-city]').forEach((el) => { el.textContent = city || 'your city'; });
  const items = [...progress.querySelectorAll('.steps li')];
  items.forEach((li) => li.classList.remove('active', 'done'));
  let i = 0;
  items[0].classList.add('active');
  const timer = setInterval(() => {
    if (i < items.length - 1) {
      items[i].classList.replace('active', 'done');
      i += 1;
      items[i].classList.add('active');
    }
  }, 1400);
  return () => {
    clearInterval(timer);
    items.forEach((li) => { li.classList.remove('active'); li.classList.add('done'); });
  };
}

async function startScan(payload) {
  errorEl.textContent = '';
  results.hidden = true;
  progress.hidden = false;
  progress.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
  if (!progressOrb) progressOrb = await createOrb($('#progress-orb'), { score: 0 });
  progressOrb.setScore(0);
  let fake = 0;
  const pulse = setInterval(() => { fake = (fake + 7) % 100; progressOrb.setScore(fake); }, 400);
  const stopSteps = runSteps(payload.city);
  const minDelay = new Promise((r) => setTimeout(r, payload.demo ? 3200 : 1500));
  try {
    const [res] = await Promise.all([
      fetch('/api/scan', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }),
      minDelay,
    ]);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'The scan failed. Please check the address and try again.');
    lastReport = data;
    stopSteps();
    renderResults(data);
  } catch (error) {
    stopSteps();
    progress.hidden = true;
    errorEl.textContent = error.message;
    $('#url').focus();
  } finally {
    clearInterval(pulse);
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(form));
  if (!payload.url.trim()) {
    errorEl.textContent = 'Enter your website address, like yoursalon.com';
    $('#url').focus();
    return;
  }
  startScan(payload);
});

$('#demo-btn').addEventListener('click', () => startScan({ demo: true, name: 'Bella Hair Co.', city: 'Austin, TX' }));

/* ---------- Results ---------- */
const CHECK_LABELS = { recommended: 'Recommends you', known: 'Knows you', websiteCorrect: 'Right website', bookingFound: 'Booking link', knowsPrices: 'Prices', knowsHours: 'Hours' };

function projected(report) {
  const vis = report.visibility == null ? null : Math.min(100, report.visibility + 30);
  return vis == null ? 100 : Math.round(60 + 0.4 * vis);
}

function fixHtml(fix) {
  return `<div class="fix">
    <div class="fix-top">
      <span class="pill ${fix.impact === 'High' ? 'pill-bad' : 'pill-ok'}">${esc(fix.impact)} impact</span>
      <span class="tag">${esc(fix.effort)}</span>
      <span class="fix-pts">+${esc(fix.pointsAvailable)} pts</span>
    </div>
    <p class="fix-title">${esc(fix.fix)}</p>
    <details><summary>Show technical details</summary><p><code>${esc(fix.tech)}</code></p></details>
  </div>`;
}

function renderResults(r) {
  progress.hidden = true;
  const color = bandColor(r.score);
  const bandClass = `pill-${r.band.id}`;
  const date = new Date(r.scannedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const name = r.business.name || new URL(r.business.url).hostname.replace(/^www\./, '');
  const top = r.fixes.slice(0, 3);
  const rest = r.fixes.slice(3);
  const shareUrl = `${location.origin}/?ref=score`;
  const cardUrl = `/api/card.svg?score=${r.score}&name=${encodeURIComponent(name)}&city=${encodeURIComponent(r.business.city || '')}`;
  const shareText = `My salon scored ${r.score}/100 on the Agent-Ready Score. Can ChatGPT book yours?`;

  const quotes = r.assistants.filter((a) => a.quote);
  const assistantsBlock = r.assistantsChecked
    ? `${quotes.map((a) => `<blockquote class="quote"><p>“${esc(a.quote)}”</p><cite>${esc(a.label)} · ${esc(date)}</cite></blockquote>`).join('')}
       ${r.assistants.map((a) => `<div class="ai-row"><strong>${esc(a.label)}</strong>${a.error ? '<span class="muted">Unavailable</span>' : `<span class="ai-checks">${Object.entries(a.checks).map(([k, v]) => `<span class="tag ${v ? 'yes' : 'no'}">${v ? '✓' : '✗'} ${esc(CHECK_LABELS[k])}</span>`).join('')}</span>`}</div>`).join('')}`
    : `<p class="muted">Add your salon name and city to the scan to see what ChatGPT, Gemini and Perplexity say about you.</p>`;

  results.innerHTML = `
    ${r.demo ? '<p class="demo-note"><strong>Sample report.</strong> This is an example salon. Run a free scan on your own website to see yours.</p>' : ''}
    <div class="r-head">
      <div class="r-orb"><div class="orb-wrap"><div class="orb-stage" id="result-orb" aria-hidden="true"></div></div>
        <div class="r-number"><strong id="score-count">0</strong><span>out of 100</span></div></div>
      <div>
        <p class="r-meta">${esc(name)}${r.business.city ? ` · ${esc(r.business.city)}` : ''} · Scanned ${esc(date)}</p>
        <h2 class="r-title" id="results-title">${esc(r.headline)}</h2>
        <div class="r-badges"><span class="pill ${bandClass}">${esc(r.band.label)}</span>
          <span class="r-letter pill ${bandClass}" aria-label="Grade ${esc(r.letter)}">${esc(r.letter)}</span>
          ${r.visibility != null ? `<span class="tag">AI visibility ${r.visibility}</span>` : ''}<span class="tag">Site readiness ${r.readiness}</span></div>
        <div class="bars">${r.categories.map((c) => `<div class="bar" title="${esc(c.description)}"><span>${esc(c.label)}</span>
          <div class="bar-track"><div class="bar-fill" data-w="${c.score}" style="background:${bandColor(c.score)}"></div></div><b>${c.score}</b></div>`).join('')}</div>
      </div>
    </div>

    <div class="r-grid">
      <section class="card"><h3>What AI says about you right now</h3>${assistantsBlock}</section>
      <section class="card"><h3>Your top fixes</h3>${top.length ? top.map(fixHtml).join('') : '<p>Nothing major to fix. You’re agent‑ready.</p>'}</section>
      ${rest.length ? `<section class="card card-wide"><h3>${rest.length} more fixes</h3>
        <div class="locked" id="locked">${rest.map(fixHtml).join('')}
          <div class="gate" id="gate"><p><strong>Send me the full fix list</strong></p>
            <form id="gate-form"><label class="sr-only" for="gate-email">Email</label>
              <input id="gate-email" type="email" placeholder="you@yoursalon.com" required autocomplete="email">
              <button class="btn btn-primary" type="submit">Unlock all fixes</button></form>
            <small>Plus a free re-check in 30 days. No spam.</small><p class="form-error" id="gate-error" role="alert"></p></div>
        </div></section>` : ''}
    </div>

    <section class="upsell" id="fix">
      <div><h3>We’ll generate every fix for you.</h3>
        <p>Tell us your hours, services and booking link. We create everything AI needs, ready to paste on Wix, Squarespace or WordPress.</p>
        <p class="proj">Your score: ${r.score} → ${projected(r)} (est.)</p></div>
      <button class="btn btn-primary btn-large" id="open-wizard" type="button">Fix it for me</button>
    </section>
    <section class="card" id="wizard" hidden style="margin-top:20px"></section>

    <div class="share">
      <img src="${cardUrl}" alt="Share card: ${esc(name)} scored ${r.score} out of 100" width="240" height="126" loading="lazy">
      <a class="btn" href="${cardUrl}" download="agent-ready-score.svg">Download my score card</a>
      <a class="btn" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}">Share on X</a>
      <a class="btn" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}">Share on Facebook</a>
      <button class="btn" id="copy-link" type="button">Copy link</button>
    </div>`;

  results.hidden = false;
  results.focus({ preventScroll: true });
  results.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  $('#sticky-cta').hidden = false;

  // Reveal: count up, fill bars, light the orb.
  const counter = $('#score-count');
  counter.style.color = color;
  const duration = prefersReducedMotion() ? 0 : 1400;
  const start = performance.now();
  const tick = (now) => {
    const t = duration ? Math.min(1, (now - start) / duration) : 1;
    counter.textContent = Math.round(r.score * (1 - (1 - t) ** 3));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  requestAnimationFrame(() => results.querySelectorAll('.bar-fill').forEach((el) => { el.style.width = `${el.dataset.w}%`; }));
  if (resultOrb) resultOrb.dispose();
  createOrb($('#result-orb'), { score: r.score }).then((orb) => { resultOrb = orb; orb.setScore(r.score); });

  wireResultActions(r, shareText, shareUrl);
}

function wireResultActions(r, shareText, shareUrl) {
  const gateForm = $('#gate-form');
  if (gateForm) {
    gateForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = $('#gate-email').value.trim();
      const res = await fetch('/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, report: r, source: 'report' }) });
      if (!res.ok) { $('#gate-error').textContent = (await res.json()).error; return; }
      $('#locked').classList.remove('locked');
      $('#gate').remove();
    });
  }
  $('#copy-link').addEventListener('click', async (event) => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      event.target.textContent = 'Copied!';
    } catch {
      event.target.textContent = shareUrl;
    }
  });
  $('#open-wizard').addEventListener('click', () => openWizard(r));
}

/* ---------- Fix wizard ---------- */
function openWizard(r) {
  const wizard = $('#wizard');
  const booking = r.site?.content?.bookingLinks?.[0] || '';
  wizard.hidden = false;
  wizard.innerHTML = `<h3>Generate my fixes</h3>
    <form class="wizard" id="wizard-form">
      <div class="row">
        <label>Salon name<input name="name" required value="${esc(r.business.name || '')}"></label>
        <label>Website<input name="website" value="${esc(r.business.url || '')}"></label>
        <label>Phone<input name="phone" placeholder="+1 512 555 0142"></label>
        <label>Online booking link<input name="bookingUrl" value="${esc(booking)}" placeholder="https://www.fresha.com/…"></label>
      </div>
      <div class="row">
        <label>Street address<input name="street"></label>
        <label>City<input name="city" value="${esc((r.business.city || '').split(',')[0])}"></label>
        <label>State<input name="region" value="${esc((r.business.city || '').split(',')[1]?.trim() || '')}"></label>
        <label>ZIP<input name="postalCode"></label>
      </div>
      <label>Opening hours, one per line (e.g. “Tuesday 09:00-18:00”)<textarea name="hours">Tuesday 09:00-19:00
Wednesday 09:00-19:00
Thursday 09:00-19:00
Friday 09:00-19:00
Saturday 09:00-17:00</textarea></label>
      <label>Services and prices, one per line (e.g. “Women's cut - 65”)<textarea name="services">Women's cut - 65
Men's cut - 40
Balayage - 180
Blowout - 45</textarea></label>
      <button class="btn btn-primary" type="submit">Generate my fixes</button>
    </form>
    <div class="outputs" id="outputs"></div>`;
  wizard.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });

  $('#wizard-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const f = Object.fromEntries(new FormData(event.target));
    const hours = {};
    for (const line of f.hours.split('\n')) {
      const m = line.trim().match(/^(\w+)\s+(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/);
      if (m) (hours[m[1][0].toUpperCase() + m[1].slice(1).toLowerCase()] ||= []).push({ opens: m[2], closes: m[3] });
    }
    const services = f.services.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
      const m = line.match(/^(.*?)\s*[-–:]\s*\$?(\d+(?:\.\d{2})?)$/);
      return m ? { name: m[1], price: Number(m[2]) } : { name: line };
    });
    const biz = {
      name: f.name, category: r.business.category || 'hair salon', website: f.website, phone: f.phone || undefined,
      bookingUrl: f.bookingUrl || undefined, address: { street: f.street, city: f.city, region: f.region, postalCode: f.postalCode, country: 'US' },
      hours, services,
    };
    const res = await fetch('/api/fix', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(biz) });
    const pack = await res.json();
    const out = (title, where, body) => `<div class="output"><header><span>${title}</span><button class="btn btn-small" type="button" data-copy>Copy</button></header>
      <p class="muted" style="padding:10px 14px 0;font-size:13px">${where}</p><pre>${esc(body)}</pre></div>`;
    $('#outputs').innerHTML = [
      out('1 · Business card for AI', 'Paste into your site’s header code (Wix: Settings → Custom code · Squarespace: Settings → Code injection · WordPress: a header plugin).', pack.jsonLd),
      out('2 · AI summary page (llms.txt)', 'Upload as a file named llms.txt at the root of your website, or let us host it for you.', pack.llmsTxt),
      out('3 · Let AI assistants in (robots.txt)', 'Add these lines to your robots.txt file.', pack.robotsTxt),
    ].join('');
    $('#outputs').querySelectorAll('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(btn.closest('.output').querySelector('pre').textContent);
      btn.textContent = 'Copied!';
    }));
  });
}

/* ---------- Agency form ---------- */
$('#agency-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = $('#agency-email').value.trim();
  const res = await fetch('/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, source: 'agency' }) });
  $('#agency-note').textContent = res.ok ? 'Thanks! We’ll send your white-label access within one business day.' : (await res.json()).error;
});

// Deep link: /?demo=1 opens the sample report directly.
if (new URLSearchParams(location.search).has('demo')) startScan({ demo: true, name: 'Bella Hair Co.', city: 'Austin, TX' });
