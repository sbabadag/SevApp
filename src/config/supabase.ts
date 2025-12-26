import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get Supabase URL and Anon Key from environment variables
// For Expo, these are loaded from .env file or app.json extra section
// The EXPO_PUBLIC_ prefix makes them available in the app
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  try {
    const supabaseUrl = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPABASE_URL) || '';
    const supabaseAnonKey = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPABASE_ANON_KEY) || '';

    // Use placeholder values if not configured to prevent crashes
    const finalUrl = supabaseUrl || 'https://placeholder.supabase.co';
    const finalKey = supabaseAnonKey || 'placeholder-key';

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn(
        'Supabase URL and Anon Key are not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your environment variables or app.json'
      );
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

