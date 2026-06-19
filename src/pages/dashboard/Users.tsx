import { useState, useMemo, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DataTable, { type DataTableColumn } from '../../components/DataTable/DataTable';
import SearchInput from '../../components/SearchInput/SearchInput';
import { useAuthStore } from '../../store/auth.store';
import { AuthUser } from '../../types/auth';
import { MOCK_USERS } from '../../constants/mockData';

const userSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.email({ message: 'Please enter a valid email address.' }),
  role: z.enum(['admin', 'manager', 'user']),
});

type UserFormValues = z.infer<typeof userSchema>;

type UserFormState =
  | { status: 'idle' }
  | { status: 'adding' }
  | { status: 'editing'; user: AuthUser };

const Users = () => {
  const currentUser = useAuthStore((state: { user: AuthUser | null }) => state.user);
  const isAdmin = currentUser?.role === 'admin';

  const [users, setUsers] = useState<AuthUser[]>(MOCK_USERS);
  const [formState, setFormState] = useState<UserFormState>({ status: 'idle' });
  const [searchTerm, setSearchTerm] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '', role: 'user' },
  });

  useEffect(() => {
    if (formState.status === 'editing') {
      reset({
        name: formState.user.name,
        email: formState.user.email,
        role: formState.user.role,
      });
    } else {
      reset({ name: '', email: '', role: 'user' });
    }
  }, [formState, reset]);

  const handleSearch = useCallback((query: string) => {
    setSearchTerm(query);
  }, []);

  const handleEditClick = useCallback((user: AuthUser) => {
    setFormState({ status: 'editing', user });
  }, []);

  const handleDeleteClick = useCallback((id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const onSubmit = (values: UserFormValues) => {
    if (formState.status === 'adding') {
      const newUser: AuthUser = { id: Date.now().toString(), ...values };
      setUsers([...users, newUser]);
    } else if (formState.status === 'editing') {
      setUsers((prev) => prev.map((u) => (u.id === formState.user.id ? { ...u, ...values } : u)));
    }
    setFormState({ status: 'idle' });
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    const lowercasedTerm = searchTerm.toLowerCase();

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowercasedTerm) ||
        user.email.toLowerCase().includes(lowercasedTerm) ||
        user.role.toLowerCase().includes(lowercasedTerm)
    );
  }, [users, searchTerm]);

  const columns = useMemo<Array<DataTableColumn<AuthUser>>>(() => {
    const baseColumns: Array<DataTableColumn<AuthUser>> = [
      { header: 'Name', accessor: 'name' },
      { header: 'Email', accessor: 'email' },
      { header: 'Role', accessor: 'role' },
    ];

    if (isAdmin) {
      baseColumns.push({
        header: 'Actions',
        accessor: (row: AuthUser) => (
          <div className="flex gap-4">
            <button
              onClick={() => handleEditClick(row)}
              className="text-brand hover:text-brand-hover font-semibold transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteClick(row.id)}
              className="text-red-600 hover:text-red-800 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
              disabled={currentUser?.id === row.id}
            >
              Delete
            </button>
          </div>
        ),
        width: 'w-32',
      });
    }
    return baseColumns;
  }, [isAdmin, currentUser?.id, handleEditClick, handleDeleteClick]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500">Admin-only access to the list of platform users.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-full sm:w-64">
            <SearchInput onSearch={handleSearch} />
          </div>

          {isAdmin && (
            <button
              onClick={() => setFormState({ status: 'adding' })}
              className="whitespace-nowrap rounded-full bg-brand hover:bg-brand-hover px-5 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              + Add User
            </button>
          )}
        </div>
      </div>

      <DataTable<AuthUser> columns={columns} data={filteredUsers} rowKey={(row) => row.id} />

      {formState.status !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl">
            <h2 className="mb-6 text-xl font-bold text-slate-900">
              {formState.status === 'adding' ? 'Add New User' : `Edit User: ${formState.user.name}`}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className={`w-full rounded-xl border px-4 py-2 outline-none transition focus:ring-2 ${
                    errors.name
                      ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-brand focus:ring-brand/30'
                  }`}
                  {...register('name')}
                />
                {errors.name && <p className="mt-1 text-sm text-rose-600">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={`w-full rounded-xl border px-4 py-2 outline-none transition focus:ring-2 ${
                    errors.email
                      ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-brand focus:ring-brand/30'
                  }`}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="role" className="mb-1 block text-sm font-medium text-slate-700">
                  Role
                </label>
                <select
                  id="role"
                  className={`w-full rounded-xl border px-4 py-2 outline-none transition focus:ring-2 ${
                    errors.role
                      ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-brand focus:ring-brand/30'
                  }`}
                  {...register('role')}
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && <p className="mt-1 text-sm text-rose-600">{errors.role.message}</p>}
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setFormState({ status: 'idle' })}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-brand hover:bg-brand-hover px-5 py-2.5 text-sm font-semibold text-white transition-colors"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
