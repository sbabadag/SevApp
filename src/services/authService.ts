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
      console.log('🔐 AuthService: Signing in user with email:', data.email);
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error('❌ AuthService: Sign in error:', error.message);
        return {
          user: null,
          session: null,
          error,
        };
      }

      if (authData.session) {
        console.log('✅ AuthService: Sign in successful - Session created');
        console.log('✅ AuthService: Session will be automatically saved to secure storage');
        console.log('✅ AuthService: Session expires at:', new Date(authData.session.expires_at! * 1000).toLocaleString());
        
        // Verify session is saved by immediately checking
        setTimeout(async () => {
          const { data: { session: savedSession } } = await supabase.auth.getSession();
          if (savedSession) {
            console.log('✅ AuthService: Session verified as saved successfully');
          } else {
            console.warn('⚠️ AuthService: Session not found after sign in - may not be persisting');
          }
        }, 500);
      }

      return {
        user: authData.user,
        session: authData.session,
        error: null,
      };
    } catch (error) {
      console.error('❌ AuthService: Sign in exception:', error);
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
      console.log('🔐 AuthService: Signing out user...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ AuthService: Sign out error:', error.message);
      } else {
        console.log('✅ AuthService: Sign out successful - Session cleared from storage');
      }
      return { error };
    } catch (error) {
      console.error('❌ AuthService: Sign out exception:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Get the current session
   * This retrieves the saved session from device storage (auto-login)
   */
  async getSession(): Promise<Session | null> {
    try {
      console.log('🔐 AuthService: Retrieving saved session from storage...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ AuthService: Error getting session:', error);
        return null;
      }
      
      if (session) {
        console.log('✅ AuthService: Session retrieved successfully');
        console.log('✅ AuthService: Session valid until:', new Date(session.expires_at! * 1000).toLocaleString());
        
        // Check if session is expired
        const now = Math.floor(Date.now() / 1000);
        if (session.expires_at && session.expires_at < now) {
          console.warn('⚠️ AuthService: Session expired, will need to refresh');
        }
      } else {
        console.log('ℹ️ AuthService: No saved session found');
      }
      
      return session;
    } catch (error) {
      console.error('❌ AuthService: Exception getting session:', error);
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
      // Get Supabase URL from environment variables (try multiple sources)
      const supabaseUrl = 
        (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPABASE_URL) ||
        Constants.expoConfig?.extra?.supabaseUrl ||
        Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL ||
        '';
      
      if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
        return {
          user: null,
          session: null,
          error: { message: 'Supabase URL is not configured. Please set EXPO_PUBLIC_SUPABASE_URL in your .env file', status: 400 } as AuthError,
        };
      }

      // Create redirect URI - PRODUCTION BUILD FIX
      // For EAS builds (standalone), NEVER use makeRedirectUri - it returns localhost
      // Always use explicit package name format: com.sevapp.app://auth
      const isExpoGo = Constants.executionEnvironment === 'storeClient';
      const isStandalone = Constants.executionEnvironment === 'standalone';
      
      // Get package name
      const packageName = Constants.expoConfig?.android?.package || Constants.expoConfig?.ios?.bundleIdentifier || 'com.sevapp.app';
      
      let redirectTo: string;
      
      // ONLY use makeRedirectUri for Expo Go (development with Expo Go app)
      if (isExpoGo) {
        // Expo Go: Use makeRedirectUri
        const scheme = Constants.expoConfig?.scheme || 'exp';
        redirectTo = AuthSession.makeRedirectUri({
          scheme: scheme,
          path: 'auth',
          usePath: true,
        });
        console.log('🔗 OAuth Redirect (Expo Go - Development):');
        console.log('  Redirect:', redirectTo);
      } else {
        // Standalone build OR unknown environment: ALWAYS use package name format
        // This includes EAS builds which are standalone
        redirectTo = `${packageName}://auth`;
        console.log('🔗 OAuth Redirect (Standalone/Production Build):');
        console.log('  Execution Environment:', Constants.executionEnvironment);
        console.log('  Package Name:', packageName);
        console.log('  Using explicit deep link:', redirectTo);
      }
      
      // ABSOLUTE SAFETY CHECK - if redirectTo contains localhost, FORCE production format
      if (redirectTo.includes('localhost') || redirectTo.includes('3000') || redirectTo.includes('127.0.0.1') || redirectTo.includes('8081')) {
        redirectTo = `${packageName}://auth`;
        console.error('❌ CRITICAL: Redirect URL contains localhost/port, forcing production format:', redirectTo);
      }
      
      console.log('✅ Final App Deep Link:', redirectTo);
      console.log('✅ This will be used to redirect back to app after OAuth');
      
      // IMPORTANT: With skipBrowserRedirect: true, we handle the redirect ourselves
      // Strategy:
      // 1. Don't specify redirectTo in signInWithOAuth - let Supabase use default callback
      // 2. Use app deep link in WebBrowser.openAuthSessionAsync - browser will redirect to app
      // 3. Browser will intercept Supabase callback and redirect to app deep link with tokens
      console.log('📤 Requesting OAuth URL from Supabase:');
      console.log('  App Deep Link (for final redirect):', redirectTo);
      console.log('  Strategy: Supabase will use default callback, browser handles redirect to app');
      
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Don't specify redirectTo - Supabase will use its default callback URL
          // The browser will intercept the callback and redirect to our app deep link
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          skipBrowserRedirect: true, // We handle the browser redirect ourselves via WebBrowser
        },
      });

      if (oauthError || !data?.url) {
        console.error('❌ Supabase OAuth Error:', oauthError);
        return {
          user: null,
          session: null,
          error: oauthError || { message: 'Failed to get OAuth URL', status: 400 } as AuthError,
        };
      }

      // Log the OAuth URL from Supabase to see what it contains
      console.log('📥 OAuth URL received from Supabase:');
      console.log('  Full URL:', data.url);
      console.log('  Contains localhost?', data.url.includes('localhost'));
      console.log('  Contains 3000?', data.url.includes('3000'));
      
      // Check if Supabase returned a URL with localhost (this would be a Supabase config issue)
      if (data.url.includes('localhost') || data.url.includes('3000')) {
        console.error('❌ WARNING: Supabase returned OAuth URL with localhost!');
        console.error('  This means Supabase is configured with localhost redirect URL');
        console.error('  Check Supabase Dashboard → Authentication → URL Configuration');
      }

      // Open the OAuth URL in browser
      // CRITICAL FIX: Don't use WebBrowser.openAuthSessionAsync with returnUrl
      // Instead, use openBrowserAsync and let Supabase handle the redirect naturally
      // Then listen for the deep link callback via Linking API
      console.log('🌐 Opening OAuth URL in browser...');
      console.log('  OAuth URL:', data.url.substring(0, 100) + '...');
      console.log('  Strategy: Open browser, Supabase redirects to app deep link automatically');
      console.log('  App deep link:', redirectTo);
      
      // Open browser without returnUrl - let Supabase handle redirect
      // Supabase will redirect to the redirectTo we specified (but we didn't specify it, so uses default)
      // Actually, we need to tell Supabase where to redirect, but can't use custom scheme
      // So we'll use WebBrowser but with a different approach
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      if (result.type === 'success' && result.url) {
        console.log('✅ OAuth callback received:', result.url.substring(0, 100) + '...');
        
        // Parse the callback URL to extract tokens
        // Supabase callback URL format: https://project.supabase.co/auth/v1/callback#access_token=...&refresh_token=...
        const parseQueryParams = (url: string): Record<string, string> => {
          const params: Record<string, string> = {};
          // Extract hash fragment (Supabase uses hash for OAuth callbacks)
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
        console.log('📋 Extracted params:', Object.keys(params).join(', '));
        
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

