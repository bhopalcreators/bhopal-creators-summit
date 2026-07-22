import { Quote } from 'lucide-react';
import { testimonials as fallbackTestimonials } from '../data/siteContent';
import useApiContent from '../hooks/useApiContent';

export default function Testimonials() {
  const { data: testimonials } = useApiContent('/testimonials', fallbackTestimonials);

  return (
    <section className="bg-ink px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-flare">
          Bhopal Creators Summit 2024
        </p>
        <h2 className="mt-4 font-display text-4xl uppercase text-bone sm:text-5xl">
          Creator Testimonials
        </h2>

        <div className="mt-14 grid gap-6 text-left sm:grid-cols-3">
          {testimonials.map((t) => (
            <article key={t.handle} className="rounded-2xl border border-panel-line bg-panel p-6">
              <div className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-charcoal to-ink">
                <Quote size={32} strokeWidth={1} className="text-fog" />
              </div>
              <p className="mt-5 font-mono text-xs text-fog">{t.handle}</p>
              <p className="mt-2 font-display text-lg leading-snug text-bone">&ldquo;{t.quote}&rdquo;</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
