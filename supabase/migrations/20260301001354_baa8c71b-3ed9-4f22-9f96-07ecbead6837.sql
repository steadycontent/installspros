
-- Create dedicated table for permanent lighting leads
CREATE TABLE public.lighting_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Address fields
  street TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  full_address TEXT,
  
  -- Photo & design data
  photo_urls JSONB DEFAULT '[]'::jsonb,
  light_config JSONB DEFAULT '{}'::jsonb,
  
  -- Property data from RentCast
  property_data JSONB DEFAULT '{}'::jsonb,
  
  -- Estimate
  estimated_linear_feet NUMERIC,
  estimated_range_low NUMERIC,
  estimated_range_high NUMERIC,
  
  -- Lead contact info
  name TEXT,
  email TEXT,
  phone TEXT,
  preferred_timeframe TEXT,
  
  -- Flags
  wants_nighttime_render BOOLEAN DEFAULT false,
  wants_starlink_bundle BOOLEAN DEFAULT false,
  
  -- UTM tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  gclid TEXT,
  fbclid TEXT,
  session_id TEXT
);

-- Enable RLS
ALTER TABLE public.lighting_leads ENABLE ROW LEVEL SECURITY;

-- Anonymous insert allowed (same pattern as leads table)
CREATE POLICY "Allow anonymous insert on lighting_leads"
  ON public.lighting_leads
  FOR INSERT
  WITH CHECK (true);

-- Deny select from client
CREATE POLICY "Deny direct select on lighting_leads"
  ON public.lighting_leads
  FOR SELECT
  USING (false);
