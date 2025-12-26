import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    let subscription: any = null;

    // Get initial session (auto-login check) - CRITICAL for auto-login
    console.log('🔐 AuthContext: Checking for saved session...');
    
    // Use a more reliable approach - check multiple times if needed
    const checkSession = async (attempt: number = 1) => {
      try {
        const session = await authService.getSession();
        if (mounted) {
          if (session && session.user) {
            console.log('✅ AuthContext: Saved session found - Auto-login successful!');
            console.log('✅ AuthContext: User:', session.user.email);
            console.log('✅ AuthContext: Session expires at:', new Date(session.expires_at! * 1000).toLocaleString());
            setSession(session);
            setUser(session.user);
            setLoading(false);
          } else {
            // If no session on first attempt, try once more after a short delay
            if (attempt === 1) {
              console.log('🔄 AuthContext: No session on first attempt, retrying...');
              setTimeout(() => checkSession(2), 1000);
            } else {
              console.log('ℹ️ AuthContext: No saved session found - User needs to login');
              setSession(null);
              setUser(null);
              setLoading(false);
            }
          }
        }
      } catch (error) {
        console.error('❌ AuthContext: Error getting session:', error);
        if (mounted) {
          if (attempt === 1) {
            // Retry once on error
            setTimeout(() => checkSession(2), 1000);
          } else {
            setLoading(false);
          }
        }
      }
    };
    
    // Start checking for session
    checkSession(1);

    // Also try to get user directly as a fallback (sometimes more reliable)
    // This helps if getSession() doesn't work but user is still logged in
    const fallbackTimer = setTimeout(() => {
      if (mounted) {
        authService.getCurrentUser()
          .then((user) => {
            if (mounted && user) {
              // If we have a user, try to get session again (in case first attempt failed)
              console.log('🔄 AuthContext: User found, double-checking session...');
              authService.getSession().then((newSession) => {
                if (mounted && newSession && newSession.user) {
                  console.log('✅ AuthContext: Session retrieved successfully via fallback');
                  setSession(newSession);
                  setUser(newSession.user);
                  setLoading(false);
                }
              });
            }
          })
          .catch((error) => {
            // Ignore errors here, session check above is primary
            console.log('ℹ️ AuthContext: getCurrentUser check completed');
          });
      }
    }, 1000); // Wait 1 second after initial session check

    // Set a longer timeout to ensure loading doesn't hang forever
    const timeout = setTimeout(() => {
      if (mounted) {
        // Check if still loading by checking if user is still null
        setLoading((currentLoading) => {
          if (currentLoading) {
            console.warn('⚠️ AuthContext: Session check timeout - proceeding anyway');
          }
          return false;
        });
      }
    }, 5000); // Increased to 5 seconds to allow session to load

    // Listen for auth changes
    try {
      const authStateResult = authService.onAuthStateChange((event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      });

      if (authStateResult?.data?.subscription) {
        subscription = authStateResult.data.subscription;
      }
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      if (mounted) {
        setLoading(false);
      }
    }

    return () => {
      mounted = false;
      clearTimeout(timeout);
      clearTimeout(fallbackTimer);
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (e) {
          // Ignore unsubscribe errors
        }
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 AuthContext: Signing in user...');
    const { user, session, error } = await authService.signIn({ email, password });
    if (!error && user && session) {
      console.log('✅ AuthContext: Sign in successful - Session saved automatically');
      console.log('✅ AuthContext: User will be auto-logged in next time');
      setUser(user);
      setSession(session);
    } else if (error) {
      console.error('❌ AuthContext: Sign in failed:', error.message);
    }
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log('🔐 AuthContext: Signing up new user...');
    const { user, session, error } = await authService.signUp({ email, password, fullName });
    if (!error && user && session) {
      console.log('✅ AuthContext: Sign up successful - Session saved automatically');
      console.log('✅ AuthContext: User will be auto-logged in next time');
      setUser(user);
      setSession(session);
    } else if (error) {
      console.error('❌ AuthContext: Sign up failed:', error.message);
    }
    return { error };
  };

  const signInWithGoogle = async () => {
    console.log('🔐 AuthContext: Signing in with Google...');
    const { user, session, error } = await authService.signInWithGoogle();
    if (!error && user && session) {
      console.log('✅ AuthContext: Google sign in successful - Session saved automatically');
      console.log('✅ AuthContext: User will be auto-logged in next time');
      setUser(user);
      setSession(session);
    } else if (error) {
      console.error('❌ AuthContext: Google sign in failed:', error.message);
    }
    return { error };
  };

  const signOut = async () => {
    console.log('🔐 AuthContext: Signing out user...');
    await authService.signOut();
    console.log('✅ AuthContext: Sign out successful - Session cleared');
    console.log('ℹ️ AuthContext: User will need to login again next time');
    setUser(null);
    setSession(null);
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

