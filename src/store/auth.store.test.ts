import { useAuthStore } from './auth.store';

const sampleUser = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin' as const,
};

describe('auth store', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    useAuthStore.getState().logout();
  });

  it('logs in a user and persists the auth state', () => {
    useAuthStore.getState().login(sampleUser);

    expect(useAuthStore.getState().user).toEqual(sampleUser);
    expect(window.sessionStorage.getItem('authUser')).toContain('test@example.com');
    expect(window.sessionStorage.getItem('userRole')).toBe('admin');
  });

  it('logs out and clears persisted auth state', () => {
    useAuthStore.getState().login(sampleUser);
    useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(window.sessionStorage.getItem('authUser')).toBeNull();
    expect(window.sessionStorage.getItem('userRole')).toBeNull();
  });
});
