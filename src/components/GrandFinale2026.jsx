import { grandFinale2026 } from '../data/siteContent';

export default function GrandFinale2026() {
  const g = grandFinale2026;
  return (
    <section id="finale" className="bg-ink px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-flare">{g.eyebrow}</p>
        <h2 className="font-display text-4xl uppercase leading-[0.95] text-bone sm:text-5xl">{g.title}</h2>
        <p className="mt-5 max-w-2xl text-fog">{g.intro}</p>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {g.items.map((item) => (
            <div
              key={item}
              className="rounded-lg border border-panel-line bg-panel px-4 py-4 text-center text-sm font-semibold text-bone"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}