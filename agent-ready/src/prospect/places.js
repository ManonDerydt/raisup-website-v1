// Find local businesses with the Google Places API (New) Text Search.
// Requires GOOGLE_PLACES_API_KEY. Check the Google Maps Platform terms on storing and displaying Places content
// before keeping this data longer than the campaign needs (place IDs may be stored; other fields have limits).

const FIELDS = [
  'places.id', 'places.displayName', 'places.formattedAddress', 'places.websiteUri',
  'places.nationalPhoneNumber', 'places.rating', 'places.userRatingCount', 'places.primaryType',
  'places.businessStatus', 'nextPageToken',
].join(',');

export function toProspect(place, { city, category }) {
  return {
    placeId: place.id,
    name: place.displayName?.text || '',
    address: place.formattedAddress || '',
    website: place.websiteUri || '',
    phone: place.nationalPhoneNumber || '',
    rating: place.rating ?? null,
    reviews: place.userRatingCount ?? 0,
    type: place.primaryType || '',
    city,
    category,
  };
}

export async function searchPlaces({ category, city, maxResults = 60, apiKey = process.env.GOOGLE_PLACES_API_KEY }) {
  if (!apiKey) throw new Error('GOOGLE_PLACES_API_KEY is not set');
  const prospects = [];
  let pageToken;
  do {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey, 'x-goog-fieldmask': FIELDS },
      body: JSON.stringify({ textQuery: `${category} in ${city}`, pageSize: 20, ...(pageToken ? { pageToken } : {}) }),
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`Places API HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    for (const place of data.places || []) {
      if (place.businessStatus && place.businessStatus !== 'OPERATIONAL') continue;
      prospects.push(toProspect(place, { city, category }));
    }
    pageToken = data.nextPageToken;
  } while (pageToken && prospects.length < maxResults);
  return prospects.slice(0, maxResults);
}
