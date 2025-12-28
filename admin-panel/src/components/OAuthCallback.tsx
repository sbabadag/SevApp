import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const OAuthCallback: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait a bit for Supabase to process the OAuth callback
    const timer = setTimeout(() => {
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }, 1000);

    return () => clearTimeout(timer);
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

