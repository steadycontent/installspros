-- Create analytics_sessions table
CREATE TABLE public.analytics_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    variant_id TEXT,
    user_agent TEXT,
    referrer TEXT
);

-- Create analytics_events table
CREATE TABLE public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.analytics_sessions(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL,
    page_path TEXT,
    funnel_step INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create analytics_leads table
CREATE TABLE public.analytics_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.analytics_sessions(id) ON DELETE CASCADE,
    variant_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    installation_type TEXT
);

-- Create indexes for performance
CREATE INDEX idx_analytics_events_session_id ON public.analytics_events(session_id);
CREATE INDEX idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_sessions_created_at ON public.analytics_sessions(created_at);
CREATE INDEX idx_analytics_leads_created_at ON public.analytics_leads(created_at);
CREATE INDEX idx_analytics_leads_session_id ON public.analytics_leads(session_id);

-- Enable RLS on all tables
ALTER TABLE public.analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for analytics_sessions
-- Allow anonymous insert for tracking
CREATE POLICY "Allow anonymous insert on analytics_sessions"
ON public.analytics_sessions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- No direct select - use edge function with service role for admin queries
CREATE POLICY "Deny direct select on analytics_sessions"
ON public.analytics_sessions
FOR SELECT
USING (false);

-- RLS Policies for analytics_events
-- Allow anonymous insert for tracking
CREATE POLICY "Allow anonymous insert on analytics_events"
ON public.analytics_events
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- No direct select - use edge function with service role for admin queries
CREATE POLICY "Deny direct select on analytics_events"
ON public.analytics_events
FOR SELECT
USING (false);

-- RLS Policies for analytics_leads
-- Allow anonymous insert for tracking
CREATE POLICY "Allow anonymous insert on analytics_leads"
ON public.analytics_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- No direct select - use edge function with service role for admin queries
CREATE POLICY "Deny direct select on analytics_leads"
ON public.analytics_leads
FOR SELECT
USING (false);