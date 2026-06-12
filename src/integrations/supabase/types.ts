export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_type: string
          funnel_step: number | null
          id: string
          metadata: Json | null
          page_path: string | null
          session_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          funnel_step?: number | null
          id?: string
          metadata?: Json | null
          page_path?: string | null
          session_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          funnel_step?: number | null
          id?: string
          metadata?: Json | null
          page_path?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "analytics_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_leads: {
        Row: {
          created_at: string
          id: string
          installation_type: string | null
          session_id: string | null
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          installation_type?: string | null
          session_id?: string | null
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          installation_type?: string | null
          session_id?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_leads_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "analytics_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_sessions: {
        Row: {
          created_at: string
          id: string
          referrer: string | null
          user_agent: string | null
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          referrer?: string | null
          user_agent?: string | null
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          referrer?: string | null
          user_agent?: string | null
          variant_id?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          fbclid: string | null
          gclid: string | null
          id: string
          inquiry: string | null
          message: string | null
          name: string
          phone: string | null
          utm_agency: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          created_at?: string
          email: string
          fbclid?: string | null
          gclid?: string | null
          id?: string
          inquiry?: string | null
          message?: string | null
          name: string
          phone?: string | null
          utm_agency?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          fbclid?: string | null
          gclid?: string | null
          id?: string
          inquiry?: string | null
          message?: string | null
          name?: string
          phone?: string | null
          utm_agency?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      experiment_events: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          experiment_id: string
          id: string
          variant_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          experiment_id: string
          id?: string
          variant_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          experiment_id?: string
          id?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "experiment_events_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      experiment_variants: {
        Row: {
          created_at: string
          experiment_id: string
          id: string
          is_winner: boolean
          traffic_weight: number
          variant_id: string
        }
        Insert: {
          created_at?: string
          experiment_id: string
          id?: string
          is_winner?: boolean
          traffic_weight?: number
          variant_id: string
        }
        Update: {
          created_at?: string
          experiment_id?: string
          id?: string
          is_winner?: boolean
          traffic_weight?: number
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiment_variants_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      experiments: {
        Row: {
          auto_promote: boolean
          auto_promote_min_lift: number
          auto_promote_min_sessions: number
          created_at: string
          description: string | null
          ended_at: string | null
          id: string
          name: string
          started_at: string
          status: string
        }
        Insert: {
          auto_promote?: boolean
          auto_promote_min_lift?: number
          auto_promote_min_sessions?: number
          created_at?: string
          description?: string | null
          ended_at?: string | null
          id?: string
          name: string
          started_at?: string
          status?: string
        }
        Update: {
          auto_promote?: boolean
          auto_promote_min_lift?: number
          auto_promote_min_sessions?: number
          created_at?: string
          description?: string | null
          ended_at?: string | null
          id?: string
          name?: string
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      funnels: {
        Row: {
          config: Json
          created_at: string
          id: string
          is_active: boolean
          is_primary: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          is_primary?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          is_primary?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      google_ads_accounts: {
        Row: {
          account_name: string
          client_id: string
          client_secret: string
          created_at: string
          customer_id: string
          developer_token: string
          id: string
          is_active: boolean
          refresh_token: string
          updated_at: string
        }
        Insert: {
          account_name?: string
          client_id?: string
          client_secret?: string
          created_at?: string
          customer_id?: string
          developer_token?: string
          id?: string
          is_active?: boolean
          refresh_token?: string
          updated_at?: string
        }
        Update: {
          account_name?: string
          client_id?: string
          client_secret?: string
          created_at?: string
          customer_id?: string
          developer_token?: string
          id?: string
          is_active?: boolean
          refresh_token?: string
          updated_at?: string
        }
        Relationships: []
      }
      kpis: {
        Row: {
          conversion_rate: number
          created_at: string
          funnel_step_0: number
          funnel_step_1: number
          funnel_step_2: number
          funnel_step_3: number
          funnel_step_4: number
          id: string
          leads: number
          page_views: number
          partial_leads: number
          period_end: string
          period_start: string
          sale_amount: number
          sale_count: number
          sessions: number
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          variant_id: string | null
        }
        Insert: {
          conversion_rate?: number
          created_at?: string
          funnel_step_0?: number
          funnel_step_1?: number
          funnel_step_2?: number
          funnel_step_3?: number
          funnel_step_4?: number
          id?: string
          leads?: number
          page_views?: number
          partial_leads?: number
          period_end: string
          period_start: string
          sale_amount?: number
          sale_count?: number
          sessions?: number
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          variant_id?: string | null
        }
        Update: {
          conversion_rate?: number
          created_at?: string
          funnel_step_0?: number
          funnel_step_1?: number
          funnel_step_2?: number
          funnel_step_3?: number
          funnel_step_4?: number
          id?: string
          leads?: number
          page_views?: number
          partial_leads?: number
          period_end?: string
          period_start?: string
          sale_amount?: number
          sale_count?: number
          sessions?: number
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          variant_id?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          city: string | null
          created_at: string
          device_type: string | null
          email: string | null
          fbclid: string | null
          gclid: string | null
          id: string
          installation_type: string | null
          is_partial: boolean | null
          landing_host: string | null
          lead_type: string
          name: string | null
          phone: string | null
          property_meta: Json | null
          session_id: string | null
          state: string | null
          street: string | null
          utm_agency: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          variant_id: string | null
          zip: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          device_type?: string | null
          email?: string | null
          fbclid?: string | null
          gclid?: string | null
          id?: string
          installation_type?: string | null
          is_partial?: boolean | null
          landing_host?: string | null
          lead_type?: string
          name?: string | null
          phone?: string | null
          property_meta?: Json | null
          session_id?: string | null
          state?: string | null
          street?: string | null
          utm_agency?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          variant_id?: string | null
          zip?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          device_type?: string | null
          email?: string | null
          fbclid?: string | null
          gclid?: string | null
          id?: string
          installation_type?: string | null
          is_partial?: boolean | null
          landing_host?: string | null
          lead_type?: string
          name?: string | null
          phone?: string | null
          property_meta?: Json | null
          session_id?: string | null
          state?: string | null
          street?: string | null
          utm_agency?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          variant_id?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      lighting_leads: {
        Row: {
          city: string | null
          created_at: string
          email: string | null
          estimated_linear_feet: number | null
          estimated_range_high: number | null
          estimated_range_low: number | null
          fbclid: string | null
          full_address: string | null
          gclid: string | null
          id: string
          light_config: Json | null
          name: string | null
          phone: string | null
          photo_urls: Json | null
          preferred_timeframe: string | null
          property_data: Json | null
          session_id: string | null
          state: string | null
          street: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          wants_nighttime_render: boolean | null
          wants_starlink_bundle: boolean | null
          zip: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          email?: string | null
          estimated_linear_feet?: number | null
          estimated_range_high?: number | null
          estimated_range_low?: number | null
          fbclid?: string | null
          full_address?: string | null
          gclid?: string | null
          id?: string
          light_config?: Json | null
          name?: string | null
          phone?: string | null
          photo_urls?: Json | null
          preferred_timeframe?: string | null
          property_data?: Json | null
          session_id?: string | null
          state?: string | null
          street?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          wants_nighttime_render?: boolean | null
          wants_starlink_bundle?: boolean | null
          zip?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          email?: string | null
          estimated_linear_feet?: number | null
          estimated_range_high?: number | null
          estimated_range_low?: number | null
          fbclid?: string | null
          full_address?: string | null
          gclid?: string | null
          id?: string
          light_config?: Json | null
          name?: string | null
          phone?: string | null
          photo_urls?: Json | null
          preferred_timeframe?: string | null
          property_data?: Json | null
          session_id?: string | null
          state?: string | null
          street?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          wants_nighttime_render?: boolean | null
          wants_starlink_bundle?: boolean | null
          zip?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          trigger_event: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          trigger_event: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          trigger_event?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
