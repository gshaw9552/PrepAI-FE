// src/components/ProtectedRoute.tsx
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Redirect to login if no token found
    return <Navigate to="/login" replace />;
  }
  
  // If token exists, render the children components
  return <>{children}</>;
};

export default ProtectedRoute;