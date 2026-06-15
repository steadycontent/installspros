## Scope

Only the `/assessment` form (commercial leads). Residential/homepage payloads untouched.

## Problem

`InlineAssessmentForm.tsx` sends assessment answers nested under `property_meta`:
`property_name`, `industry`, `sites`, `acreage`, `current_isp`.

`forward-lead-webhook/index.ts` forwards core lead fields (name/email/phone/address/utm) to Zapier/LeadConnector/GHL but never flattens `property_meta`, so Zapier only sees the basics.

## Fix

In `supabase/functions/forward-lead-webhook/index.ts`, when `leadData.lead_type === "commercial"`, merge the `property_meta` fields as top-level keys into all outbound payloads. Residential payloads stay exactly as they are today.

### Implementation

Add once near the payload builders:

```ts
const assessmentFields = isCommercial ? {
  property_name: String(leadData.property_meta?.property_name ?? ""),
  industry:      String(leadData.property_meta?.industry ?? ""),
  sites:         String(leadData.property_meta?.sites ?? ""),
  acreage:       String(leadData.property_meta?.acreage ?? ""),
  current_isp:   String(leadData.property_meta?.current_isp ?? ""),
} : {};
```

Spread `...assessmentFields` into:
1. `zapierPayload.data` (will hit `ZAPIER_ASSESSMENT_INGEST` — hook `43z96cx`)
2. `leadConnectorPayload`
3. `ghlPayload` (used by both GHL webhooks and `dispatch-webhooks`)

DB insert already stores the nested `property_meta` — no change there.

## Verification

Submit `/assessment` once → check Zapier run history for `43z96cx` → confirm `property_name`, `industry`, `sites`, `acreage`, `current_isp` appear as top-level fields under `data`. Submit homepage funnel once → confirm hook `ul3oa6g` payload is unchanged (no new keys).
