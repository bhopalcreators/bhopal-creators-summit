import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { agenda as fallbackAgenda } from '../data/siteContent';
import useApiContent from '../hooks/useApiContent';

export default function Agenda() {
  const [openIndex, setOpenIndex] = useState(0);
  const { data: rawAgenda } = useApiContent('/agenda', fallbackAgenda);
  const agenda = rawAgenda.map((block) => ({
    key: block._id || block.title,
    title: block.title,
    time: block.time || block.timeLabel,
    items: block.items || block.subItems || [],
  }));

  return (
    <section id="agenda" className="bg-ink px-5 pb-24 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="border-t border-dashed border-panel-line pt-10">
          <div className="divide-y divide-panel-line overflow-hidden rounded-xl border border-panel-line">
            {agenda.map((block, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={block.key}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    className={`focus-flare flex w-full items-center justify-between px-6 py-5 text-left ${
                      isOpen ? 'bg-panel' : 'bg-ink'
                    }`}
                    aria-expanded={isOpen}
                  >
                    <span className={`font-bold ${isOpen ? 'text-flare' : 'text-bone'}`}>
                      {block.title} | {block.time}
                    </span>
                    {isOpen ? (
                      <ChevronUp size={20} className="text-flare" />
                    ) : (
                      <ChevronDown size={20} className="text-fog" />
                    )}
                  </button>
                  {isOpen && block.items.length > 0 && (
                    <div className="bg-panel px-6 pb-6">
                      <p className="text-bone">Dive into 6 workshops happening in parallel:</p>
                      <ul className="mt-4 space-y-2">
                        {block.items.map((item) => (
                          <li key={item} className="flex gap-3 text-fog">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flare" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
