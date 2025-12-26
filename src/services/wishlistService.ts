import { supabase } from '../config/supabase';
import { Product } from '../types';

class WishlistService {
  /**
   * Get wishlist items for a user
   */
  async getWishlist(userId: string): Promise<{ data: Product[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select(`
          *,
          products (
            id,
            name,
            price,
            original_price,
            image_url,
            description,
            discount_percentage,
            rating,
            review_count,
            in_stock,
            categories (
              name
            ),
            product_images (
              image_url,
              order
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const products: Product[] = (data || []).map((item: any) => ({
        id: item.products.id,
        name: item.products.name,
        price: item.products.price,
        originalPrice: item.products.original_price,
        image: item.products.image_url,
        images: item.products.product_images?.map((img: any) => img.image_url).sort((a: any, b: any) => a.display_order - b.display_order) || [item.products.image_url],
        description: item.products.description,
        category: item.products.categories?.name,
        isFavorite: true,
        discount: item.products.discount_percentage,
        rating: item.products.rating,
        reviews: item.products.review_count,
        inStock: item.products.in_stock,
      }));

      return { data: products, error: null };
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return { data: [], error: error as Error };
    }
  }

  /**
   * Add product to wishlist
   */
  async addToWishlist(userId: string, productId: number): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .insert({
          user_id: userId,
          product_id: productId,
        });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { error: error as Error };
    }
  }

  /**
   * Remove product from wishlist
   */
  async removeFromWishlist(userId: string, productId: number): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { error: error as Error };
    }
  }

  /**
   * Check if product is in wishlist
   */
  async isInWishlist(userId: string, productId: number): Promise<{ isFavorite: boolean; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" which is fine
        throw error;
      }

      return { isFavorite: !!data, error: null };
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return { isFavorite: false, error: error as Error };
    }
  }
}

export const wishlistService = new WishlistService();

