export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics: {
        Row: {
          demographics: Json | null
          engagement: Json | null
          id: string
          metadata: Json | null
          metrics: Json
          period: string
          timestamp: string
          trends: Json | null
        }
        Insert: {
          demographics?: Json | null
          engagement?: Json | null
          id?: string
          metadata?: Json | null
          metrics: Json
          period: string
          timestamp?: string
          trends?: Json | null
        }
        Update: {
          demographics?: Json | null
          engagement?: Json | null
          id?: string
          metadata?: Json | null
          metrics?: Json
          period?: string
          timestamp?: string
          trends?: Json | null
        }
        Relationships: []
      }
      communications: {
        Row: {
          channel: string
          constituent_id: string | null
          content: string
          created_at: string
          id: string
          message_type: string
          representative_id: string | null
          sent_at: string | null
          status: string | null
        }
        Insert: {
          channel: string
          constituent_id?: string | null
          content: string
          created_at?: string
          id?: string
          message_type: string
          representative_id?: string | null
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          channel?: string
          constituent_id?: string | null
          content?: string
          created_at?: string
          id?: string
          message_type?: string
          representative_id?: string | null
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communications_constituent_id_fkey"
            columns: ["constituent_id"]
            isOneToOne: false
            referencedRelation: "constituents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_representative_id_fkey"
            columns: ["representative_id"]
            isOneToOne: false
            referencedRelation: "representatives"
            referencedColumns: ["id"]
          },
        ]
      }
      constituents: {
        Row: {
          created_at: string
          district: string | null
          email: string | null
          full_name: string
          id: string
          preferences: Json | null
        }
        Insert: {
          created_at?: string
          district?: string | null
          email?: string | null
          full_name: string
          id?: string
          preferences?: Json | null
        }
        Update: {
          created_at?: string
          district?: string | null
          email?: string | null
          full_name?: string
          id?: string
          preferences?: Json | null
        }
        Relationships: []
      }
      group_members: {
        Row: {
          constituent_id: string
          group_id: string
          joined_at: string
          role: string | null
        }
        Insert: {
          constituent_id: string
          group_id: string
          joined_at?: string
          role?: string | null
        }
        Update: {
          constituent_id?: string
          group_id?: string
          joined_at?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_constituent_id_fkey"
            columns: ["constituent_id"]
            isOneToOne: false
            referencedRelation: "constituents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          analytics: Json | null
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          name: string
          representative_id: string | null
          settings: Json | null
          type: string
          updated_at: string | null
        }
        Insert: {
          analytics?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          representative_id?: string | null
          settings?: Json | null
          type: string
          updated_at?: string | null
        }
        Update: {
          analytics?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          representative_id?: string | null
          settings?: Json | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_representative_id_fkey"
            columns: ["representative_id"]
            isOneToOne: false
            referencedRelation: "representatives"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          displayname: string | null
          email: string
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          created_at?: string
          displayname?: string | null
          email: string
          id: string
          metadata?: Json | null
          role: string
        }
        Update: {
          created_at?: string
          displayname?: string | null
          email?: string
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: []
      }
      representatives: {
        Row: {
          created_at: string
          district: string | null
          email: string
          full_name: string
          id: string
          office_type: string | null
        }
        Insert: {
          created_at?: string
          district?: string | null
          email: string
          full_name: string
          id?: string
          office_type?: string | null
        }
        Update: {
          created_at?: string
          district?: string | null
          email?: string
          full_name?: string
          id?: string
          office_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      link_company_admin_profile: {
        Args: {
          user_id: string
        }
        Returns: undefined
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
