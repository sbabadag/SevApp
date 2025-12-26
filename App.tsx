// Import polyfills FIRST - must be before any other imports
import './polyfill';

import React, { ErrorInfo, ReactNode, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, Text, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AppNavigator from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { Colors } from './src/constants/theme';
import { registerForPushNotificationsAsync, setupNotificationListeners } from './src/utils/notifications';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong</Text>
          <Text style={styles.errorDetail}>{this.state.error?.message}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

function AppContent(): JSX.Element {
  const { loading, user } = useAuth();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    let isMounted = true;
    let cleanup: (() => void) | undefined;

    // Register for push notifications when user is logged in
    // This MUST be called to request notification permissions
    if (user) {
      console.log('🔔 App: User logged in, requesting notification permissions...');
      registerForPushNotificationsAsync()
        .then((token) => {
          if (token && isMounted) {
            console.log('✅ Push notification token registered:', token);
            console.log('📋 Copy this token to test notifications:');
            console.log('   node scripts/testNotification.js', token);
          } else if (isMounted) {
            console.warn('⚠️ App: No push token received - permissions may have been denied');
          }
        })
        .catch((error) => {
          console.error('❌ App: Error registering for push notifications:', error);
        });

      // Set up notification listeners
      cleanup = setupNotificationListeners(
        (notification) => {
          const content = notification.request.content;
          console.log('Notification received in foreground:', {
            title: content.title,
            body: content.body,
            sound: content.sound,
          });
          // Sound should play automatically via the notification handler
        },
        (response) => {
          console.log('Notification tapped:', response);
          // Handle notification tap - you can navigate to specific screen here
          const data = response.notification.request.content.data;
          if (data?.notificationId) {
            // Navigate to notification detail or mark as read
            console.log('Notification ID:', data.notificationId);
          }
        }
      );
    } else {
      console.log('ℹ️ App: No user logged in, skipping notification registration');
    }

    return () => {
      isMounted = false;
      if (cleanup) cleanup();
    };
  }, [user]);

  try {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }

    return <AppNavigator />;
  } catch (error) {
    console.error('Error in AppContent:', error);
    // Fallback: render navigator anyway
    return <AppNavigator />;
  }
}

export default function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <AppContent />
          <StatusBar style="auto" />
        </AuthProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.error,
    marginBottom: 10,
  },
  errorDetail: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

