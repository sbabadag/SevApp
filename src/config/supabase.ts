import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

    supabaseInstance = createClient(finalUrl, finalKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });

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

