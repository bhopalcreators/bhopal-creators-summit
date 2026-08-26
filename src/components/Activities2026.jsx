import {
  Bike,
  Music2,
  Paintbrush2,
  Sparkles,
  Trophy,
  Mic2,
  Mic,
  Dumbbell,
  TreePine,
  Shirt,
  Footprints,
  HeartHandshake,
  TrafficCone,
  Camera,
  PartyPopper,
} from 'lucide-react';
import { activities2026 as fallbackActivities2026 } from '../data/siteContent';
import useApiContent from '../hooks/useApiContent';

// Static grid — no auto-scroll, nothing moving on its own, so every card is
// readable at a glance. Each card gets a real image slot (same treatment as
// the Competitions cards) so a photo uploaded from the admin panel actually
// shows up, not just a small icon badge. Still visually its own thing:
// smaller/denser cards, a single consistent accent, and a marigold eyebrow
// to read as a distinct section from Competitions (flare/orange) and
// Workshops (carousel).
const iconBySlug = {
  'bike-rally': Bike,
  jamming: Music2,
  'painting-competition-wall-art': Paintbrush2,
  'cleanliness-drive': Sparkles,
  sports: Trophy,
  shayari: Mic2,
  'rap-battle': Mic,
  fitness: Dumbbell,
  'plantation-drive': TreePine,
  fashion: Shirt,
  'gen-run': Footprints,
  'well-being': HeartHandshake,
  'traffic-police': TrafficCone,
  singing: Mic2,
  photowalk: Camera,
  'flash-mob': PartyPopper,
};

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function Activities2026() {
  const { data: activities } = useApiContent('/activities?year=2026', fallbackActivities2026);

  if (!activities?.length) return null;

  return (
    <section id="activities-2026" className="bg-charcoal px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-marigold">
              On Ground — 2026
            </p>
            <h2 className="font-display text-4xl uppercase leading-[0.95] text-bone sm:text-5xl">
              Activities
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-fog">
            Beyond the competitions — rallies, drives, jams and everything in between. Rotating,
            recurring and one-off moments that keep the season buzzing.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {activities.map((a) => {
            const slug = a.slug || slugify(a.title);
            const Icon = iconBySlug[slug] || Sparkles;
            return (
              <div key={a._id || a.title} className="flex flex-col">
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-panel to-ink">
                  {a.coverImage?.url ? (
                    <img
                      src={a.coverImage.url}
                      alt={a.coverImage.altText || a.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Icon size={32} strokeWidth={1.25} className="text-fog" />
                  )}
                </div>
                <h3 className="mt-4 font-display text-base uppercase leading-tight text-bone">{a.title}</h3>
                {a.hostedBy && <p className="mt-0.5 text-xs italic text-marigold">by {a.hostedBy}</p>}
                {(a.copy || a.description) && (
                  <p className="mt-1.5 text-xs leading-relaxed text-fog">{a.copy || a.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}