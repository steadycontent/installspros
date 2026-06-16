# Add `source_domain` to Webhook Payloads

Mirror the JOB INSTALL project exactly so Zapier mapping is identical.

## Field
- Name: `source_domain`
- Value: `window.location.hostname` (bare domain, no protocol/path)
- Sanitized server-side: lowercased, max 253 chars

## Changes

### 1. `src/components/InlineQuoteForm.tsx` (residential funnel — full + partial submission paths)
Add to both the full submit payload and the partial-lead payload sent to `forward-lead-webhook`:
```ts
source_domain: window.location.hostname,
```

### 2. `src/components/commercial/InlineAssessmentForm.tsx`
Add to the assessment submit payload:
```ts
source_domain: window.location.hostname,
```

### 3. `supabase/functions/forward-lead-webhook/index.ts`
- Accept optional `source_domain` on the incoming body, sanitized (lowercase, max 253 chars).
- Forward as a flat field `source_domain` on:
  - `zapierPayload.data`
  - `leadConnectorPayload`
  - LeadConnector partial-lead payload (if separate branch)

## Zapier
After one test submission per form, re-sample the trigger in Zapier so `Data Source Domain` appears in the field picker.

## Out of scope
- No DB column added.
- No changes to lighting, contact, or photo webhooks.
