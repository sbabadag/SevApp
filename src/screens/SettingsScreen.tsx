import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '../types';
import { testNotificationSound } from '../utils/testSound';
import { registerForPushNotificationsAsync } from '../utils/notifications';
import * as Notifications from 'expo-notifications';

interface SettingsScreenProps {
  navigation: NavigationProp<'Settings'>;
}

interface SettingItem {
  id: number;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen?: string | null;
  type?: 'switch';
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void | Promise<void>;
}

interface SettingsGroup {
  title: string;
  items: SettingItem[];
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [permissionStatus, setPermissionStatus] = useState<string>('checking');

  // Check permission status on mount
  React.useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionStatus(status);
  };

  const requestPermissions = async () => {
    try {
      console.log('SettingsScreen: Requesting notification permissions...');
      const token = await registerForPushNotificationsAsync();
      if (token) {
        Alert.alert(
          '✅ İzin Verildi',
          'Bildirim izinleri başarıyla verildi! Artık bildirimler alabilirsiniz.',
          [{ text: 'Tamam' }]
        );
        await checkPermissionStatus();
      } else {
        Alert.alert(
          '❌ İzin Reddedildi',
          'Bildirim izinleri verilmedi. Lütfen telefon ayarlarından manuel olarak izin verin:\n\nAyarlar → Uygulamalar → SevApp → Bildirimler',
          [{ text: 'Tamam' }]
        );
        await checkPermissionStatus();
      }
    } catch (error) {
      console.error('SettingsScreen: Error requesting permissions:', error);
      Alert.alert('Hata', 'İzin istenirken bir hata oluştu.');
    }
  };

  const settingsGroups: SettingsGroup[] = [
    {
      title: 'Account',
      items: [
        { id: 1, title: 'Edit Profile', icon: 'person-outline', screen: null },
        { id: 2, title: 'Change Password', icon: 'lock-closed-outline', screen: null },
        { id: 3, title: 'Privacy Settings', icon: 'shield-outline', screen: null },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 4,
          title: 'Push Notifications',
          icon: 'notifications-outline',
          type: 'switch',
          value: notificationsEnabled,
          onValueChange: setNotificationsEnabled,
        },
        {
          id: 5,
          title: 'Email Notifications',
          icon: 'mail-outline',
          type: 'switch',
          value: emailNotifications,
          onValueChange: setEmailNotifications,
        },
        {
          id: 9,
          title: permissionStatus === 'granted' 
            ? '✅ Bildirim İzinleri Aktif' 
            : permissionStatus === 'denied'
            ? '❌ Bildirim İzinleri Reddedildi'
            : '⚠️ Bildirim İzinleri İstenmedi',
          icon: permissionStatus === 'granted' ? 'checkmark-circle-outline' : 'alert-circle-outline',
          screen: null,
          onPress: permissionStatus === 'granted' 
            ? undefined 
            : requestPermissions,
        },
        {
          id: 10,
          title: 'Test Notification Sound',
          icon: 'volume-high-outline',
          screen: null,
          onPress: async () => {
            // Check permissions first
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert(
                'İzin Gerekli',
                'Bildirim izinleri verilmedi. Önce izin vermeniz gerekiyor.',
                [
                  { text: 'İptal', style: 'cancel' },
                  {
                    text: 'İzin Ver',
                    onPress: requestPermissions,
                  },
                ]
              );
              return;
            }

            Alert.alert(
              'Ses Testi',
              'Test bildirimi gönderilecek. Cihazınızın sessiz modda olmadığından emin olun.',
              [
                { text: 'İptal', style: 'cancel' },
                {
                  text: 'Test Et',
                  onPress: async () => {
                    await testNotificationSound();
                    Alert.alert('Test Gönderildi', 'Bildirim sesini duydunuz mu?');
                  },
                },
              ]
            );
          },
        },
      ],
    },
    {
      title: 'Support',
      items: [
        { id: 6, title: 'Help Center', icon: 'help-circle-outline', screen: null },
        { id: 7, title: 'Contact Us', icon: 'chatbubble-outline', screen: null },
        { id: 8, title: 'About', icon: 'information-circle-outline', screen: null },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            {group.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.settingItem}
                onPress={() => {
                  if (item.onPress) {
                    item.onPress();
                  } else if (item.screen) {
                    navigation.navigate(item.screen as any);
                  }
                }}
              >
                <View style={styles.settingItemLeft}>
                  <Ionicons name={item.icon} size={24} color={Colors.text} />
                  <Text style={styles.settingItemText}>{item.title}</Text>
                </View>
                {item.type === 'switch' ? (
                  <Switch
                    value={item.value || false}
                    onValueChange={item.onValueChange || (() => {})}
                    trackColor={{ false: Colors.border, true: Colors.primary }}
                  />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
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
  content: {
    flex: 1,
  },
  group: {
    marginBottom: Spacing.xl,
  },
  groupTitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingItemText: {
    ...Typography.body,
    color: Colors.text,
  },
});

export default SettingsScreen;


