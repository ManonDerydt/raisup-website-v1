import { fetchText } from '../fetch.js';
import { checkAiAccess, parseRobots, isRootBlocked } from './robots.js';
import {
  extractJsonLd, findLocalBusiness, hasReserveAction, hasStructuredPrices, hasStructuredHours,
  extractLinks, findBookingLinks, visibleText, countPriceMentions, mentionsHours, meta,
} from './html.js';

async function tryFetch(url) {
  try {
    return await fetchText(url, { timeoutMs: 8000 });
  } catch {
    return null;
  }
}

// Pure extraction from already-fetched documents; kept separate so tests can run offline.
export function analyzeSite({ homepage, robotsTxt, llmsTxt, sitemapFound }) {
  const html = homepage.body;
  const nodes = extractJsonLd(html);
  const business = findLocalBusiness(nodes);
  const text = visibleText(html);
  const links = extractLinks(html, homepage.finalUrl);
  const bookingLinks = findBookingLinks(links);
  const pageMeta = meta(html);

  return {
    url: homepage.finalUrl,
    https: homepage.finalUrl.startsWith('https://'),
    responseMs: homepage.elapsedMs,
    meta: pageMeta,
    structuredData: {
      jsonLdNodes: nodes.length,
      localBusiness: business ? [].concat(business['@type']).join(', ') : null,
      hasName: Boolean(business?.name),
      hasAddress: Boolean(business?.address),
      hasPhone: Boolean(business?.telephone),
      hasHours: hasStructuredHours(business),
      hasPrices: hasStructuredPrices(nodes),
      hasReserveAction: hasReserveAction(nodes),
    },
    content: {
      priceMentions: countPriceMentions(text),
      mentionsHours: mentionsHours(text),
      bookingLinks,
    },
    aiAccess: checkAiAccess(robotsTxt),
    robotsTxtFound: robotsTxt != null,
    llmsTxtFound: Boolean(llmsTxt && llmsTxt.trim().length > 20),
    sitemapFound,
  };
}

// Returns the analysis plus the homepage HTML (used by the campaign builder to find a contact email).
export async function scanSiteWithHtml(rawUrl) {
  // Respect the site's robots.txt for our own scanner before reading the homepage.
  const preflight = await tryFetch(`${new URL(rawUrl).origin}/robots.txt`);
  if (preflight?.ok && !/text\/html/i.test(preflight.contentType) && isRootBlocked(parseRobots(preflight.body), 'AgentReadyScanner')) {
    throw new Error('This website asks automated tools not to read it, so we can’t scan it.');
  }
  const homepage = await fetchText(rawUrl);
  if (!homepage.ok) throw new Error(`The website answered with HTTP ${homepage.status}`);
  const origin = new URL(homepage.finalUrl).origin;
  const [robots, llms, sitemap] = await Promise.all([
    tryFetch(`${origin}/robots.txt`),
    tryFetch(`${origin}/llms.txt`),
    tryFetch(`${origin}/sitemap.xml`),
  ]);
  const plainText = (res) => (res?.ok && !/text\/html/i.test(res.contentType) ? res.body : null);
  const site = analyzeSite({
    homepage,
    robotsTxt: plainText(robots),
    llmsTxt: plainText(llms),
    sitemapFound: Boolean(sitemap?.ok && /<(urlset|sitemapindex)/i.test(sitemap.body)),
  });
  return { site, html: homepage.body };
}

export async function scanSite(rawUrl) {
  return (await scanSiteWithHtml(rawUrl)).site;
}
