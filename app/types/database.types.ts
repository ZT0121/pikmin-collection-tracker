export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_collections: {
        Row: {
          id: string;
          user_id: string;
          collected_items: Json | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          collected_items?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          collected_items?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'user_collections_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
