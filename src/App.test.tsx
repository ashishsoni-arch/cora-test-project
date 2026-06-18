import { render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet as MockOutlet } from 'react-router-dom';
import App from './App';
import { useAuthStore } from './store/auth.store';
import { AuthUser } from './types/auth';

// 1. Mock the Auth Store to control authentication state
jest.mock('./store/auth.store', () => ({
  useAuthStore: jest.fn(),
}));

// 2. Mock the Header
jest.mock('./components/Header/Header', () => ({
  __esModule: true,
  default: ({ showTopBanner }: { showTopBanner: boolean }) => (
    <div data-testid="mock-header">{showTopBanner ? 'Header With Banner' : 'Header No Banner'}</div>
  ),
}));

// 3. Mock ProtectedRoute to isolate App.tsx routing logic!
// This prevents rogue redirects during pure routing tests.
jest.mock('./components/ProtectedRoute/ProtectedRoute', () => {
  return {
    __esModule: true,
    // If it wraps children, render them. If it acts as a layout, render the MockOutlet.
    default: ({ children }: { children?: React.ReactNode }) =>
      children ? <>{children}</> : <MockOutlet />,
  };
});

// 4. Mock all lazy-loaded pages
jest.mock('./pages/Home/Home', () => ({
  __esModule: true,
  default: () => <div data-testid="page-home">Home</div>,
}));
jest.mock('./pages/About/About', () => ({
  __esModule: true,
  default: () => <div data-testid="page-about">About</div>,
}));
jest.mock('./pages/Contact/Contact', () => ({
  __esModule: true,
  default: () => <div data-testid="page-contact">Contact</div>,
}));
jest.mock('./pages/Login/Login', () => ({
  __esModule: true,
  default: () => <div data-testid="page-login">Login</div>,
}));

jest.mock('./pages/dashboard/DashboardLayout', () => {
  return {
    __esModule: true,
    default: () => (
      <div data-testid="page-dashboard-layout">
        <MockOutlet />
      </div>
    ),
  };
});

jest.mock('./pages/dashboard/Overview', () => ({
  __esModule: true,
  default: () => <div data-testid="page-overview">Overview</div>,
}));
jest.mock('./pages/dashboard/Users', () => ({
  __esModule: true,
  default: () => <div data-testid="page-users">Users</div>,
}));
jest.mock('./pages/dashboard/Reports', () => ({
  __esModule: true,
  default: () => <div data-testid="page-reports">Reports</div>,
}));

describe('App Component Routing', () => {
  const createMockStore = (userState: AuthUser | null) => {
    const state = {
      user: userState,
      login: jest.fn(),
      logout: jest.fn(),
    };
    const storeHook = jest.fn((selector) => (selector ? selector(state) : state));

    Object.assign(storeHook, {
      getState: () => state,
      setState: jest.fn(),
      subscribe: jest.fn(),
      destroy: jest.fn(),
    });

    return storeHook;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockImplementation(createMockStore(null));
  });

  const renderAppWithRoute = (route: string) => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    );
  };

  it('renders Home page and Header with TopBanner on the root path ("/")', async () => {
    renderAppWithRoute('/');
    expect(await screen.findByTestId('page-home')).toBeInTheDocument();
    expect(screen.getByTestId('mock-header')).toHaveTextContent('Header With Banner');
  });

  it('renders About page and Header WITHOUT TopBanner on "/about"', async () => {
    renderAppWithRoute('/about');
    expect(await screen.findByTestId('page-about')).toBeInTheDocument();
    expect(screen.getByTestId('mock-header')).toHaveTextContent('Header No Banner');
  });

  it('redirects unknown routes to the Home page ("*")', async () => {
    renderAppWithRoute('/some-random-unknown-route');
    expect(await screen.findByTestId('page-home')).toBeInTheDocument();
  });

  it('hides the Header completely on dashboard routes', async () => {
    (useAuthStore as unknown as jest.Mock).mockImplementation(
      createMockStore({ id: '1', name: 'Admin', role: 'admin', email: 'admin@test.com' })
    );

    renderAppWithRoute('/dashboard');
    expect(await screen.findByTestId('page-dashboard-layout')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-header')).not.toBeInTheDocument();
  });

  it('renders the Dashboard Overview index route correctly', async () => {
    (useAuthStore as unknown as jest.Mock).mockImplementation(
      createMockStore({ id: '1', name: 'Admin', role: 'admin', email: 'admin@test.com' })
    );

    renderAppWithRoute('/dashboard');
    expect(await screen.findByTestId('page-overview')).toBeInTheDocument();
  });

  it('renders the protected Users route for admin users', async () => {
    const adminUser: AuthUser = {
      id: '1',
      name: 'Admin',
      role: 'admin',
      email: 'admin@test.com',
    };

    (useAuthStore as unknown as jest.Mock).mockImplementation(createMockStore(adminUser));

    renderAppWithRoute('/dashboard/users');

    expect(await screen.findByTestId('page-users')).toBeInTheDocument();
  });
});
