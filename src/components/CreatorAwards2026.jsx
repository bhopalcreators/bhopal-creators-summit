import { Ticket } from 'lucide-react';
import Button from './Button';
import { creatorAwards2026, siteSettings2026 } from '../data/siteContent';

export default function CreatorAwards2026() {
  const a = creatorAwards2026;
  return (
    <section id="awards" className="bg-ink px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-flare">{a.eyebrow}</p>
          <h2 className="font-display text-4xl uppercase leading-[0.95] text-bone sm:text-5xl">{a.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-fog">{a.intro}</p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {a.categories.map((cat) => (
            <div
              key={cat}
              className="rounded-lg border border-panel-line bg-panel px-5 py-3 text-sm font-semibold text-bone"
            >
              {cat}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button href={siteSettings2026.ticketUrl} target="_blank" rel="noreferrer" variant="flare" className="gap-2">
            <Ticket size={16} />
            Get Your Tickets to the Awards
          </Button>
        </div>
      </div>
    </section>
  );
}