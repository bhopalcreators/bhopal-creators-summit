import { useCallback, useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import adminApi from '../lib/adminApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';

const ROLES = [
  'super_admin',
  'admin',
  'editor',
  'content_manager',
  'volunteer_manager',
  'media_manager',
  'viewer',
];

export default function Users() {
  const { user: me } = useAuth();
  const { push } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'viewer' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/auth/users');
      setUsers(res.users || []);
    } catch (err) {
      push(err.message || 'Failed to load users.', 'error');
    } finally {
      setLoading(false);
    }
  }, [push]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await adminApi.post('/auth/users', form);
      push('User created.');
      setDrawerOpen(false);
      setForm({ name: '', email: '', password: '', role: 'viewer' });
      load();
    } catch (err) {
      setError(err.message || 'Could not create user.');
    } finally {
      setSubmitting(false);
    }
  };

  const changeRole = async (id, role) => {
    try {
      await adminApi.put(`/auth/users/${id}`, { role });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
    } catch (err) {
      push(err.message || 'Could not update role.', 'error');
      load();
    }
  };

  const toggleActive = async (u) => {
    try {
      await adminApi.put(`/auth/users/${u._id}`, { isActive: !u.isActive });
      setUsers((prev) => prev.map((x) => (x._id === u._id ? { ...x, isActive: !x.isActive } : x)));
    } catch (err) {
      push(err.message || 'Update failed.', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.delete(`/auth/users/${pendingDelete._id}`);
      push('User deactivated.');
      setPendingDelete(null);
      load();
    } catch (err) {
      push(err.message || 'Delete failed.', 'error');
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl uppercase text-bone">Users & Roles</h1>
        <button
          onClick={() => setDrawerOpen(true)}
          className="focus-flare flex items-center gap-2 rounded-full bg-flare px-5 py-2.5 text-sm font-bold text-ink hover:bg-flare-hot"
        >
          <Plus size={16} /> Add user
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-panel-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel text-xs uppercase tracking-wide text-fog">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-panel-line">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-fog">Loading…</td>
              </tr>
            )}
            {!loading && users.map((u) => (
              <tr key={u._id} className="text-bone">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 text-fog">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u._id, e.target.value)}
                    disabled={u._id === me?.id}
                    className="focus-flare rounded-lg border border-panel-line bg-charcoal px-3 py-1.5 text-xs text-bone disabled:opacity-50"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(u)}
                    disabled={u._id === me?.id}
                    className={`rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50 ${
                      u.isActive ? 'bg-flare/15 text-flare' : 'bg-panel-line text-fog'
                    }`}
                  >
                    {u.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  {u._id !== me?.id && (
                    <button onClick={() => setPendingDelete(u)} className="focus-flare text-xs font-semibold text-fog hover:text-red-400">
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/60">
          <div className="h-full w-full max-w-md overflow-y-auto border-l border-panel-line bg-ink p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl uppercase text-bone">New user</h2>
              <button onClick={() => setDrawerOpen(false)} className="focus-flare text-fog hover:text-bone" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                required
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="focus-flare w-full rounded-lg border border-panel-line bg-charcoal px-4 py-2.5 text-sm text-bone outline-none"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="focus-flare w-full rounded-lg border border-panel-line bg-charcoal px-4 py-2.5 text-sm text-bone outline-none"
              />
              <input
                required
                type="password"
                minLength={8}
                placeholder="Temporary password (min 8 characters)"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="focus-flare w-full rounded-lg border border-panel-line bg-charcoal px-4 py-2.5 text-sm text-bone outline-none"
              />
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="focus-flare w-full rounded-lg border border-panel-line bg-charcoal px-4 py-2.5 text-sm text-bone outline-none"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="focus-flare w-full rounded-full bg-flare py-2.5 text-sm font-bold text-ink hover:bg-flare-hot disabled:opacity-60"
              >
                {submitting ? 'Creating…' : 'Create user'}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove this user?"
        message="Their account will be deactivated and they'll no longer be able to log in."
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
