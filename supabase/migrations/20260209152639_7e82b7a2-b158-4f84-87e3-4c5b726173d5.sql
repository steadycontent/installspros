
-- Create KPIs table for aggregated funnel/conversion snapshots
CREATE TABLE public.kpis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  sessions integer NOT NULL DEFAULT 0,
  page_views integer NOT NULL DEFAULT 0,
  funnel_step_0 integer NOT NULL DEFAULT 0,
  funnel_step_1 integer NOT NULL DEFAULT 0,
  funnel_step_2 integer NOT NULL DEFAULT 0,
  funnel_step_3 integer NOT NULL DEFAULT 0,
  funnel_step_4 integer NOT NULL DEFAULT 0,
  leads integer NOT NULL DEFAULT 0,
  partial_leads integer NOT NULL DEFAULT 0,
  conversion_rate numeric NOT NULL DEFAULT 0,
  sale_amount numeric NOT NULL DEFAULT 0,
  sale_count integer NOT NULL DEFAULT 0,
  variant_id text,
  utm_source text,
  utm_medium text,
  utm_campaign text
);

-- Enable RLS
ALTER TABLE public.kpis ENABLE ROW LEVEL SECURITY;

-- Deny all anonymous/authenticated access (service role bypasses RLS)
CREATE POLICY "Deny direct select on kpis" ON public.kpis FOR SELECT USING (false);
CREATE POLICY "Deny direct insert on kpis" ON public.kpis FOR INSERT WITH CHECK (false);
CREATE POLICY "Deny direct update on kpis" ON public.kpis FOR UPDATE USING (false);
CREATE POLICY "Deny direct delete on kpis" ON public.kpis FOR DELETE USING (false);

-- Indexes for query performance
CREATE INDEX idx_kpis_created_at ON public.kpis (created_at);
CREATE INDEX idx_kpis_period_start ON public.kpis (period_start);
