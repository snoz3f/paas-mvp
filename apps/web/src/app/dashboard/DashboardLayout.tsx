import { Outlet, NavLink, useNavigate } from 'react-router';
import { useAuthStore } from '@/stores/authStore';
import * as s from './dashboard.css';

const NAV_ITEMS = [
  {
    to: '/dashboard',
    end: true,
    label: 'Projects',
    icon: (
      <svg className={s.navIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="1" width="6" height="6" rx="1" />
        <rect x="9" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="9" width="6" height="6" rx="1" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  {
    to: '/dashboard/settings',
    end: false,
    label: 'Settings',
    icon: (
      <svg className={s.navIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="2.5" />
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41" />
      </svg>
    ),
  },
];

export function DashboardLayout() {
  const navigate = useNavigate();
  const { email, clear } = useAuthStore();

  const handleLogout = () => {
    clear();
    void navigate('/login');
  };

  return (
    <div className={s.layout}>
      <aside className={s.sidebar}>
        <div className={s.sidebarHeader}>
          <span className={s.logo}>INFRAL_</span>
        </div>

        <nav className={s.nav}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? `${s.navItem} ${s.navItemActive}` : s.navItem
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={s.sidebarFooter}>
          <span className={s.userEmail}>{email}</span>
          <button className={s.logoutBtn} onClick={handleLogout}>
            <svg className={s.navIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      <div className={s.main}>
        <Outlet />
      </div>
    </div>
  );
}
