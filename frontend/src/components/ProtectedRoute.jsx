import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 relative">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--border-light)]" />
            <div className="absolute inset-0 rounded-full border-2 border-[#3B82F6] border-t-transparent animate-spin" />
          </div>
          <span className="text-sm text-[var(--text-muted)] font-medium tracking-wide">Verifying session…</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save intended destination so Login can redirect back after auth
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
