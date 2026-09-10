import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BusinessLoginPage } from '../../pages/admin/BusinessLoginPage';
import { Loader2 } from 'lucide-react';

export const BusinessAuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-white border border-[#DED7CE] flex items-center justify-center shadow-xs">
          <Loader2 className="w-6 h-6 text-[#9E2328] animate-spin" />
        </div>
        <p className="mt-4 text-xs font-semibold text-[#6F6A65] tracking-wider uppercase">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <BusinessLoginPage />;
  }

  return <>{children}</>;
};
