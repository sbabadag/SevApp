import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

export const OAuthCallback: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle OAuth callback from URL hash or query params
    const handleCallback = async () => {
      // Check URL hash for tokens (Supabase OAuth uses hash fragments)
      const hash = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const error = hashParams.get('error');
      const errorDescription = hashParams.get('error_description');

      if (error) {
        console.error('OAuth error:', error, errorDescription);
        navigate('/login?error=' + encodeURIComponent(errorDescription || error));
        return;
      }

      if (accessToken && refreshToken) {
        try {
          // Set session in Supabase
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            navigate('/login?error=' + encodeURIComponent(sessionError.message));
            return;
          }

          // Session set successfully, wait a moment for auth state to update
          setTimeout(() => {
            navigate('/dashboard');
          }, 500);
        } catch (err: any) {
          console.error('Callback error:', err);
          navigate('/login?error=' + encodeURIComponent(err.message || 'Authentication failed'));
        }
      } else {
        // No tokens in URL, check if user is already authenticated
        if (user) {
          navigate('/dashboard');
        } else {
          // Wait a bit for Supabase to process the callback
          const timer = setTimeout(() => {
            if (user) {
              navigate('/dashboard');
            } else {
              navigate('/login');
            }
          }, 2000);

          return () => clearTimeout(timer);
        }
      }
    };

    handleCallback();
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

