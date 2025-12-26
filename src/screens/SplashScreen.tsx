import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Colors, Typography, Spacing } from '../constants/theme';
import { NavigationProp } from '../types';
import { useAuth } from '../context/AuthContext';

interface SplashScreenProps {
  navigation: NavigationProp<'Splash'>;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Wait for auth to finish loading
    if (!loading) {
      // Small delay for smooth transition
      const timer = setTimeout(() => {
        if (user) {
          // User is logged in - go directly to main app
          console.log('✅ Auto-login: User session found, navigating to Main');
          navigation.replace('Main');
        } else {
          // No user session - show onboarding/login
          console.log('ℹ️ Auto-login: No session found, navigating to Onboarding');
          navigation.replace('Onboarding');
        }
      }, 500); // Short delay for smooth UX

      return () => clearTimeout(timer);
    }
  }, [loading, user, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
});

export default SplashScreen;


