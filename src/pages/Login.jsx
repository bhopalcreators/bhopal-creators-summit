import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAccount } from '../context/AccountContext';

export default function Login() {
  const { login, attendee, loading } = useAccount();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && attendee) return <Navigate to="/my-account" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/my-account');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 pb-16 pt-28">
      <div className="w-full max-w-sm rounded-2xl border border-panel-line bg-panel p-8">
        <h1 className="font-display text-2xl uppercase text-bone">Log In</h1>
        <p className="mt-1 text-sm text-fog">Welcome back to the Bhopal Creators Summit.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fog">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-flare w-full rounded-lg border border-panel-line bg-charcoal px-4 py-2.5 text-sm text-bone outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fog">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus-flare w-full rounded-lg border border-panel-line bg-charcoal px-4 py-2.5 text-sm text-bone outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="focus-flare w-full rounded-full bg-flare px-6 py-3 text-sm font-bold text-ink hover:bg-flare-hot disabled:opacity-60"
          >
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-fog">
          New here?{' '}
          <Link to="/register" className="focus-flare font-semibold text-flare hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}