import { Mic, Heart, Presentation } from 'lucide-react';
import { aboutContent } from '../data/siteContent';

const icons = { Mic, Heart, Presentation };

export default function About() {
  return (
    <section id="about" className="bg-ink px-5 py-24 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Image collage */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex aspect-square flex-col justify-end rounded-2xl bg-flare p-6">
            <p className="font-display text-2xl uppercase leading-[0.95] text-ink">
              Bhopal Creators
              <br />
              Summit 2025
            </p>
          </div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-panel">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-panel to-charcoal text-fog">
              <Mic size={40} />
            </div>
          </div>
          <div className="col-span-2 aspect-[16/10] overflow-hidden rounded-2xl bg-panel">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-panel to-charcoal">
              <p className="font-display text-lg uppercase tracking-wide text-fog">
                Bhopal Creators Summit 2024
              </p>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div>
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-flare">
            {aboutContent.eyebrow}
          </p>
          <h2 className="font-display text-4xl uppercase leading-[0.95] text-bone sm:text-5xl">
            {aboutContent.title}
          </h2>

          <div className="mt-6 space-y-4 text-fog">
            {aboutContent.paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-10 space-y-8">
            {aboutContent.highlights.map((h) => {
              const Icon = icons[h.icon];
              return (
                <div key={h.title} className="flex gap-4">
                  <Icon className="mt-1 shrink-0 text-flare" size={26} strokeWidth={1.5} />
                  <div>
                    <h3 className="font-display text-lg uppercase tracking-wide text-bone">{h.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-fog">{h.copy}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
