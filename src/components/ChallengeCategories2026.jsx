import { Sparkles } from 'lucide-react';
import { challengeCategories2026 } from '../data/siteContent';

export default function ChallengeCategories2026() {
  const c = challengeCategories2026;
  return (
    <section id="challenges" className="bg-ink px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-flare">{c.eyebrow}</p>
        <h2 className="font-display text-4xl uppercase leading-[0.95] text-bone sm:text-5xl">{c.title}</h2>
        <p className="mt-5 max-w-2xl text-fog">{c.intro}</p>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {c.groups.map((group) => (
            <div key={group.title} className="rounded-2xl border border-panel-line bg-panel p-6">
              <h3 className="font-display text-xl uppercase text-bone">{group.title}</h3>
              <ul className="mt-4 space-y-2.5 border-t border-panel-line pt-4">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-fog">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-flare" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-xl border border-flare/40 px-6 py-4">
          <Sparkles className="shrink-0 text-flare" size={20} />
          <p className="text-sm text-bone">{c.note}</p>
        </div>
      </div>
    </section>
  );
}