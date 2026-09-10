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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and listen to Supabase Auth session on mount
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            const { data: profile } = await supabase
              .from('admin_users')
              .select('*')
              .eq('auth_user_id', session.user.id)
              .maybeSingle();

            if (profile && profile.active) {
              const adminUser: AdminUser = {
                id: profile.id,
                authUserId: session.user.id,
                name: profile.name || session.user.email?.split('@')[0] || 'VETANIC Admin',
                email: session.user.email || profile.email,
                role: (profile.role as AdminRole) || 'Admin',
                active: profile.active,
                createdAt: profile.created_at || new Date().toISOString(),
                lastLoginAt: new Date().toISOString()
              };
              setUser(adminUser);
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
            } else {
              setUser(null);
              localStorage.removeItem(AUTH_STORAGE_KEY);
            }
          } else if (isMounted) {
            setUser(null);
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        } catch (err) {
          console.error('Supabase session verification error:', err);
          if (isMounted) setUser(null);
        } finally {
          if (isMounted) setIsLoading(false);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!isMounted) return;
          if (event === 'SIGNED_OUT' || !session) {
            setUser(null);
            localStorage.removeItem(AUTH_STORAGE_KEY);
            sessionStorage.removeItem(AUTH_STORAGE_KEY);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } else {
        // Fallback for unconfigured/offline dev environment only
        try {
          const stored = localStorage.getItem(AUTH_STORAGE_KEY);
          if (stored && isMounted) {
            setUser(JSON.parse(stored));
          }
        } catch {
          // ignore
        }
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (isSupabaseConfigured && supabase) {
        // 1. Authenticate with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password
        });

        if (error || !data.user) {
          setIsLoading(false);
          return { 
            success: false, 
            error: error?.message || 'Invalid email or password. Please check your credentials.' 
          };
        }

        // 2. Verify active authorization in public.admin_users
        const { data: profile, error: profileErr } = await supabase
          .from('admin_users')
          .select('*')
          .eq('auth_user_id', data.user.id)
          .maybeSingle();

        if (profileErr) {
          console.error('Failed to query admin_users table:', profileErr);
        }

        if (!profile || !profile.active) {
          await supabase.auth.signOut();
          setIsLoading(false);
          return {
            success: false,
            error: 'Authentication succeeded, but your account is not registered as an active administrator in the VETANIC database.'
          };
        }

        // 3. Construct verified Admin session
        const adminUser: AdminUser = {
          id: profile.id,
          authUserId: data.user.id,
          name: profile.name || data.user.email?.split('@')[0] || 'VETANIC Admin',
          email: data.user.email || profile.email,
          role: (profile.role as AdminRole) || 'Admin',
          active: profile.active,
          createdAt: profile.created_at || new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };

        setUser(adminUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'Supabase authentication service is not configured.' };
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
        console.warn('Supabase sign out error:', e);
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
