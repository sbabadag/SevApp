import { useState, useEffect, useCallback } from 'react';
import { Notification } from '../types';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';
import { sendLocalNotification } from '../utils/notifications';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const loadNotifications = useCallback(async () => {
    if (!user) {
      console.log('useNotifications: No user, clearing notifications');
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    console.log('useNotifications: Loading notifications for user:', user.id);
    setLoading(true);
    try {
      const [notificationsResult, countResult] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getUnreadCount(),
      ]);

      console.log('useNotifications: Notifications result:', notificationsResult);
      console.log('useNotifications: Count result:', countResult);

      if (notificationsResult.error) {
        console.error('useNotifications: Error fetching notifications:', notificationsResult.error);
      }

      if (notificationsResult.data) {
        setNotifications(notificationsResult.data);
        console.log('useNotifications: Set notifications:', notificationsResult.data.length);
      } else {
        setNotifications([]);
        console.log('useNotifications: No notifications data, setting empty array');
      }

      if (countResult.count !== undefined) {
        setUnreadCount(countResult.count);
        console.log('useNotifications: Unread count:', countResult.count);
      } else if (countResult.error) {
        console.error('useNotifications: Error fetching count:', countResult.error);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('useNotifications: Unexpected error loading notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      console.log('useNotifications: Setting loading to false');
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    loadNotifications();

    // Subscribe to real-time notifications
    let unsubscribe: (() => void) | null = null;

    notificationService.subscribeToNotifications(async (newNotification) => {
      console.log('🔔 useNotifications: New notification received via real-time:', {
        id: newNotification.id,
        title: newNotification.title,
        read: newNotification.read,
      });
      
      // Update UI state
      setNotifications((prev) => [newNotification, ...prev]);
      
      // Only increment if notification is unread
      if (!newNotification.read) {
        setUnreadCount((prev) => prev + 1);
        console.log('useNotifications: Incremented unread count');
        
        // CRITICAL: Trigger local notification with sound when new notification arrives
        // This ensures sound plays even for real-time notifications from Supabase
        console.log('🔊 useNotifications: Triggering local notification with sound...');
        try {
          await sendLocalNotification(
            newNotification.title,
            newNotification.message,
            { notificationId: newNotification.id, type: newNotification.type }
          );
          console.log('✅ useNotifications: Local notification with sound triggered successfully');
        } catch (error) {
          console.error('❌ useNotifications: Error sending local notification:', error);
        }
      } else {
        console.log('useNotifications: Notification is already read, skipping sound');
      }
      
      // Also refresh count from database to ensure accuracy
      notificationService.getUnreadCount().then((result) => {
        if (result.count !== undefined) {
          setUnreadCount(result.count);
          console.log('useNotifications: Refreshed unread count from DB:', result.count);
        }
      });
    }).then((cleanup) => {
      unsubscribe = cleanup;
      console.log('useNotifications: Subscribed to real-time notifications');
    }).catch((error) => {
      console.error('useNotifications: Error subscribing to notifications:', error);
    });

    // Fallback: Poll for new notifications every 10 seconds if real-time doesn't work
    // Less frequent since real-time should handle most updates
    const pollInterval = setInterval(() => {
      notificationService.getUnreadCount().then((result) => {
        if (result.count !== undefined) {
          setUnreadCount((prev) => {
            if (prev !== result.count) {
              console.log('useNotifications: Unread count changed via polling:', prev, '->', result.count);
              return result.count;
            }
            return prev;
          });
        }
      });
    }, 10000); // Poll every 10 seconds (less frequent)

    return () => {
      if (unsubscribe) unsubscribe();
      clearInterval(pollInterval);
      console.log('useNotifications: Cleaned up subscription and polling');
    };
  }, [user?.id]); // Only depend on user.id to prevent multiple subscriptions

  // Add a safety timeout to prevent infinite loading
  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        console.warn('useNotifications: Loading timeout, forcing loading to false');
        setLoading(false);
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [loading]);

  const markAsRead = useCallback(async (notificationId: number) => {
    const { error } = await notificationService.markAsRead(notificationId);
    if (!error) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const { error } = await notificationService.markAllAsRead();
    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  }, []);

  const refreshNotifications = useCallback(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  };
};

