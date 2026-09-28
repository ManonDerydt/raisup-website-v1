// Agent-Ready Score v1. Weights are documented in METHODOLOGY.md; keep both in sync.

function item(id, label, points, max, fix) {
  return { id, label, points: Math.round(points * 10) / 10, max, passed: points >= max, fix: points >= max ? null : fix };
}

export function scoreSite(site) {
  const sd = site.structuredData;
  const allowedShare = site.aiAccess.filter((a) => a.allowed).length / site.aiAccess.length;
  const hasBooking = site.content.bookingLinks.length > 0 || sd.hasReserveAction;

  const categories = [
    {
      id: 'access',
      label: 'AI assistants can read your site',
      items: [
        item('ai-crawlers', 'AI crawlers allowed in robots.txt', 15 * allowedShare, 15,
          'Allow OAI-SearchBot, ChatGPT-User, Claude-User, PerplexityBot and Google-Extended in robots.txt.'),
        item('https', 'Secure connection (HTTPS)', site.https ? 5 : 0, 5, 'Serve the site over HTTPS.'),
        item('speed', 'Homepage responds in under 3 seconds', site.responseMs < 3000 ? 5 : 0, 5,
          'Speed up the homepage; assistants give up on slow pages.'),
      ],
    },
    {
      id: 'understand',
      label: 'AI assistants understand your business',
      items: [
        item('local-business', 'Business identified in structured data (schema.org)', sd.localBusiness ? 8 : 0, 8,
          'Add a schema.org LocalBusiness (or HairSalon, Restaurant, …) JSON-LD block.'),
        item('nap', 'Name, address and phone in structured data',
          (sd.hasName + sd.hasAddress + sd.hasPhone) * 2, 6, 'Add name, address and telephone to your JSON-LD.'),
        item('hours', 'Opening hours machine-readable',
          sd.hasHours ? 8 : site.content.mentionsHours ? 3 : 0, 8,
          'Publish openingHoursSpecification in JSON-LD, not only as text or an image.'),
        item('meta', 'Clear page title and description',
          (site.meta.title ? 2.5 : 0) + (site.meta.description ? 2.5 : 0), 5,
          'Write a title and meta description stating what you do, where, and for whom.'),
      ],
    },
    {
      id: 'act',
      label: 'AI assistants can quote and book you',
      items: [
        item('prices', 'Prices available to assistants',
          sd.hasPrices ? 10 : site.content.priceMentions >= 3 ? 6 : site.content.priceMentions > 0 ? 3 : 0, 10,
          'Publish your service menu with prices, ideally as structured data (offers / priceRange).'),
        item('booking', 'Online booking an assistant can reach',
          hasBooking ? (sd.hasReserveAction ? 15 : 11) : 0, 15,
          'Link your online booking page and declare it as a ReserveAction in structured data.'),
      ],
    },
    {
      id: 'ai-docs',
      label: 'AI-specific files',
      items: [
        item('llms-txt', 'llms.txt summary for AI assistants', site.llmsTxtFound ? 6 : 0, 6,
          'Publish /llms.txt: a plain-text summary of services, prices, hours and booking link.'),
        item('sitemap', 'Sitemap available', site.sitemapFound ? 4 : 0, 4, 'Publish /sitemap.xml.'),
        item('mobile', 'Mobile-friendly page', site.meta.viewport ? 3 : 0, 3, 'Add a responsive viewport meta tag.'),
      ],
    },
  ];

  for (const category of categories) {
    category.points = Math.round(category.items.reduce((sum, i) => sum + i.points, 0));
    category.max = category.items.reduce((sum, i) => sum + i.max, 0);
  }
  const total = categories.reduce((sum, c) => sum + c.items.reduce((s, i) => s + i.points, 0), 0);
  const max = categories.reduce((sum, c) => sum + c.max, 0);
  return { readiness: Math.round((total / max) * 100), categories };
}

// Combine site readiness with AI visibility (only when at least one assistant was queried).
export function overallScore(readiness, visibility) {
  if (visibility == null) return readiness;
  return Math.round(readiness * 0.6 + visibility * 0.4);
}

export function grade(score) {
  if (score >= 80) return 'Agent-ready';
  if (score >= 60) return 'Partly ready';
  if (score >= 40) return 'Hard for AI to use';
  return 'Invisible to AI agents';
}
