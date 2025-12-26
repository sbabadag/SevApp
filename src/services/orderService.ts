import { supabase } from '../config/supabase';
import { Order, OrderItem } from '../types';

class OrderService {
  /**
   * Get all orders for a user
   */
  async getOrders(userId: string): Promise<{ data: Order[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            price,
            size,
            color,
            products (
              name,
              image_url
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const orders: Order[] = (data || []).map((item: any) => ({
        id: item.id,
        date: item.created_at.split('T')[0],
        status: this.mapOrderStatus(item.status),
        items: item.order_items.map((oi: any) => ({
          id: oi.id,
          name: oi.products.name,
          quantity: oi.quantity,
          price: oi.price,
          image: oi.products.image_url,
        })),
        subtotal: item.subtotal,
        shipping: item.shipping,
        tax: item.tax,
        total: item.total,
        address: item.shipping_address,
      }));

      return { data: orders, error: null };
    } catch (error) {
      console.error('Error fetching orders:', error);
      return { data: [], error: error as Error };
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string, userId: string): Promise<{ data: Order | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            price,
            size,
            color,
            products (
              name,
              image_url
            )
          )
        `)
        .eq('id', orderId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (!data) {
        return { data: null, error: null };
      }

      const order: Order = {
        id: data.id,
        date: data.created_at.split('T')[0],
        status: this.mapOrderStatus(data.status),
        items: data.order_items.map((oi: any) => ({
          id: oi.id,
          name: oi.products.name,
          quantity: oi.quantity,
          price: oi.price,
          image: oi.products.image_url,
        })),
        subtotal: data.subtotal,
        shipping: data.shipping,
        tax: data.tax,
        total: data.total,
        address: data.shipping_address,
      };

      return { data: order, error: null };
    } catch (error) {
      console.error('Error fetching order:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Create a new order
   */
  async createOrder(
    userId: string,
    items: Array<{ productId: number; quantity: number; price: number; size?: string; color?: string }>,
    shippingAddress: string,
    subtotal: number,
    shipping: number,
    tax: number
  ): Promise<{ data: Order | null; error: Error | null }> {
    try {
      const total = subtotal + shipping + tax;

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          status: 'pending',
          subtotal,
          shipping,
          tax,
          total,
          shipping_address: shippingAddress,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        size: item.size || null,
        color: item.color || null,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      // Fetch the complete order
      return this.getOrderById(orderData.id, userId);
    } catch (error) {
      console.error('Error creating order:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Map database order status to app order status
   */
  private mapOrderStatus(status: string): Order['status'] {
    const statusMap: Record<string, Order['status']> = {
      pending: 'Processing',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };

    return statusMap[status] || 'Processing';
  }
}

export const orderService = new OrderService();


