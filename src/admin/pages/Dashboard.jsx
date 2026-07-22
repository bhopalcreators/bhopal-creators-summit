import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminApi from '../lib/adminApi';
import { useAuth } from '../context/AuthContext';
import { resources, resourceOrder } from '../config/resources';

export default function Dashboard() {
  const { user, can } = useAuth();
  const [counts, setCounts] = useState({});
  const [submissionCount, setSubmissionCount] = useState(null);

  useEffect(() => {
    const visible = resourceOrder.filter((key) => can(resources[key].resourceKey, 'read'));

    Promise.all(
      visible.map((key) =>
        adminApi
          .get(`${resources[key].endpoint}?limit=1`)
          .then((res) => [key, res.total ?? res.count ?? 0])
          .catch(() => [key, null])
      )
    ).then((entries) => setCounts(Object.fromEntries(entries)));

    if (can('registrations', 'read')) {
      adminApi
        .get('/submissions?status=new&limit=1')
        .then((res) => setSubmissionCount(res.total ?? 0))
        .catch(() => setSubmissionCount(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-2xl uppercase text-bone">Welcome, {user?.name?.split(' ')[0]}</h1>
      <p className="mt-1 text-sm capitalize text-fog">Signed in as {user?.role?.replace(/_/g, ' ')}</p>

      {submissionCount !== null && submissionCount > 0 && (
        <Link
          to="/admin/submissions"
          className="focus-flare mt-6 flex items-center justify-between rounded-xl border border-flare/40 bg-flare/10 px-5 py-4 text-flare hover:bg-flare/15"
        >
          <span className="font-semibold">{submissionCount} new form submission{submissionCount === 1 ? '' : 's'} awaiting review</span>
          <span className="text-sm">Review →</span>
        </Link>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {resourceOrder
          .filter((key) => can(resources[key].resourceKey, 'read'))
          .map((key) => (
            <Link
              key={key}
              to={`/admin/content/${key}`}
              className="focus-flare rounded-xl border border-panel-line bg-panel p-5 transition-colors hover:border-flare/50"
            >
              <p className="font-display text-3xl text-bone">
                {counts[key] === undefined ? '…' : counts[key] === null ? '—' : counts[key]}
              </p>
              <p className="mt-1 text-sm text-fog">{resources[key].label}</p>
            </Link>
          ))}
      </div>
    </div>
  );
}
