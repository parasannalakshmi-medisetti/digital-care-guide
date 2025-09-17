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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_type: string
          consultation_request_id: string
          created_at: string
          doctor_id: string
          id: string
          notes: string | null
          patient_id: string
          prescription_id: string | null
          scheduled_date: string
          scheduled_time: string
          status: string
          updated_at: string
        }
        Insert: {
          appointment_type?: string
          consultation_request_id: string
          created_at?: string
          doctor_id: string
          id?: string
          notes?: string | null
          patient_id: string
          prescription_id?: string | null
          scheduled_date: string
          scheduled_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_type?: string
          consultation_request_id?: string
          created_at?: string
          doctor_id?: string
          id?: string
          notes?: string | null
          patient_id?: string
          prescription_id?: string | null
          scheduled_date?: string
          scheduled_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      consultation_requests: {
        Row: {
          consultation_type: string
          created_at: string
          doctor_id: string
          doctor_response: string | null
          id: string
          patient_id: string
          request_message: string | null
          scheduled_time: string | null
          status: string
          symptoms: string
          updated_at: string
        }
        Insert: {
          consultation_type?: string
          created_at?: string
          doctor_id: string
          doctor_response?: string | null
          id?: string
          patient_id: string
          request_message?: string | null
          scheduled_time?: string | null
          status?: string
          symptoms: string
          updated_at?: string
        }
        Update: {
          consultation_type?: string
          created_at?: string
          doctor_id?: string
          doctor_response?: string | null
          id?: string
          patient_id?: string
          request_message?: string | null
          scheduled_time?: string | null
          status?: string
          symptoms?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultation_requests_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_requests_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_schedule: {
        Row: {
          consultation_request_id: string | null
          created_at: string
          date: string
          doctor_id: string
          end_time: string
          id: string
          notes: string | null
          patient_id: string | null
          start_time: string
          status: string
          updated_at: string
        }
        Insert: {
          consultation_request_id?: string | null
          created_at?: string
          date: string
          doctor_id: string
          end_time: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          start_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          consultation_request_id?: string | null
          created_at?: string
          date?: string
          doctor_id?: string
          end_time?: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          start_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      doctors: {
        Row: {
          available: boolean | null
          bio: string | null
          created_at: string
          email: string
          experience_years: number | null
          full_name: string
          id: string
          license_number: string
          phone: string | null
          specialization: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          available?: boolean | null
          bio?: string | null
          created_at?: string
          email: string
          experience_years?: number | null
          full_name: string
          id?: string
          license_number: string
          phone?: string | null
          specialization: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          available?: boolean | null
          bio?: string | null
          created_at?: string
          email?: string
          experience_years?: number | null
          full_name?: string
          id?: string
          license_number?: string
          phone?: string | null
          specialization?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          created_at: string
          current_symptoms: string | null
          date_of_birth: string | null
          email: string
          emergency_contact: string | null
          full_name: string
          gender: string | null
          id: string
          medical_history: string | null
          phone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_symptoms?: string | null
          date_of_birth?: string | null
          email: string
          emergency_contact?: string | null
          full_name: string
          gender?: string | null
          id?: string
          medical_history?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_symptoms?: string | null
          date_of_birth?: string | null
          email?: string
          emergency_contact?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          medical_history?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      prescriptions: {
        Row: {
          consultation_request_id: string
          created_at: string
          doctor_id: string
          dosage_instructions: string
          follow_up_date: string | null
          health_tips: string | null
          id: string
          medications: string
          notes: string | null
          patient_id: string
        }
        Insert: {
          consultation_request_id: string
          created_at?: string
          doctor_id: string
          dosage_instructions: string
          follow_up_date?: string | null
          health_tips?: string | null
          id?: string
          medications: string
          notes?: string | null
          patient_id: string
        }
        Update: {
          consultation_request_id?: string
          created_at?: string
          doctor_id?: string
          dosage_instructions?: string
          follow_up_date?: string | null
          health_tips?: string | null
          id?: string
          medications?: string
          notes?: string | null
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_consultation_request_id_fkey"
            columns: ["consultation_request_id"]
            isOneToOne: false
            referencedRelation: "consultation_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          emergency_contact: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          emergency_contact?: string | null
          full_name: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          emergency_contact?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_user_id: string | null
          available: boolean | null
          bio: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          emergency_contact: string | null
          experience_years: number | null
          full_name: string
          gender: string | null
          id: string
          license_number: string | null
          medical_history: string | null
          phone: string | null
          specialization: string | null
          updated_at: string
          user_type: string
        }
        Insert: {
          auth_user_id?: string | null
          available?: boolean | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          emergency_contact?: string | null
          experience_years?: number | null
          full_name: string
          gender?: string | null
          id?: string
          license_number?: string | null
          medical_history?: string | null
          phone?: string | null
          specialization?: string | null
          updated_at?: string
          user_type: string
        }
        Update: {
          auth_user_id?: string | null
          available?: boolean | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          emergency_contact?: string | null
          experience_years?: number | null
          full_name?: string
          gender?: string | null
          id?: string
          license_number?: string | null
          medical_history?: string | null
          phone?: string | null
          specialization?: string | null
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      doctor_can_view_patient: {
        Args: { patient_user_id: string }
        Returns: boolean
      }
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
