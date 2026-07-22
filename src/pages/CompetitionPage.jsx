import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import Button from '../components/Button';

export default function CompetitionPage() {
  const { slug } = useParams();
  const [competition, setCompetition] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setStatus('loading');
    // No public slug endpoint for competitions yet — fetch the list and find it client-side.
    api
      .get('/competitions?limit=100')
      .then((res) => {
        const match = res.items?.find((c) => c.slug === slug);
        if (match) {
          setCompetition(match);
          setStatus('ready');
        } else {
          setStatus('not-found');
        }
      })
      .catch(() => setStatus('not-found'));
  }, [slug]);

  if (status === 'loading') {
    return <div className="px-5 py-32 text-center text-fog">Loading…</div>;
  }

  if (status === 'not-found') {
    return (
      <div className="px-5 py-32 text-center">
        <h1 className="font-display text-3xl uppercase text-bone">Competition not found</h1>
        <Link to="/" className="focus-flare mt-4 inline-block text-flare hover:text-flare-hot">
          ← Back home
        </Link>
      </div>
    );
  }

  return (
    <article className="px-5 pb-24 pt-32 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-4xl uppercase leading-[0.95] text-bone sm:text-5xl">{competition.title}</h1>
        {competition.shortDescription && <p className="mt-4 max-w-2xl text-fog">{competition.shortDescription}</p>}
        {competition.body && <p className="mt-6 whitespace-pre-line leading-relaxed text-fog">{competition.body}</p>}

        {competition.prizeSummary && (
          <div className="mt-8 rounded-xl border border-panel-line bg-panel p-5">
            <p className="text-xs uppercase tracking-wide text-flare">Prizes</p>
            <p className="mt-1 text-bone">{competition.prizeSummary}</p>
          </div>
        )}

        {competition.rules?.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 font-display text-xl uppercase text-bone">Rules & Guidelines</h2>
            <ol className="list-inside list-decimal space-y-2 text-sm text-fog">
              {competition.rules.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-10">
          <Button href={competition.registerUrl || '#tickets'} target={competition.registerUrl ? '_blank' : undefined} rel="noreferrer">
            Register Now
          </Button>
        </div>
      </div>
    </article>
  );
}
