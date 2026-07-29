import { Link, useNavigate } from 'react-router-dom';
import { useAccount } from '../context/AccountContext';

export default function MyAccount() {
  const { attendee, loading, logout } = useAccount();
  const navigate = useNavigate();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-ink px-5 pt-24 text-fog">Loading…</div>;
  }

  if (!attendee) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-5 pb-16 pt-28">
        <div className="w-full max-w-sm rounded-2xl border border-panel-line bg-panel p-8 text-center">
          <h1 className="font-display text-2xl uppercase text-bone">My Account</h1>
          <p className="mt-2 text-sm text-fog">Log in or create an account to see your details here.</p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/login"
              className="focus-flare rounded-full bg-flare px-6 py-3 text-sm font-bold text-ink hover:bg-flare-hot"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="focus-flare rounded-full border border-panel-line px-6 py-3 text-sm font-bold text-bone hover:border-flare hover:text-flare"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 pb-16 pt-28">
      <div className="w-full max-w-sm rounded-2xl border border-panel-line bg-panel p-8">
        <h1 className="font-display text-2xl uppercase text-bone">My Account</h1>
        <p className="mt-1 text-sm text-fog">Your registration details for the summit.</p>

        <dl className="mt-6 space-y-4">
          <div>
            <dt className="text-xs uppercase tracking-wide text-fog">Name</dt>
            <dd className="text-sm text-bone">{attendee.name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-fog">Email</dt>
            <dd className="text-sm text-bone">{attendee.email}</dd>
          </div>
          {attendee.phone && (
            <div>
              <dt className="text-xs uppercase tracking-wide text-fog">Phone</dt>
              <dd className="text-sm text-bone">{attendee.phone}</dd>
            </div>
          )}
        </dl>

        <button
          onClick={handleLogout}
          className="focus-flare mt-8 w-full rounded-full border border-panel-line px-6 py-3 text-sm font-bold text-bone hover:border-flare hover:text-flare"
        >
          Log out
        </button>
      </div>
    </div>
  );
}