import { create } from 'zustand';

export type UserRole = 'admin' | 'manager' | 'user';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const persistedUser =
  typeof window !== 'undefined' ? window.sessionStorage.getItem('authUser') : null;

const initialUser: AuthUser | null = persistedUser ? JSON.parse(persistedUser) : null;

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  login: (user) => {
    set({ user });
    window.sessionStorage.setItem('authUser', JSON.stringify(user));
    window.sessionStorage.setItem('userRole', user.role);
  },
  logout: () => {
    set({ user: null });
    window.sessionStorage.removeItem('authUser');
    window.sessionStorage.removeItem('userRole');
  },
}));
