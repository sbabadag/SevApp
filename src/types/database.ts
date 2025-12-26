// Database types for Supabase
// These types should match your Supabase database schema

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          price: number;
          original_price: number | null;
          image_url: string;
          category_id: number | null;
          created_at: string;
          updated_at: string;
          in_stock: boolean;
          discount_percentage: number | null;
          rating: number | null;
          review_count: number | null;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          price: number;
          original_price?: number | null;
          image_url: string;
          category_id?: number | null;
          created_at?: string;
          updated_at?: string;
          in_stock?: boolean;
          discount_percentage?: number | null;
          rating?: number | null;
          review_count?: number | null;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          price?: number;
          original_price?: number | null;
          image_url?: string;
          category_id?: number | null;
          created_at?: string;
          updated_at?: string;
          in_stock?: boolean;
          discount_percentage?: number | null;
          rating?: number | null;
          review_count?: number | null;
        };
      };
      categories: {
        Row: {
          id: number;
          name: string;
          icon: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          icon?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          icon?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: number;
          product_id: number;
          image_url: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          product_id: number;
          image_url: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          product_id?: number;
          image_url?: string;
          display_order?: number;
          created_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: number;
          product_id: number;
          size: string | null;
          color: string | null;
          stock_quantity: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          product_id: number;
          size?: string | null;
          color?: string | null;
          stock_quantity?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          product_id?: number;
          size?: string | null;
          color?: string | null;
          stock_quantity?: number;
          created_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: number;
          user_id: string;
          product_id: number;
          quantity: number;
          size: string | null;
          color: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          product_id: number;
          quantity: number;
          size?: string | null;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          product_id?: number;
          quantity?: number;
          size?: string | null;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      wishlist_items: {
        Row: {
          id: number;
          user_id: string;
          product_id: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          product_id: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          product_id?: number;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          subtotal: number;
          shipping: number;
          tax: number;
          total: number;
          shipping_address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          subtotal: number;
          shipping: number;
          tax: number;
          total: number;
          shipping_address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          subtotal?: number;
          shipping?: number;
          tax?: number;
          total?: number;
          shipping_address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: number;
          order_id: string;
          product_id: number;
          quantity: number;
          price: number;
          size: string | null;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          order_id: string;
          product_id: number;
          quantity: number;
          price: number;
          size?: string | null;
          color?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          order_id?: string;
          product_id?: number;
          quantity?: number;
          price?: number;
          size?: string | null;
          color?: string | null;
          created_at?: string;
        };
      };
      addresses: {
        Row: {
          id: number;
          user_id: string;
          name: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          phone: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          name: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          phone: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          name?: string;
          address?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          phone?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: number;
          user_id: string;
          product_id: number;
          rating: number;
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          product_id: number;
          rating: number;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          product_id?: number;
          rating?: number;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    };
  };
}

