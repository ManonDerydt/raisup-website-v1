// Generates the files that make a service business readable and bookable by AI assistants.
// Input is what the owner confirms in the fix wizard; output is ready to paste or to host.

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SCHEMA_TYPES = {
  'hair salon': 'HairSalon',
  'barber shop': 'HairSalon',
  'beauty salon': 'BeautySalon',
  'nail salon': 'NailSalon',
  'day spa': 'DaySpa',
  restaurant: 'Restaurant',
  dentist: 'Dentist',
  plumber: 'Plumber',
  electrician: 'Electrician',
};

export function schemaType(category = '') {
  return SCHEMA_TYPES[category.toLowerCase()] || 'LocalBusiness';
}

function clean(value) {
  if (Array.isArray(value)) return value.map(clean).filter((v) => v !== undefined);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      const c = clean(v);
      if (c !== undefined && c !== '' && !(Array.isArray(c) && c.length === 0)) out[k] = c;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return value ?? undefined;
}

// hours: { Monday: [{ opens: '09:00', closes: '18:00' }], ... }
function hoursSpecification(hours = {}) {
  return DAYS.flatMap((day) => (hours[day] || []).map(({ opens, closes }) => ({
    '@type': 'OpeningHoursSpecification', dayOfWeek: day, opens, closes,
  })));
}

export function buildJsonLd(biz) {
  const services = biz.services || [];
  return clean({
    '@context': 'https://schema.org',
    '@type': schemaType(biz.category),
    name: biz.name,
    url: biz.website,
    telephone: biz.phone,
    email: biz.email,
    description: biz.description,
    image: biz.image,
    priceRange: biz.priceRange,
    address: biz.address && {
      '@type': 'PostalAddress',
      streetAddress: biz.address.street,
      addressLocality: biz.address.city,
      addressRegion: biz.address.region,
      postalCode: biz.address.postalCode,
      addressCountry: biz.address.country,
    },
    openingHoursSpecification: hoursSpecification(biz.hours),
    hasOfferCatalog: services.length ? {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, description: s.description },
        price: s.price != null ? String(s.price) : undefined,
        priceCurrency: s.price != null ? (biz.currency || 'USD') : undefined,
      })),
    } : undefined,
    potentialAction: biz.bookingUrl && {
      '@type': 'ReserveAction',
      target: { '@type': 'EntryPoint', urlTemplate: biz.bookingUrl, actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform'] },
      result: { '@type': 'Reservation', name: `Appointment at ${biz.name}` },
    },
    sameAs: biz.profiles,
  });
}

export function jsonLdSnippet(biz) {
  return `<script type="application/ld+json">\n${JSON.stringify(buildJsonLd(biz), null, 2)}\n</script>`;
}

function formatHours(hours = {}) {
  return DAYS.map((day) => {
    const slots = hours[day] || [];
    return `- ${day}: ${slots.length ? slots.map((s) => `${s.opens}–${s.closes}`).join(', ') : 'Closed'}`;
  }).join('\n');
}

const money = (price, currency = 'USD') => {
  if (price == null) return 'price on request';
  const symbol = { USD: '$', GBP: '£', EUR: '€', CAD: 'CA$', AUD: 'A$' }[currency] || `${currency} `;
  return `${symbol}${price}`;
};

// llms.txt: a plain-language brief that assistants can read in one request (https://llmstxt.org).
export function buildLlmsTxt(biz) {
  const a = biz.address || {};
  const lines = [
    `# ${biz.name}`,
    '',
    `> ${biz.description || `${biz.category || 'Local business'} in ${a.city || ''}`.trim()}`,
    '',
    '## Key facts',
    (biz.category || null) && `- Type: ${biz.category}`,
    (a.street || null) && `- Address: ${[a.street, a.city, a.region, a.postalCode].filter(Boolean).join(', ')}`,
    (biz.phone || null) && `- Phone: ${biz.phone}`,
    (biz.website || null) && `- Website: ${biz.website}`,
    (biz.bookingUrl || null) && `- Book online: ${biz.bookingUrl}`,
    (biz.priceRange || null) && `- Price range: ${biz.priceRange}`,
    '',
    '## Opening hours',
    formatHours(biz.hours),
  ];
  if (biz.services?.length) {
    lines.push('', '## Services and prices');
    for (const s of biz.services) {
      lines.push(`- ${s.name}: ${money(s.price, biz.currency)}${s.duration ? ` (${s.duration} min)` : ''}${s.description ? ` — ${s.description}` : ''}`);
    }
  }
  if (biz.policies) lines.push('', '## Policies', biz.policies);
  lines.push('', '## How to book', biz.bookingUrl
    ? `Book directly at ${biz.bookingUrl}. AI assistants may send customers to this link.`
    : `Call ${biz.phone || 'the business'} to book.`);
  return `${lines.filter((l) => l !== undefined && l !== false && l !== null).join('\n')}\n`;
}

export const ROBOTS_ADDITION = `# Let AI assistants read this site so they can recommend and book it
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /
`;

export function buildFixPack(biz) {
  return {
    jsonLd: jsonLdSnippet(biz),
    llmsTxt: buildLlmsTxt(biz),
    robotsTxt: ROBOTS_ADDITION,
  };
}
