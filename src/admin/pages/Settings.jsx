import { useEffect, useState } from 'react';
import adminApi from '../lib/adminApi';
import { useToast } from '../components/Toast';
import {
  navLinks as navLinksDefault,
  footerLinks as footerLinksDefault,
  journeyStats as journeyStatsDefault,
  aboutContent as aboutDefault,
  comingSoon2026 as comingSoonDefault,
  socialLinksFallback,
} from '../../data/siteContent';

export default function Settings() {
  const { push } = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const normalizeSettings = (s) => ({
    ...s,
    socialLinks: s.socialLinks?.length ? s.socialLinks : socialLinksFallback,
    navLinks: s.navLinks?.length ? s.navLinks : navLinksDefault,
    footerLinks: s.footerLinks?.length ? s.footerLinks : footerLinksDefault,
    journeyStats: s.journeyStats?.length ? s.journeyStats : journeyStatsDefault,
    about: {
      eyebrow: aboutDefault.eyebrow,
      title: aboutDefault.title,
      paragraphs: aboutDefault.paragraphs,
      highlights: aboutDefault.highlights,
      ...s.about,
    },
    comingSoon: {
      eyebrow: comingSoonDefault.eyebrow,
      title: comingSoonDefault.title,
      copy: comingSoonDefault.copy,
      notifyHref: comingSoonDefault.notifyHref,
      notifyLabel: comingSoonDefault.notifyLabel,
      ...s.comingSoon,
    },
  });

  useEffect(() => {
    adminApi
      .get('/settings')
      .then((res) => setSettings(normalizeSettings(res.settings)))
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

  const updateArray = (path, updater) => {
    setSettings((prev) => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      const arrKey = keys[keys.length - 1];
      if (!Array.isArray(obj[arrKey])) obj[arrKey] = [];
      obj[arrKey] = updater(obj[arrKey]);
      return next;
    });
  };

  const addItem = (path, template) => updateArray(path, (arr) => [...arr, { ...template }]);
  const removeItem = (path, index) => updateArray(path, (arr) => arr.filter((_, i) => i !== index));
  const updateItem = (path, index, key, value) =>
    updateArray(path, (arr) => arr.map((item, i) => (i === index ? { ...item, [key]: value } : item)));

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

        <Section title="Navigation menu">
          {(settings.navLinks || []).map((link, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <input
                value={link.label || ''}
                placeholder="Label"
                onChange={(e) => updateItem('navLinks', i, 'label', e.target.value)}
                className="focus-flare w-40 rounded-lg border border-panel-line bg-charcoal px-3 py-2 text-sm text-bone outline-none"
              />
              <input
                value={link.href || ''}
                placeholder="/about or #section"
                onChange={(e) => updateItem('navLinks', i, 'href', e.target.value)}
                className="focus-flare min-w-[180px] flex-1 rounded-lg border border-panel-line bg-charcoal px-3 py-2 text-sm text-bone outline-none"
              />
              <button
                type="button"
                onClick={() => removeItem('navLinks', i)}
                className="focus-flare rounded-full border border-panel-line px-3 py-1.5 text-xs font-bold text-fog hover:border-flare hover:text-flare"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem('navLinks', { label: '', href: '' })}
            className="focus-flare rounded-full border border-panel-line px-4 py-2 text-xs font-bold text-bone hover:border-flare hover:text-flare"
          >
            + Add nav link
          </button>
        </Section>

        <Section title="Event details">
          <Field label="Date label" value={settings.eventDateLabel} onChange={(v) => set('eventDateLabel', v)} placeholder="31 AUG" />
          <Field label="Venue name" value={settings.venueName} onChange={(v) => set('venueName', v)} />
          <Field label="Venue full address" value={settings.venueFullAddress} onChange={(v) => set('venueFullAddress', v)} />
        </Section>

        <Section title="About section (homepage &amp; /about page)">
          <Field
            label="Eyebrow"
            value={settings.about?.eyebrow}
            onChange={(v) => set('about.eyebrow', v)}
          />
          <Field label="Title" value={settings.about?.title} onChange={(v) => set('about.title', v)} />
          <Field
            label="Paragraphs (one per line)"
            value={(settings.about?.paragraphs || []).join('\n')}
            onChange={(v) => set('about.paragraphs', v.split('\n').map((s) => s.trim()).filter(Boolean))}
            textarea
          />

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fog">
              Highlights
            </label>
            <div className="space-y-3">
              {(settings.about?.highlights || []).map((h, i) => (
                <div key={i} className="space-y-2 rounded-lg border border-panel-line p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={h.icon || 'Mic'}
                      onChange={(e) => updateItem('about.highlights', i, 'icon', e.target.value)}
                      className="focus-flare rounded-lg border border-panel-line bg-charcoal px-3 py-2 text-sm text-bone outline-none"
                    >
                      {['Mic', 'Heart', 'Presentation'].map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                    <input
                      value={h.title || ''}
                      placeholder="Highlight title"
                      onChange={(e) => updateItem('about.highlights', i, 'title', e.target.value)}
                      className="focus-flare min-w-[180px] flex-1 rounded-lg border border-panel-line bg-charcoal px-3 py-2 text-sm text-bone outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem('about.highlights', i)}
                      className="focus-flare rounded-full border border-panel-line px-3 py-1.5 text-xs font-bold text-fog hover:border-flare hover:text-flare"
                    >
                      Remove
                    </button>
                  </div>
                  <textarea
                    value={h.copy || ''}
                    placeholder="Highlight description"
                    rows={2}
                    onChange={(e) => updateItem('about.highlights', i, 'copy', e.target.value)}
                    className="focus-flare w-full rounded-lg border border-panel-line bg-charcoal px-3 py-2 text-sm text-bone outline-none"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addItem('about.highlights', { icon: 'Mic', title: '', copy: '' })}
                className="focus-flare rounded-full border border-panel-line px-4 py-2 text-xs font-bold text-bone hover:border-flare hover:text-flare"
              >
                + Add highlight
              </button>
            </div>
          </div>
        </Section>

        <Section title="Contact">
          <Field label="Email" value={settings.contactEmail} onChange={(v) => set('contactEmail', v)} />
          <Field
            label="Phone numbers (comma-separated)"
            value={(settings.contactPhones || []).join(', ')}
            onChange={(v) => set('contactPhones', v.split(',').map((s) => s.trim()).filter(Boolean))}
          />
        </Section>

        <Section title="Social links">
          {(settings.socialLinks || []).map((s, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg border border-panel-line p-3">
              <select
                value={s.platform || ''}
                onChange={(e) => updateItem('socialLinks', i, 'platform', e.target.value)}
                className="focus-flare rounded-lg border border-panel-line bg-charcoal px-3 py-2 text-sm text-bone outline-none"
              >
                {['instagram', 'facebook', 'youtube', 'linkedin', 'twitter'].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                value={s.url || ''}
                placeholder="https://..."
                onChange={(e) => updateItem('socialLinks', i, 'url', e.target.value)}
                className="focus-flare min-w-[220px] flex-1 rounded-lg border border-panel-line bg-charcoal px-3 py-2 text-sm text-bone outline-none"
              />
              <label className="flex items-center gap-2 text-xs text-bone">
                <input
                  type="checkbox"
                  checked={s.isActive !== false}
                  onChange={(e) => updateItem('socialLinks', i, 'isActive', e.target.checked)}
                  className="h-4 w-4 accent-flare"
                />
                Active
              </label>
              <button
                type="button"
                onClick={() => removeItem('socialLinks', i)}
                className="focus-flare rounded-full border border-panel-line px-3 py-1.5 text-xs font-bold text-fog hover:border-flare hover:text-flare"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem('socialLinks', { platform: 'instagram', url: '', isActive: true })}
            className="focus-flare rounded-full border border-panel-line px-4 py-2 text-xs font-bold text-bone hover:border-flare hover:text-flare"
          >
            + Add social link
          </button>
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

        <Section title="Our Journey stats">
          {(settings.journeyStats || []).map((s, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 rounded-lg border border-panel-line p-3 sm:grid-cols-[100px_1fr_1fr_auto]">
              <input
                value={s.value || ''}
                placeholder="3"
                onChange={(e) => updateItem('journeyStats', i, 'value', e.target.value)}
                className="focus-flare rounded-lg border border-panel-line bg-charcoal px-3 py-2 text-sm text-bone outline-none"
              />
              <input
                value={s.label || ''}
                placeholder="Years of the Summit"
                onChange={(e) => updateItem('journeyStats', i, 'label', e.target.value)}
                className="focus-flare rounded-lg border border-panel-line bg-charcoal px-3 py-2 text-sm text-bone outline-none"
              />
              <input
                value={s.sub || ''}
                placeholder="Sub text (optional)"
                onChange={(e) => updateItem('journeyStats', i, 'sub', e.target.value)}
                className="focus-flare rounded-lg border border-panel-line bg-charcoal px-3 py-2 text-sm text-bone outline-none"
              />
              <button
                type="button"
                onClick={() => removeItem('journeyStats', i)}
                className="focus-flare rounded-full border border-panel-line px-3 py-1.5 text-xs font-bold text-fog hover:border-flare hover:text-flare"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem('journeyStats', { value: '', label: '', sub: '' })}
            className="focus-flare rounded-full border border-panel-line px-4 py-2 text-xs font-bold text-bone hover:border-flare hover:text-flare"
          >
            + Add stat
          </button>
        </Section>

        <Section title="Coming soon (2026 teaser)">
          <Field label="Eyebrow" value={settings.comingSoon?.eyebrow} onChange={(v) => set('comingSoon.eyebrow', v)} />
          <Field label="Title" value={settings.comingSoon?.title} onChange={(v) => set('comingSoon.title', v)} />
          <Field label="Copy" value={settings.comingSoon?.copy} onChange={(v) => set('comingSoon.copy', v)} textarea />
          <Field
            label="Notify link (e.g. Instagram)"
            value={settings.comingSoon?.notifyHref}
            onChange={(v) => set('comingSoon.notifyHref', v)}
          />
          <Field
            label="Notify button label"
            value={settings.comingSoon?.notifyLabel}
            onChange={(v) => set('comingSoon.notifyLabel', v)}
          />
        </Section>

        <Section title="Footer">
          <Field label="Footer about text" value={settings.footerAbout} onChange={(v) => set('footerAbout', v)} textarea />

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fog">
              Footer links
            </label>
            <div className="space-y-2">
              {(settings.footerLinks || []).map((link, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2">
                  <input
                    value={link.label || ''}
                    placeholder="Label"
                    onChange={(e) => updateItem('footerLinks', i, 'label', e.target.value)}
                    className="focus-flare w-40 rounded-lg border border-panel-line bg-charcoal px-3 py-2 text-sm text-bone outline-none"
                  />
                  <input
                    value={link.href || ''}
                    placeholder="/privacy-policy or #section"
                    onChange={(e) => updateItem('footerLinks', i, 'href', e.target.value)}
                    className="focus-flare min-w-[180px] flex-1 rounded-lg border border-panel-line bg-charcoal px-3 py-2 text-sm text-bone outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem('footerLinks', i)}
                    className="focus-flare rounded-full border border-panel-line px-3 py-1.5 text-xs font-bold text-fog hover:border-flare hover:text-flare"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addItem('footerLinks', { label: '', href: '' })}
                className="focus-flare rounded-full border border-panel-line px-4 py-2 text-xs font-bold text-bone hover:border-flare hover:text-flare"
              >
                + Add footer link
              </button>
            </div>
          </div>
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