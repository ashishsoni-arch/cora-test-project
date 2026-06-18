export type UserRole = 'admin' | 'manager' | 'user';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}
