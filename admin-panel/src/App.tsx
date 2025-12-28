import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { OAuthCallback } from './components/OAuthCallback';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Campaigns } from './pages/Campaigns';

// Get base path for GitHub Pages
const getBasePath = () => {
  // Check if we're on GitHub Pages
  if (window.location.hostname.includes('github.io')) {
    // Extract repo name from URL (e.g., username.github.io/repo-name)
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      // Return base path with repo name (e.g., "/SevApp/")
      return `/${pathParts[0]}/`;
    }
  }
  return '/';
};

function App() {
  try {
    return (
      <AuthProvider>
        <BrowserRouter basename={getBasePath()}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns"
              element={
                <ProtectedRoute>
                  <Campaigns />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    );
  } catch (error) {
    console.error('App Error:', error);
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h1>Error Loading App</h1>
        <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
        <p>Check console for details</p>
      </div>
    );
  }
}

export default App;
