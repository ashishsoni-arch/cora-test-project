import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const TestComponent = () => <div>Protected content</div>;

describe('ProtectedRoute', () => {
  it('redirects unauthenticated user to login', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<div>Login page</div>} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute isAuthenticated={false} allowedRoles={['user']} />}
          >
            <Route index element={<TestComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('redirects unauthorized user to dashboard', () => {
    window.sessionStorage.setItem('userRole', 'user');

    render(
      <MemoryRouter initialEntries={['/dashboard/reports']}>
        <Routes>
          <Route path="/dashboard" element={<div>Dashboard root</div>} />
          <Route
            path="/dashboard/reports"
            element={
              <ProtectedRoute isAuthenticated={true} allowedRoles={['admin']}>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard root')).toBeInTheDocument();
    window.sessionStorage.removeItem('userRole');
  });
});
