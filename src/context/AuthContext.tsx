import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AdminRole } from '../types/auth';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasRole: (roles: AdminRole[]) => boolean;
}

const USER_STORAGE_KEY = 'vetanic_admin_user_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and verify HttpOnly session cookie on mount
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      const storedUser = sessionStorage.getItem(USER_STORAGE_KEY);

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          // ignore
        }
      }

      try {
        const response = await fetch('/api/admin-auth', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.valid && data.user && isMounted) {
            setUser(data.user);
            sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
          } else if (isMounted) {
            setUser(null);
            sessionStorage.removeItem(USER_STORAGE_KEY);
          }
        } else if (isMounted) {
          setUser(null);
          sessionStorage.removeItem(USER_STORAGE_KEY);
        }
      } catch (err) {
        console.warn('Admin session validation network notice:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin-auth', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setIsLoading(false);
        return {
          success: false,
          error: data.error || 'Incorrect password. Access denied.'
        };
      }

      const adminUser: AdminUser = data.user || {
        id: 'admin',
        name: 'VETANIC Admin',
        email: 'admin@vetanic.sg',
        role: 'Owner',
        active: true,
        createdAt: new Date().toISOString()
      };

      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(adminUser));
      setUser(adminUser);
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Network error verifying password.';
      return { success: false, error: msg };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/admin-auth', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'logout' })
      });
    } catch {
      // ignore
    }

    setUser(null);
    sessionStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem('vetanic_admin_auth_v1');
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
