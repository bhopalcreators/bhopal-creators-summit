import { sponsors as fallbackSponsors } from '../data/siteContent';
import useApiContent from '../hooks/useApiContent';

function chunkIntoRows(items, rowCount) {
  const rows = Array.from({ length: rowCount }, () => []);
  items.forEach((item, i) => rows[i % rowCount].push(item));
  return rows.filter((row) => row.length > 0);
}

function SponsorMark({ s }) {
  return s.logo?.url ? (
    <img
      src={s.logo.url}
      alt={s.name}
      className="h-20 w-auto max-w-[220px] object-contain sm:h-24"
      loading="lazy"
    />
  ) : (
    <span className="font-display text-base uppercase tracking-wide text-bone sm:text-lg">{s.name}</span>
  );
}

function MarqueeRow({ items, direction, speedSeconds }) {
  // Duplicate the row so the loop is seamless (the second copy picks up exactly where the first ends).
  const track = [...items, ...items];

  return (
    <div className="marquee-row">
      <div
        className="marquee-track"
        style={{
          animationDirection: direction === 'reverse' ? 'reverse' : 'normal',
          animationDuration: `${speedSeconds}s`,
        }}
      >
        {track.map((s, i) => (
          <div key={`${s.name}-${i}`} className="flex shrink-0 items-center justify-center px-8">
            <SponsorMark s={s} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Sponsors() {
  const { data: sponsors } = useApiContent('/sponsors', fallbackSponsors);
  const rows = chunkIntoRows(sponsors, 3);
  const directions = ['normal', 'reverse', 'normal'];

  return (
    <section id="sponsors" className="bg-ink px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="font-display text-4xl uppercase text-bone sm:text-5xl">Sponsor the Summit</h2>
        <div className="mx-auto mt-6 h-px w-40 bg-panel-line" />
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.25em] text-fog">Sponsors</p>
      </div>

      <div className="mx-auto mt-14 max-w-full space-y-8">
        {rows.map((row, i) => (
          <MarqueeRow key={i} items={row} direction={directions[i % directions.length]} speedSeconds={28 + i * 6} />
        ))}
      </div>
    </section>
  );
}