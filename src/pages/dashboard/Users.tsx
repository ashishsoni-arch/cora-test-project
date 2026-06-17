import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DataTable, { type DataTableColumn } from '../../components/DataTable';
import { useAuthStore, type AuthUser } from '../../store/auth.store';

// --- ZOD SCHEMA ---
// This acts as both our runtime validation and our compile-time type!
const userSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.email({ message: 'Please enter a valid email address.' }),
  role: z.enum(['admin', 'manager', 'user']),
});

type UserFormValues = z.infer<typeof userSchema>;

// --- DISCRIMINATED UNION ---
type UserFormState =
  | { status: 'idle' }
  | { status: 'adding' }
  | { status: 'editing'; user: AuthUser };

// Mock Initial Data
const MOCK_USERS: AuthUser[] = [
  { id: '1', name: 'Avery Chen', email: 'avery@cora.com', role: 'admin' },
  { id: '2', name: 'Jordan Lee', email: 'jordan@cora.com', role: 'manager' },
];

const Users = () => {
  const currentUser = useAuthStore((state) => state.user);
  const isAdmin = currentUser?.role === 'admin';

  const [users, setUsers] = useState<AuthUser[]>(MOCK_USERS);
  const [formState, setFormState] = useState<UserFormState>({ status: 'idle' });

  // --- REACT-HOOK-FORM SETUP ---
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '', role: 'user' },
  });

  // Populate or clear form based on formState
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

  // --- ACTIONS ---
  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const onSubmit = (values: UserFormValues) => {
    if (formState.status === 'adding') {
      const newUser: AuthUser = { id: Date.now().toString(), ...values };
      setUsers([...users, newUser]);
    } else if (formState.status === 'editing') {
      setUsers((prev) => prev.map((u) => (u.id === formState.user.id ? { ...u, ...values } : u)));
    }
    setFormState({ status: 'idle' }); // Close the modal
  };

  // --- COLUMNS ---
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
              onClick={() => setFormState({ status: 'editing', user: row })}
              className="text-sky-600 hover:text-sky-800 font-semibold transition"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(row.id)}
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
  }, [isAdmin, currentUser]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500">Admin-only access to the list of platform users.</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setFormState({ status: 'adding' })}
            className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Add User
          </button>
        )}
      </div>

      {/* Data Table */}
      <DataTable<AuthUser> columns={columns} data={users} rowKey={(row) => row.id} />

      {/* MODAL OVERLAY */}
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
                      : 'border-slate-300 focus:border-sky-400 focus:ring-sky-200'
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
                      : 'border-slate-300 focus:border-sky-400 focus:ring-sky-200'
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
                      : 'border-slate-300 focus:border-sky-400 focus:ring-sky-200'
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
                  className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
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
