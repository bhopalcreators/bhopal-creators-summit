import { useState } from 'react';
import { Search } from 'lucide-react';
import adminApi from '../lib/adminApi';

const LABELS = {
  speakers: 'Speakers',
  sponsors: 'Sponsors',
  competitions: 'Competitions',
  workshops: 'Workshops',
  previousYears: 'Previous Years',
  blogs: 'Blog Posts',
};

export default function GlobalSearch() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSearch = async (e) => {
    e.preventDefault();
    if (q.trim().length < 2) return;
    setLoading(true);
    try {
      const res = await adminApi.get(`/search?q=${encodeURIComponent(q)}`);
      setResults(res.results);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6 lg:p-10">
      <h1 className="mb-6 font-display text-2xl uppercase text-bone">Global Search</h1>

      <form onSubmit={runSearch} className="mb-8 flex items-center gap-2 rounded-lg border border-panel-line bg-panel px-4 py-3">
        <Search size={18} className="text-fog" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search speakers, sponsors, competitions, workshops, years, blogs…"
          className="w-full bg-transparent text-sm text-bone outline-none"
        />
      </form>

      {loading && <p className="text-fog">Searching…</p>}

      {results && (
        <div className="space-y-8">
          {Object.entries(results).every(([, arr]) => arr.length === 0) && (
            <p className="text-fog">No results for &ldquo;{q}&rdquo;.</p>
          )}
          {Object.entries(results).map(
            ([key, arr]) =>
              arr.length > 0 && (
                <div key={key}>
                  <h2 className="mb-2 font-display text-sm uppercase tracking-wide text-flare">{LABELS[key] || key}</h2>
                  <ul className="divide-y divide-panel-line rounded-lg border border-panel-line">
                    {arr.map((item) => (
                      <li key={item._id} className="px-4 py-3 text-sm text-bone">
                        {item.title || item.name || item.question || item.theme || `Year ${item.year}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
