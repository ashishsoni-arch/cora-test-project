import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Reports from './Reports';
import request from '../../lib/api';

// 1. Mock the custom API request function
jest.mock('../../lib/api', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Reports Component', () => {
  // 2. Helper to create a fresh QueryClient for each test so cache doesn't bleed over
  const createTestQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Turn off retries so error tests fail fast
        },
      },
    });

  const renderWithClient = (ui: React.ReactElement) => {
    const testQueryClient = createTestQueryClient();
    return render(<QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the loading state initially', () => {
    // Return a promise that never resolves to keep it in the loading state
    (request as jest.Mock).mockReturnValue(new Promise(() => {}));

    renderWithClient(<Reports />);

    expect(screen.getByText('Loading reports...')).toBeInTheDocument();
  });

  it('renders the error state if the API request fails', async () => {
    // Simulate an API failure
    (request as jest.Mock).mockRejectedValueOnce(new Error('API Down'));

    renderWithClient(<Reports />);

    // Wait for React Query to transition from loading -> error
    expect(await screen.findByText('Unable to load reports.')).toBeInTheDocument();
  });

  it('renders the reports list and correct status chips on success', async () => {
    // 3. Provide mock data that covers all three possible status styles
    const mockReports = [
      { id: '1', title: 'Q1 Financials', status: 'completed' },
      { id: '2', title: 'Security Audit', status: 'pending' },
      { id: '3', title: 'Performance Metrics', status: 'review' },
    ];

    (request as jest.Mock).mockResolvedValueOnce({ data: mockReports });

    renderWithClient(<Reports />);

    // Wait for the loading state to disappear and header to show up
    expect(await screen.findByText('Reports')).toBeInTheDocument();

    // Verify all titles are rendered
    expect(screen.getByText('Q1 Financials')).toBeInTheDocument();
    expect(screen.getByText('Security Audit')).toBeInTheDocument();
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument();

    // Verify the status chips are rendered
    expect(screen.getByText('completed')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('review')).toBeInTheDocument();

    // Verify the mock was actually called with the correct URL
    expect(request).toHaveBeenCalledWith({ url: '/reports' });
  });

  it('renders empty gracefully if no data is returned', async () => {
    // Simulate an API returning null or undefined data
    (request as jest.Mock).mockResolvedValueOnce({ data: null });

    renderWithClient(<Reports />);

    // Wait for successful render
    expect(await screen.findByText('Reports')).toBeInTheDocument();

    // Ensure the header text is there, but no report items are rendered
    expect(
      screen.getByText('Manager and admin access to operational dashboards.')
    ).toBeInTheDocument();
  });
});
