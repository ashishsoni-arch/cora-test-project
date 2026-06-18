import type { UserRole } from '../types/auth';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export const demoUsers: DemoUser[] = [
  {
    id: 'admin-1',
    name: 'Avery Chen',
    email: 'admin@cora.com',
    password: 'Admin123!',
    role: 'admin',
  },
  {
    id: 'manager-1',
    name: 'Jordan Lee',
    email: 'manager@cora.com',
    password: 'Manager123!',
    role: 'manager',
  },
  {
    id: 'user-1',
    name: 'Morgan Ray',
    email: 'user@cora.com',
    password: 'User123!',
    role: 'user',
  },
];
