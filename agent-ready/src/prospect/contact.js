import { fetchText } from '../fetch.js';

// Find the contact email a business publishes on its own website (homepage, then a contact page).
// Only addresses on the business's own domain or common mailbox providers are kept, so we never
// pick up agency, platform or tracking addresses.

const PERSONAL_PROVIDERS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'aol.com', 'me.com', 'live.com', 'msn.com', 'proton.me', 'protonmail.com'];
const IGNORE = /(example\.|sentry|wixpress|godaddy|squarespace|wordpress|schema\.org|domain\.com|email\.com|yourdomain|@2x|\.png|\.jpg|\.gif|\.webp|\.svg)/i;
const PREFERRED = ['hello', 'info', 'contact', 'book', 'bookings', 'appointments', 'salon', 'office', 'studio', 'team'];

export function rootDomain(hostname) {
  return hostname.replace(/^www\./, '').split('.').slice(-2).join('.');
}

function decodeEntities(s) {
  return s.replace(/&#64;|&commat;/gi, '@').replace(/&#46;|&period;/gi, '.').replace(/%40/g, '@');
}

export function extractEmails(html, siteUrl) {
  const domain = rootDomain(new URL(siteUrl).hostname);
  const text = decodeEntities(html);
  const found = new Set();
  for (const m of text.matchAll(/mailto:([^"'?\s>]+)/gi)) found.add(m[1].toLowerCase());
  for (const m of text.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)) found.add(m[0].toLowerCase());
  return [...found]
    .map((e) => e.replace(/[.,;:]+$/, ''))
    .filter((e) => !IGNORE.test(e))
    .filter((e) => {
      const emailDomain = e.split('@')[1];
      return rootDomain(emailDomain) === domain || PERSONAL_PROVIDERS.includes(emailDomain);
    });
}

export function pickBest(emails) {
  if (!emails.length) return null;
  const score = (e) => {
    const local = e.split('@')[0];
    const i = PREFERRED.findIndex((p) => local.startsWith(p));
    return i === -1 ? PREFERRED.length : i;
  };
  return [...emails].sort((a, b) => score(a) - score(b))[0];
}

export function findContactPage(html, siteUrl) {
  const m = html.match(/<a\b[^>]*href=["']([^"'#]*contact[^"']*)["']/i);
  if (!m) return null;
  try {
    const url = new URL(m[1], siteUrl);
    return url.hostname === new URL(siteUrl).hostname ? url.href : null;
  } catch {
    return null;
  }
}

export async function findEmail(siteUrl, homepageHtml) {
  let emails = extractEmails(homepageHtml, siteUrl);
  if (!emails.length) {
    const contactUrl = findContactPage(homepageHtml, siteUrl);
    if (contactUrl) {
      try {
        const page = await fetchText(contactUrl, { timeoutMs: 8000 });
        if (page.ok) emails = extractEmails(page.body, siteUrl);
      } catch {
        // No contact page reachable.
      }
    }
  }
  return pickBest(emails);
}
