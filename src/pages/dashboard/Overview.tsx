import { useMemo } from 'react';
import { useFetchDashboardData } from '../../hooks/useFetchDashboardData';

const Overview = () => {
  const { data, isLoading, isError } = useFetchDashboardData();

  const summary = useMemo(
    () => data?.summary ?? { activeUsers: 0, pendingTasks: 0, totalRevenue: 0 },
    [data]
  );

  if (isLoading) {
    return <div className="text-slate-600">Loading overview...</div>;
  }

  if (isError) {
    return <div className="text-rose-600">Failed to load overview.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Overview</h2>
        <p className="mt-2 text-slate-600">
          A quick summary of dashboard activity and key metrics.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Active users</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{summary.activeUsers}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Pending tasks</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{summary.pendingTasks}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Total revenue</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">
              ${summary.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
        <h3 className="text-xl font-semibold text-slate-900">Latest activity</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {data?.items.map((item) => (
            <div key={item.id} className="rounded-3xl border border-slate-200 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{item.title}</p>
              <p className="mt-3 text-slate-700">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
