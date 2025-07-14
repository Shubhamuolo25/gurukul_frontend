import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authcontext.jsx';

const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) return <div>Loading...</div>;

  if (!isAuthenticated) {
    // Remove toast here to avoid duplicate toasts on rerender
    return <Navigate to="/" replace state={{ loginError: 'Login required' }} />;
  }

  return <>{children}</>;
};

export default RequireAuth;
