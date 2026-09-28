# Can a third-party startup let AI assistants book salons/spas on non-Fresha platforms? (API access audit, as of 28 Sep 2026)

Method note: research done 28 Sep 2026. Most official developer portals were BLOCKED by the research proxy (developer.squareup.com, developers.joinblvd.com, developers.acuityscheduling.com, developer.timely.com, www.timely.com, support.schedulicity.com, usecarly.com). For those, findings rely on search-engine snippets of the official pages and are flagged "[snippet]". Several claims come from secondary aggregators (Supergood, API Evangelist, usecarly.com "Carly" blog, AgentZap) that profile these APIs; they are marked "[secondary]". Anything not confirmed is marked "[UNVERIFIED]". Background already known (not re-researched): Fresha ChatGPT/Claude native booking (4 Aug 2026); Square ChatGPT app + Claude plugin (1 Jul 2026, restaurants live, appointments "coming soon"); Google AI Mode books beauty via Booksy, Fresha, Vagaro.

## Q1. Which platforms expose a public API that can read services/availability AND create a booking for a customer?

### Takeaway
Technically bookable via API: Square, Acuity, Vagaro, Mindbody (+Booker), Boulevard, Setmore, SimplyBook.me, Phorest, Zenoti, and Booksy (partner-only). No API: GlossGenius, StyleSeat. Unclear: Timely (salon), Schedulicity.

### Cited Findings

