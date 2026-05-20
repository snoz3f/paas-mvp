import { Outlet, NavLink, useNavigate } from 'react-router';
import * as s from './admin.css';

const NAV_ITEMS = [
  {
    to: '/admin',
    end: true,
    label: 'Overview',
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
    to: '/admin/nodes',
    end: false,
    label: 'Nodes',
    icon: (
      <svg className={s.navIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="3" width="14" height="4" rx="1" />
        <rect x="1" y="9" width="14" height="4" rx="1" />
        <circle cx="3.5" cy="5" r="0.75" fill="currentColor" stroke="none" />
        <circle cx="3.5" cy="11" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className={s.layout}>
      <aside className={s.sidebar}>
        <div className={s.sidebarHeader}>
          <span className={s.logo}>INFRAL_</span>
          <span className={s.adminBadge}>ADMIN</span>
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
          <button className={s.backLink} onClick={() => void navigate('/dashboard')}>
            <svg className={s.navIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 12L6 8l4-4" />
            </svg>
            Back to app
          </button>
        </div>
      </aside>

      <div className={s.main}>
        <Outlet />
      </div>
    </div>
  );
}
