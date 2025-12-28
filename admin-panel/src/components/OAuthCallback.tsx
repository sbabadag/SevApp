import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle OAuth callback from URL hash or query params
    const handleCallback = async () => {
      console.log('OAuthCallback: Starting callback handling');
      console.log('OAuthCallback: Current URL:', window.location.href);
      console.log('OAuthCallback: Hash:', window.location.hash);
      
      // Check URL hash for tokens (Supabase OAuth uses hash fragments)
      const hash = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const error = hashParams.get('error');
      const errorDescription = hashParams.get('error_description');

      console.log('OAuthCallback: Access token found:', !!accessToken);
      console.log('OAuthCallback: Refresh token found:', !!refreshToken);
      console.log('OAuthCallback: Error:', error);

      if (error) {
        console.error('OAuth error:', error, errorDescription);
        navigate('/login?error=' + encodeURIComponent(errorDescription || error));
        return;
      }

      if (accessToken && refreshToken) {
        try {
          console.log('OAuthCallback: Setting session in Supabase...');
          // Set session in Supabase
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('OAuthCallback: Session error:', sessionError);
            navigate('/login?error=' + encodeURIComponent(sessionError.message));
            return;
          }

          console.log('OAuthCallback: Session set successfully:', !!sessionData.session);
          console.log('OAuthCallback: User:', sessionData.session?.user?.email);

          // Clear the hash from URL
          window.history.replaceState(null, '', window.location.pathname + window.location.search);

          // Wait a moment for auth state to update, then navigate
          setTimeout(() => {
            console.log('OAuthCallback: Navigating to dashboard...');
            navigate('/dashboard', { replace: true });
          }, 1000);
        } catch (err: any) {
          console.error('OAuthCallback: Callback error:', err);
          navigate('/login?error=' + encodeURIComponent(err.message || 'Authentication failed'));
        }
      } else {
        console.log('OAuthCallback: No tokens in URL, checking if user is already authenticated...');
        // No tokens in URL, check if user is already authenticated
        // Wait a bit for Supabase to process the callback
        const timer = setTimeout(async () => {
          const { data: { session } } = await supabase.auth.getSession();
          console.log('OAuthCallback: Session check result:', !!session);
          if (session) {
            console.log('OAuthCallback: User authenticated, navigating to dashboard...');
            navigate('/dashboard', { replace: true });
          } else {
            console.log('OAuthCallback: No session found, navigating to login...');
            navigate('/login', { replace: true });
          }
        }, 2000);

        return () => clearTimeout(timer);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

