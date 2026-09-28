// Ask AI assistants what they know about the business. Each provider is enabled only when its API key is set.
// Model names are configurable because providers rename models often.

const TIMEOUT_MS = 45000;

function prompt({ name, city, category }) {
  return `You are helping a consumer in ${city} find a ${category}.
1. List the 5 ${category} businesses in ${city} you would recommend first.
2. Then, about the business named "${name}" in ${city}: do you know it? What is its website? Where can someone book an appointment online? Do you know its prices and opening hours?
Answer ONLY with JSON of this shape:
{"recommendations": ["name", ...], "business": {"known": true|false, "website": "url or null", "booking_url": "url or null", "knows_prices": true|false, "knows_hours": true|false}}`;
}

export const PROVIDERS = [
  {
    id: 'chatgpt',
    label: 'ChatGPT (OpenAI)',
    envKey: 'OPENAI_API_KEY',
    async ask(text) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
          messages: [{ role: 'user', content: text }],
          response_format: { type: 'json_object' },
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}`);
      return (await res.json()).choices[0].message.content;
    },
  },
  {
    id: 'gemini',
    label: 'Gemini (Google)',
    envKey: 'GEMINI_API_KEY',
    async ask(text) {
      const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'content-type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text }] }] }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
      return (await res.json()).candidates[0].content.parts.map((p) => p.text).join('');
    },
  },
  {
    id: 'perplexity',
    label: 'Perplexity',
    envKey: 'PERPLEXITY_API_KEY',
    async ask(text) {
      const res = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: { authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({ model: process.env.PERPLEXITY_MODEL || 'sonar', messages: [{ role: 'user', content: text }] }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`Perplexity HTTP ${res.status}`);
      return (await res.json()).choices[0].message.content;
    },
  },
];

export function enabledProviders(env = process.env) {
  return PROVIDERS.filter((p) => env[p.envKey]);
}

export function parseAnswer(raw) {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('No JSON in answer');
  return JSON.parse(raw.slice(start, end + 1));
}

const normalize = (s) => String(s || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim();
const hostOf = (u) => {
  try {
    return new URL(u).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
};

export function nameMatches(candidate, name) {
  const a = normalize(candidate);
  const b = normalize(name);
  return Boolean(a && b) && (a === b || a.includes(b) || b.includes(a));
}

// Score one assistant's answer out of 100.
export function scoreAnswer(answer, { name, website }) {
  const recommended = (answer.recommendations || []).some((r) => nameMatches(r, name));
  const biz = answer.business || {};
  const siteHost = hostOf(website);
  const websiteCorrect = Boolean(siteHost && hostOf(biz.website) === siteHost);
  const hasBooking = Boolean(biz.booking_url && hostOf(biz.booking_url));
  const checks = {
    recommended,
    known: Boolean(biz.known),
    websiteCorrect,
    bookingFound: hasBooking,
    knowsPrices: Boolean(biz.knows_prices),
    knowsHours: Boolean(biz.knows_hours),
  };
  const points = recommended * 40 + checks.known * 15 + websiteCorrect * 15 + hasBooking * 10
    + checks.knowsPrices * 10 + checks.knowsHours * 10;
  return { score: points, checks };
}

export async function askAssistants(business, providers = enabledProviders()) {
  const text = prompt(business);
  const results = await Promise.all(providers.map(async (provider) => {
    try {
      const answer = parseAnswer(await provider.ask(text));
      return { id: provider.id, label: provider.label, ...scoreAnswer(answer, business), answer };
    } catch (error) {
      return { id: provider.id, label: provider.label, error: error.message };
    }
  }));
  const scored = results.filter((r) => r.score != null);
  const visibility = scored.length ? Math.round(scored.reduce((s, r) => s + r.score, 0) / scored.length) : null;
  return { visibility, results };
}
