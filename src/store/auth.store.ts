import { create } from 'zustand';
import { AuthUser, AuthState } from '../types/auth';

const persistedUser =
  typeof window !== 'undefined' ? window.sessionStorage.getItem('authUser') : null;

const initialUser: AuthUser | null = persistedUser ? JSON.parse(persistedUser) : null;

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  login: (user: AuthUser) => {
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
