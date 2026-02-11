/**
 * Protected Route Component
 * Prevents unauthorized access and enforces role-based permissions
 */

import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '@/lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: ('patient' | 'doctor' | 'admin')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  const userRole = getUserRole();
  if (!userRole || !allowedRoles.includes(userRole as any)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground max-w-md">
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
          <div className="pt-4">
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
