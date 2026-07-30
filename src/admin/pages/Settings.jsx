import { useEffect, useState } from 'react';
import adminApi from '../lib/adminApi';
import { useToast } from '../components/Toast';

export default function Settings() {
  const { push } = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi
      .get('/settings')
      .then((res) => setSettings(res.settings))
      .catch((err) => push(err.message || 'Failed to load settings.', 'error'))
      .finally(() => setLoading(false));
  }, [push]);

  const set = (path, value) => {
    setSettings((prev) => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminApi.put('/settings', settings);
      setSettings(res.settings);
      push('Settings saved.');
    } catch (err) {
      push(err.message || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="p-10 text-fog">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl p-6 lg:p-10">
      <h1 className="mb-6 font-display text-2xl uppercase text-bone">Site Settings</h1>

      <form onSubmit={handleSave} className="space-y-8">
        <Section title="Brand">
          <Field label="Brand name" value={settings.brandName} onChange={(v) => set('brandName', v)} />
          <Field label="Event name" value={settings.eventName} onChange={(v) => set('eventName', v)} />
          <Field label="Tagline" value={settings.tagline} onChange={(v) => set('tagline', v)} />
        </Section>

        <Section title="Event details">
          <Field label="Date label" value={settings.eventDateLabel} onChange={(v) => set('eventDateLabel', v)} placeholder="31 AUG" />
          <Field label="Venue name" value={settings.venueName} onChange={(v) => set('venueName', v)} />
          <Field label="Venue full address" value={settings.venueFullAddress} onChange={(v) => set('venueFullAddress', v)} />
        </Section>

        <Section title="Contact">
          <Field label="Email" value={settings.contactEmail} onChange={(v) => set('contactEmail', v)} />
          <Field
            label="Phone numbers (comma-separated)"
            value={(settings.contactPhones || []).join(', ')}
            onChange={(v) => set('contactPhones', v.split(',').map((s) => s.trim()).filter(Boolean))}
          />
        </Section>

        <Section title="Theme">
          <div className="grid grid-cols-3 gap-4">
            <ColorField label="Primary" value={settings.theme?.primaryColor} onChange={(v) => set('theme.primaryColor', v)} />
            <ColorField label="Secondary" value={settings.theme?.secondaryColor} onChange={(v) => set('theme.secondaryColor', v)} />
            <ColorField label="Background" value={settings.theme?.backgroundColor} onChange={(v) => set('theme.backgroundColor', v)} />
          </div>
        </Section>

        <Section title="SEO defaults">
          <Field label="Meta title" value={settings.seoDefaults?.metaTitle} onChange={(v) => set('seoDefaults.metaTitle', v)} />
          <Field label="Meta description" value={settings.seoDefaults?.metaDescription} onChange={(v) => set('seoDefaults.metaDescription', v)} textarea />
          <Field
            label="Keywords (comma-separated)"
            value={(settings.seoDefaults?.keywords || []).join(', ')}
            onChange={(v) => set('seoDefaults.keywords', v.split(',').map((s) => s.trim()).filter(Boolean))}
          />
          <Field label="Twitter handle" value={settings.seoDefaults?.twitterHandle} onChange={(v) => set('seoDefaults.twitterHandle', v)} />
        </Section>

        <Section title="Announcement bar">
          <label className="flex items-center gap-2 text-sm text-bone">
            <input
              type="checkbox"
              checked={Boolean(settings.announcementBar?.isActive)}
              onChange={(e) => set('announcementBar.isActive', e.target.checked)}
              className="h-4 w-4 accent-flare"
            />
            Show announcement bar
          </label>
          <Field label="Message" value={settings.announcementBar?.message} onChange={(v) => set('announcementBar.message', v)} />
          <Field label="Link URL" value={settings.announcementBar?.linkUrl} onChange={(v) => set('announcementBar.linkUrl', v)} />
        </Section>

        <Section title="Footer">
          <Field label="Footer about text" value={settings.footerAbout} onChange={(v) => set('footerAbout', v)} textarea />
        </Section>

        <Section title="Volunteer sign-up">
          <Field
            label="Volunteer form URL (Google Form link)"
            value={settings.volunteerFormUrl}
            onChange={(v) => set('volunteerFormUrl', v)}
            placeholder="https://forms.gle/..."
          />
          <p className="text-xs text-fog">
            This is where the homepage &quot;Volunteer&quot; button sends people. Leave blank and it&apos;ll fall back
            to the contact section until you add a link here.
          </p>
        </Section>

        <button
          type="submit"
          disabled={saving}
          className="focus-flare rounded-full bg-flare px-6 py-2.5 text-sm font-bold text-ink hover:bg-flare-hot disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-panel-line bg-panel p-6">
      <h2 className="mb-4 font-display text-sm uppercase tracking-wide text-flare">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, textarea }) {
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fog">{label}</label>
      <Tag
        value={value || ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={textarea ? 3 : undefined}
        className="focus-flare w-full rounded-lg border border-panel-line bg-charcoal px-4 py-2.5 text-sm text-bone outline-none"
      />
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fog">{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} className="h-9 w-9 rounded border border-panel-line bg-charcoal" />
        <input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="focus-flare w-full rounded-lg border border-panel-line bg-charcoal px-3 py-2 text-xs text-bone outline-none"
        />
      </div>
    </div>
  );
}