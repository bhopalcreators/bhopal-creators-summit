import { communityEngagement2026 } from '../data/siteContent';

export default function CommunityEngagement2026() {
  const c = communityEngagement2026;
  return (
    <section id="community" className="bg-charcoal px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-flare">{c.eyebrow}</p>
        <h2 className="font-display text-4xl uppercase leading-[0.95] text-bone sm:text-5xl">{c.title}</h2>
        <p className="mt-5 max-w-2xl text-fog">{c.intro}</p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.items.map((item) => (
            <div key={item.title} className="rounded-xl border border-panel-line bg-panel p-5">
              <h3 className="font-display text-base uppercase text-flare">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}