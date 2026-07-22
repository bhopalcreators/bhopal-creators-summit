import { Image, Users, GraduationCap } from 'lucide-react';
import { activities as fallbackActivities } from '../data/siteContent';
import useApiContent from '../hooks/useApiContent';

const iconFor = { exhibition: Image, panel: Users, 'workshops-grid': GraduationCap };
const iconSequence = [Image, Users, GraduationCap];

export default function Activities() {
  const { data: activities } = useApiContent('/activities', fallbackActivities);
  return (
    <section className="bg-ink px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-flare">
              Explore
            </p>
            <h2 className="font-display text-4xl uppercase leading-[0.95] text-bone">Activities</h2>
            <p className="mt-6 text-sm leading-relaxed text-fog">
              From performances to workshops and creator talks\u2014each activity is designed to
              inspire, engage, and celebrate the creative spirit.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {activities.map((a, i) => {
              const Icon = iconFor[a.image] || iconSequence[i] || Image;
              return (
                <div key={a._id || a.title}>
                  <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-gradient-to-br from-panel to-charcoal">
                    <Icon size={40} strokeWidth={1} className="text-fog" />
                  </div>
                  <h3 className="mt-5 font-display text-lg uppercase leading-tight text-bone">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fog">{a.copy || a.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
