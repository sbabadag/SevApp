import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get Supabase URL and Anon Key from environment variables
// For Expo, these are loaded from .env file, app.json extra section, or EAS secrets
// The EXPO_PUBLIC_ prefix makes them available in the app
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  try {
    // Try multiple sources for environment variables (in order of priority):
    // 1. Constants.expoConfig.extra (production builds - most reliable)
    // 2. process.env (development/local or EAS secrets)
    // 3. Constants.expoConfig (fallback)
    const supabaseUrl = 
      Constants.expoConfig?.extra?.supabaseUrl ||
      Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL ||
      (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPABASE_URL) ||
      '';
    
    const supabaseAnonKey = 
      Constants.expoConfig?.extra?.supabaseAnonKey ||
      Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
      (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPABASE_ANON_KEY) ||
      '';

    // Debug logging (always log to help debug production issues)
    console.log('🔍 Supabase Config Check:');
    console.log('  URL from process.env:', process.env?.EXPO_PUBLIC_SUPABASE_URL ? `✅ ${process.env.EXPO_PUBLIC_SUPABASE_URL.substring(0, 30)}...` : '❌ Not set');
    console.log('  Key from process.env:', process.env?.EXPO_PUBLIC_SUPABASE_ANON_KEY ? `✅ ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` : '❌ Not set');
    console.log('  URL from Constants.extra.supabaseUrl:', Constants.expoConfig?.extra?.supabaseUrl || '❌ Not set');
    console.log('  Key from Constants.extra.supabaseAnonKey:', Constants.expoConfig?.extra?.supabaseAnonKey ? `${String(Constants.expoConfig.extra.supabaseAnonKey).substring(0, 20)}...` : '❌ Not set');
    console.log('  Final URL:', supabaseUrl || 'NOT SET');
    console.log('  Final Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET');

    // Use placeholder values if not configured to prevent crashes
    const finalUrl = supabaseUrl || 'https://placeholder.supabase.co';
    const finalKey = supabaseAnonKey || 'placeholder-key';

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
      console.warn(
        '⚠️ Supabase URL and Anon Key are not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in EAS secrets or app.json'
      );
    } else {
      console.log('✅ Supabase configuration loaded successfully');
    }

    // Custom storage adapter for React Native using AsyncStorage
    // AsyncStorage can handle larger values (no 2048 byte limit like SecureStore)
    // This ensures sessions are properly persisted for auto-login
    let firstRetrieval = true;
    const storageAdapter = {
      getItem: async (key: string): Promise<string | null> => {
        try {
          const value = await AsyncStorage.getItem(key);
          // Only log on first retrieval to reduce noise
          if (value && firstRetrieval) {
            console.log('📦 Storage: Retrieved session from AsyncStorage');
            firstRetrieval = false;
          }
          return value;
        } catch (error) {
          console.error('❌ Storage getItem error:', error);
          return null;
        }
      },
      setItem: async (key: string, value: string): Promise<void> => {
        try {
          await AsyncStorage.setItem(key, value);
          console.log('✅ Storage: Session saved to AsyncStorage (', value.length, 'bytes)');
          console.log('✅ Storage: Auto-login will work on next app launch');
        } catch (error) {
          console.error('❌ Storage setItem error:', error);
          throw error; // Re-throw to let Supabase know storage failed
        }
      },
      removeItem: async (key: string): Promise<void> => {
        try {
          await AsyncStorage.removeItem(key);
          console.log('✅ Storage: Session removed from AsyncStorage');
        } catch (error) {
          console.error('❌ Storage removeItem error:', error);
        }
      },
    };

    supabaseInstance = createClient(finalUrl, finalKey, {
      auth: {
        autoRefreshToken: true, // Automatically refresh tokens when they expire
        persistSession: true, // CRITICAL: Save session to device storage for auto-login
        detectSessionInUrl: false, // Don't detect session in URL (React Native)
        storage: storageAdapter, // Use AsyncStorage for session persistence (handles large values)
      },
    });
    
    console.log('✅ Supabase client initialized with session persistence enabled');

    return supabaseInstance;
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    // Return a minimal client that won't crash
    const placeholderUrl = 'https://placeholder.supabase.co';
    const placeholderKey = 'placeholder-key';
    return createClient(placeholderUrl, placeholderKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }
}

export const supabase = getSupabaseClient();

