import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import About from '../components/About';
import Stats from '../components/Stats';
import api from '../lib/api';

export default function AboutPage() {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/previous-years?limit=50')
      .then((res) => setYears((res.items || []).filter((y) => y.isPublished)))
      .catch(() => setYears([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-24">
      <About />
      <Stats />

      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-4xl uppercase text-bone sm:text-5xl">Previous Years</h2>
          <p className="mt-4 max-w-2xl text-fog">
            Relive every edition of the Bhopal Creators Summit — themes, speakers, winners, and
            highlights from each year.
          </p>

          {loading && <p className="mt-8 text-fog">Loading…</p>}
          {!loading && years.length === 0 && (
            <p className="mt-8 text-fog">Previous editions will appear here once published.</p>
          )}

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {years.map((y) => (
              <Link
                key={y._id}
                to={`/previous-years/${y.slug}`}
                className="focus-flare group rounded-2xl border border-panel-line bg-panel p-6 transition-colors hover:border-flare/50"
              >
                <p className="font-display text-4xl text-bone group-hover:text-flare">{y.year}</p>
                {y.theme && <p className="mt-2 text-sm text-fog">{y.theme}</p>}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
