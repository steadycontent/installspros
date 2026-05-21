## Goal
Replace every occurrence of the phone number `(512) 881-7007` with `(512) 675-6605`, including `tel:` links (`+15128817007` → `+15126756605`).

## Files to update (9)
- `src/components/CTASection.tsx`
- `src/components/Navbar.tsx`
- `src/components/GusNavbar.tsx`
- `src/pages/ContactUs.tsx`
- `src/pages/Shop.tsx`
- `src/pages/SmartHome.tsx`
- `src/pages/services/GarageOpeners.tsx`
- `src/pages/services/SecuritySystems.tsx`
- `src/pages/services/SmartThermostats.tsx`

## Changes per file
Two string replacements in each:
1. Display text: `(512) 881-7007` → `(512) 675-6605`
2. `tel:` link: `tel:+15128817007` → `tel:+15126756605`

## Out of scope
No backend (Supabase functions), `index.html`, or `public/` files contain the number — no changes there. Business logic, layout, and styling are untouched.
