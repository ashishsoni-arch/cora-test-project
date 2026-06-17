import { renderWithProviders, screen } from '../../test-utils';
import DashboardLayout from './DashboardLayout';
import { useAuthStore } from '../../store/auth.store';

jest.mock('../../store/auth.store');

const mockedUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('DashboardLayout', () => {
  it('renders user navigation for admin', () => {
    mockedUseAuthStore.mockReturnValue({
      user: { id: 'user-1', name: 'Avery', email: 'avery@cora.com', role: 'admin' },
      login: jest.fn(),
      logout: jest.fn(),
    });

    renderWithProviders(<DashboardLayout />);

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });
});
