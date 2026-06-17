import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import Login from './Login';
import DashboardLayout from './dashboard/DashboardLayout';
import Overview from './dashboard/Overview';
import Reports from './dashboard/Reports';
import Users from './dashboard/Users';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthUser, useAuthStore } from '../store/auth.store';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderWithProviders = (ui: React.ReactNode, route = '/') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </MemoryRouter>
  );
};

describe('page smoke tests', () => {
  it('renders the Home page', () => {
    renderWithProviders(<Home />);

    expect(screen.getByText('Rehabilitation you can trust')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders the About page', () => {
    renderWithProviders(<About />);

    expect(screen.getByText('About CORA')).toBeInTheDocument();
    expect(screen.getByText('Expert clinicians')).toBeInTheDocument();
  });

  it('renders the Contact page', () => {
    renderWithProviders(<Contact />);

    expect(screen.getByText('Reach us for care or career guidance.')).toBeInTheDocument();
    expect(screen.getByText('1.866.443.2672')).toBeInTheDocument();
  });

  it('renders the Login page', () => {
    renderWithProviders(<Login />);

    expect(screen.getByRole('textbox', { name: /email address/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getAllByText(/demo users/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders dashboard layout and routes for admin', () => {
    jest.spyOn(useAuthStore, 'getState').mockReturnValue({
      user: { id: 'user-1', name: 'Admin', email: 'admin@test.com', role: 'admin' } as AuthUser,
      login: jest.fn(),
      logout: jest.fn(),
    });

    renderWithProviders(
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>,
      '/dashboard'
    );

    expect(screen.getByText('Overview')).toBeInTheDocument();
  });
});
