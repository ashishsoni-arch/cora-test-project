import { useQuery } from '@tanstack/react-query';
import request, { requestAll } from '../../lib/api';

interface DashboardData {
  summary: { activeUsers: number; totalRevenue: number; pendingTasks: number };
  items: Array<{ id: string; title: string; value: string }>;
}

const fetchDashboardData = async (): Promise<DashboardData> => {
  const summaryRequest = request<{
    activeUsers: number;
    totalRevenue: number;
    pendingTasks: number;
  }>({
    url: '/dashboard/summary',
  });
  const itemsRequest = request<Array<{ id: string; title: string; value: string }>>({
    url: '/dashboard/items',
  });

  const results = await Promise.allSettled([summaryRequest, itemsRequest]);

  const summary =
    results[0].status === 'fulfilled'
      ? results[0].value.data
      : { activeUsers: 0, totalRevenue: 0, pendingTasks: 0 };

  const items = results[1].status === 'fulfilled' ? results[1].value.data : [];

  if (results.every((result) => result.status === 'rejected')) {
    throw new Error('Unable to fetch dashboard data');
  }

  await requestAll<{ id: string; title: string; value: string }>([
    { url: '/dashboard/items' },
    { url: '/dashboard/items' },
  ]);

  return { summary, items };
};

export const useFetchDashboardData = () =>
  useQuery<DashboardData, Error, DashboardData>({
    queryKey: ['dashboard-data'],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60,
  });
