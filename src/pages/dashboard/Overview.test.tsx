import { render, screen } from '@testing-library/react';
import Overview from './Overview';
import { useFetchDashboardData } from '../../hooks/useFetchDashboardData/useFetchDashboardData';

// 1. Mock the custom hook
jest.mock('../../hooks/useFetchDashboardData/useFetchDashboardData', () => ({
  useFetchDashboardData: jest.fn(),
}));

describe('Overview Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the loading state', () => {
    (useFetchDashboardData as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    render(<Overview />);

    expect(screen.getByText('Loading overview...')).toBeInTheDocument();
  });

  it('renders the error state', () => {
    (useFetchDashboardData as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    });

    render(<Overview />);

    expect(screen.getByText('Failed to load overview.')).toBeInTheDocument();
  });

  it('renders the dashboard data correctly on success', () => {
    const mockData = {
      summary: {
        activeUsers: 1250,
        pendingTasks: 42,
        totalRevenue: 55000,
      },
      items: [
        { id: '1', title: 'New User', value: 'Alice registered' },
        { id: '2', title: 'System Update', value: 'v2.4 deployed' },
      ],
    };

    (useFetchDashboardData as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    });

    render(<Overview />);

    // Verify headers
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Latest activity')).toBeInTheDocument();

    // Verify summary metrics (Note: totalRevenue expects .toLocaleString() formatting)
    expect(screen.getByText('1250')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('$55,000')).toBeInTheDocument();

    // Verify activity items map correctly
    expect(screen.getByText('New User')).toBeInTheDocument();
    expect(screen.getByText('Alice registered')).toBeInTheDocument();
    expect(screen.getByText('System Update')).toBeInTheDocument();
    expect(screen.getByText('v2.4 deployed')).toBeInTheDocument();
  });

  it('renders default fallback values if data is undefined or missing', () => {
    // Return empty data to trigger the useMemo fallback ?? { activeUsers: 0... }
    (useFetchDashboardData as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });

    render(<Overview />);

    // Because multiple zeroes might exist in the DOM, we can test specifically
    // by ensuring at least the default string formatting applies.
    const activeUsersLabel = screen.getByText('Active users');
    expect(activeUsersLabel.nextElementSibling).toHaveTextContent('0');

    const pendingTasksLabel = screen.getByText('Pending tasks');
    expect(pendingTasksLabel.nextElementSibling).toHaveTextContent('0');

    const totalRevenueLabel = screen.getByText('Total revenue');
    expect(totalRevenueLabel.nextElementSibling).toHaveTextContent('$0');

    // Ensure "Latest activity" block renders without crashing when items are missing
    expect(screen.getByText('Latest activity')).toBeInTheDocument();
  });
});
