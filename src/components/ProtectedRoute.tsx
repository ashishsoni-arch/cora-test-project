import { Navigate, Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  allowedRoles?: Array<'admin' | 'manager' | 'user'>;
  children?: ReactNode;
}

const ProtectedRoute = ({ isAuthenticated, allowedRoles, children }: ProtectedRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const userRole = window.sessionStorage.getItem('userRole') as
      | 'admin'
      | 'manager'
      | 'user'
      | null;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children ?? <Outlet />;
};

export default ProtectedRoute;
