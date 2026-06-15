## Goal

Split webhook routing per form so each funnel posts to its own Zapier destination, while keeping the existing GHL / LeadConnector fan-out unchanged for both.

| Form | Lives in | Zapier destination |
|---|---|---|
| Homepage quote funnel (and anywhere `InlineQuoteFlow` / `FunnelEngine` is used — `/`, `/gus`, `/frank`, `/i-need-starlink`, `/starlink-lp1`, etc.) | `src/components/InlineQuoteFlow.tsx`, `src/components/funnel/FunnelEngine.tsx` | `https://hooks.zapier.com/hooks/catch/218580/ul3oa6g/` (current `ZAPIER_LEAD_INGEST`) |
| Commercial assessment (`/assessment`, `/commercial`, industry pages) | `src/components/commercial/InlineAssessmentForm.tsx` | `https://hooks.zapier.com/hooks/catch/218580/43z96cx/` (new) |

GHL webhook #1, GHL webhook #2, `LEADCONNECTOR_WEBHOOK_URL`, and `dispatch-webhooks` continue to fire for **both** forms — unchanged.

## How it works today

All three call sites hit one edge function: `forward-lead-webhook`. That function fans out to every destination on every submission, with no awareness of which form the submission came from.

## Changes

### 1. Tag submissions with their source
- Already in the payload: `lead_type` is `"residential"` for the homepage funnel and `"commercial"` for the assessment form (`InlineAssessmentForm.tsx` line ~177 sets this). We'll use that as the routing key — no client changes required.
- Sanity-check: `InlineQuoteFlow.tsx` and `FunnelEngine.tsx` do not set `lead_type`, so it defaults to `"residential"` in the edge function (line 71 of `forward-lead-webhook/index.ts`). That's what we want.

### 2. Add a new secret for the assessment Zapier URL
- Create secret `ZAPIER_ASSESSMENT_INGEST` = `https://hooks.zapier.com/hooks/catch/218580/43z96cx/`.

### 3. Overwrite the homepage Zapier secret to be safe
- Update `ZAPIER_LEAD_INGEST` to `https://hooks.zapier.com/hooks/catch/218580/ul3oa6g/`.

### 4. Update `supabase/functions/forward-lead-webhook/index.ts`
- Read both Zapier secrets at startup.
- Pick the URL by `lead_type`:
  - `commercial` → `ZAPIER_ASSESSMENT_INGEST`
  - anything else → `ZAPIER_LEAD_INGEST`
- Log which destination was selected (`[forward-lead-webhook] Zapier route: commercial → ...43z96cx/`).
- If the chosen secret is missing, warn and skip that one webhook (do not fall back to the other Zapier URL — leads should never cross funnels).
- Leave LeadConnector, both hardcoded GHL webhooks, and `dispatch-webhooks` untouched so they keep firing for every submission.

### 5. No frontend changes
- `InlineAssessmentForm.tsx`, `InlineQuoteFlow.tsx`, and `FunnelEngine.tsx` continue calling `forward-lead-webhook` as today. All routing is server-side.

## Verification

- After deploy, submit a test lead from the homepage funnel → confirm a Zap run on `ul3oa6g`, none on `43z96cx`.
- Submit a test lead from `/assessment` → confirm a Zap run on `43z96cx`, none on `ul3oa6g`.
- Confirm both submissions still appear in GHL (LeadConnector + both hardcoded GHL hooks) and in the `leads` table.
- Check edge function logs for the `Zapier route:` line to verify the branching logic.

## Files touched

- `supabase/functions/forward-lead-webhook/index.ts` — routing logic only
- Secrets: add `ZAPIER_ASSESSMENT_INGEST`, update `ZAPIER_LEAD_INGEST`

No database migrations, no frontend changes.
