import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, Notification } from '../types';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationsScreenProps {
  navigation: NavigationProp<'Notifications'>;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const { notifications, loading, markAsRead, markAllAsRead, refreshNotifications } = useNotifications();

  const getIcon = (type: Notification['type']): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'order':
        return 'briefcase-outline';
      case 'promotion':
        return 'megaphone-outline';
      default:
        return 'notifications-outline';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllAsRead} disabled={notifications.length === 0 || notifications.every(n => n.read)}>
          <Text style={[styles.markAllRead, (notifications.length === 0 || notifications.every(n => n.read)) && styles.markAllReadDisabled]}>
            Mark all read
          </Text>
        </TouchableOpacity>
      </View>
      {loading && notifications.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-outline" size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyText}>No notifications yet</Text>
          <Text style={styles.emptySubtext}>You'll see updates about your orders and promotions here</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refreshNotifications}
              colors={[Colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.notificationCard, !item.read && styles.unreadCard]}
              onPress={() => !item.read && markAsRead(item.id)}
            >
            <View style={styles.iconContainer}>
              <Ionicons name={getIcon(item.type)} size={24} color={Colors.primary} />
            </View>
            <View style={styles.content}>
              <Text style={[styles.title, !item.read && styles.unreadTitle]}>
                {item.title}
              </Text>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
      />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  markAllRead: {
    ...Typography.bodySmall,
    color: Colors.primary,
  },
  list: {
    padding: Spacing.lg,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    position: 'relative',
  },
  unreadCard: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  time: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  unreadDot: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    ...Typography.h3,
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  markAllReadDisabled: {
    opacity: 0.5,
  },
});

export default NotificationsScreen;

