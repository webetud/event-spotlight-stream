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
      clubs: {
        Row: {
          created_at: string
          description: string | null
          description_en: string | null
          display_order: number
          gallery_urls: string[] | null
          id: string
          logo_url: string | null
          name: string
          name_en: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_en?: string | null
          display_order?: number
          gallery_urls?: string[] | null
          id?: string
          logo_url?: string | null
          name: string
          name_en?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          description_en?: string | null
          display_order?: number
          gallery_urls?: string[] | null
          id?: string
          logo_url?: string | null
          name?: string
          name_en?: string | null
        }
        Relationships: []
      }
      event_settings: {
        Row: {
          attendance_count: number
          description: string | null
          description_en: string | null
          event_date: string | null
          event_location: string | null
          event_name: string
          event_name_en: string | null
          id: string
          logo_url: string | null
          news_ticker: string | null
          news_ticker_active: boolean
          news_ticker_en: string | null
          program_pdf_url: string | null
          registration_url: string | null
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          attendance_count?: number
          description?: string | null
          description_en?: string | null
          event_date?: string | null
          event_location?: string | null
          event_name?: string
          event_name_en?: string | null
          id?: string
          logo_url?: string | null
          news_ticker?: string | null
          news_ticker_active?: boolean
          news_ticker_en?: string | null
          program_pdf_url?: string | null
          registration_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          attendance_count?: number
          description?: string | null
          description_en?: string | null
          event_date?: string | null
          event_location?: string | null
          event_name?: string
          event_name_en?: string | null
          id?: string
          logo_url?: string | null
          news_ticker?: string | null
          news_ticker_active?: boolean
          news_ticker_en?: string | null
          program_pdf_url?: string | null
          registration_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      organizers: {
        Row: {
          created_at: string
          display_order: number
          facebook_url: string | null
          id: string
          linkedin_url: string | null
          name: string
          photo_url: string | null
          role: string | null
          role_en: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          facebook_url?: string | null
          id?: string
          linkedin_url?: string | null
          name: string
          photo_url?: string | null
          role?: string | null
          role_en?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          facebook_url?: string | null
          id?: string
          linkedin_url?: string | null
          name?: string
          photo_url?: string | null
          role?: string | null
          role_en?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          category: string
          created_at: string
          display_order: number
          id: string
          logo_url: string | null
          name: string
          website_url: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          logo_url?: string | null
          name: string
          website_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          logo_url?: string | null
          name?: string
          website_url?: string | null
        }
        Relationships: []
      }
      past_events: {
        Row: {
          created_at: string
          display_order: number
          event_date: string | null
          id: string
          image_url: string | null
          location: string | null
          title: string
          title_en: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          event_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          title: string
          title_en?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          event_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          title?: string
          title_en?: string | null
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          category: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          title: string
          title_en: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          title: string
          title_en?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          title?: string
          title_en?: string | null
        }
        Relationships: []
      }
      speakers: {
        Row: {
          card_color: string | null
          created_at: string
          description: string | null
          description_en: string | null
          display_order: number
          duration_minutes: number | null
          external_link: string | null
          gallery_urls: string[] | null
          id: string
          is_live: boolean
          is_supervisor: boolean
          live_started_at: string | null
          name: string
          photo_url: string | null
          scheduled_time: string | null
          specialty: string | null
          specialty_en: string | null
          talk_title: string | null
          talk_title_en: string | null
          updated_at: string
        }
        Insert: {
          card_color?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          display_order?: number
          duration_minutes?: number | null
          external_link?: string | null
          gallery_urls?: string[] | null
          id?: string
          is_live?: boolean
          is_supervisor?: boolean
          live_started_at?: string | null
          name: string
          photo_url?: string | null
          scheduled_time?: string | null
          specialty?: string | null
          specialty_en?: string | null
          talk_title?: string | null
          talk_title_en?: string | null
          updated_at?: string
        }
        Update: {
          card_color?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          display_order?: number
          duration_minutes?: number | null
          external_link?: string | null
          gallery_urls?: string[] | null
          id?: string
          is_live?: boolean
          is_supervisor?: boolean
          live_started_at?: string | null
          name?: string
          photo_url?: string | null
          scheduled_time?: string | null
          specialty?: string | null
          specialty_en?: string | null
          talk_title?: string | null
          talk_title_en?: string | null
          updated_at?: string
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
          role?: Database["public"]["Enums"]["app_role"]
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
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
