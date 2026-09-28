import { analyzeSite } from './checks/site.js';
import { scoreSite, overallScore, prioritizedFixes, band, letter, headline } from './score.js';

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
    { id: 'chatgpt', label: 'ChatGPT (OpenAI)', score: 25, quote: "I don't have reliable details about Bella Hair Co.'s services or prices. You may want to call them directly to ask about availability.", checks: { recommended: false, known: true, websiteCorrect: false, bookingFound: false, knowsPrices: false, knowsHours: true } },
    { id: 'gemini', label: 'Gemini (Google)', score: 55, quote: 'Bella Hair Co. is a hair salon in Austin known for cuts and color. I could not find an online booking page or a price list.', checks: { recommended: true, known: true, websiteCorrect: false, bookingFound: false, knowsPrices: false, knowsHours: false } },
    { id: 'perplexity', label: 'Perplexity', score: 40, quote: 'Bella Hair Co. (bellahair.example) is a salon in Austin. Hours appear to be Tuesday to Saturday; prices are not listed online.', checks: { recommended: false, known: true, websiteCorrect: true, bookingFound: false, knowsPrices: false, knowsHours: true } },
  ];
  const visibility = Math.round(assistants.reduce((s, a) => s + a.score, 0) / assistants.length);
  const score = overallScore(siteScore.readiness, visibility);
  return {
    demo: true,
    scannedAt: new Date().toISOString(),
    business: { name, city, category, url: site.url },
    score,
    band: band(score),
    letter: letter(score),
    headline: headline(siteScore.categories),
    readiness: siteScore.readiness,
    visibility,
    assistantsChecked: true,
    categories: siteScore.categories,
    assistants,
    fixes: prioritizedFixes(siteScore.categories),
    site,
  };
}
