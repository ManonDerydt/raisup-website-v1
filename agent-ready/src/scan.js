import { scanSite } from './checks/site.js';
import { askAssistants, enabledProviders } from './checks/assistants.js';
import { scoreSite, overallScore, prioritizedFixes, band, letter, headline } from './score.js';

export async function scan({ url, name, city, category = 'hair salon' }) {
  const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  const site = await scanSite(normalizedUrl);
  const siteScore = scoreSite(site);

  const canAsk = name && city && enabledProviders().length > 0;
  const assistants = canAsk
    ? await askAssistants({ name, city, category, website: site.url })
    : { visibility: null, results: [] };

  const score = overallScore(siteScore.readiness, assistants.visibility);

  return {
    scannedAt: new Date().toISOString(),
    business: { name: name || null, city: city || null, category, url: site.url },
    score,
    band: band(score),
    letter: letter(score),
    headline: headline(siteScore.categories),
    readiness: siteScore.readiness,
    visibility: assistants.visibility,
    assistantsChecked: assistants.results.length > 0,
    categories: siteScore.categories,
    assistants: assistants.results,
    fixes: prioritizedFixes(siteScore.categories),
    site,
  };
}
