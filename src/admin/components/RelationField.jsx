import { useEffect, useState } from 'react';
import adminApi from '../lib/adminApi';

export default function RelationField({ label, endpoint, labelKey, value, onChange, multiple = false }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    adminApi
      .get(`${endpoint}?limit=200`)
      .then((res) => {
        if (!cancelled) setOptions(res.items || []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  const display = (opt) => (typeof labelKey === 'function' ? labelKey(opt) : opt[labelKey]) || opt._id;

  if (multiple) {
    const selected = (value || []).map((v) => (typeof v === 'string' ? v : v._id));
    const toggle = (id) => {
      onChange(selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id]);
    };
    return (
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fog">{label}</label>
        <div className="grid max-h-56 grid-cols-1 gap-1 overflow-y-auto rounded-lg border border-panel-line bg-charcoal p-2 sm:grid-cols-2">
          {options.map((opt) => (
            <label key={opt._id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-bone hover:bg-panel">
              <input
                type="checkbox"
                checked={selected.includes(opt._id)}
                onChange={() => toggle(opt._id)}
                className="h-4 w-4 accent-flare"
              />
              {display(opt)}
            </label>
          ))}
          {!loading && options.length === 0 && (
            <p className="px-2 py-1.5 text-xs text-fog">Nothing here yet — add one first.</p>
          )}
        </div>
      </div>
    );
  }

  const selectedId = typeof value === 'string' ? value : value?._id || '';

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fog">{label}</label>
      <select
        value={selectedId}
        onChange={(e) => onChange(e.target.value || null)}
        className="focus-flare w-full rounded-lg border border-panel-line bg-charcoal px-4 py-2.5 text-sm text-bone outline-none"
      >
        <option value="">{loading ? 'Loading…' : 'None'}</option>
        {options.map((opt) => (
          <option key={opt._id} value={opt._id}>
            {display(opt)}
          </option>
        ))}
      </select>
    </div>
  );
}