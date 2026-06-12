ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS lead_type text NOT NULL DEFAULT 'residential',
  ADD COLUMN IF NOT EXISTS property_meta jsonb;

CREATE INDEX IF NOT EXISTS leads_lead_type_idx ON public.leads (lead_type);