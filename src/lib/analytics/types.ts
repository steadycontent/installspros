export type AnalyticsEventType =
  | "session_start"
  | "page_view"
  | "funnel_step_view"
  | "cta_click"
  | "form_submit"
  | "click";

export interface TrackEventPayload {
  session_id: string;
  event_type: AnalyticsEventType;
  page_path?: string;
  funnel_step?: number;
  variant_id?: string;
  metadata?: Record<string, unknown>;
  // Session creation data (only for session_start)
  user_agent?: string;
  referrer?: string;
}

export interface OverviewMetrics {
  sessions: number;
  pageViews: number;
  leads: number;
  partialLeads: number;
  conversionRate: number;
}

export interface FunnelStep {
  step: number;
  name: string;
  users: number;
  dropOffRate: number;
}

export interface FunnelData {
  funnel: FunnelStep[];
}

export interface VariantData {
  variant: string;
  sessions: number;
  leads: number;
  conversionRate: number;
}

export interface VariantsData {
  variants: VariantData[];
}

export interface ClickPoint {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  count: number;
  element_tag?: string;
  element_text?: string;
}

export interface HeatmapData {
  step: number;
  clicks: ClickPoint[];
  totalClicks: number;
}
