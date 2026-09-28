// Agent-Ready Score v1. Weights are documented in METHODOLOGY.md; keep both in sync.

// fix: plain-English action · tech: technical detail · effort: '5 min' | '30 min' | 'Needs web person'
function item(id, label, points, max, { fix, tech, effort }) {
  const passed = points >= max;
  return {
    id, label, points: Math.round(points * 10) / 10, max, passed,
    fix: passed ? null : fix, tech: passed ? null : tech, effort: passed ? null : effort,
  };
}

export function scoreSite(site) {
  const sd = site.structuredData;
  const allowedShare = site.aiAccess.filter((a) => a.allowed).length / site.aiAccess.length;
  const hasBooking = site.content.bookingLinks.length > 0 || sd.hasReserveAction;

  const categories = [
    {
      id: 'allowed',
      label: 'Allowed',
      description: 'AI assistants are allowed to read your website',
      items: [
        item('ai-crawlers', 'AI assistants allowed to read your site', 15 * allowedShare, 15, {
          fix: 'Unblock AI assistants so they can read your services and prices.',
          tech: 'In robots.txt, allow OAI-SearchBot, ChatGPT-User, Claude-User, PerplexityBot and Google-Extended.',
          effort: '5 min',
        }),
        item('https', 'Secure connection', site.https ? 5 : 0, 5, {
          fix: 'Turn on a secure connection (the padlock) for your website.',
          tech: 'Serve the site over HTTPS and redirect HTTP to HTTPS.',
          effort: 'Needs web person',
        }),
        item('speed', 'Website loads fast', site.responseMs < 3000 ? 5 : 0, 5, {
          fix: 'Make your homepage load faster; assistants skip slow pages.',
          tech: 'Homepage took over 3 s to respond. Compress images, use a CDN.',
          effort: 'Needs web person',
        }),
      ],
    },
    {
      id: 'understood',
      label: 'Understood',
      description: 'AI assistants know who you are, where you are and when you are open',
      items: [
        item('local-business', 'Your business is clearly identified', sd.localBusiness ? 8 : 0, 8, {
          fix: 'Add a hidden “business card” to your website that AI assistants read.',
          tech: 'Add a schema.org LocalBusiness (or HairSalon) JSON-LD block.',
          effort: '5 min',
        }),
        item('nap', 'Name, address and phone readable by AI', (sd.hasName + sd.hasAddress + sd.hasPhone) * 2, 6, {
          fix: 'Put your exact name, address and phone in that business card.',
          tech: 'Add name, address and telephone to your JSON-LD.',
          effort: '5 min',
        }),
        item('hours', 'Opening hours readable by AI', sd.hasHours ? 8 : site.content.mentionsHours ? 3 : 0, 8, {
          fix: 'Publish your opening hours in a format AI can read, not only as text or a picture.',
          tech: 'Add openingHoursSpecification to your JSON-LD.',
          effort: '5 min',
        }),
        item('meta', 'Clear description of what you do', (site.meta.title ? 2.5 : 0) + (site.meta.description ? 2.5 : 0), 5, {
          fix: 'Describe in one sentence what you do, where, and for whom.',
          tech: 'Write a descriptive <title> and meta description.',
          effort: '5 min',
        }),
      ],
    },
    {
      id: 'bookable',
      label: 'Bookable',
      description: 'AI assistants can quote your prices and send clients to book',
      items: [
        item('booking', 'Clients can be sent to book online', hasBooking ? (sd.hasReserveAction ? 15 : 11) : 0, 15, {
          fix: 'Give AI assistants a booking link they can send clients to.',
          tech: 'Link your online booking page and declare it as a schema.org ReserveAction.',
          effort: '5 min',
        }),
        item('prices', 'Prices available to AI', sd.hasPrices ? 10 : site.content.priceMentions >= 3 ? 6 : site.content.priceMentions > 0 ? 3 : 0, 10, {
          fix: 'Publish your service menu with prices so AI can answer “how much?”.',
          tech: 'Add services with prices as structured data (hasOfferCatalog / priceRange).',
          effort: '30 min',
        }),
      ],
    },
    {
      id: 'ai-files',
      label: 'AI-ready',
      description: 'Your site has the files AI assistants look for',
      items: [
        item('llms-txt', 'A summary page written for AI', site.llmsTxtFound ? 6 : 0, 6, {
          fix: 'Add a short summary page written for AI: services, prices, hours, booking link.',
          tech: 'Publish /llms.txt (llmstxt.org).',
          effort: '5 min',
        }),
        item('sitemap', 'Site map available', site.sitemapFound ? 4 : 0, 4, {
          fix: 'Add a site map so assistants find all your pages.',
          tech: 'Publish /sitemap.xml.',
          effort: 'Needs web person',
        }),
        item('mobile', 'Mobile-friendly', site.meta.viewport ? 3 : 0, 3, {
          fix: 'Make your website mobile-friendly.',
          tech: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
          effort: 'Needs web person',
        }),
      ],
    },
  ];

  for (const category of categories) {
    const raw = category.items.reduce((sum, i) => sum + i.points, 0);
    const max = category.items.reduce((sum, i) => sum + i.max, 0);
    category.score = Math.round((raw / max) * 100);
  }
  const total = categories.reduce((sum, c) => sum + c.items.reduce((s, i) => s + i.points, 0), 0);
  const max = categories.reduce((sum, c) => sum + c.items.reduce((s, i) => s + i.max, 0), 0);
  return { readiness: Math.round((total / max) * 100), categories };
}

export function prioritizedFixes(categories) {
  return categories.flatMap((c) => c.items).filter((i) => i.fix)
    .map((i) => ({
      id: i.id, label: i.label, fix: i.fix, tech: i.tech, effort: i.effort,
      pointsAvailable: Math.round(i.max - i.points),
      impact: i.max - i.points >= 8 ? 'High' : 'Medium',
    }))
    .sort((a, b) => b.pointsAvailable - a.pointsAvailable);
}

// Combine site readiness with AI visibility (only when at least one assistant was queried).
export function overallScore(readiness, visibility) {
  if (visibility == null) return readiness;
  return Math.round(readiness * 0.6 + visibility * 0.4);
}

// Bands mirror Lighthouse's red/orange/green so the scale reads instantly.
export function band(score) {
  if (score >= 80) return { id: 'good', label: 'Agent-ready' };
  if (score >= 50) return { id: 'ok', label: 'Partly visible' };
  return { id: 'bad', label: 'Invisible to AI' };
}

export function letter(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 65) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

export const grade = (score) => band(score).label;

// One-sentence verdict shown under the score.
export function headline(categories) {
  const byId = Object.fromEntries(categories.map((c) => [c.id, c.score]));
  if (byId.allowed < 60) return 'Some AI assistants are blocked from reading your website.';
  if (byId.understood >= 70 && byId.bookable < 50) return 'AI can find you, but can’t book you.';
  if (byId.understood < 50) return 'AI assistants can’t tell what you offer, where, or when.';
  if (byId.bookable < 70) return 'AI knows you, but can’t quote your prices or book clients.';
  return 'AI assistants can find, understand and book you.';
}
