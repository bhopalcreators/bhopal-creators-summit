import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth({ children, resource, action = 'read', roles }) {
  const { user, loading, can } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-ink text-fog">Loading…</div>;
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  const permissionDenied = resource && !can(resource, action);
  const roleDenied = roles && !roles.includes(user.role);

  if (permissionDenied || roleDenied) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-ink px-6 text-center text-fog">
        <p className="font-display text-2xl uppercase text-bone">Access denied</p>
        <p className="text-sm">Your role ({user.role}) doesn&rsquo;t have access to this section.</p>
      </div>
    );
  }

  return children;
}
