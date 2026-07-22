import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Inbox,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { resources, resourceOrder } from '../config/resources';

const staticLinks = [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }];

const utilityLinks = [
  { to: '/admin/previous-years', label: 'Previous Years', resourceKey: 'previousYears' },
  { to: '/admin/media', label: 'Media Library', icon: ImageIcon, resourceKey: 'media' },
  { to: '/admin/submissions', label: 'Form Submissions', icon: Inbox, resourceKey: 'registrations' },
  { to: '/admin/search', label: 'Global Search', icon: Search },
];

export default function AdminLayout() {
  const { user, logout, can } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-ink">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-panel-line bg-charcoal lg:flex">
        <div className="flex items-center gap-3 border-b border-panel-line px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-flare via-magenta to-marigold font-display text-[10px] text-ink">
            IBC
          </div>
          <p className="font-display text-xs uppercase leading-tight text-bone">
            Admin
            <br />
            Panel
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {staticLinks.map((link) => (
              <SidebarLink key={link.to} {...link} />
            ))}
          </ul>

          <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-widest text-fog">Content</p>
          <ul className="space-y-1">
            {resourceOrder
              .filter((key) => can(resources[key].resourceKey, 'read'))
              .map((key) => (
                <SidebarLink key={key} to={`/admin/content/${key}`} label={resources[key].label} />
              ))}
          </ul>

          <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-widest text-fog">Manage</p>
          <ul className="space-y-1">
            {utilityLinks
              .filter((link) => !link.resourceKey || can(link.resourceKey, 'read'))
              .map((link) => (
                <SidebarLink key={link.to} {...link} />
              ))}
            {['super_admin', 'admin'].includes(user?.role) && (
              <SidebarLink to="/admin/users" label="Users & Roles" icon={Users} />
            )}
            <SidebarLink to="/admin/settings" label="Site Settings" icon={SettingsIcon} />
          </ul>
        </nav>

        <div className="border-t border-panel-line px-5 py-4">
          <p className="text-sm font-semibold text-bone">{user?.name}</p>
          <p className="text-xs capitalize text-fog">{user?.role?.replace(/_/g, ' ')}</p>
          <button
            onClick={handleLogout}
            className="focus-flare mt-3 flex items-center gap-2 text-xs font-semibold text-fog hover:text-flare"
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <MobileTopbar can={can} onLogout={handleLogout} />
        <Outlet />
      </main>
    </div>
  );
}

function MobileTopbar({ can, onLogout }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const allLinks = [
    { to: '/admin', label: 'Dashboard' },
    ...resourceOrder.filter((key) => can(resources[key].resourceKey, 'read')).map((key) => ({ to: `/admin/content/${key}`, label: resources[key].label })),
    ...utilityLinks.filter((l) => !l.resourceKey || can(l.resourceKey, 'read')),
    ...(['super_admin', 'admin'].includes(user?.role) ? [{ to: '/admin/users', label: 'Users & Roles' }] : []),
    { to: '/admin/settings', label: 'Site Settings' },
  ];

  return (
    <div className="flex items-center gap-3 border-b border-panel-line bg-charcoal px-4 py-3 lg:hidden">
      <select
        onChange={(e) => e.target.value && navigate(e.target.value)}
        defaultValue=""
        className="focus-flare flex-1 rounded-lg border border-panel-line bg-ink px-3 py-2 text-sm text-bone"
      >
        <option value="" disabled>
          Navigate to…
        </option>
        {allLinks.map((l) => (
          <option key={l.to} value={l.to}>
            {l.label}
          </option>
        ))}
      </select>
      <button onClick={onLogout} className="focus-flare shrink-0 text-fog hover:text-flare" aria-label="Log out">
        <LogOut size={18} />
      </button>
    </div>
  );
}

function SidebarLink({ to, label, icon: Icon, end }) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          `focus-flare flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isActive ? 'bg-flare/15 text-flare' : 'text-fog hover:bg-panel hover:text-bone'
          }`
        }
      >
        {Icon && <Icon size={16} />}
        {label}
      </NavLink>
    </li>
  );
}
