import { NavLink, Outlet } from 'react-router-dom';
import { useMemo } from 'react';
import { useAuthStore } from '../../store/auth.store';

const navItems = [
  { label: 'Overview', to: '/dashboard' },
  { label: 'Users', to: '/dashboard/users', roles: ['admin'] },
  { label: 'Reports', to: '/dashboard/reports', roles: ['admin', 'manager'] },
];

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();

  const allowedNav = useMemo(
    () => navItems.filter((item) => !item.roles || item.roles.includes(user?.role ?? 'user')),
    [user?.role]
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white px-6 py-5 shadow-sm sm:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Dashboard</p>
            <h1 className="text-xl font-semibold text-slate-900">Welcome back, {user?.name}</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              window.sessionStorage.removeItem('userRole');
              window.location.assign('/login');
            }}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[260px_1fr]">
        <nav className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Navigation
          </p>
          <div className="flex flex-col gap-3">
            {allowedNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                // The 'end' prop ensures '/dashboard' doesn't stay active when on '/dashboard/users'
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `rounded-3xl px-4 py-3 transition ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default DashboardLayout;
