/**
 * Manual Supabase Database type definition.
 *
 * To auto-generate from your live schema, run:
 *   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
 *
 * This manual version covers tables from migrations:
 *   - 001-auth-profiles.sql  → profiles
 *   - 002-menus-table.sql → menus
 */

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          role: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          role?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          role?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      menus: {
        Row: {
          id: number;
          name: string | null;
          description: string | null;
          price: number | null;
          discount: number | null;
          image_url: string | null;
          category: string | null;
          is_available: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name?: string | null;
          description?: string | null;
          price?: number | null;
          discount?: number | null;
          image_url?: string | null;
          category?: string | null;
          is_available?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string | null;
          description?: string | null;
          price?: number | null;
          discount?: number | null;
          image_url?: string | null;
          category?: string | null;
          is_available?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tables: {
        Row: {
          id: number;
          name: string | null;
          status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name?: string | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

/** Convenience alias for a profiles table row */
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

/** Convenience alias for a menus table row */
export type MenuItemRow = Database["public"]["Tables"]["menus"]["Row"];
