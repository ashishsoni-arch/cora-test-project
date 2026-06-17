import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import request from '../../lib/api';

interface ReportRecord {
  id: string;
  title: string;
  status: 'pending' | 'completed' | 'review';
}

const fetchReports = async (): Promise<ReportRecord[]> => {
  const { data } = await request<ReportRecord[]>({ url: '/reports' });
  return data;
};

const statusStyles: Record<ReportRecord['status'], string> = {
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  review: 'bg-sky-100 text-sky-700',
};

const Reports = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['reports-list'],
    queryFn: fetchReports,
    staleTime: 1000 * 60 * 2,
  });
  const rows = useMemo(() => data ?? [], [data]);

  if (isLoading) {
    return <div className="text-slate-600">Loading reports...</div>;
  }

  if (isError) {
    return <div className="text-rose-600">Unable to load reports.</div>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Reports</h2>
        <p className="mt-2 text-slate-600">Manager and admin access to operational dashboards.</p>
      </header>
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-card">
        <div className="grid gap-4 p-6 sm:grid-cols-2">
          {rows.map((report) => (
            <div key={report.id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <p className="text-lg font-semibold text-slate-900">{report.title}</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[report.status]}`}
                >
                  {report.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
