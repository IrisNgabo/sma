import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

/**
 * ProtectedRoute
 * 
 * A wrapper that restricts access to authenticated users only.
 * - Shows a loading spinner while authentication is being verified.
 * - Redirects unauthenticated users to the login page.
 * - Renders child components if authenticated.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content when authenticated
  return children;
};

export default ProtectedRoute;
