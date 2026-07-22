import { stats as fallbackStats } from '../data/siteContent';
import useApiContent from '../hooks/useApiContent';

export default function Stats() {
  const { data: stats } = useApiContent('/stats', fallbackStats);

  return (
    <section className="bg-ink px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl border-y border-dashed border-panel-line py-14">
        <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label} className="text-center sm:text-left">
              <p className="font-display text-4xl text-bone sm:text-5xl">{s.value}</p>
              <p className="mt-2 text-sm font-semibold text-fog">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
