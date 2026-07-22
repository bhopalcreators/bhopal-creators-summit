import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import adminApi from '../lib/adminApi';
import { useToast } from '../components/Toast';
import MediaField from '../components/MediaField';

const RELATION_FIELDS = [
  { key: 'speakers', endpoint: '/speakers', label: 'Speakers & Committee', display: (i) => i.name },
  { key: 'workshops', endpoint: '/workshops', label: 'Workshops', display: (i) => i.title },
  { key: 'competitions', endpoint: '/competitions', label: 'Competitions', display: (i) => i.title },
  { key: 'sponsors', endpoint: '/sponsors', label: 'Sponsors', display: (i) => i.name },
  { key: 'testimonials', endpoint: '/testimonials', label: 'Testimonials', display: (i) => i.handle },
  { key: 'faqs', endpoint: '/faqs', label: 'FAQs', display: (i) => i.question },
];

export default function PreviousYearEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();

  const [year, setYear] = useState(null);
  const [relationOptions, setRelationOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      adminApi.get(`/previous-years/${id}`),
      ...RELATION_FIELDS.map((r) => adminApi.get(`${r.endpoint}?limit=200`)),
    ])
      .then(([yearRes, ...relRes]) => {
        setYear(yearRes.item);
        const opts = {};
        RELATION_FIELDS.forEach((r, i) => {
          opts[r.key] = relRes[i].items || [];
        });
        setRelationOptions(opts);
      })
      .catch((err) => push(err.message || 'Failed to load.', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const set = (path, value) => {
    setYear((prev) => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const toggleRelation = (key, itemId) => {
    setYear((prev) => {
      const current = (prev[key] || []).map((v) => (typeof v === 'string' ? v : v._id));
      const next = current.includes(itemId) ? current.filter((v) => v !== itemId) : [...current, itemId];
      return { ...prev, [key]: next };
    });
  };

  const addListRow = (key, blank) => set(key, [...(year[key] || []), blank]);
  const removeListRow = (key, index) => set(key, year[key].filter((_, i) => i !== index));
  const updateListRow = (key, index, field, value) => {
    const list = [...year[key]];
    list[index] = { ...list[index], [field]: value };
    set(key, list);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // relation arrays must be plain ID strings for the API
      const payload = { ...year };
      RELATION_FIELDS.forEach((r) => {
        payload[r.key] = (year[r.key] || []).map((v) => (typeof v === 'string' ? v : v._id));
      });
      const res = await adminApi.put(`/previous-years/${id}`, payload);
      setYear(res.item);
      push('Saved.');
    } catch (err) {
      push(err.message || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !year) return <div className="p-10 text-fog">Loading…</div>;

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button onClick={() => navigate('/admin/previous-years')} className="focus-flare mb-2 text-xs text-fog hover:text-flare">
            ← Back to Previous Years
          </button>
          <h1 className="font-display text-2xl uppercase text-bone">Editing {year.year}</h1>
        </div>
        <label className="flex items-center gap-2 text-sm text-bone">
          <input
            type="checkbox"
            checked={Boolean(year.isPublished)}
            onChange={(e) => set('isPublished', e.target.checked)}
            className="h-4 w-4 accent-flare"
          />
          Published
        </label>
      </div>

      <div className="space-y-8">
        <Section title="Overview">
          <TextField label="Theme" value={year.theme} onChange={(v) => set('theme', v)} />
          <TextField label="Overview" value={year.overview} onChange={(v) => set('overview', v)} textarea rows={5} />
          <MediaField label="Cover image" value={year.coverImage} onChange={(v) => set('coverImage', v)} folder={`previous-years/${year.year}`} />
          <TextField label="Closing ceremony notes" value={year.closingCeremonyNotes} onChange={(v) => set('closingCeremonyNotes', v)} textarea />
        </Section>

        <Section title="Statistics">
          {(year.statistics || []).map((s, i) => (
            <div key={i} className="flex gap-3">
              <input
                placeholder="Value (450+)"
                value={s.value || ''}
                onChange={(e) => updateListRow('statistics', i, 'value', e.target.value)}
                className="focus-flare w-32 rounded-lg border border-panel-line bg-charcoal px-3 py-2 text-sm text-bone outline-none"
              />
              <input
                placeholder="Label (Creators Attended)"
                value={s.label || ''}
                onChange={(e) => updateListRow('statistics', i, 'label', e.target.value)}
                className="focus-flare flex-1 rounded-lg border border-panel-line bg-charcoal px-3 py-2 text-sm text-bone outline-none"
              />
              <button onClick={() => removeListRow('statistics', i)} className="focus-flare text-fog hover:text-red-400" aria-label="Remove">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <AddRowButton onClick={() => addListRow('statistics', { value: '', label: '' })} label="Add stat" />
        </Section>

        <Section title="Timeline">
          {(year.timeline || []).map((t, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-[100px_1fr_1fr_auto]">
              <input
                placeholder="Time"
                value={t.time || ''}
                onChange={(e) => updateListRow('timeline', i, 'time', e.target.value)}
                className="focus-flare rounded-lg border border-panel-line bg-charcoal px-3 py-2 text-sm text-bone outline-none"
              />
              <input
                placeholder="Title"
                value={t.title || ''}
                onChange={(e) => updateListRow('timeline', i, 'title', e.target.value)}
                className="focus-flare rounded-lg border border-panel-line bg-charcoal px-3 py-2 text-sm text-bone outline-none"
              />
              <input
                placeholder="Description"
                value={t.description || ''}
                onChange={(e) => updateListRow('timeline', i, 'description', e.target.value)}
                className="focus-flare rounded-lg border border-panel-line bg-charcoal px-3 py-2 text-sm text-bone outline-none"
              />
              <button onClick={() => removeListRow('timeline', i)} className="focus-flare text-fog hover:text-red-400" aria-label="Remove">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <AddRowButton onClick={() => addListRow('timeline', { time: '', title: '', description: '' })} label="Add timeline entry" />
        </Section>

        <Section title="Achievements & Highlights">
          <TextField
            label="Achievements (one per line)"
            value={(year.achievements || []).join('\n')}
            onChange={(v) => set('achievements', v.split('\n').map((s) => s.trim()).filter(Boolean))}
            textarea
          />
          <TextField
            label="Highlights (one per line)"
            value={(year.highlights || []).join('\n')}
            onChange={(v) => set('highlights', v.split('\n').map((s) => s.trim()).filter(Boolean))}
            textarea
          />
        </Section>

        <Section title="Winners">
          {(year.winners || []).map((w, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <input
                placeholder="Award title"
                value={w.awardTitle || ''}
                onChange={(e) => updateListRow('winners', i, 'awardTitle', e.target.value)}
                className="focus-flare rounded-lg border border-panel-line bg-charcoal px-3 py-2 text-sm text-bone outline-none"
              />
              <input
                placeholder="Winner name"
                value={w.winnerName || ''}
                onChange={(e) => updateListRow('winners', i, 'winnerName', e.target.value)}
                className="focus-flare rounded-lg border border-panel-line bg-charcoal px-3 py-2 text-sm text-bone outline-none"
              />
              <button onClick={() => removeListRow('winners', i)} className="focus-flare text-fog hover:text-red-400" aria-label="Remove">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <AddRowButton onClick={() => addListRow('winners', { awardTitle: '', winnerName: '' })} label="Add winner" />
        </Section>

        {RELATION_FIELDS.map((r) => {
          const selected = (year[r.key] || []).map((v) => (typeof v === 'string' ? v : v._id));
          return (
            <Section key={r.key} title={r.label}>
              <div className="grid max-h-64 grid-cols-1 gap-1 overflow-y-auto sm:grid-cols-2">
                {(relationOptions[r.key] || []).map((opt) => (
                  <label key={opt._id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-bone hover:bg-charcoal">
                    <input
                      type="checkbox"
                      checked={selected.includes(opt._id)}
                      onChange={() => toggleRelation(r.key, opt._id)}
                      className="h-4 w-4 accent-flare"
                    />
                    {r.display(opt)}
                  </label>
                ))}
                {(relationOptions[r.key] || []).length === 0 && (
                  <p className="text-xs text-fog">No {r.label.toLowerCase()} exist yet — add them from their own section first.</p>
                )}
              </div>
            </Section>
          );
        })}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="focus-flare sticky bottom-6 mt-8 w-full rounded-full bg-flare py-3 text-sm font-bold text-ink shadow-lg hover:bg-flare-hot disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save all changes'}
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-panel-line bg-panel p-6">
      <h2 className="mb-4 font-display text-sm uppercase tracking-wide text-flare">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function TextField({ label, value, onChange, textarea, rows = 3 }) {
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fog">{label}</label>
      <Tag
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={textarea ? rows : undefined}
        className="focus-flare w-full rounded-lg border border-panel-line bg-charcoal px-4 py-2.5 text-sm text-bone outline-none"
      />
    </div>
  );
}

function AddRowButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-flare flex items-center gap-1.5 text-xs font-semibold text-flare hover:text-flare-hot"
    >
      <Plus size={14} /> {label}
    </button>
  );
}