**Square Appointments**
- Bookings API is GA; `POST /v2/bookings` creates a booking; there are availability search, list, retrieve endpoints. — [Square API ref: Create booking](https://developer.squareup.com/reference/square/bookings-api/create-booking); [Bookings API overview](https://developer.squareup.com/docs/bookings-api/what-it-is); [GA blog](https://developer.squareup.com/blog/build-with-bookings-api-now-generally-available/) [snippet]
- Two permission models. "Buyer-level" (scope APPOINTMENTS_WRITE): app can create bookings on behalf of customers, sees only bookings it created, cannot double-book or book outside business hours. "Seller-level" (APPOINTMENTS_ALL_WRITE) gives full calendar control. — [Bookings API concepts](https://developer.squareup.com/docs/bookings-api/get-ready-to-use-the-api); [Forum launch post](https://developer.squareup.com/forums/t/bookings-api-seller-scoped-permissions-launch-access-data-and-webhooks-for-all-bookings/4872) [snippet]
- "With the free subscription plan, you can call the Bookings API to create, update or cancel buyer-level bookings"; seller-level writes require Appointments Plus or Premium. — [Bookings API](https://developer.squareup.com/docs/bookings-api/what-it-is) [snippet]
- This buyer-level model is exactly the "third-party consumer booking app" pattern.

**Acuity Scheduling (Squarespace)**
- API "allows you to manage most aspects of scheduling... including creating and modifying appointments, managing availability"; docs show fetching appointment types, finding available dates/times, and creating appointments. — [Acuity Developer Hub](https://developers.acuityscheduling.com/); [Getting started](https://developers.acuityscheduling.com/docs/getting-started) [snippet]

**Vagaro**
- Developer surface at docs.vagaro.com: OAuth-style access token, REST areas Employee Management, Locations, Appointments, Customers, Employees; webhooks for appointments, customers, transactions etc. — [API Evangelist profile](https://github.com/api-evangelist/vagaro) [secondary]; [Vagaro Support – Developer Features](https://support.vagaro.com/hc/en-us/categories/34949493949851-Developer-Features)
- Described as "read and write ... appointments, customer records, services, and provider availability." — [Supergood Vagaro API](https://supergood.ai/docs/vagaro-api) [secondary]. Whether a documented "create appointment" endpoint with availability search exists for external booking is [UNVERIFIED] — full reference only visible after approval ([AgentZap guide](https://agentzap.ai/blog/how-to-enable-vagaro-api-and-webhooks-complete-setup-guide-2026) [secondary]).

**Booksy**
- Booksy Public API (partner-facing REST, version 0.3): list appointments, "creating or rescheduling bookings while honoring per-business booking rules, lead times, and deposit requirements"; RSA-JWT auth with sandbox + production keys. — [Booksy Public API docs](https://docs.booksy.com/v01.html); [APIs.io profile](https://apis.io/apis/booksy/booksy-public-api/) [secondary]
- Docs return HTTP 401 to the public; OAuth app registration requires contacting Booksy. — [API Evangelist Booksy](https://github.com/api-evangelist/booksy) [secondary]

**GlossGenius**
- "GlossGenius does not currently have an API", publishes no developer docs, no Zapier listing, no partner program. — [usecarly GlossGenius AI](https://www.usecarly.com/blog/glossgenius-ai/) [secondary, snippet]; consistent with [API Evangelist profile](https://github.com/api-evangelist/glossgenius) [secondary]

**Mindbody (+ Booker)**
- Public API v6 at `https://api.mindbodyonline.com/public/v6`; supports booking a single appointment for a client with a staff member at a time ("gated behind a booking permissions flag"), class bookings, client lookup. — [Mindbody Developer Portal](https://developers.mindbodyonline.com/); [Tray.ai connector docs](https://tray.ai/documentation/connectors/service/mindbody) [secondary]
- Booker has a separate API ("Introduction to Mindbody Booker API"), plus legacy Azure portal developers.booker.com. Booker, Mindbody, ClassPass unified under parent brand Playlist (June 2025). — [Mindbody Booker API intro](https://developers.mindbodyonline.com/ui/documentation/booker-api); [developers.booker.com](https://developers.booker.com/); [Wikipedia Booker](https://en.wikipedia.org/wiki/Booker_Software). Booker API's current booking capability: [UNVERIFIED].

**Boulevard**
- GraphQL "Client API" for custom booking experiences + "Admin API"; official booking SDK `@boulevard/blvd-book-sdk` and `create-booking-flow` React template (availability → cart → checkout). — [Boulevard Developer Portal](https://developers.joinblvd.com/); [Boulevard/book-sdk GitHub](https://github.com/Boulevard/book-sdk); [create-booking-flow](https://github.com/Boulevard/create-booking-flow)

**Setmore**
- REST API with OAuth 2.0; create/update/cancel appointments, services, staff, slots (docs on Apiary). — [Setmore developers page](https://www.setmore.com/developers); [Pipedream Create Appointment action](https://pipedream.com/apps/setmoreappointments/actions/create-appointment)

**SimplyBook.me**
- JSON-RPC API; `book` method "performs all necessary validations and registers a new booking"; public service methods cover services, performers, available time slots. — [Company public service methods](https://help.simplybook.me/index.php/Company_public_service_methods); [API docs](https://simplybook.me/en/api/developer-api)

**Timely (NZ salon software, gettimely/timely.com)**
- Timely states it has a public API using OAuth 2.0, with OAuth apps created in-product by an admin. — [Timely handbook: Getting started with Timely's API](https://www.timely.com/help/handbook/tips-tricks/getting-started-with-timelys-api/) [snippet; page blocked]; [developer.timely.com](https://developer.timely.com/) [blocked]
- CAUTION: dev.timelyapp.com is a different company (Timely time-tracking); don't confuse. — [dev.timelyapp.com](https://dev.timelyapp.com/)
- Whether salon Timely API can create bookings: [UNVERIFIED].

**Phorest**
- Explicit "Create a booking" and "Activate a booking" endpoints in the Phorest API reference; API covers clients, appointments, staff, services. — [Phorest: Create a booking](https://developer.phorest.com/reference/createbooking); [Activate a booking](https://developer.phorest.com/reference/activatebooking); [Phorest API common use cases](https://support.phorest.com/hc/en-us/articles/360018509380-Phorest-API-Common-Use-Cases)

**Zenoti**
- "Create a service booking" → reserve slot → confirm flow; list services/therapists of a center; 200+ endpoints. — [Zenoti: Service Booking APIs](https://docs.zenoti.com/docs/service-booking-apis); [Create a service booking](https://docs.zenoti.com/reference/create-a-service-booking-copy); [Reserve a slot](https://docs.zenoti.com/reference/reserve-a-slot-for-a-service-booking)

**Schedulicity**
- Official support article titled "Does Schedulicity have an open API?" exists but was blocked; third-party directories conflict (some say API + Zapier, others say none). — [Schedulicity support](https://support.schedulicity.com/en/articles/3566732-does-schedulicity-have-an-open-api) [blocked]; [GetApp](https://www.getapp.com/customer-management-software/a/schedulicity/) [secondary]. Status [UNVERIFIED]; lean "no public booking API" (no developer docs found).

**StyleSeat**
- No public API; integration only via Zapier-type automation per directories. — [SourceForge StyleSeat integrations](https://sourceforge.net/software/product/StyleSeat/integrations/) [secondary]; [API Evangelist profile](https://github.com/api-evangelist/styleseat) [secondary]. [Partly UNVERIFIED: official statement not found]

### Inferences
- The platforms that are the biggest pure-beauty US players outside Fresha (GlossGenius, StyleSeat, Booksy) are the least open. The open ones (Square, Acuity, Setmore, SimplyBook) are horizontal schedulers, not salon-specialist.
- Square's buyer-level booking scope is the only one clearly designed for third-party consumer booking and available on a free seller plan.

### Gaps
- Could not open official Square, Acuity, Boulevard, Timely, Schedulicity pages directly (proxy); relied on snippets.
- Vagaro's exact appointment-create endpoint and availability search unverified (docs behind approval).

## Q2. Access model and terms (self-serve / merchant OAuth / partner-only / enterprise / paid)

### Takeaway
Every workable path requires per-merchant authorization; only Square and (partly) Acuity/Timely support standard multi-merchant OAuth. Vagaro, Mindbody, Phorest, Zenoti, Setmore need a per-salon request/activation; Booksy is partner-only; Boulevard is Enterprise-tier only.

### Cited Findings
- **Square**: self-serve developer account; merchant OAuth with granular scopes; buyer-level booking works on free Appointments plan, seller-level needs Plus/Premium. — [Bookings API](https://developer.squareup.com/docs/bookings-api/what-it-is) [snippet]; App Marketplace listing requires first being approved as a Square App Partner and meeting API usage requirements. — [App Marketplace requirements](https://developer.squareup.com/docs/app-marketplace/requirements); [App Partner program](https://squareup.com/us/en/partnerships/app-partner)
- **Acuity**: OAuth2 (`scope=api-v1`) for multi-account apps, obtained by filling an "OAuth partner" registration form — [Acuity OAuth register](https://acuityscheduling.com/oauth2/register); [acuity-js](https://github.com/AcuityScheduling/acuity-js). API access for a merchant requires Premium plan (formerly Powerhouse). — [Acuity Help: custom CSS, webhooks, APIs](https://help.acuityscheduling.com/hc/en-us/articles/16676949253389-Using-custom-CSS-webhooks-and-APIs) [snippet]
- **Vagaro**: salon owner requests from Settings → Developers → APIs & Webhooks; needs paid non-trial subscription with card processing; manual review ~5–7 business days; $10/month incl. 5,000 calls, $0.002/extra call. — [AgentZap guide](https://agentzap.ai/blog/how-to-enable-vagaro-api-and-webhooks-complete-setup-guide-2026) [secondary]; [Vagaro Support Developer Features](https://support.vagaro.com/hc/en-us/categories/34949493949851-Developer-Features). Model = per-merchant credentials (Client ID/secret), not a multi-tenant partner OAuth [inference, UNVERIFIED].
- **Booksy**: partner-only; contact Booksy; no self-serve. — [API Evangelist Booksy](https://github.com/api-evangelist/booksy) [secondary]; [Supergood Booksy](https://supergood.ai/docs/booksy-api) [secondary]
- **GlossGenius**: no API, no partner program. — [usecarly](https://www.usecarly.com/blog/glossgenius-ai/) [secondary]
- **Mindbody**: developer account + free sandbox → request "Live Access" with billing → manual review → per-site activation code the studio owner enters (Manager Tools → Mindbody Add Ons → API Integrations). Free under 5,000 calls/billing cycle, then ~$0.002/call. — [Mindbody Developer Portal](https://developers.mindbodyonline.com/); [API fees Q&A](https://developers.mindbodyonline.com/community/questions/46/how-much-are-api-fees.html); [Mindbody API FAQ](https://support.mindbodyonline.com/s/article/API-FAQ?language=en_US); [usecarly Mindbody API](https://www.usecarly.com/blog/mindbody-api/) [secondary]
- **Boulevard**: "Only Enterprise tier customers have access to these APIs and custom apps"; sandbox via dev-support@blvd.co. — [Boulevard Developer Portal](https://developers.joinblvd.com/) [snippet]; [book-sdk README](https://github.com/Boulevard/book-sdk)
- **Setmore**: requires Setmore Pro account; email api@setmore.com to request access. — [Setmore Support: Request Access to the API](https://support.setmore.com/en/articles/579360-request-access-to-the-setmore-api)
- **SimplyBook.me**: self-serve — merchant enables "API" custom feature in admin; Free plan includes 1 custom feature, Basic 3, Standard 8, Premium unlimited; Enterprise adds High Load API. — [API custom feature](https://help.simplybook.me/index.php/API_custom_feature); [Pricing](https://simplybook.me/en/pricing)
- **Timely**: OAuth app created in-product by account admin. — [Timely handbook](https://www.timely.com/help/handbook/tips-tricks/getting-started-with-timelys-api/) [snippet]
- **Phorest**: request via api-requests@phorest.com quoting the business's account number; HTTP Basic auth per business/branch; "Third-party software providers wishing to partner with Phorest might be subject to integration charges." — [Getting Started with Phorest API](https://support.phorest.com/hc/en-us/articles/360018509300-Getting-Started-with-Phorest-API); [Integrating 3rd party solutions](https://support.phorest.com/hc/en-us/articles/360018547979-Integrating-3rd-Party-E-Commerce-Solutions)
- **Zenoti**: no public self-serve signup; existing customer generates app ID/secret/API key in backend; key valid one year. — [Zenoti: create backend app and API key](https://help.zenoti.com/en/zenoti-apis/create-the-backend-app-and-generate-a-new-api-key.html); [Supergood Zenoti](https://supergood.ai/docs/zenoti-api) [secondary]
- **Schedulicity / StyleSeat**: no documented access path found. — see Q1 sources.

### Inferences
- A startup can reach Square, Acuity, SimplyBook, Timely merchants with a normal "Connect your account" OAuth flow. For Vagaro, Mindbody, Phorest, Zenoti, Setmore, each salon must request/activate access (friction: days, fees), so onboarding is per-salon sales, not self-serve scale.
- Payments/deposits: most salon APIs create bookings but deposit/card-on-file capture typically runs through the platform's own processor — a connector may be limited to no-deposit services [inference, UNVERIFIED per platform].

### Gaps
- I did not find or read explicit developer ToS clauses forbidding aggregators/marketplace booking for any platform (Square, Vagaro, Mindbody, Acuity terms pages not accessible or not found). Must be checked before building — Booksy/Vagaro/Mindbody/StyleSeat all run their own consumer marketplaces and are likely to restrict competing consumer aggregation [inference].

## Q3. Official AI assistant integrations and community MCP servers

### Takeaway
Among the 14, only Square has an official MCP server (plus its July 2026 ChatGPT app/Claude plugin); Booksy and Vagaro are in Google AI Mode. No official ChatGPT/Claude booking integration found for Vagaro, Booksy, GlossGenius, Mindbody, Boulevard, Acuity, Setmore, SimplyBook, Timely, Phorest, Zenoti, Schedulicity, StyleSeat. Community MCP servers exist for Mindbody, Acuity, Boulevard, Zenoti, SimplyBook (all tiny, 0–12 stars).

### Cited Findings
- **Square official MCP server** (beta), remote at `https://mcp.squareup.com/mcp` (and /sse), OAuth login with granular scopes, covering payments, catalog, customers, **bookings** and ~30 other APIs. — [Square MCP docs](https://developer.squareup.com/docs/mcp) [snippet]; [PulseMCP listing](https://www.pulsemcp.com/servers/square). Launch date [UNVERIFIED here; believed 2025].
- **Booksy**: Google AI Mode launch partner Aug 2025, expanded Nov 2025; "Neither ChatGPT nor Claude ships a Booksy connector, and there is no official Booksy MCP server." — [usecarly Booksy AI](https://www.usecarly.com/blog/booksy-ai/) [secondary, snippet]
- **Vagaro**: listed among Google AI Mode booking partners (with Booksy, Fresha). — [Google blog: agentic booking in AI Mode](https://blog.google/products-and-platforms/products/search/agentic-plans-booking-travel-canvas-ai-mode/) [snippet; exact date of Vagaro mention UNVERIFIED]. Vagaro's own AI ("Vera", "Connect AI") is in-product, not a ChatGPT/Claude app. — [usecarly Vagaro AI](https://www.usecarly.com/blog/vagaro-ai/) [secondary]. No Vagaro MCP repos on GitHub (search "vagaro mcp" = 0 results, 28 Sep 2026).
- **Mindbody**: no official MCP server as of May 2026; a community server (NoBanks/mindbody-mcp) was built in response to Mindbody's 28 May 2026 Bilt Rewards distribution partnership. — [NoBanks/mindbody-mcp](https://github.com/NoBanks/mindbody-mcp); [Glama listing](https://glama.ai/mcp/servers/NoBanks/mindbody-mcp). Other community: [vespo92/MindbodyMCP](https://github.com/vespo92/MindbodyMCP) (9★, updated Sep 2026), [welsakka/mindbody-mcp](https://github.com/welsakka/mindbody-mcp); Composio offers a Mindbody MCP toolkit — [Composio](https://composio.dev/toolkits/mindbody).
- **Acuity**: community [walakaka77/acuity-mcp](https://github.com/walakaka77/acuity-mcp) (Aug 2026, 0★), [BusyBee3333/acuity-scheduling-mcp-2026-complete](https://github.com/BusyBee3333/acuity-scheduling-mcp-2026-complete) (Feb 2026, 0★). A blog reviews "Claude + Acuity Scheduling: what the integration can and can't do in 2026". — [usecarly](https://www.usecarly.com/blog/claude-acuity-scheduling-integration/) [secondary, not read]
- **Boulevard**: community [austinntowns/blvd-mcp-server](https://github.com/austinntowns/blvd-mcp-server) (Mar 2026, operations-focused, not consumer booking).
- **Zenoti**: community [tacit-code/zenoti-mcp-server](https://github.com/tacit-code/zenoti-mcp-server) (appointments, guests; updated Aug 2026), auto-generated [ag2-mcp-servers/zenoti-api](https://github.com/ag2-mcp-servers/zenoti-api).
- **SimplyBook.me**: "doesn't publish an MCP server"; community [pgallar/simplybook-mcp](https://github.com/pgallar/simplybook-mcp). — [Supergood report card](https://supergood.ai/api-report-card/simplybook-me) [secondary]
- GitHub search found no MCP repos for Booksy (0) or Vagaro (0); GlossGenius, StyleSeat, Schedulicity, Setmore, Phorest, Timely not specifically searched individually beyond combined query [partial].

### Inferences
- The "official AI booking" land-grab is happening at platform level (Fresha, Square) and via Google AI Mode (Booksy, Vagaro). Community MCPs are single-merchant, owner-facing tools (run with the owner's own API key), not consumer booking networks.

### Gaps
- No verified info on Gemini-specific integrations beyond Google AI Mode.

## Q4. App marketplaces / partner programs a startup could join

### Takeaway
Real, joinable programs: Square App Marketplace/App Partner, Mindbody partner program (paid API), Acuity OAuth partner, SimplyBook partner program, Phorest (paid integration partner), Zenoti/Vagaro (merchant-driven). Booksy partnership is negotiated; GlossGenius and StyleSeat have none.

### Cited Findings
- Square App Partner: build, launch, then apply; must be approved before listing in App Marketplace; revenue share and co-marketing offered. — [Square App Partners](https://squareup.com/us/en/partnerships/app-partner); [Listing guide](https://developer.squareup.com/docs/app-marketplace/listing-best-practices)
- Mindbody: partner program + Partner Store; paid metered API. — [Mindbody Developer Portal](https://developers.mindbodyonline.com/); [API FAQ](https://support.mindbodyonline.com/s/article/API-FAQ?language=en_US)
- Acuity: OAuth partner registration form. — [acuityscheduling.com/oauth2/register](https://acuityscheduling.com/oauth2/register)
- SimplyBook.me partner program page. — [SimplyBook partners](https://simplybook.me/en/partners)
- Phorest: partner integrations may carry charges. — [Phorest support](https://support.phorest.com/hc/en-us/articles/360018547979-Integrating-3rd-Party-E-Commerce-Solutions)
- Zenoti: partners receive API keys from customers (e.g., Perkville flow). — [Perkville Zenoti docs](https://docs.perkville.com/overview/integrations/integration-reference/zenoti)
- Boulevard: Enterprise-customer apps only; no open marketplace found. — [Boulevard Developer Portal](https://developers.joinblvd.com/) [snippet]
- GlossGenius: "no partner program to apply to." — [usecarly](https://www.usecarly.com/blog/glossgenius-ai/) [secondary]

### Gaps
- Vagaro, Setmore, Timely, Booksy formal partner-program pages not found.

## Q5. Approximate business counts

### Takeaway
Numbers are mostly company self-reports or tech-tracking estimates; US-specific beauty counts rarely published.

### Cited Findings
- Vagaro: "over 220,000 businesses globally" / "more than 83,000 beauty, wellness, and fitness businesses in the USA, Canada, UK, and Australia" (conflicting self-descriptions). — [Vagaro About Us](https://www.vagaro.com/pro/about-us); [Vagaro Pro](https://www.vagaro.com/pro) [snippet]
- Booksy: 140,000 businesses and 40M consumers globally (2024). — [Wikipedia Booksy](https://en.wikipedia.org/wiki/Booksy). US share unknown (6sense figure of 2,517 US customers is a tech-detection sample, not reliable — [6sense](https://6sense.com/tech/appointments-and-scheduling/booksy-biz-market-share)).
- GlossGenius: "over 100,000 local service businesses" (mostly US). — [GlossGenius About](https://glossgenius.com/about) [snippet]
- Mindbody: 60,000+ businesses in 130+ countries (fitness-heavy); Booker added ~10,000 salons/spas at 2018 acquisition. — [Landbase / Mindbody](https://data.landbase.com/technology/mindbody/) [secondary]; [Wikipedia Mindbody](https://en.wikipedia.org/wiki/Mindbody_Inc.)
- Boulevard: "thousands of salons, spas, and medspas" — no exact number. — [Boulevard blog](https://www.joinblvd.com/blog/best-booking-site-for-hairstylist) [snippet]
- Square Appointments, Acuity, Setmore, SimplyBook, Timely, Phorest, Zenoti, Schedulicity, StyleSeat: no reliable US salon counts found.

### Gaps
- US-only salon counts per platform not available from primary sources.

---

## Synthesis: ranked opportunity table (for a third-party AI booking connector)

| Rank | Platform | API can create bookings? | Access difficulty | Official AI integration already? | Opportunity for 3rd-party AI connector |
|---|---|---|---|---|---|
| 1 | Acuity Scheduling | Yes (appointments + availability) | Medium: OAuth partner form; merchant needs Premium plan | No official; 2 tiny community MCPs | **Medium-High** (but few salons; mostly solo/wellness) |
| 2 | Vagaro | Yes-ish (appointments read/write; create endpoint [UNVERIFIED]) | Medium-High: each salon requests, 5–7 days, $10/mo, paid+card-processing plan | Google AI Mode partner; no ChatGPT/Claude; no MCP | **Medium** (large US salon base, but Vagaro can ship ChatGPT itself) |
| 3 | Mindbody / Booker | Yes (appointments, classes) | High: partner approval, per-site activation, metered fees | No official MCP; Bilt partnership (May 2026); several community MCPs | **Medium** (fitness-heavy; Playlist may do it in-house) |
| 4 | Zenoti | Yes (service booking → reserve → confirm) | Medium: customer-generated API key; enterprise chains | None official; 2 community MCPs | **Medium** (sell B2B to chains/franchises, not a consumer network) |
| 5 | Phorest | Yes (create/activate booking) | Medium-High: per-business request, possible partner charges | None found | **Medium** (strong in UK/IE; smaller US) |
| 6 | Setmore | Yes | Medium: Pro plan + email request | None found | **Medium-Low** (horizontal SMB scheduler) |
| 7 | SimplyBook.me | Yes (`book` method, slots) | Low: self-serve API even on Free plan | None official; community MCP | **Medium-Low** (easy, but small US salon share; could build MCP itself) |
| 8 | Square Appointments | Yes (buyer-level booking, free plan) | Low: self-serve OAuth | **Yes**: official MCP (beta) + ChatGPT app/Claude plugin (Jul 2026, appointments "coming soon") | **Low** (easiest tech, but Square is shipping the same thing) |
| 9 | Boulevard | Yes (Client API / book SDK) | High: Enterprise tier only | None official; ops-focused community MCP | **Low-Medium** (premium salons, per-client enterprise deals) |
| 10 | Timely | Probably (OAuth API) [UNVERIFIED] | Medium: in-app OAuth app | None found | **Low-Medium** [UNVERIFIED] (ANZ/UK focus) |
| 11 | Booksy | Yes (Public API) | Very high: partner-only, negotiated | Google AI Mode partner (Aug/Nov 2025) | **Low** |
| 12 | Schedulicity | Unclear [UNVERIFIED] | Unknown / likely none | None found | **Low** |
| 13 | GlossGenius | No API | Closed | None found | **Very Low** (only via scraping/browser automation — ToS risk) |
| 14 | StyleSeat | No public API | Closed | None found | **Very Low** |

### Blunt conclusion
- Technically possible? **Yes, but only as a merchant-authorized B2B integration, one salon at a time** — not as a consumer aggregator that books any salon. Every usable API requires the salon to connect/activate access, and several add fees, plan upgrades or manual approval (Vagaro, Mindbody, Phorest, Setmore, Boulevard Enterprise).
- The largest beauty-first US pools outside Fresha are closed (GlossGenius ~100k, StyleSeat, Booksy partner-only). The open APIs (Square, Acuity, SimplyBook, Setmore) are horizontal schedulers where the platform (Square especially) is already shipping or can trivially ship its own MCP/ChatGPT app.
- Platform risk is extreme: Fresha and Square did it natively in Jul–Aug 2026; Booksy/Vagaro already route through Google AI Mode; any platform can revoke API access or launch its own connector, commoditizing a third-party layer overnight. Terms restricting aggregation were not verified and must be checked before building.
- Viable niche (if any): a paid "AI-ready booking" service sold directly to multi-location salons/chains on Zenoti, Vagaro, Mindbody, Phorest, Boulevard, where the vendor has no native ChatGPT/Claude connector yet — i.e., a B2B integration/agency play with a short window (likely 6–18 months [inference]) until those vendors ship their own. **As a standalone, venture-scale "connector for non-Fresha salons" business: not viable / weak.** As a feature inside a broader salon marketing or AI-receptionist product: plausible.
