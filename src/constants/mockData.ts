import type { AuthUser } from '../types/auth'; // Adjust path if your types are elsewhere

export const MOCK_USERS: AuthUser[] = [
  { id: '1', name: 'Avery Chen', email: 'avery@cora.com', role: 'admin' },
  { id: '2', name: 'Jordan Lee', email: 'jordan@cora.com', role: 'manager' },
  { id: '3', name: 'Taylor Swift', email: 'taylor@cora.com', role: 'user' },
];
