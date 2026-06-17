import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';
import ProtectedRoute from './components/ProtectedRoute';
import PageSkeleton from './components/PageSkeleton';
import Header from './components/Header';
import { withErrorBoundary } from './components/hoc/withErrorBoundary';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'));
const DashboardOverview = lazy(() => import('./pages/dashboard/Overview'));
const DashboardUsers = lazy(() => import('./pages/dashboard/Users'));
const DashboardReports = lazy(() => import('./pages/dashboard/Reports'));

function AppContent() {
  const { user } = useAuthStore();
  const location = useLocation();
  const showTopBanner = location.pathname === '/';
  const showHeader = !location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {showHeader && <Header showTopBanner={showTopBanner} />}
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={Boolean(user)} />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route
                path="users"
                element={
                  <ProtectedRoute isAuthenticated={Boolean(user)} allowedRoles={['admin']}>
                    <DashboardUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reports"
                element={
                  <ProtectedRoute
                    isAuthenticated={Boolean(user)}
                    allowedRoles={['admin', 'manager']}
                  >
                    <DashboardReports />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default withErrorBoundary(
  AppContent,
  <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
    <div className="rounded-3xl border border-white/20 bg-slate-900/90 p-12 text-center shadow-2xl">
      <p className="text-xl font-semibold">Something went wrong.</p>
      <p className="mt-3 text-slate-300">Please refresh the page or try again later.</p>
    </div>
  </div>
);
