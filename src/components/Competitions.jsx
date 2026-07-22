import { Camera, Users } from 'lucide-react';
import Button from './Button';
import { competitions as fallbackCompetitions } from '../data/siteContent';
import useApiContent from '../hooks/useApiContent';

const iconFor = { camera: Camera, collab: Users };
const iconBySlug = { photography: Camera, 'collabverse-2025': Users };

export default function Competitions() {
  const { data: competitions } = useApiContent('/competitions', fallbackCompetitions);

  return (
    <section id="competitions" className="border-t border-panel-line bg-ink px-5 py-24 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-3">
        <div>
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-flare">
            Explore
          </p>
          <h2 className="font-display text-4xl uppercase leading-[0.95] text-bone sm:text-5xl">
            Competitions
          </h2>
          <p className="mt-6 text-fog">
            Ready to compete where creativity meets community? From capturing powerful frames to
            building content with fellow creators, our competitions are all about turning ideas into
            impact.
          </p>
        </div>

        {competitions.map((c) => {
          const Icon = iconFor[c.image] || iconBySlug[c.slug] || Camera;
          return (
            <div key={c._id || c.slug} className="flex flex-col">
              <div className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-panel to-charcoal">
                <Icon size={56} strokeWidth={1} className="text-fog" />
              </div>
              <h3 className="mt-6 font-display text-2xl uppercase text-bone">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">{c.copy || c.shortDescription}</p>
              <Button href={c.registerUrl || '#tickets'} className="mt-6 self-start">
                Register Now
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
