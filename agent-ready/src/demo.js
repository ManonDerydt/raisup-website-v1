import { analyzeSite } from './checks/site.js';
import { scoreSite, overallScore, grade } from './score.js';

// A realistic sample report so the page can be demoed without live network access or API keys.
const DEMO_HTML = `<!doctype html><html><head><title>Bella Hair Co.</title><meta name="viewport" content="width=device-width">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness","name":"Bella Hair Co.","telephone":"+1-512-555-0142"}</script>
</head><body><h1>Bella Hair Co.</h1><p>Open Tue–Sat 9am–7pm</p><p>Cuts from $55</p><a href="tel:+15125550142">Call to book</a></body></html>`;

export function demoReport({ name = 'Bella Hair Co.', city = 'Austin, TX', category = 'hair salon' } = {}) {
  const site = analyzeSite({
    homepage: { body: DEMO_HTML, finalUrl: 'https://bellahair.example/', elapsedMs: 1850 },
    robotsTxt: 'User-agent: GPTBot\nDisallow: /\n\nUser-agent: *\nAllow: /',
    llmsTxt: null,
    sitemapFound: true,
  });
  const siteScore = scoreSite(site);
  const assistants = [
    { id: 'chatgpt', label: 'ChatGPT (OpenAI)', score: 25, checks: { recommended: false, known: true, websiteCorrect: false, bookingFound: false, knowsPrices: false, knowsHours: true } },
    { id: 'gemini', label: 'Gemini (Google)', score: 55, checks: { recommended: true, known: true, websiteCorrect: false, bookingFound: false, knowsPrices: false, knowsHours: false } },
    { id: 'perplexity', label: 'Perplexity', score: 40, checks: { recommended: false, known: true, websiteCorrect: true, bookingFound: false, knowsPrices: false, knowsHours: true } },
  ];
  const visibility = Math.round(assistants.reduce((s, a) => s + a.score, 0) / assistants.length);
  const score = overallScore(siteScore.readiness, visibility);
  const fixes = siteScore.categories.flatMap((c) => c.items).filter((i) => i.fix)
    .sort((a, b) => (b.max - b.points) - (a.max - a.points))
    .map((i) => ({ label: i.label, fix: i.fix, pointsAvailable: Math.round(i.max - i.points) }));
  return {
    demo: true,
    scannedAt: new Date().toISOString(),
    business: { name, city, category, url: site.url },
    score,
    grade: grade(score),
    readiness: siteScore.readiness,
    visibility,
    assistantsChecked: true,
    categories: siteScore.categories,
    assistants,
    fixes,
    site,
  };
}
