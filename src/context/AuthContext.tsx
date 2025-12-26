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

    // Set a timeout to ensure loading doesn't hang forever
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        // Silently proceed if auth takes too long (Supabase might not be configured)
        setLoading(false);
      }
    }, 2000);

    // Get initial session
    authService.getSession()
      .then((session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error getting session:', error);
        if (mounted) {
          setLoading(false);
        }
      });

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
    const { user, session, error } = await authService.signIn({ email, password });
    if (!error && user && session) {
      setUser(user);
      setSession(session);
    }
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { user, session, error } = await authService.signUp({ email, password, fullName });
    if (!error && user && session) {
      setUser(user);
      setSession(session);
    }
    return { error };
  };

  const signInWithGoogle = async () => {
    const { user, session, error } = await authService.signInWithGoogle();
    if (!error && user && session) {
      setUser(user);
      setSession(session);
    }
    return { error };
  };

  const signOut = async () => {
    await authService.signOut();
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

