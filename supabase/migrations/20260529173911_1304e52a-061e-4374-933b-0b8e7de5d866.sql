
CREATE TABLE public.funnels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_primary boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT funnels_slug_format CHECK (slug ~ '^[a-z0-9][a-z0-9-]{0,62}$')
);

CREATE UNIQUE INDEX funnels_one_primary ON public.funnels (is_primary) WHERE is_primary = true;
CREATE INDEX funnels_active_idx ON public.funnels (is_active);

GRANT SELECT ON public.funnels TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.funnels TO authenticated;
GRANT ALL ON public.funnels TO service_role;

ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active funnels"
  ON public.funnels FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can select all funnels"
  ON public.funnels FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert funnels"
  ON public.funnels FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update funnels"
  ON public.funnels FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete funnels"
  ON public.funnels FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') AND is_primary = false);

CREATE TRIGGER update_funnels_updated_at
  BEFORE UPDATE ON public.funnels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.funnels (slug, name, is_primary, is_active, config) VALUES (
  'primary',
  'Satellite Internet — Primary',
  true,
  true,
  '{
    "version": 1,
    "branding": {
      "headline": "Professional Satellite Internet Installation",
      "subheadline": "Professional residential satellite internet installations handled from start to finish.",
      "badge": "37 States Nationwide 🇺🇸"
    },
    "steps": [
      {
        "id": "installation_type",
        "type": "choice-grid",
        "title": "What type of installation?",
        "options": [
          { "value": "residential", "label": "Residential", "icon": "home" },
          { "value": "commercial", "label": "Commercial", "icon": "building" },
          { "value": "marine", "label": "Marine", "icon": "anchor" },
          { "value": "mobile", "label": "Mobile/RV", "icon": "rv" }
        ]
      },
      { "id": "name",    "type": "text",    "label": "Your name",        "placeholder": "Full name" },
      { "id": "phone",   "type": "phone",   "label": "Phone number" },
      { "id": "email",   "type": "email",   "label": "Email" },
      { "id": "address", "type": "address", "label": "Install address" }
    ],
    "submit": { "label": "Get My Quote", "redirect": "/thank-you" }
  }'::jsonb
);
