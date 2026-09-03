import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const BusinessAuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-white border border-[#DED7CE] flex items-center justify-center shadow-xs">
          <Loader2 className="w-6 h-6 text-brand-600 animate-spin" />
        </div>
        <p className="mt-4 text-xs font-semibold text-charcoal-muted tracking-wider uppercase">
          Verifying Business Credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/business/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
