
-- Experiments table
CREATE TABLE public.experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'paused')),
  auto_promote boolean NOT NULL DEFAULT false,
  auto_promote_min_sessions integer NOT NULL DEFAULT 100,
  auto_promote_min_lift numeric NOT NULL DEFAULT 15,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;

-- Only service role (edge functions) can access
CREATE POLICY "Deny direct select on experiments" ON public.experiments FOR SELECT USING (false);
CREATE POLICY "Deny direct insert on experiments" ON public.experiments FOR INSERT WITH CHECK (false);
CREATE POLICY "Deny direct update on experiments" ON public.experiments FOR UPDATE USING (false);
CREATE POLICY "Deny direct delete on experiments" ON public.experiments FOR DELETE USING (false);

-- Experiment variants table
CREATE TABLE public.experiment_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id uuid NOT NULL REFERENCES public.experiments(id) ON DELETE CASCADE,
  variant_id text NOT NULL,
  is_winner boolean NOT NULL DEFAULT false,
  traffic_weight integer NOT NULL DEFAULT 50,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (experiment_id, variant_id)
);

ALTER TABLE public.experiment_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny direct select on experiment_variants" ON public.experiment_variants FOR SELECT USING (false);
CREATE POLICY "Deny direct insert on experiment_variants" ON public.experiment_variants FOR INSERT WITH CHECK (false);
CREATE POLICY "Deny direct update on experiment_variants" ON public.experiment_variants FOR UPDATE USING (false);
CREATE POLICY "Deny direct delete on experiment_variants" ON public.experiment_variants FOR DELETE USING (false);

-- Experiment events / history log
CREATE TABLE public.experiment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id uuid NOT NULL REFERENCES public.experiments(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('promoted', 'rolled_back', 'auto_promoted', 'paused', 'resumed')),
  variant_id text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.experiment_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny direct select on experiment_events" ON public.experiment_events FOR SELECT USING (false);
CREATE POLICY "Deny direct insert on experiment_events" ON public.experiment_events FOR INSERT WITH CHECK (false);
CREATE POLICY "Deny direct update on experiment_events" ON public.experiment_events FOR UPDATE USING (false);
CREATE POLICY "Deny direct delete on experiment_events" ON public.experiment_events FOR DELETE USING (false);

-- Seed the current running experiment
INSERT INTO public.experiments (name, description, status)
VALUES ('Homepage Trust Signals', 'Control vs Credibility - testing trust badges on homepage', 'running');

-- Get the experiment id and seed variants
INSERT INTO public.experiment_variants (experiment_id, variant_id, traffic_weight)
SELECT id, 'control', 50 FROM public.experiments WHERE name = 'Homepage Trust Signals'
UNION ALL
SELECT id, 'credibility', 50 FROM public.experiments WHERE name = 'Homepage Trust Signals';
