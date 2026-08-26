import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Button from './Button';
import { workshops2026 as fallbackWorkshops2026 } from '../data/siteContent';
import useApiContent from '../hooks/useApiContent';

// Same carousel layout/classes as the 2025 Workshops section (src/components/Workshops.jsx)
// — kept as its own component (rather than reusing Workshops.jsx) so the /2025 page is
// never touched. 2026 workshops haven't been announced yet, so this section stays hidden
// (returns null) until items are added from the admin panel — no empty carousel on the
// live site in the meantime.
export default function Workshops2026() {
  const trackRef = useRef(null);
  const { data: rawWorkshops } = useApiContent('/workshops?year=2026', fallbackWorkshops2026);
  const workshops = rawWorkshops.map((w) => ({
    title: w.title,
    facilitator: w.facilitator || w.facilitatorName,
    copy: w.copy || w.description,
    coverImage: w.coverImage,
    _key: w._id || w.title,
  }));

  const scrollBy = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  if (!workshops.length) return null;

  return (
    <section id="workshops-2026" className="bg-ink px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <h2 className="font-display text-4xl uppercase leading-[0.95] text-bone sm:text-5xl">
            Workshops
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-fog">
            Skill-enhancing sessions led by industry leaders to help creators refine their craft.
            These workshops focus on practical learning and real-world insights, offering valuable
            guidance to sharpen skills and grow creatively.
          </p>
        </div>

        <div className="relative mt-12">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Previous workshop"
            className="focus-flare absolute left-0 top-1/2 z-10 hidden -translate-x-4 -translate-y-1/2 rounded-full bg-panel/90 p-2 text-bone hover:text-flare lg:flex"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Next workshop"
            className="focus-flare absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-4 rounded-full bg-panel/90 p-2 text-bone hover:text-flare lg:flex"
          >
            <ChevronRight size={22} />
          </button>

          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {workshops.map((w) => (
              <article
                key={w._key}
                className="w-[300px] shrink-0 snap-start rounded-2xl border border-panel-line bg-panel"
              >
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-t-2xl bg-gradient-to-br from-charcoal to-ink">
                  {w.coverImage?.url ? (
                    <img
                      src={w.coverImage.url}
                      alt={w.coverImage.altText || w.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Sparkles size={36} strokeWidth={1} className="text-fog" />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl uppercase text-bone">{w.title}</h3>
                  {w.facilitator && (
                    <p className="mt-1 text-sm italic text-fog">(by {w.facilitator})</p>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-fog">{w.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button href="#agenda" variant="flare">
            Discover More
          </Button>
        </div>
      </div>
    </section>
  );
}