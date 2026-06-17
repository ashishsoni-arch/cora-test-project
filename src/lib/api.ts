export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequest<TBody = unknown> {
  url: string;
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
}

export interface ApiResponse<TData> {
  data: TData;
}

interface MockResponseMap {
  '/dashboard/summary': {
    activeUsers: number;
    totalRevenue: number;
    pendingTasks: number;
  };
  '/dashboard/items': Array<{ id: string; title: string; value: string }>;
  '/users': Array<{ id: string; name: string; email: string; role: string }>;
  '/reports': Array<{ id: string; title: string; status: 'pending' | 'completed' | 'review' }>;
}

const mockDatabase: MockResponseMap = {
  '/dashboard/summary': {
    activeUsers: 1324,
    totalRevenue: 128_500,
    pendingTasks: 18,
  },
  '/dashboard/items': [
    { id: 'item-1', title: 'New referrals', value: '24 new patients this week' },
    { id: 'item-2', title: 'Clinic utilization', value: '87% average capacity' },
    { id: 'item-3', title: 'Care plan completion', value: '68% in the last quarter' },
  ],
  '/users': [
    { id: 'user-1', name: 'Avery Chen', email: 'avery@cora.com', role: 'admin' },
    { id: 'user-2', name: 'Jordan Lee', email: 'jordan@cora.com', role: 'manager' },
    { id: 'user-3', name: 'Morgan Ray', email: 'morgan@cora.com', role: 'user' },
  ],
  '/reports': [
    { id: 'report-1', title: 'Weekly capacity review', status: 'pending' },
    { id: 'report-2', title: 'Patient satisfaction summary', status: 'review' },
    { id: 'report-3', title: 'Billing reconciliation', status: 'completed' },
  ],
};

const getMockResponse = async <TData>(url: string): Promise<TData> => {
  const response = mockDatabase[url as keyof MockResponseMap] as unknown;

  if (!response) {
    throw new Error(`No mock response configured for: ${url}`);
  }

  return response as TData;
};

async function request<TData, TBody = unknown>({
  url,
}: ApiRequest<TBody>): Promise<ApiResponse<TData>> {
  const data = await getMockResponse<TData>(url);
  return { data };
}

export async function requestAll<T>(requests: Array<ApiRequest>): Promise<Array<ApiResponse<T>>> {
  const results = await Promise.all(requests.map((requestConfig) => request<T>(requestConfig)));
  return results;
}

export async function requestAllSettled<T>(
  requests: Array<ApiRequest>
): Promise<Array<PromiseSettledResult<ApiResponse<T>>>> {
  const results = await Promise.allSettled(
    requests.map((requestConfig) => request<T>(requestConfig))
  );
  return results;
}

export default request;
