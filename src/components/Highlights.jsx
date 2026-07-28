import { useEffect, useState } from 'react';
import { Image, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function Highlights() {
  const [year, setYear] = useState(null); // most recent published previous year
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | empty

  useEffect(() => {
    let cancelled = false;

    api
      .get('/previous-years?limit=50')
      .then(async (res) => {
        if (cancelled) return;
        const published = (res.items || [])
          .filter((y) => y.isPublished === true)
          .sort((a, b) => b.year - a.year);
        const latest = published[0];
        if (!latest) {
          setStatus('empty');
          return;
        }
        setYear(latest);

        if (latest.galleryAlbum) {
          try {
            const albumId = latest.galleryAlbum._id || latest.galleryAlbum;
            const imgRes = await api.get(`/gallery-images?album=${albumId}&limit=8`);
            if (!cancelled && imgRes.items?.length) {
              setImages(imgRes.items);
              setStatus('ready');
              return;
            }
          } catch {
            // fall through to empty state below
          }
        }
        if (!cancelled) setStatus(latest.videos?.length ? 'ready' : 'empty');
      })
      .catch(() => {
        if (!cancelled) setStatus('empty');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const tileCount = 8;
  const tiles = Array.from({ length: tileCount });

  return (
    <section id="highlights" className="bg-ink px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-center font-mono text-xs font-semibold uppercase tracking-[0.25em] text-flare">
          Event Highlights &amp; Memories
        </p>
        <h2 className="mt-3 text-center font-display text-4xl uppercase text-bone sm:text-5xl">
          {year ? `${year.year} Highlights` : 'Photos & Videos'}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-fog">
          Every frame tells a story from the Summit floor &mdash; relive the energy, the people,
          and the moments that made it unforgettable.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {status === 'ready' && images.length > 0
            ? images.slice(0, tileCount).map((img) => (
                <div
                  key={img._id}
                  className="aspect-square overflow-hidden rounded-lg bg-panel"
                >
                  <img
                    src={img.media?.url}
                    alt={img.caption || img.media?.altText || 'Bhopal Creators Summit highlight'}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))
            : tiles.map((_, i) => (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br from-panel to-charcoal"
                >
                  <Image size={28} strokeWidth={1} className="text-fog" />
                </div>
              ))}
        </div>

        {year?.videos?.length > 0 && (
          <div className="mt-12">
            <p className="mb-5 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-flare">
              <PlayCircle size={14} /> Watch the Recap
            </p>
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
          </div>
        )}

        {year && (
          <div className="mt-12 text-center">
            <Link
              to={`/previous-years/${year.slug}`}
              className="focus-flare inline-block text-sm font-bold uppercase tracking-wide text-flare hover:text-flare-hot"
            >
              See Full {year.year} Recap →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}