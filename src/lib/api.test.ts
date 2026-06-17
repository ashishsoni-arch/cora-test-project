import request, { requestAll, requestAllSettled, type ApiRequest } from './api';

describe('api utility', () => {
  it('returns mock data for a configured request', async () => {
    const response = await request<{ activeUsers: number }>({ url: '/dashboard/summary' });

    expect(response).toEqual({
      data: { activeUsers: 1324, totalRevenue: 128500, pendingTasks: 18 },
    });
  });

  it('throws when the URL is not configured', async () => {
    await expect(request({ url: '/missing-endpoint' })).rejects.toThrow(
      'No mock response configured for: /missing-endpoint'
    );
  });

  it('resolves multiple requests with requestAll', async () => {
    const requests: ApiRequest[] = [{ url: '/dashboard/summary' }, { url: '/users' }];
    const result = await requestAll(requests);

    expect(result).toHaveLength(2);
    expect(result[0].data).toMatchObject({ activeUsers: 1324 });
    expect(Array.isArray(result[1].data)).toBe(true);
  });

  it('returns settled results for mixed request results', async () => {
    const requests: ApiRequest[] = [{ url: '/dashboard/summary' }, { url: '/missing' }];
    const result = await requestAllSettled(requests);

    expect(result).toHaveLength(2);
    expect(result[0].status).toBe('fulfilled');
    expect(result[1].status).toBe('rejected');
  });
});
