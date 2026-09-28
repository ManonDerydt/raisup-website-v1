// Lightweight HTML extraction without dependencies. Good enough for scoring signals, not a full parser.

export const BOOKING_DOMAINS = [
  'fresha.com', 'booksy.com', 'vagaro.com', 'squareup.com/appointments', 'square.site', 'book.squareup.com',
  'mindbodyonline.com', 'mindbody.io', 'schedulicity.com', 'glossgenius.com', 'styleseat.com',
  'acuityscheduling.com', 'calendly.com', 'setmore.com', 'simplybook', 'timely.com', 'gettimely.com',
  'phorest.com', 'boulevard.io', 'joinblvd.com', 'zenoti.com', 'treatwell', 'opentable.com', 'resy.com',
  'exploretock.com', 'sevenrooms.com', 'zocdoc.com', 'housecallpro.com', 'jobber.com', 'booker.com',
];

const LOCAL_BUSINESS_TYPES = /LocalBusiness|HairSalon|BeautySalon|DaySpa|HealthAndBeautyBusiness|NailSalon|Restaurant|FoodEstablishment|Cafe|Bakery|Dentist|MedicalBusiness|MedicalClinic|Physician|AutoRepair|HomeAndConstructionBusiness|Plumber|Electrician|HVACBusiness|Locksmith|RoofingContractor|ProfessionalService|LegalService|AccountingService|SportsActivityLocation|ExerciseGym|Store|LodgingBusiness|Hotel|AnimalShelter|ChildCare|EntertainmentBusiness/;

export function extractJsonLd(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(re)) {
    try {
      const parsed = JSON.parse(match[1].trim());
      blocks.push(parsed);
    } catch {
      // Invalid JSON-LD is common; ignore the block.
    }
  }
  const nodes = [];
  const visit = (value) => {
    if (Array.isArray(value)) return value.forEach(visit);
    if (value && typeof value === 'object') {
      if (value['@type']) nodes.push(value);
      if (value['@graph']) visit(value['@graph']);
    }
  };
  blocks.forEach(visit);
  return nodes;
}

const typesOf = (node) => [].concat(node['@type'] || []).map(String);

export function findLocalBusiness(nodes) {
  return nodes.find((node) => typesOf(node).some((t) => LOCAL_BUSINESS_TYPES.test(t))) || null;
}

export function hasReserveAction(nodes) {
  const text = JSON.stringify(nodes);
  return /ReserveAction|ScheduleAction|OrderAction|"acceptsReservations"\s*:\s*(true|"true"|"yes"|"http)/i.test(text);
}

export function hasStructuredPrices(nodes) {
  const text = JSON.stringify(nodes);
  return /"priceRange"|"offers"|"price"\s*:|"makesOffer"|"hasOfferCatalog"|"hasMenu"|"menu"\s*:/i.test(text);
}

export function hasStructuredHours(business) {
  return Boolean(business && (business.openingHours || business.openingHoursSpecification));
}

export function extractLinks(html, baseUrl) {
  const links = [];
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"'#][^"']*)["']/gi)) {
    try {
      links.push(new URL(match[1], baseUrl).href);
    } catch {
      // Skip malformed hrefs.
    }
  }
  // Booking widgets are often embedded as iframes or scripts instead of links.
  for (const match of html.matchAll(/<(?:iframe|script)\b[^>]*src=["']([^"']+)["']/gi)) {
    try {
      links.push(new URL(match[1], baseUrl).href);
    } catch {
      // Skip malformed sources.
    }
  }
  return links;
}

export function findBookingLinks(links) {
  return [...new Set(links.filter((href) => BOOKING_DOMAINS.some((domain) => href.includes(domain))))];
}

export function visibleText(html) {
  return html
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export function countPriceMentions(text) {
  return (text.match(/(?:[$£€]\s?\d{1,4}(?:[.,]\d{2})?)|(?:\d{1,4}(?:[.,]\d{2})?\s?(?:€|USD|GBP|EUR))/g) || []).length;
}

export function mentionsHours(text) {
  return /\b(mon|tue|wed|thu|fri|sat|sun)[a-z]*\b[^.]{0,40}\d{1,2}(:\d{2})?\s?(am|pm)?/i.test(text)
    || /opening hours|business hours|hours of operation/i.test(text);
}

export function meta(html) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '';
  const description = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1]
    || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i)?.[1] || '';
  const viewport = /<meta[^>]*name=["']viewport["']/i.test(html);
  return { title, description: description.trim(), viewport };
}
