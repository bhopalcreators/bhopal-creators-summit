import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import adminApi from '../lib/adminApi';

// Mirrors server/models/User.js ROLE_PERMISSIONS for UI purposes only
// (hiding nav items / buttons the user can't use). The server is the real
// enforcement point — this just avoids showing controls that would 403.
const ROLE_PERMISSIONS = {
  super_admin: { '*': ['create', 'read', 'update', 'delete'] },
  admin: { '*': ['create', 'read', 'update', 'delete'], users: ['create', 'read', 'update'] },
  editor: {
    content: ['create', 'read', 'update', 'delete'],
    previousYears: ['create', 'read', 'update', 'delete'],
    faqs: ['create', 'read', 'update', 'delete'],
    users: ['read'],
  },
  content_manager: {
    content: ['create', 'read', 'update'],
    previousYears: ['create', 'read', 'update'],
    faqs: ['create', 'read', 'update'],
  },
  volunteer_manager: { registrations: ['read', 'update'], forms: ['read', 'update'] },
  media_manager: { media: ['create', 'read', 'update', 'delete'], gallery: ['create', 'read', 'update', 'delete'] },
  viewer: { '*': ['read'] },
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await adminApi.get('/auth/me');
      setUser(res.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email, password) => {
    const res = await adminApi.post('/auth/login', { email, password });
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    await adminApi.post('/auth/logout', {});
    setUser(null);
  };

  const can = (resource, action) => {
    if (!user) return false;
    const perms = ROLE_PERMISSIONS[user.role];
    if (!perms) return false;
    const allowed = perms[resource] || perms['*'];
    return Boolean(allowed?.includes(action));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, can, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
