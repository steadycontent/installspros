
-- Table for quote/lead form submissions
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  street TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  installation_type TEXT,
  is_partial BOOLEAN DEFAULT false,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  gclid TEXT,
  fbclid TEXT,
  variant_id TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for contact form submissions
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  inquiry TEXT,
  message TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  gclid TEXT,
  fbclid TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (no auth required for form submissions)
CREATE POLICY "Allow anonymous insert on leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on contact_submissions"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

-- Deny direct reads from client (data accessed via edge functions/admin only)
CREATE POLICY "Deny direct select on leads"
  ON public.leads FOR SELECT
  USING (false);

CREATE POLICY "Deny direct select on contact_submissions"
  ON public.contact_submissions FOR SELECT
  USING (false);
