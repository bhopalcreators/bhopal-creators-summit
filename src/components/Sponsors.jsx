import { sponsors as fallbackSponsors } from '../data/siteContent';
import useApiContent from '../hooks/useApiContent';

export default function Sponsors() {
  const { data: sponsors } = useApiContent('/sponsors', fallbackSponsors);

  return (
    <section id="sponsors" className="bg-ink px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="font-display text-4xl uppercase text-bone sm:text-5xl">Sponsor the Summit</h2>
        <div className="mx-auto mt-6 h-px w-40 bg-panel-line" />
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.25em] text-fog">Sponsors</p>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {sponsors.map((s) => (
            <div
              key={s.name}
              className="flex aspect-[3/2] items-center justify-center rounded-xl border border-panel-line bg-panel px-4 text-center transition-colors hover:border-flare/50"
            >
              <span className="font-display text-sm uppercase tracking-wide text-bone">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
