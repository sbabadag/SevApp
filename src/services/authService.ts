import { supabase } from '../config/supabase';
import { Session, User, AuthError } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

class AuthService {
  /**
   * Sign up a new user
   */
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName || '',
          },
        },
      });

      return {
        user: authData.user,
        session: authData.session,
        error,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Sign in an existing user
   */
  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      return {
        user: authData.user,
        session: authData.session,
        error,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  /**
   * Get the current session
   */
  async getSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  /**
   * Get the current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'exp://localhost:8081/--/reset-password',
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  /**
   * Sign in with Google using Supabase OAuth
   */
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      // Get Supabase URL from environment variables
      const supabaseUrl = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPABASE_URL) || '';
      
      if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
        return {
          user: null,
          session: null,
          error: { message: 'Supabase URL is not configured. Please set EXPO_PUBLIC_SUPABASE_URL in your .env file', status: 400 } as AuthError,
        };
      }

      // Create redirect URI using expo-auth-session's makeRedirectUri
      // This generates the correct URL format for OAuth flows
      const redirectTo = AuthSession.makeRedirectUri({
        scheme: Constants.expoConfig?.scheme || 'exp',
        path: 'auth',
      });
      
      console.log('Using redirect URL:', redirectTo);
      
      // IMPORTANT: This URL must match EXACTLY what's configured in Supabase
      // Go to: Supabase Dashboard → Authentication → URL Configuration → Redirect URLs
      // Add this exact URL there

      // Get the OAuth URL from Supabase
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          skipBrowserRedirect: true, // We'll handle the browser redirect ourselves
        },
      });

      if (oauthError || !data?.url) {
        return {
          user: null,
          session: null,
          error: oauthError || { message: 'Failed to get OAuth URL', status: 400 } as AuthError,
        };
      }

      // Open the OAuth URL in browser
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      if (result.type === 'success' && result.url) {
        // Parse the callback URL to extract tokens
        const parseQueryParams = (url: string): Record<string, string> => {
          const params: Record<string, string> = {};
          // Extract hash fragment or query string
          const hashIndex = url.indexOf('#');
          const queryIndex = url.indexOf('?');
          
          let queryString = '';
          if (hashIndex !== -1) {
            queryString = url.substring(hashIndex + 1);
          } else if (queryIndex !== -1) {
            queryString = url.substring(queryIndex + 1);
          }
          
          if (queryString) {
            queryString.split('&').forEach((param) => {
              const [key, value] = param.split('=');
              if (key && value) {
                params[decodeURIComponent(key)] = decodeURIComponent(value);
              }
            });
          }
          return params;
        };

        const params = parseQueryParams(result.url);
        const accessToken = params.access_token;
        const refreshToken = params.refresh_token;
        const error = params.error;
        const errorDescription = params.error_description;

        if (error) {
          return {
            user: null,
            session: null,
            error: { message: errorDescription || error, status: 400 } as AuthError,
          };
        }

        if (accessToken && refreshToken) {
          // Set the session in Supabase
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          return {
            user: sessionData.user,
            session: sessionData.session,
            error: sessionError,
          };
        }

        return {
          user: null,
          session: null,
          error: { message: 'Failed to extract tokens from OAuth response', status: 400 } as AuthError,
        };
      } else if (result.type === 'cancel') {
        return {
          user: null,
          session: null,
          error: { message: 'OAuth session was cancelled', status: 400 } as AuthError,
        };
      } else {
        return {
          user: null,
          session: null,
          error: { message: 'OAuth session failed', status: 400 } as AuthError,
        };
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      return {
        user: null,
        session: null,
        error: { message: error?.message || 'An unexpected error occurred', status: 500 } as AuthError,
      };
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
}

export const authService = new AuthService();

