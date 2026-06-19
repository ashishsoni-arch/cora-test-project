import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFetchDashboardData } from './useFetchDashboardData'; // Update with your actual file path
import request, { requestAll } from '../../lib/api';

// 1. Mock the API module
jest.mock('../../lib/api', () => ({
  __esModule: true,
  default: jest.fn(),
  requestAll: jest.fn(),
}));

// Mock Data
const mockSummaryData = { activeUsers: 150, totalRevenue: 5000, pendingTasks: 12 };
const mockItemsData = [{ id: '1', title: 'Task 1', value: '100' }];
const defaultSummary = { activeUsers: 0, totalRevenue: 0, pendingTasks: 0 };

describe('useFetchDashboardData', () => {
  let queryClient: QueryClient;

  // 2. Setup QueryClient wrapper
  beforeEach(() => {
    jest.clearAllMocks();
    // Create a new QueryClient for each test and disable retries to prevent test timeouts on errors
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    (requestAll as jest.Mock).mockResolvedValue([{ data: {} }, { data: {} }]);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('fetches and returns both summary and items successfully', async () => {
    // Mock successful responses based on URL
    (request as jest.Mock).mockImplementation(({ url }) => {
      if (url === '/dashboard/summary') return Promise.resolve({ data: mockSummaryData });
      if (url === '/dashboard/items') return Promise.resolve({ data: mockItemsData });
      return Promise.reject(new Error('Not found'));
    });

    const { result } = renderHook(() => useFetchDashboardData(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      summary: mockSummaryData,
      items: mockItemsData,
    });

    // Verify requestAll was called with the correct array
    expect(requestAll).toHaveBeenCalledWith([
      { url: '/dashboard/items' },
      { url: '/dashboard/items' },
    ]);
  });

  it('handles partial failure: summary fails, items succeed', async () => {
    (request as jest.Mock).mockImplementation(({ url }) => {
      if (url === '/dashboard/summary') return Promise.reject(new Error('Summary API down'));
      if (url === '/dashboard/items') return Promise.resolve({ data: mockItemsData });
    });

    const { result } = renderHook(() => useFetchDashboardData(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Should return default summary and actual items
    expect(result.current.data).toEqual({
      summary: defaultSummary,
      items: mockItemsData,
    });
  });

  it('handles partial failure: summary succeeds, items fail', async () => {
    (request as jest.Mock).mockImplementation(({ url }) => {
      if (url === '/dashboard/summary') return Promise.resolve({ data: mockSummaryData });
      if (url === '/dashboard/items') return Promise.reject(new Error('Items API down'));
    });

    const { result } = renderHook(() => useFetchDashboardData(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Should return actual summary and empty items array
    expect(result.current.data).toEqual({
      summary: mockSummaryData,
      items: [],
    });
  });

  it('throws an error if both summary and items requests fail', async () => {
    (request as jest.Mock).mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useFetchDashboardData(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe('Unable to fetch dashboard data');
  });

  it('fails if requestAll fails', async () => {
    // Both individual requests succeed
    (request as jest.Mock).mockImplementation(({ url }) => {
      if (url === '/dashboard/summary') return Promise.resolve({ data: mockSummaryData });
      if (url === '/dashboard/items') return Promise.resolve({ data: mockItemsData });
    });

    // But requestAll fails
    (requestAll as jest.Mock).mockRejectedValue(new Error('Bulk request failed'));

    const { result } = renderHook(() => useFetchDashboardData(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    // React Query catches the error thrown by requestAll
    expect(result.current.error?.message).toBe('Bulk request failed');
  });
});
