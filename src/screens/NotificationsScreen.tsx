import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, Notification } from '../types';

interface NotificationsScreenProps {
  navigation: NavigationProp<'Notifications'>;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const notifications: Notification[] = [
    {
      id: 1,
      title: 'Order Shipped',
      message: 'Your order #12345 has been shipped',
      time: '2 hours ago',
      type: 'order',
      read: false,
    },
    {
      id: 2,
      title: 'New Arrival',
      message: 'Check out our new summer collection',
      time: '5 hours ago',
      type: 'promotion',
      read: false,
    },
    {
      id: 3,
      title: 'Order Delivered',
      message: 'Your order #12344 has been delivered',
      time: '1 day ago',
      type: 'order',
      read: true,
    },
  ];

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
        <TouchableOpacity>
          <Text style={styles.markAllRead}>Mark all read</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notificationCard, !item.read && styles.unreadCard]}
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
});

export default NotificationsScreen;

