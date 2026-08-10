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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      cases: {
        Row: {
          alcoholic: boolean | null
          athletic: boolean | null
          came_from: string | null
          created_at: string
          created_by: string | null
          doctor_advice: string | null
          drugs_used: string | null
          fasting_since: string | null
          has_diet_plan: boolean | null
          has_prior_contract: boolean | null
          id: string
          is_pregnant: boolean | null
          patient_id: string
          payment_method: string | null
          payment_status: string | null
          referring_doctor: string | null
          report_sent_at: string | null
          smoker: boolean | null
        }
        Insert: {
          alcoholic?: boolean | null
          athletic?: boolean | null
          came_from?: string | null
          created_at?: string
          created_by?: string | null
          doctor_advice?: string | null
          drugs_used?: string | null
          fasting_since?: string | null
          has_diet_plan?: boolean | null
          has_prior_contract?: boolean | null
          id?: string
          is_pregnant?: boolean | null
          patient_id: string
          payment_method?: string | null
          payment_status?: string | null
          referring_doctor?: string | null
          report_sent_at?: string | null
          smoker?: boolean | null
        }
        Update: {
          alcoholic?: boolean | null
          athletic?: boolean | null
          came_from?: string | null
          created_at?: string
          created_by?: string | null
          doctor_advice?: string | null
          drugs_used?: string | null
          fasting_since?: string | null
          has_diet_plan?: boolean | null
          has_prior_contract?: boolean | null
          id?: string
          is_pregnant?: boolean | null
          patient_id?: string
          payment_method?: string | null
          payment_status?: string | null
          referring_doctor?: string | null
          report_sent_at?: string | null
          smoker?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          created_at: string
          created_by: string | null
          dob: string
          email: string | null
          first_name: string
          gender: string
          id: string
          last_name: string
          marital_status: string | null
          phone: string
          referral_source: string | null
          residence: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          dob: string
          email?: string | null
          first_name: string
          gender: string
          id?: string
          last_name: string
          marital_status?: string | null
          phone: string
          referral_source?: string | null
          residence?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          dob?: string
          email?: string | null
          first_name?: string
          gender?: string
          id?: string
          last_name?: string
          marital_status?: string | null
          phone?: string
          referral_source?: string | null
          residence?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          auth_user_id: string
          created_at: string
          full_name: string
          id: string
          role: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          full_name: string
          id?: string
          role: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          full_name?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
      test_catalog: {
        Row: {
          active: boolean
          code: string | null
          created_at: string
          id: string
          name: string | null
          price: number | null
          specimen_type: string | null
          unit: string | null
        }
        Insert: {
          active?: boolean
          code?: string | null
          created_at?: string
          id?: string
          name?: string | null
          price?: number | null
          specimen_type?: string | null
          unit?: string | null
        }
        Update: {
          active?: boolean
          code?: string | null
          created_at?: string
          id?: string
          name?: string | null
          price?: number | null
          specimen_type?: string | null
          unit?: string | null
        }
        Relationships: []
      }
      test_orders: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          case_id: string
          created_at: string
          id: string
          is_repeat: boolean
          price_snapshot: number | null
          processed_at: string | null
          processed_by: string | null
          repeat_reason: string | null
          result_flag: string | null
          result_unit: string | null
          result_value: number | null
          sampled_at: string | null
          sampled_by: string | null
          status: string
          test_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          case_id: string
          created_at?: string
          id?: string
          is_repeat?: boolean
          price_snapshot?: number | null
          processed_at?: string | null
          processed_by?: string | null
          repeat_reason?: string | null
          result_flag?: string | null
          result_unit?: string | null
          result_value?: number | null
          sampled_at?: string | null
          sampled_by?: string | null
          status?: string
          test_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          case_id?: string
          created_at?: string
          id?: string
          is_repeat?: boolean
          price_snapshot?: number | null
          processed_at?: string | null
          processed_by?: string | null
          repeat_reason?: string | null
          result_flag?: string | null
          result_unit?: string | null
          result_value?: number | null
          sampled_at?: string | null
          sampled_by?: string | null
          status?: string
          test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_orders_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_orders_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_orders_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_orders_sampled_by_fkey"
            columns: ["sampled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_orders_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "test_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_role: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
