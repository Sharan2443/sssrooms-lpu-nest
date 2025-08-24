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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          check_in: string
          check_out: string | null
          created_at: string
          id: string
          payment_status: string
          room_id: string
          special_requests: string | null
          status: string
          student_id: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          check_in: string
          check_out?: string | null
          created_at?: string
          id?: string
          payment_status?: string
          room_id: string
          special_requests?: string | null
          status?: string
          student_id: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          check_in?: string
          check_out?: string | null
          created_at?: string
          id?: string
          payment_status?: string
          room_id?: string
          special_requests?: string | null
          status?: string
          student_id?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          course: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_admin: boolean | null
          phone: string | null
          university_id: string | null
          updated_at: string
          user_id: string
          year_of_study: number | null
        }
        Insert: {
          course?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_admin?: boolean | null
          phone?: string | null
          university_id?: string | null
          updated_at?: string
          user_id: string
          year_of_study?: number | null
        }
        Update: {
          course?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_admin?: boolean | null
          phone?: string | null
          university_id?: string | null
          updated_at?: string
          user_id?: string
          year_of_study?: number | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          created_at: string
          id: string
          rating: number
          room_id: string
          student_id: string
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          room_id: string
          student_id: string
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          room_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      rooms: {
        Row: {
          available_from: string | null
          available_until: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string
          current_occupancy: number
          description: string | null
          discount: number | null
          facilities: string[] | null
          gender_preference: string | null
          id: string
          images: string[] | null
          is_available: boolean | null
          location: string
          max_occupancy: number
          original_price: number | null
          owner_id: string | null
          price: number
          rating: number | null
          room_type: string
          title: string
          total_reviews: number | null
          updated_at: string
        }
        Insert: {
          available_from?: string | null
          available_until?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          current_occupancy?: number
          description?: string | null
          discount?: number | null
          facilities?: string[] | null
          gender_preference?: string | null
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          location: string
          max_occupancy?: number
          original_price?: number | null
          owner_id?: string | null
          price: number
          rating?: number | null
          room_type: string
          title: string
          total_reviews?: number | null
          updated_at?: string
        }
        Update: {
          available_from?: string | null
          available_until?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          current_occupancy?: number
          description?: string | null
          discount?: number | null
          facilities?: string[] | null
          gender_preference?: string | null
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          location?: string
          max_occupancy?: number
          original_price?: number | null
          owner_id?: string | null
          price?: number
          rating?: number | null
          room_type?: string
          title?: string
          total_reviews?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      rooms_public: {
        Row: {
          available_from: string | null
          available_until: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string | null
          current_occupancy: number | null
          description: string | null
          discount: number | null
          facilities: string[] | null
          gender_preference: string | null
          id: string | null
          images: string[] | null
          is_available: boolean | null
          location: string | null
          max_occupancy: number | null
          original_price: number | null
          owner_id: string | null
          price: number | null
          rating: number | null
          room_type: string | null
          title: string | null
          total_reviews: number | null
          updated_at: string | null
        }
        Insert: {
          available_from?: string | null
          available_until?: string | null
          contact_person?: never
          contact_phone?: never
          created_at?: string | null
          current_occupancy?: number | null
          description?: string | null
          discount?: number | null
          facilities?: string[] | null
          gender_preference?: string | null
          id?: string | null
          images?: string[] | null
          is_available?: boolean | null
          location?: string | null
          max_occupancy?: number | null
          original_price?: number | null
          owner_id?: string | null
          price?: number | null
          rating?: number | null
          room_type?: string | null
          title?: string | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Update: {
          available_from?: string | null
          available_until?: string | null
          contact_person?: never
          contact_phone?: never
          created_at?: string | null
          current_occupancy?: number | null
          description?: string | null
          discount?: number | null
          facilities?: string[] | null
          gender_preference?: string | null
          id?: string | null
          images?: string[] | null
          is_available?: boolean | null
          location?: string | null
          max_occupancy?: number | null
          original_price?: number | null
          owner_id?: string | null
          price?: number | null
          rating?: number | null
          room_type?: string | null
          title?: string | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Functions: {
      is_admin: {
        Args: { user_uuid: string }
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
