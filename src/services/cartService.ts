import { supabase } from '../config/supabase';
import { CartItem } from '../types';

class CartService {
  /**
   * Get cart items for a user
   */
  async getCartItems(userId: string): Promise<{ data: CartItem[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (
            id,
            name,
            price,
            image_url
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const cartItems: CartItem[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.products.name,
        price: item.products.price,
        image: item.products.image_url,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      }));

      return { data: cartItems, error: null };
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return { data: [], error: error as Error };
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(
    userId: string,
    productId: number,
    quantity: number,
    size?: string,
    color?: string
  ): Promise<{ data: CartItem | null; error: Error | null }> {
    try {
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .eq('size', size || null)
        .eq('color', color || null)
        .single();

      if (existingItem) {
        // Update quantity
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)
          .select(`
            *,
            products (
              id,
              name,
              price,
              image_url
            )
          `)
          .single();

        if (error) throw error;

        return {
          data: {
            id: data.id,
            name: data.products.name,
            price: data.products.price,
            image: data.products.image_url,
            size: data.size,
            color: data.color,
            quantity: data.quantity,
          },
          error: null,
        };
      } else {
        // Insert new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            product_id: productId,
            quantity,
            size: size || null,
            color: color || null,
          })
          .select(`
            *,
            products (
              id,
              name,
              price,
              image_url
            )
          `)
          .single();

        if (error) throw error;

        return {
          data: {
            id: data.id,
            name: data.products.name,
            price: data.products.price,
            image: data.products.image_url,
            size: data.size,
            color: data.color,
            quantity: data.quantity,
          },
          error: null,
        };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItemQuantity(
    cartItemId: number,
    quantity: number
  ): Promise<{ error: Error | null }> {
    try {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return this.removeCartItem(cartItemId);
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error updating cart item:', error);
      return { error: error as Error };
    }
  }

  /**
   * Remove item from cart
   */
  async removeCartItem(cartItemId: number): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error removing cart item:', error);
      return { error: error as Error };
    }
  }

  /**
   * Clear entire cart
   */
  async clearCart(userId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { error: error as Error };
    }
  }
}

export const cartService = new CartService();


