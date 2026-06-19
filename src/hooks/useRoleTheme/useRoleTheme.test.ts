import { renderHook } from '@testing-library/react';
import { useRoleTheme } from './useRoleTheme';
import { useAuthStore } from '../../store/auth.store';
import type { AuthUser } from '../../types/auth';

// 1. Mock the Zustand store
jest.mock('../../store/auth.store', () => ({
  useAuthStore: jest.fn(),
}));

describe('useRoleTheme Hook', () => {
  // Helper function to easily mock the user state for each test
  const mockUserState = (user: Partial<AuthUser> | null) => {
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) => {
      return selector({ user });
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear out the HTML classes before every test to ensure a clean slate
    document.documentElement.className = '';
  });

  it('applies "theme-user" when there is no user logged in', () => {
    mockUserState(null);

    renderHook(() => useRoleTheme());

    expect(document.documentElement.classList.contains('theme-user')).toBe(true);
    expect(document.documentElement.classList.length).toBe(1);
  });

  it('applies "theme-admin" when the user role is admin', () => {
    mockUserState({ role: 'admin' });

    renderHook(() => useRoleTheme());

    expect(document.documentElement.classList.contains('theme-admin')).toBe(true);
  });

  it('applies "theme-manager" when the user role is manager', () => {
    mockUserState({ role: 'manager' });

    renderHook(() => useRoleTheme());

    expect(document.documentElement.classList.contains('theme-manager')).toBe(true);
  });

  it('applies "theme-user" as the fallback default for standard users', () => {
    mockUserState({ role: 'user' });

    renderHook(() => useRoleTheme());

    expect(document.documentElement.classList.contains('theme-user')).toBe(true);
  });

  it('removes old theme classes before applying a new one', () => {
    // Manually inject an old theme class
    document.documentElement.classList.add('theme-admin');

    // Simulate a standard user logging in
    mockUserState({ role: 'user' });

    renderHook(() => useRoleTheme());

    // Verify the old admin class was stripped away and the new user class was added
    expect(document.documentElement.classList.contains('theme-admin')).toBe(false);
    expect(document.documentElement.classList.contains('theme-user')).toBe(true);
  });
});
