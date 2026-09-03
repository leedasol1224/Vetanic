import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AdminRole } from '../types/auth';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasRole: (roles: AdminRole[]) => boolean;
}

const AUTH_STORAGE_KEY = 'vetanic_admin_auth_v1';

// Initial default administrators for VETANIC Singapore operations
const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin-001',
    name: 'VETANIC Admin',
    email: 'admin@vetanic.sg',
    role: 'Admin',
    active: true,
    createdAt: '2026-09-01T00:00:00.000Z'
  },
  {
    id: 'admin-002',
    name: 'Sarah Tan (Operations)',
    email: 'sarah@vetanic.sg',
    role: 'Staff',
    active: true,
    createdAt: '2026-09-01T00:00:00.000Z'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load existing session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AdminUser;
        if (parsed && parsed.active) {
          setUser(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to parse admin session', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      // 1. If Supabase Auth is fully configured, attempt official Supabase login
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password
        });

        if (!error && data.user) {
          // Query admin_users table for profile role
          const { data: profile } = await supabase
            .from('admin_users')
            .select('*')
            .eq('auth_user_id', data.user.id)
            .single();

          const adminUser: AdminUser = {
            id: profile?.id || data.user.id,
            authUserId: data.user.id,
            name: profile?.name || data.user.email?.split('@')[0] || 'VETANIC Admin',
            email: data.user.email || normalizedEmail,
            role: (profile?.role as AdminRole) || 'Admin',
            active: profile?.active ?? true,
            createdAt: profile?.created_at || new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          };

          setUser(adminUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
          setIsLoading(false);
          return { success: true };
        }
      }

      // 2. Business Auth Verification
      // Accepts official team accounts or vetanic demo credentials
      if (
        (normalizedEmail === 'admin@vetanic.sg' || normalizedEmail === 'sarah@vetanic.sg' || normalizedEmail === 'team@vetanic.sg') &&
        (password === 'vetanic2026' || password === 'admin' || password === 'vetanic')
      ) {
        const matched = DEFAULT_ADMIN_USERS.find((u) => u.email === normalizedEmail) || {
          id: `admin-${Date.now()}`,
          name: 'VETANIC Admin',
          email: normalizedEmail,
          role: 'Admin' as AdminRole,
          active: true,
          createdAt: new Date().toISOString()
        };

        const sessionUser: AdminUser = {
          ...matched,
          lastLoginAt: new Date().toISOString()
        };

        setUser(sessionUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'Invalid business email or password. Please check your credentials.' };
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      return { success: false, error: msg };
    }
  };

  const logout = async (): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase sign out error', e);
      }
    }
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const hasRole = (roles: AdminRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user && user.active),
        isLoading,
        login,
        logout,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
