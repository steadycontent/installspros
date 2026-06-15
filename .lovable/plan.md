Align the `/assessment` Zapier webhook payload with the Job Install project reference (screenshots).

## Differences vs current payload

Current payload sends:
- `installation_type` = "Commercial-RVPark" (mapped value)
- No `lead_type` field
- No `commercial_type` field

Reference payload (target):
- `installation_type` = "commercial"
- `lead_type` = "commercial"
- `commercial_type` = "Commercial-RVPark" (separate field)

## Changes

**1. `src/components/commercial/InlineAssessmentForm.tsx`**
- Set `installationType: "commercial"` (constant for all commercial leads).
- Add `commercial_type` to `property_meta` using the existing `commercialTypeMap` (rv-parks → Commercial-RVPark, marinas → Commercial-Marina, mobile-home-parks → Commercial-WineryEquestrian, large-properties → Commercial-Other).

**2. `supabase/functions/forward-lead-webhook/index.ts`**
- Extend `assessmentFields` with `commercial_type: String(pm.commercial_type ?? "")`.
- Add `lead_type: leadData.lead_type` to both `zapierPayload.data` and `leadConnectorPayload` so the Zap receives it as a flat field.

## Verification
- Submit assessment form → check the Zap "Catch Hook" run details show `Installation Type: commercial`, `Lead Type: commercial`, `Commercial Type: Commercial-RVPark` (or matching mapped value), plus existing Property Name / Industry / Sites / Acreage / Current Isp fields.
- DB `leads.installation_type` will now store "commercial" instead of the mapped Commercial-* string; that's consistent with the reference project.
