import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../lib/api';

// Public-site visitor accounts (register/login/my-account). Separate from
// src/admin/context/AuthContext.jsx, which handles staff/admin panel logins.
const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const [attendee, setAttendee] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshAttendee = useCallback(async () => {
    try {
      const res = await api.get('/account/me');
      setAttendee(res.attendee);
    } catch {
      setAttendee(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAttendee();
  }, [refreshAttendee]);

  const register = async ({ name, email, phone, password }) => {
    const res = await api.post('/account/register', { name, email, phone, password });
    setAttendee(res.attendee);
    return res.attendee;
  };

  const login = async (email, password) => {
    const res = await api.post('/account/login', { email, password });
    setAttendee(res.attendee);
    return res.attendee;
  };

  const logout = async () => {
    await api.post('/account/logout', {});
    setAttendee(null);
  };

  return (
    <AccountContext.Provider value={{ attendee, loading, register, login, logout, refreshAttendee }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used within AccountProvider');
  return ctx;
}