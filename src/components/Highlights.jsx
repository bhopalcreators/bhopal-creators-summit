import { Image } from 'lucide-react';

export default function Highlights() {
  const tiles = Array.from({ length: 8 });

  return (
    <section id="highlights" className="bg-ink px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center font-display text-4xl uppercase text-bone sm:text-5xl">
          2024 Highlights
        </h2>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tiles.map((_, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br from-panel to-charcoal"
            >
              <Image size={28} strokeWidth={1} className="text-fog" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
