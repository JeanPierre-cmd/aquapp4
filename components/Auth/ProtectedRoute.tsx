import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  roles: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles, children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // In a real app, you'd return a loading spinner component
    return <div className="flex items-center justify-center h-screen">Verificando permisos...</div>;
  }

  if (!user || !roles.includes(user.role)) {
    // User is not authenticated or doesn't have the required role, redirect them
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
