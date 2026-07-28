import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search, X } from 'lucide-react';
import adminApi from '../lib/adminApi';
import { resources } from '../config/resources';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';
import AdminForm from '../components/AdminForm';

export default function ResourceList() {
  const { key } = useParams();
  const resource = resources[key];
  const { can } = useAuth();
  const { push } = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [drawer, setDrawer] = useState(null); // null | 'create' | item object
  const [pendingDelete, setPendingDelete] = useState(null);

  const canCreate = resource && can(resource.resourceKey, 'create');
  const canUpdate = resource && can(resource.resourceKey, 'update');
  const canDelete = resource && can(resource.resourceKey, 'delete');

  const load = useCallback(async () => {
    if (!resource) return;
    setLoading(true);
    try {
      const query = search ? `?search=${encodeURIComponent(search)}&limit=200` : '?limit=200';
      const res = await adminApi.get(`${resource.endpoint}${query}`);
      setItems(res.items || []);
    } catch (err) {
      push(err.message || 'Failed to load items.', 'error');
    } finally {
      setLoading(false);
    }
  }, [resource, search, push]);

  useEffect(() => {
    load();
  }, [load]);

  if (!resource) {
    return <div className="p-8 text-fog">Unknown resource: {key}</div>;
  }

  const handleSave = async (payload) => {
    if (drawer === 'create') {
      await adminApi.post(resource.endpoint, payload);
      push(`${resource.label.replace(/s$/, '')} created.`);
    } else {
      await adminApi.put(`${resource.endpoint}/${drawer._id}`, payload);
      push(`${resource.label.replace(/s$/, '')} updated.`);
    }
    setDrawer(null);
    load();
  };

  const handleDelete = async () => {
    try {
      await adminApi.delete(`${resource.endpoint}/${pendingDelete._id}`);
      push('Deleted.');
      setPendingDelete(null);
      load();
    } catch (err) {
      push(err.message || 'Delete failed.', 'error');
    }
  };

  const move = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setItems(reordered);

    try {
      await adminApi.patch(`${resource.endpoint}/reorder`, {
        items: reordered.map((it, i) => ({ id: it._id, order: i })),
      });
    } catch (err) {
      push(err.message || 'Reorder failed.', 'error');
      load();
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl uppercase text-bone">{resource.label}</h1>
        {canCreate && (
          <button
            onClick={() => setDrawer('create')}
            className="focus-flare flex items-center gap-2 rounded-full bg-flare px-5 py-2.5 text-sm font-bold text-ink hover:bg-flare-hot"
          >
            <Plus size={16} /> Add new
          </button>
        )}
      </div>

      <div className="mb-5 flex items-center gap-2 rounded-lg border border-panel-line bg-panel px-4 py-2.5">
        <Search size={16} className="text-fog" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          className="w-full bg-transparent text-sm text-bone outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-panel-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel text-xs uppercase tracking-wide text-fog">
            <tr>
              {resource.reorderable && <th className="w-20 px-4 py-3">Order</th>}
              {resource.columns.map((col) => (
                <th key={col.key} className="px-4 py-3">
                  {col.label}
                </th>
              ))}
              <th className="w-28 px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-panel-line">
            {loading && (
              <tr>
                <td colSpan={resource.columns.length + 2} className="px-4 py-8 text-center text-fog">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={resource.columns.length + 2} className="px-4 py-8 text-center text-fog">
                  Nothing here yet.
                </td>
              </tr>
            )}
            {items.map((item, i) => (
              <tr key={item._id} className="text-bone">
                {resource.reorderable && (
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => move(i, -1)}
                        disabled={i === 0 || !canUpdate}
                        className="focus-flare text-fog hover:text-flare disabled:opacity-30"
                        aria-label="Move up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => move(i, 1)}
                        disabled={i === items.length - 1 || !canUpdate}
                        className="focus-flare text-fog hover:text-flare disabled:opacity-30"
                        aria-label="Move down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </td>
                )}
                {resource.columns.map((col) => (
                  <td key={col.key} className="max-w-xs truncate px-4 py-3">
                    {renderCell(item[col.key])}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {canUpdate && (
                      <button
                        onClick={() => setDrawer(item)}
                        className="focus-flare text-fog hover:text-flare"
                        aria-label="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => setPendingDelete(item)}
                        className="focus-flare text-fog hover:text-red-400"
                        aria-label="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/60">
          <div className="h-full w-full max-w-lg overflow-y-auto border-l border-panel-line bg-ink p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl uppercase text-bone">
                {drawer === 'create' ? `New ${resource.label.replace(/s$/, '')}` : `Edit ${resource.label.replace(/s$/, '')}`}
              </h2>
              <button onClick={() => setDrawer(null)} className="focus-flare text-fog hover:text-bone" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <AdminForm
              fields={resource.fields}
              initialValues={drawer === 'create' ? {} : drawer}
              onSubmit={handleSave}
              onCancel={() => setDrawer(null)}
              mediaFolder={key}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this item?"
        message="This can be restored by an admin from the database, but won't appear on the live site anymore."
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function renderCell(value) {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value === undefined || value === null) return '—';
  if (typeof value === 'object') return value.title || value.name || value.label || value._id || '—';
  return String(value);
}