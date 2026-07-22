import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import RequireAuth from './components/RequireAuth';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ResourceList from './pages/ResourceList';
import PreviousYearsList from './pages/PreviousYearsList';
import PreviousYearEditor from './pages/PreviousYearEditor';
import MediaLibrary from './pages/MediaLibrary';
import Submissions from './pages/Submissions';
import Users from './pages/Users';
import Settings from './pages/Settings';
import GlobalSearch from './pages/GlobalSearch';

export default function AdminApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="login" element={<Login />} />

          <Route
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="content/:key" element={<ResourceList />} />
            <Route
              path="previous-years"
              element={
                <RequireAuth resource="previousYears">
                  <PreviousYearsList />
                </RequireAuth>
              }
            />
            <Route
              path="previous-years/:id"
              element={
                <RequireAuth resource="previousYears">
                  <PreviousYearEditor />
                </RequireAuth>
              }
            />
            <Route
              path="media"
              element={
                <RequireAuth resource="media">
                  <MediaLibrary />
                </RequireAuth>
              }
            />
            <Route
              path="submissions"
              element={
                <RequireAuth resource="registrations">
                  <Submissions />
                </RequireAuth>
              }
            />
            <Route
              path="users"
              element={
                <RequireAuth roles={['super_admin', 'admin']}>
                  <Users />
                </RequireAuth>
              }
            />
            <Route path="settings" element={<Settings />} />
            <Route path="search" element={<GlobalSearch />} />
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
