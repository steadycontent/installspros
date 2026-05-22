## Goal

Reduce Starlink trademark/policy exposure across the public site. Prominent product positioning becomes "Satellite Internet / Satellite Internet Installation". Starlink stays only as a compatibility/reference word and in the existing support-link card.

Scope is **copy + meta only**. No layout, color, form logic, route, value-key, CRM mapping, or backend changes.

## What's already done (previous turn)

Hero headline/subheadline, intent button, footer disclaimer, FeaturesSection titles, CoverageSection heading, SmartHomeSection blurb, FAQSection answers, CTASection heading + compatibility line, EquipmentSection alt text, and Index.tsx + index.html SEO already updated. This plan covers everything else.

## Files to update (copy only)

### Public pages
- `src/pages/Blog.tsx` — post titles/excerpts/slugs stay (content references), but page `<title>` → "Blog | InstallPros — Satellite Internet & Smart Home Tips", meta description → "Expert tips, guides, and news about satellite internet installation and smart home automation.", intro paragraph → "Tips, guides, and news for satellite internet and smart home enthusiasts."
- `src/pages/Shop.tsx` — page title → "Satellite Internet Equipment & Accessories | InstallPros"; meta description, hero alt, and hero paragraph swap "Starlink" → "satellite internet"; keep import name `starlinkKit` as-is (internal).
- `src/pages/SmartHome.tsx` — meta description, "Network Integration" desc, and intro paragraph: "Starlink" → "satellite internet" / "satellite internet network".
- `src/pages/Locations.tsx` — page title → "Service Locations | InstallPros — 37 States Satellite Internet Installation"; meta description swaps "Starlink" → "satellite internet".
- `src/pages/ContactUs.tsx` — meta description and "Get a custom … quote" bullet swap "Starlink" → "satellite internet".
- `src/pages/ScheduleCall.tsx` — meta description: "Starlink and smart home" → "satellite internet and smart home".
- `src/pages/ThankYou.tsx` — WhatsApp prefilled text: "Starlink quote" → "satellite internet quote".
- `src/pages/TermsAndConditions.tsx` — "Starlink satellite systems" → "satellite internet systems".
- `src/pages/services/SecuritySystems.tsx` — meta description and hero paragraph: "Starlink" → "satellite internet" / "your satellite internet network".
- `src/pages/services/SmartThermostats.tsx` — feature card title "Starlink Powered" → "Always Online"; meta description: "Starlink-powered" → "satellite-internet-powered".
- `src/pages/services/GarageOpeners.tsx` — feature card title "Starlink Connected" → "Always Connected"; description: "Reliable Starlink internet" → "Reliable satellite internet".

### Components (visible copy)
- `src/components/HeroSection.tsx` — support card label "I Need Starlink help or support" → "I Need Help or Support" (link target/href unchanged, since it correctly points to Starlink's own support site). Comment/alt cleanups are cosmetic.
- `src/components/FeaturesCarousel.tsx` — card titles "Residential/Commercial/Marine/Mobile/RV Starlink" → "Residential/Commercial/Marine/Mobile-RV Satellite Internet". Image import identifiers stay.
- `src/components/HeroWithCarousel.tsx` — same renaming for the three carousel titles, plus heading "Complete Starlink Installation Solutions" → "Complete Satellite Internet Installation Solutions" and subline → "Expert nationwide installs with the best pricing on satellite internet hardware and smart home integrations."
- `src/components/ProfessionalInstallation.tsx` — "We supply and install your Starlink system" → "We supply and install your satellite internet system".
- `src/components/QuoteForm.tsx` — visible labels "Residential/Commercial/Marine/Mobile/RV Starlink Installation" → "… Satellite Internet Installation". **Option `value` strings stay unchanged** (CRM mapping memory).
- `src/components/InlineQuoteForm.tsx` — visible labels "Residential/Commercial/Marine/Mobile/RV Starlink" → "… Satellite Internet". **`value` keys (`residential-starlink`, etc.) stay unchanged** to preserve CRM/Zapier mapping.

## Explicitly NOT changing

- Dormant variant pages and their components: `Gus.tsx`, `Frank.tsx`, `StarlinkLp1.tsx`, `INeedStarlink.tsx`, `ThankYouGus.tsx`, `GusNavbar.tsx`, `GusValueProps.tsx`, `GusInteractiveCoverageMap.tsx`, `StarlinkHeroSection.tsx`. They are off the active funnel per project memory.
- Asset filenames/import identifiers (`starlink-kit.jpg`, `starlinkDishCompass`, etc.) — internal only, not user-visible.
- Admin UI (`admin/google-ads/*`), backend (`supabase/functions/*`, migrations, generated `types.ts`), and lighting modal — no public copy impact.
- Form `value` keys and CRM job-type mapping — preserved per project memory.
- The existing Starlink-branded support link card and its `starlink.com/support` href — kept as legitimate reference to the trademark owner's support.
- Branding colors, layout, responsive behavior, UTM handling, form logic, and tracking — all unchanged.

## Verification

After edits: `rg -i "starlink" src/pages src/components` should only show: compatibility/reference lines, the support card href + visible "Starlink Support" link text, blog post titles (editorial references), and import identifiers/asset filenames.
