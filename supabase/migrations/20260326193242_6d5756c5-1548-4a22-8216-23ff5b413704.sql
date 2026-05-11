CREATE POLICY "Deny direct insert on analytics_events" ON analytics_events FOR INSERT TO public WITH CHECK (false);
CREATE POLICY "Deny direct update on analytics_events" ON analytics_events FOR UPDATE TO public USING (false);
CREATE POLICY "Deny direct delete on analytics_events" ON analytics_events FOR DELETE TO public USING (false);
CREATE POLICY "Deny direct insert on analytics_sessions" ON analytics_sessions FOR INSERT TO public WITH CHECK (false);
CREATE POLICY "Deny direct update on analytics_sessions" ON analytics_sessions FOR UPDATE TO public USING (false);
CREATE POLICY "Deny direct delete on analytics_sessions" ON analytics_sessions FOR DELETE TO public USING (false);
CREATE POLICY "Deny direct insert on analytics_leads" ON analytics_leads FOR INSERT TO public WITH CHECK (false);
CREATE POLICY "Deny direct update on analytics_leads" ON analytics_leads FOR UPDATE TO public USING (false);
CREATE POLICY "Deny direct delete on analytics_leads" ON analytics_leads FOR DELETE TO public USING (false);