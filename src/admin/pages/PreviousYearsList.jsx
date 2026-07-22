import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import adminApi from '../lib/adminApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';

export default function PreviousYearsList() {
  const { can } = useAuth();
  const { push } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [newYear, setNewYear] = useState('');

  const canCreate = can('previousYears', 'create');
  const canDelete = can('previousYears', 'delete');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/previous-years?limit=100');
      setItems(res.items || []);
    } catch (err) {
      push(err.message || 'Failed to load.', 'error');
    } finally {
      setLoading(false);
    }
  }, [push]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const year = Number(newYear);
    if (!year) return;
    try {
      await adminApi.post('/previous-years', { year, slug: String(year) });
      push(`Created ${year} edition.`);
      setNewYear('');
      load();
    } catch (err) {
      push(err.message || 'Could not create.', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.delete(`/previous-years/${pendingDelete._id}`);
      push('Deleted.');
      setPendingDelete(null);
      load();
    } catch (err) {
      push(err.message || 'Delete failed.', 'error');
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <h1 className="mb-6 font-display text-2xl uppercase text-bone">Previous Years</h1>

      {canCreate && (
        <form onSubmit={handleCreate} className="mb-6 flex gap-3">
          <input
            type="number"
            placeholder="e.g. 2024"
            value={newYear}
            onChange={(e) => setNewYear(e.target.value)}
            className="focus-flare w-40 rounded-lg border border-panel-line bg-panel px-4 py-2.5 text-sm text-bone outline-none"
          />
          <button
            type="submit"
            className="focus-flare flex items-center gap-2 rounded-full bg-flare px-5 py-2.5 text-sm font-bold text-ink hover:bg-flare-hot"
          >
            <Plus size={16} /> Add year
          </button>
        </form>
      )}

      {loading && <p className="text-fog">Loading…</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item._id} className="rounded-xl border border-panel-line bg-panel p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-2xl text-bone">{item.year}</p>
                <p className="text-xs text-fog">{item.theme || 'No theme set'}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                  item.isPublished ? 'bg-flare/15 text-flare' : 'bg-panel-line text-fog'
                }`}
              >
                {item.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
            <div className="mt-4 flex gap-3">
              <Link
                to={`/admin/previous-years/${item._id}`}
                className="focus-flare flex-1 rounded-full border border-panel-line py-2 text-center text-xs font-semibold text-bone hover:border-flare hover:text-flare"
              >
                Edit
              </Link>
              <a
                href={`/previous-years/${item.slug}`}
                target="_blank"
                rel="noreferrer"
                className="focus-flare rounded-full border border-panel-line p-2 text-fog hover:text-flare"
                aria-label="View live page"
              >
                <ExternalLink size={14} />
              </a>
              {canDelete && (
                <button
                  onClick={() => setPendingDelete(item)}
                  className="focus-flare rounded-full border border-panel-line p-2 text-fog hover:text-red-400"
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete ${pendingDelete?.year}?`}
        message="This removes the entire year page and its data. Speakers, workshops etc referenced from it are not deleted, just unlinked."
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
