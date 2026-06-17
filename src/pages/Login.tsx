import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuthStore } from '../store/auth.store';
import { demoUsers } from '../lib/demoUsers';

const loginSchema = z.object({
  email: z.email({ message: 'Enter a valid email' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: useMemo(
      () => ({
        email: '',
        password: '',
      }),
      []
    ),
  });

  const onSubmit = async (values: LoginFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const matchedUser = demoUsers.find(
      (user) => user.email === values.email && user.password === values.password
    );

    if (!matchedUser) {
      setAuthError('Email or password is incorrect.');
      return;
    }

    login(matchedUser);
    navigate('/dashboard');
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center px-6 py-16 sm:px-10 lg:px-12">
      <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-10 shadow-card sm:p-14">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Access dashboard</p>
          <h1 className="text-3xl font-semibold text-slate-900">Login to continue.</h1>
          <p className="max-w-xl text-slate-600">
            Enter your email and password to sign in. Demo users with restricted dashboard access
            are supported.
          </p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              {...register('email')}
            />
            {errors.email && <p className="mt-2 text-sm text-rose-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-rose-600">{errors.password.message}</p>
            )}
          </div>

          {authError && <p className="text-sm text-rose-600">{authError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Demo users</p>
          <ul className="mt-3 space-y-2">
            <li>Admin: admin@cora.com / Admin123!</li>
            <li>Manager: manager@cora.com / Manager123!</li>
            <li>User: user@cora.com / User123!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
