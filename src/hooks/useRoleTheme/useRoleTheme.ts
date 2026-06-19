import { useEffect } from 'react';
import { useAuthStore } from '../../store/auth.store';
import type { AuthState } from '../../types/auth';

export const useRoleTheme = () => {
  const user = useAuthStore((state: AuthState) => state.user);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove('theme-user', 'theme-admin', 'theme-manager');

    if (!user) {
      root.classList.add('theme-user');
      return;
    }

    switch (user.role) {
      case 'admin':
        root.classList.add('theme-admin');
        break;
      case 'manager':
        root.classList.add('theme-manager');
        break;
      default:
        root.classList.add('theme-user');
    }
  }, [user]);
};
