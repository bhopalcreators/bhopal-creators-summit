import { useState } from 'react';
import MediaField from './MediaField';

function toInputValue(field, raw) {
  if (raw === undefined || raw === null) return field.type === 'checkbox' ? false : '';
  if (field.type === 'date') return String(raw).slice(0, 10);
  if (field.type === 'stringList') return Array.isArray(raw) ? raw.join('\n') : raw;
  return raw;
}

function fromInputValue(field, raw) {
  if (field.type === 'number') return raw === '' ? undefined : Number(raw);
  if (field.type === 'stringList') return raw.split('\n').map((s) => s.trim()).filter(Boolean);
  if (field.type === 'checkbox') return Boolean(raw);
  return raw;
}

export default function AdminForm({ fields, initialValues = {}, onSubmit, onCancel, submitLabel = 'Save', mediaFolder }) {
  const [values, setValues] = useState(() => {
    const v = {};
    fields.forEach((f) => {
      v[f.name] = f.type === 'media' ? initialValues[f.name] || null : toInputValue(f, initialValues[f.name]);
    });
    return v;
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const setField = (name, val) => setValues((v) => ({ ...v, [name]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {};
    fields.forEach((f) => {
      payload[f.name] = f.type === 'media' ? values[f.name] : fromInputValue(f, values[f.name]);
    });

    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.message || 'Something went wrong saving this.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {fields.map((field) => (
        <div key={field.name}>
          {field.type === 'media' ? (
            <MediaField
              label={field.label}
              value={values[field.name]}
              onChange={(val) => setField(field.name, val)}
              folder={mediaFolder}
            />
          ) : field.type === 'checkbox' ? (
            <label className="flex items-center gap-2 text-sm text-bone">
              <input
                type="checkbox"
                checked={Boolean(values[field.name])}
                onChange={(e) => setField(field.name, e.target.checked)}
                className="h-4 w-4 rounded border-panel-line accent-flare"
              />
              {field.label}
            </label>
          ) : (
            <>
              <label htmlFor={field.name} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fog">
                {field.label}
                {field.required && <span className="text-flare"> *</span>}
              </label>

              {field.type === 'textarea' || field.type === 'stringList' ? (
                <textarea
                  id={field.name}
                  required={field.required}
                  rows={field.rows || (field.type === 'stringList' ? 5 : 4)}
                  placeholder={field.type === 'stringList' ? 'One item per line' : field.placeholder}
                  value={values[field.name] ?? ''}
                  onChange={(e) => setField(field.name, e.target.value)}
                  className="focus-flare w-full rounded-lg border border-panel-line bg-charcoal px-4 py-2.5 text-sm text-bone outline-none"
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.name}
                  required={field.required}
                  value={values[field.name] ?? ''}
                  onChange={(e) => setField(field.name, e.target.value)}
                  className="focus-flare w-full rounded-lg border border-panel-line bg-charcoal px-4 py-2.5 text-sm text-bone outline-none"
                >
                  <option value="">Select…</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ''}
                  onChange={(e) => setField(field.name, e.target.value)}
                  className="focus-flare w-full rounded-lg border border-panel-line bg-charcoal px-4 py-2.5 text-sm text-bone outline-none"
                />
              )}
            </>
          )}
        </div>
      ))}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex justify-end gap-3 border-t border-panel-line pt-5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="focus-flare rounded-full border border-panel-line px-5 py-2.5 text-sm font-semibold text-bone hover:border-fog"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="focus-flare rounded-full bg-flare px-6 py-2.5 text-sm font-bold text-ink hover:bg-flare-hot disabled:opacity-60"
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
