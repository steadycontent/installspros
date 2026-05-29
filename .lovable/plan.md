# Funnel Builder – Copy/Import JSON + Rapid Deploy

Goal: from the admin Overview, export the primary homepage funnel as JSON, create new funnels (blank or via JSON import), store them in the DB, and instantly serve them at a custom URL slug.

## 1. Database

New `funnels` table:

| column | type | notes |
|---|---|---|
| id | uuid PK | |
| slug | text unique | URL-safe, e.g. `solar-tx` → served at `/f/solar-tx` |
| name | text | Internal label |
| config | jsonb | Funnel schema (steps, fields, copy, theme) |
| is_primary | boolean | Marks the homepage funnel (only one true) |
| is_active | boolean | If false, route returns 404 |
| created_at / updated_at | timestamptz | |

RLS: admins (`has_role(uid,'admin')`) can do all; `anon` + `authenticated` can `SELECT` only `is_active = true` rows (needed so the public `/f/:slug` page can read the config without auth).

A migration also seeds one row with `slug='primary'`, `is_primary=true`, containing the current hardcoded funnel definition.

## 2. JSON schema (v1)

```json
{
  "version": 1,
  "name": "Satellite Internet — Primary",
  "branding": { "headline": "...", "subheadline": "...", "badge": "37 States Nationwide" },
  "steps": [
    { "id": "installation_type", "type": "choice-grid",
      "title": "What type of installation?",
      "options": [
        { "value": "residential", "label": "Residential", "icon": "home" },
        { "value": "commercial", "label": "Commercial", "icon": "building" },
        { "value": "marine",      "label": "Marine",      "icon": "anchor" },
        { "value": "mobile",      "label": "Mobile/RV",   "icon": "rv" }
      ]
    },
    { "id": "name",    "type": "text",  "label": "Your name",  "placeholder": "Full name" },
    { "id": "phone",   "type": "phone", "label": "Phone" },
    { "id": "email",   "type": "email", "label": "Email" },
    { "id": "address", "type": "address","label": "Install address" }
  ],
  "submit": { "label": "Get My Quote", "redirect": "/thank-you" }
}
```

The five step types above cover what the current funnel uses. Existing lead-submission logic (Supabase insert + webhook dispatch + partial-lead capture) is reused unchanged — the dynamic renderer just feeds field values into the same payload.

## 3. Dynamic renderer

- New page: `src/pages/DynamicFunnel.tsx`, route `/f/:slug`
  - Fetches the funnel row by slug, renders steps via a `<FunnelEngine config={...}/>` component
  - 404 if not found / not active
- New component: `src/components/funnel/FunnelEngine.tsx`
  - Step-type switch → reuses existing inputs (address autocomplete, phone formatter, validation, partial-lead timers)
  - On submit, calls the same lead-insert pipeline used by `InlineQuoteFlow`

The existing homepage `InlineQuoteFlow` is left untouched for now (low risk). Optional follow-up: switch homepage to read the `is_primary` row.

## 4. Admin UI changes

On **Overview → Funnel Overview card**:

- **Copy JSON** button → copies the current primary funnel's `config` JSON to clipboard, toast confirms.
- **New Funnel** button → opens a modal with two tabs:

  **Tab 1 — Blank**
  - Slug input (auto-slugifies, validates `[a-z0-9-]+`, checks uniqueness)
  - Funnel name input
  - Creates a funnel pre-populated with the primary config so it works immediately; user can edit JSON later.

  **Tab 2 — Import JSON**
  - Slug + name inputs
  - JSON textarea (with paste + validate button)
  - Validates against the schema; shows inline errors
  - Creates the funnel with the imported config.

After creation: toast with a link to `/f/{slug}` (opens in new tab) so the user can instantly preview the deployed page.

A small **Funnels list** appears below the actions showing slug · name · created · open · delete, so admins can manage what they've created.

## 5. Files touched

New:
- `supabase/migrations/<ts>_create_funnels.sql`
- `src/components/admin/FunnelManagerCard.tsx` (Copy JSON + New Funnel modal + list)
- `src/components/admin/NewFunnelDialog.tsx` (tabbed dialog)
- `src/hooks/useFunnels.ts` (CRUD via supabase-js)
- `src/components/funnel/FunnelEngine.tsx`
- `src/pages/DynamicFunnel.tsx`
- `src/lib/funnels/schema.ts` (Zod validator + types)
- `src/lib/funnels/primarySeed.ts` (canonical JSON of current funnel)

Edited:
- `src/pages/admin/Overview.tsx` — mount `<FunnelManagerCard/>` above the Funnel Overview chart
- `src/App.tsx` — register `/f/:slug` route

## 6. Out of scope (can add later)

- Visual drag-and-drop funnel editor (this PR is JSON in/out only)
- Per-funnel analytics filtering
- Switching homepage to render from DB

Confirm and I'll implement.
