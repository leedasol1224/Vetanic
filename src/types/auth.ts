export type AdminRole = 'Owner' | 'Admin' | 'Staff';

export interface AdminUser {
  id: string;
  authUserId?: string;
  name: string;
  email: string;
  role: AdminRole;
  active: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
