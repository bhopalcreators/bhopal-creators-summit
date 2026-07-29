import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAccount } from '../context/AccountContext';

export default function Register() {
  const { register, attendee, loading } = useAccount();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && attendee) return <Navigate to="/my-account" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await register({ name, email, phone, password });
      navigate('/my-account');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 pb-16 pt-28">
      <div className="w-full max-w-sm rounded-2xl border border-panel-line bg-panel p-8">
        <h1 className="font-display text-2xl uppercase text-bone">Register</h1>
        <p className="mt-1 text-sm text-fog">Create your account for the Bhopal Creators Summit.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Full name" id="name" value={name} onChange={setName} required autoComplete="name" />
          <Field
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={setEmail}
            required
            autoComplete="email"
          />
          <Field label="Phone (optional)" id="phone" type="tel" value={phone} onChange={setPhone} autoComplete="tel" />
          <Field
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={setPassword}
            required
            autoComplete="new-password"
          />
          <Field
            label="Confirm password"
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
            autoComplete="new-password"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="focus-flare w-full rounded-full bg-flare px-6 py-3 text-sm font-bold text-ink hover:bg-flare-hot disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-fog">
          Already registered?{' '}
          <Link to="/login" className="focus-flare font-semibold text-flare hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, id, type = 'text', value, onChange, required, autoComplete }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fog">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus-flare w-full rounded-lg border border-panel-line bg-charcoal px-4 py-2.5 text-sm text-bone outline-none"
      />
    </div>
  );
}