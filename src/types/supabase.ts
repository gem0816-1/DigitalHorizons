/**
 * @brief Persisted wishlist item snapshot stored in Supabase.
 */
export interface WishlistItemSnapshot {
  hardware_id: string;
  category: string;
  name: string;
  price: number;
  jd_url: string;
}

/**
 * @brief Supabase database typing contract.
 */
export interface Database {
  public: {
    Tables: {
      saved_builds: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          items: WishlistItemSnapshot[];
          total_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          items: WishlistItemSnapshot[];
          total_price: number;
        };
        Update: Partial<{
          name: string;
          items: WishlistItemSnapshot[];
          total_price: number;
        }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
