import { Award } from 'lucide-react';
import Button from './Button';
import { awards as fallbackAwards } from '../data/siteContent';
import useApiContent from '../hooks/useApiContent';

export default function Awards() {
  const { data: awards } = useApiContent('/awards', fallbackAwards);

  return (
    <section id="awards" className="bg-ink px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center font-display text-3xl uppercase tracking-wide text-marigold sm:text-4xl">
          <span aria-hidden>\ud83c\udfc6</span> Creator Awards 2025 <span aria-hidden>\ud83c\udfc6</span>
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {awards.map((a) => (
            <article
              key={a._id || a.title}
              className="rounded-2xl border border-panel-line bg-panel p-6 transition-colors hover:border-marigold/50"
            >
              <Award className="text-bone" size={30} strokeWidth={1.5} />
              <h3 className="mt-5 font-display text-lg uppercase leading-tight text-bone">
                {a.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">{a.copy || a.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button href="#tickets" variant="flare">
            Nominate Now
          </Button>
        </div>
      </div>
    </section>
  );
}
