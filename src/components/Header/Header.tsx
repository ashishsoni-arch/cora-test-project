import { Link } from 'react-router-dom';
import type { HeaderProps } from '../../types/header';

const navItems = [
  { label: 'About', to: '/about' },
  { label: 'Login', to: '/login' },
];

const Header = ({ showTopBanner = false }: HeaderProps) => (
  <header className="relative">
    {showTopBanner && (
      <div className="bg-slate-950 text-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 text-center text-xs sm:flex-row sm:items-center sm:justify-center sm:text-sm sm:px-6 lg:px-8">
          <p className="truncate">
            From new grads to seasoned pros, your next move starts here.{' '}
            <Link
              to="/contact"
              className="font-semibold text-sky-300 underline decoration-sky-300/50 hover:text-sky-200"
            >
              Explore CORA Careers
            </Link>
          </p>
        </div>
      </div>
    )}

    <div className="bg-slate-950 text-slate-100 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-lime-400 text-lg font-semibold text-slate-950 shadow-card">
            C
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              CORA Physical Therapy
            </p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-5 text-sm font-medium text-slate-200 sm:gap-6">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
          <span className="hidden rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-200 sm:inline-flex">
            <span className="text-sky-300">1.866.443.2672</span>
          </span>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
