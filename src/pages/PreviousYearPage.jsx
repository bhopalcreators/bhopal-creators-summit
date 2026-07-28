import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import api from '../lib/api';

export default function PreviousYearPage() {
  const { slug } = useParams();
  const [year, setYear] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | not-found

  useEffect(() => {
    setStatus('loading');
    setGalleryImages([]);
    api
      .get(`/previous-years/slug/${slug}`)
      .then((res) => {
        setYear(res.item);
        setStatus('ready');

        const albumId = res.item?.galleryAlbum?._id || res.item?.galleryAlbum;
        if (albumId) {
          api
            .get(`/gallery-images?album=${albumId}&limit=50`)
            .then((imgRes) => setGalleryImages(imgRes.items || []))
            .catch(() => setGalleryImages([]));
        }
      })
      .catch(() => setStatus('not-found'));
  }, [slug]);

  if (status === 'loading') {
    return <div className="px-5 py-32 text-center text-fog">Loading…</div>;
  }

  if (status === 'not-found') {
    return (
      <div className="px-5 py-32 text-center">
        <h1 className="font-display text-3xl uppercase text-bone">That year hasn&rsquo;t been published yet</h1>
        <Link to="/" className="focus-flare mt-4 inline-block text-flare hover:text-flare-hot">
          ← Back home
        </Link>
      </div>
    );
  }

  return (
    <article className="px-5 pb-24 pt-32 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-flare">Bhopal Creators Summit</p>
        <h1 className="mt-2 font-display text-5xl uppercase leading-[0.95] text-bone sm:text-6xl">{year.year}</h1>
        {year.theme && <p className="mt-3 text-lg text-fog">{year.theme}</p>}

        {year.overview && <p className="mt-8 max-w-3xl leading-relaxed text-fog">{year.overview}</p>}

        {year.statistics?.length > 0 && (
          <div className="mt-14 grid grid-cols-2 gap-8 border-y border-dashed border-panel-line py-10 sm:grid-cols-4">
            {year.statistics.map((s, i) => (
              <div key={i}>
                <p className="font-display text-3xl text-bone">{s.value}</p>
                <p className="mt-1 text-sm text-fog">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {year.timeline?.length > 0 && (
          <Section title="Timeline">
            <div className="space-y-4">
              {year.timeline.map((t, i) => (
                <div key={i} className="flex gap-4 border-b border-panel-line pb-4">
                  <p className="w-28 shrink-0 font-mono text-xs text-flare">{t.time}</p>
                  <div>
                    <p className="font-semibold text-bone">{t.title}</p>
                    {t.description && <p className="mt-1 text-sm text-fog">{t.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {year.winners?.length > 0 && (
          <Section title="Winners">
            <div className="grid gap-3 sm:grid-cols-2">
              {year.winners.map((w, i) => (
                <div key={i} className="rounded-xl border border-panel-line bg-panel p-4">
                  <p className="text-xs uppercase tracking-wide text-fog">{w.awardTitle}</p>
                  <p className="mt-1 font-display text-lg text-bone">{w.winnerName}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {galleryImages.length > 0 && (
          <Section title="Photos">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {galleryImages.map((img) => (
                <div key={img._id} className="aspect-square overflow-hidden rounded-lg bg-panel">
                  <img
                    src={img.media?.url}
                    alt={img.caption || img.media?.altText || `${year.year} highlight`}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </Section>
        )}

        {year.videos?.length > 0 && (
          <Section title="Videos">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {year.videos.map((v, i) => (
                <a
                  key={i}
                  href={v.url}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-flare group flex aspect-video items-center justify-center rounded-xl border border-panel-line bg-panel transition-colors hover:border-flare/60"
                >
                  <PlayCircle size={34} className="text-fog transition-colors group-hover:text-flare" />
                </a>
              ))}
            </div>
          </Section>
        )}

        {year.speakers?.length > 0 && (
          <Section title="Speakers & Committee">
            <div className="grid gap-4 sm:grid-cols-3">
              {year.speakers.map((s) => (
                <div key={s._id} className="rounded-xl border border-panel-line bg-panel p-4">
                  <p className="font-display text-base text-bone">{s.name}</p>
                  {s.title && <p className="mt-1 text-xs text-fog">{s.title}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {year.workshops?.length > 0 && (
          <Section title="Workshops">
            <ul className="grid gap-2 sm:grid-cols-2">
              {year.workshops.map((w) => (
                <li key={w._id} className="rounded-lg border border-panel-line bg-panel px-4 py-3 text-sm text-bone">
                  {w.title}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {year.competitions?.length > 0 && (
          <Section title="Competitions">
            <ul className="grid gap-2 sm:grid-cols-2">
              {year.competitions.map((c) => (
                <li key={c._id}>
                  <Link
                    to={`/competitions/${c.slug}`}
                    className="focus-flare block rounded-lg border border-panel-line bg-panel px-4 py-3 text-sm text-bone hover:border-flare hover:text-flare"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {(year.sponsors?.length > 0 || year.partners?.length > 0) && (
          <Section title="Sponsors & Partners">
            <div className="flex flex-wrap gap-3">
              {[...(year.sponsors || []), ...(year.partners || [])].map((s) => (
                <span key={s._id} className="rounded-full border border-panel-line px-4 py-1.5 text-sm text-bone">
                  {s.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {year.testimonials?.length > 0 && (
          <Section title="Testimonials">
            <div className="grid gap-4 sm:grid-cols-3">
              {year.testimonials.map((t) => (
                <div key={t._id} className="rounded-xl border border-panel-line bg-panel p-4">
                  <p className="font-mono text-xs text-fog">{t.handle}</p>
                  <p className="mt-2 text-sm text-bone">&ldquo;{t.quote}&rdquo;</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {year.achievements?.length > 0 && (
          <Section title="Achievements">
            <ul className="list-inside list-disc space-y-1 text-sm text-fog">
              {year.achievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </Section>
        )}

        {year.faqs?.length > 0 && (
          <Section title="FAQs">
            <div className="space-y-3">
              {year.faqs.map((f) => (
                <details key={f._id} className="rounded-lg border border-panel-line bg-panel p-4">
                  <summary className="cursor-pointer font-semibold text-bone">{f.question}</summary>
                  <p className="mt-2 text-sm text-fog">{f.answer}</p>
                </details>
              ))}
            </div>
          </Section>
        )}

        {year.closingCeremonyNotes && (
          <Section title="Closing Ceremony">
            <p className="text-fog">{year.closingCeremonyNotes}</p>
          </Section>
        )}
      </div>
    </article>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-14">
      <h2 className="mb-5 font-display text-2xl uppercase text-bone">{title}</h2>
      {children}
    </div>
  );
}