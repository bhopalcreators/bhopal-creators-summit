import { useCallback, useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import adminApi from '../lib/adminApi';
import { useToast } from '../components/Toast';

const FORM_TYPES = ['contact', 'registration', 'sponsor_inquiry', 'competition_entry', 'newsletter'];
const STATUSES = ['new', 'reviewed', 'approved', 'rejected', 'spam'];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function Submissions() {
  const { push } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formType, setFormType] = useState('');
  const [status, setStatus] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (formType) params.set('formType', formType);
      if (status) params.set('status', status);
      const res = await adminApi.get(`/submissions?${params.toString()}`);
      setItems(res.items || []);
    } catch (err) {
      push(err.message || 'Failed to load submissions.', 'error');
    } finally {
      setLoading(false);
    }
  }, [formType, status, push]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id, newStatus) => {
    try {
      await adminApi.put(`/submissions/${id}/status`, { status: newStatus });
      setItems((prev) => prev.map((it) => (it._id === id ? { ...it, status: newStatus } : it)));
    } catch (err) {
      push(err.message || 'Update failed.', 'error');
    }
  };

  const exportCsv = () => {
    const params = new URLSearchParams();
    if (formType) params.set('formType', formType);
    window.open(`${API_BASE_URL}/submissions/export/csv?${params.toString()}`, '_blank');
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl uppercase text-bone">Form Submissions</h1>
        <button
          onClick={exportCsv}
          className="focus-flare flex items-center gap-2 rounded-full border border-panel-line px-5 py-2.5 text-sm font-semibold text-bone hover:border-fog"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <select
          value={formType}
          onChange={(e) => setFormType(e.target.value)}
          className="focus-flare rounded-lg border border-panel-line bg-panel px-4 py-2 text-sm text-bone"
        >
          <option value="">All form types</option>
          {FORM_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="focus-flare rounded-lg border border-panel-line bg-panel px-4 py-2 text-sm text-bone"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {loading && <p className="text-fog">Loading…</p>}
        {!loading && items.length === 0 && <p className="text-fog">No submissions match these filters.</p>}
        {items.map((s) => (
          <div key={s._id} className="rounded-xl border border-panel-line bg-panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="rounded-full bg-flare/15 px-3 py-1 text-xs font-semibold uppercase text-flare">
                  {s.formType.replace(/_/g, ' ')}
                </span>
                <span className="ml-2 text-xs text-fog">{new Date(s.createdAt).toLocaleString()}</span>
              </div>
              <select
                value={s.status}
                onChange={(e) => updateStatus(s._id, e.target.value)}
                className="focus-flare rounded-lg border border-panel-line bg-charcoal px-3 py-1.5 text-xs text-bone"
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
            <dl className="mt-4 grid gap-2 sm:grid-cols-2">
              {Object.entries(s.fields || {}).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs uppercase tracking-wide text-fog">{k}</dt>
                  <dd className="text-sm text-bone">{String(v)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
