import { supabase } from '../config/supabase';
import { Notification } from '../types';

export interface CreateNotificationData {
  title: string;
  message: string;
  type?: 'order' | 'promotion' | 'general' | 'system';
  data?: Record<string, any>;
  userId?: string; // If not provided, uses current user
}

class NotificationService {
  /**
   * Get all notifications for the current user
   */
  async getNotifications(limit: number = 50): Promise<{ data: Notification[]; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: [], error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const notifications: Notification[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        message: item.message,
        time: this.formatTimeAgo(item.created_at),
        type: item.type || 'general',
        read: item.read || false,
      }));

      console.log('NotificationService: Fetched', notifications.length, 'notifications');
      return { data: notifications, error: null };
    } catch (error) {
      console.error('NotificationService: Error fetching notifications:', error);
      // Return empty array even on error so UI doesn't get stuck
      return { data: [], error: error as Error };
    }
  }

  /**
   * Get unread notifications count
   */
  async getUnreadCount(): Promise<{ count: number; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { count: 0, error: null };
      }

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      return { count: count || 0, error: null };
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return { count: 0, error: error as Error };
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: number): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { error: error as Error };
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: new Error('User not authenticated') };
      }

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { error: error as Error };
    }
  }

  /**
   * Create a notification (for admin/system use)
   */
  async createNotification(notificationData: CreateNotificationData): Promise<{ data: Notification | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = notificationData.userId || user?.id;

      if (!userId) {
        return { data: null, error: new Error('User ID is required') };
      }

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: notificationData.title,
          message: notificationData.message,
          type: notificationData.type || 'general',
          data: notificationData.data || {},
        })
        .select()
        .single();

      if (error) throw error;

      const notification: Notification = {
        id: data.id,
        title: data.title,
        message: data.message,
        time: this.formatTimeAgo(data.created_at),
        type: data.type || 'general',
        read: data.read || false,
      };

      return { data: notification, error: null };
    } catch (error) {
      console.error('Error creating notification:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: number): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { error: error as Error };
    }
  }

  /**
   * Subscribe to real-time notifications
   */
  async subscribeToNotifications(callback: (notification: Notification) => void): Promise<(() => void) | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('NotificationService: No user, skipping real-time subscription');
        return null;
      }

      // Use a unique channel name per user to avoid conflicts
      const channelName = `notifications-${user.id.substring(0, 8)}`;
      
      const channel = supabase
        .channel(channelName, {
          config: {
            broadcast: { self: true },
            presence: { key: user.id },
          },
        })
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('NotificationService: Real-time notification received:', payload.new?.id);
            const newNotification: Notification = {
              id: payload.new.id,
              title: payload.new.title,
              message: payload.new.message,
              time: this.formatTimeAgo(payload.new.created_at),
              type: payload.new.type || 'general',
              read: payload.new.read || false,
              data: payload.new.data || {},
            };
            callback(newNotification);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('NotificationService: ✅ Real-time subscription active');
          } else if (status === 'CHANNEL_ERROR') {
            // Only log once, not repeatedly
            console.warn('NotificationService: ⚠️ Real-time subscription error. Polling will be used as fallback.');
            console.warn('NotificationService: To enable real-time, go to Supabase Dashboard → Database → Replication');
            console.warn('NotificationService: Enable replication for the "notifications" table');
          } else if (status === 'TIMED_OUT') {
            console.warn('NotificationService: ⚠️ Real-time subscription timed out. Retrying...');
          }
        });

      return () => {
        console.log('NotificationService: Unsubscribing from real-time notifications');
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error('NotificationService: Error setting up subscription:', error);
      return null;
    }
  }

  /**
   * Format time ago
   */
  private formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}

export const notificationService = new NotificationService();

