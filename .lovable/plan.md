
# InstallPros Commercial Repositioning

Reframe the site as a **commercial connectivity infrastructure** company (Meraki / Ubiquiti Enterprise / ServiceTitan energy) targeting RV parks, campgrounds, motorcoach resorts, marinas, mobile home communities, and large hospitality properties. Residential stays live but moves to a secondary path.

## 1. Information architecture

New primary nav: **Industries · Solutions · Calculator · Process · Assessment**

```text
/                              → Commercial homepage (new)
/industries/rv-parks           → Industry landing
/industries/campgrounds
/industries/motorcoach-resorts
/industries/marinas
/industries/mobile-home-parks
/industries/large-properties
/solutions                     → Infrastructure stack (Starlink Business, Ubiquiti, APs, P2P, monitoring)
/process                       → Assessment → Design → Install → Optimize → Monitor
/assessment                    → Commercial lead funnel (primary CTA target)
/calculator                    → Revenue impact visual preview → assessment
/residential                   → Existing residential homepage, demoted (footer + secondary header link)
```

Existing residential routes (`/smart-home`, `/security-systems`, `/garage-openers`, `/smart-thermostats`, `/permanent-lighting`, `/locations`, `/shop`) stay live, reachable from `/residential` and footer. Admin, auth, contact, legal pages untouched.

## 2. New homepage

Replace `src/pages/Index.tsx` sections in order:

1. **Hero** — "Reliable Internet Across Your Entire Property." Subhead names RV parks/resorts/campgrounds/marinas. Primary CTA: *Get Free Property Assessment* → `/assessment`. Secondary: *Calculate Revenue Impact* → `/calculator`. Visual: generated aerial RV park with coverage overlay.
2. **Why Connectivity Matters** — 4 metric tiles (More Bookings, Longer Stays, Higher Reviews, Fewer Complaints).
3. **Industries We Serve** — 6 cards (RV Parks, Campgrounds, Motorcoach Resorts, Marinas, Mobile Home Communities, Resorts) linking to industry pages.
4. **Revenue Calculator preview** — visual sliders (Sites, Occupancy, Nightly Rate, Review Score) with computed-looking output tiles. Non-binding preview; CTA *Run Full Assessment* → `/assessment`.
5. **Our Process** — 5-step horizontal timeline.
6. **Commercial Infrastructure** — Starlink Business, Ubiquiti, Enterprise WiFi, Outdoor APs, Point-to-Point Links, Network Monitoring as diagram-style cards.
7. **Final CTA band** — assessment + phone.

## 3. Industry landing pages

Single shared template `src/pages/industries/IndustryTemplate.tsx`, configured per slug:

- Hero (industry-specific headline + image)
- Pain points (3-4 bullets)
- Connectivity challenges
- Revenue impact panel
- Coverage example visual
- ROI example numbers
- Assessment CTA pinned to industry

Six wrapper pages call the template with their own copy/visuals.

## 4. Two funnels

Per your direction — keep both.

- **Commercial assessment funnel** (new, primary): `InlineAssessmentForm.tsx` with steps Property Name → Industry → Number of Sites → Estimated Acreage → Current Internet Provider → Phone → Email. Lives on homepage hero + `/assessment`. Posts to existing `leads` table with `lead_type: 'commercial'` and the new fields stored in a JSON column (e.g. extend `metadata` or add `property_meta jsonb`). Routes to a new `/thank-you-assessment` page.
- **Residential funnel** (existing `InlineQuoteForm` / `handleQuoteCTA`): unchanged, lives on `/residential` and existing service sub-pages. Tag leads as `lead_type: 'residential'`.

Admin Submissions table gets a `lead_type` filter. Webhook dispatch payload includes `lead_type` so Zapier/GHL can route.

**Backend changes**
- Migration: add `lead_type text default 'residential'` and `property_meta jsonb` to `leads`. GRANTs preserved. Existing RLS unchanged.
- `dispatch-webhooks` and `forward-lead-webhook` pass new fields through.

## 5. Calculator (visual preview)

`/calculator` and homepage embed: sliders for Sites / Occupancy / Nightly Rate / Review Score → outputs Potential Revenue Increase, Complaint Reduction, Payback Period using transparent illustrative formulas (e.g. `sites × occupancy% × rate × 365 × 0.05` lift). Disclaimer "Illustrative — request a full assessment for real numbers." Submit button captures inputs into sessionStorage and routes to `/assessment` (prefills industry/sites/acreage when possible).

## 6. Visual direction

Keep current dark theme tokens (`#000`, `#FFF`, `#1E90FF`, Be Vietnam Pro, `rounded-[4px]`) — they already match the enterprise look. Adjust:

- Hero gets coverage-map overlay treatment (radial gradients + dotted grid).
- Replace residential service photography on the new homepage with commercial imagery.
- Industry cards use diagram/aerial visuals, not roof shots.

**Generated images** (via `imagegen` standard tier):
1. Hero — aerial RV resort at dusk with WiFi coverage overlay.
2-7. One image per industry (RV park, campground, motorcoach resort, marina, mobile home community, resort).
8. Optional infrastructure diagram for Solutions section.

All saved as project assets (compressed JPGs).

## 7. SEO

Per-route Helmet titles/descriptions targeting:
- RV Park WiFi · Campground Internet · RV Park Starlink · Commercial Starlink Installation · Marina WiFi · Property-Wide WiFi · Motorcoach Resort WiFi · Mobile Home Park Internet · Commercial Connectivity

Update `index.html` sitewide title/description/OG to commercial positioning. Update `sitemap.xml` with new routes. Canonicals per route.

## 8. Residential demotion

- `/` no longer renders residential hero/services.
- Existing residential homepage content moves to `src/pages/Residential.tsx` (lifted from current `Index.tsx`).
- Footer adds "Residential Services" link. Navbar gets a small "Residential" link under a "More" dropdown or in the footer only (your call at build time).
- `handleQuoteCTA` still works for residential pages.

## 9. Out of scope (defer)

- Real case studies (placeholder cards only)
- Real ROI math (illustrative)
- Customer logos
- Blog content for new keywords
- CRM job-type mapping changes beyond `lead_type` (current lowercase keys preserved for residential)

## Technical notes

- New files: `src/pages/Assessment.tsx`, `src/pages/Calculator.tsx`, `src/pages/Process.tsx`, `src/pages/Solutions.tsx`, `src/pages/Residential.tsx`, `src/pages/ThankYouAssessment.tsx`, `src/pages/industries/IndustryTemplate.tsx` + 6 thin wrappers, `src/components/commercial/*` (Hero, IndustriesGrid, MetricsBand, CalculatorPreview, ProcessTimeline, InfrastructureGrid, AssessmentCTA), `src/components/InlineAssessmentForm.tsx`.
- Edited: `src/pages/Index.tsx` (replaced), `src/components/Navbar.tsx` (new nav), `src/components/Footer.tsx` (Residential link), `src/App.tsx` (routes, lazy), `index.html` (meta), `public/sitemap.xml`.
- DB migration: `alter table public.leads add column lead_type text default 'residential', add column property_meta jsonb;` (no RLS changes; GRANTs unchanged).
- Memory updates after build: new Core entry for commercial positioning + industry slug list; mark residential as secondary.

## Build order

1. DB migration + types regen.
2. Lift residential homepage to `/residential`.
3. New homepage shell + assessment funnel + `/assessment` route (wired to backend).
4. Generate hero + 6 industry images.
5. Industry template + 6 wrappers.
6. Calculator, Process, Solutions pages.
7. Navbar, Footer, sitemap, SEO meta.
8. Smoke test both funnels end-to-end.

