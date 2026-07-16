import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/scenarios', icon: 'science', label: 'Scenarios' },
  { to: '/analytics', icon: 'monitoring', label: 'Analytics' },
];

export default function NavigationSidebar() {
  return (
    <aside className="fixed left-0 top-16 bottom-0 z-40 flex flex-col bg-surface/60 backdrop-blur-2xl border-r border-white/20 w-20 hover:w-64 transition-all duration-300 overflow-hidden group select-none">
      {/* Main Nav Items */}
      <div className="flex flex-col gap-2 p-4 flex-grow">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-primary/10 text-primary border-r-4 border-primary'
                  : 'text-on-surface-variant opacity-70 hover:bg-primary-container/20 hover:text-primary hover:opacity-100'
              }`
            }
          >
            <span className="material-symbols-outlined shrink-0">{item.icon}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity font-medium whitespace-nowrap">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>

      {/* Bottom: Profile */}
      <div className="p-4 border-t border-white/10">
        {/* Admin profile row */}
        <div className="flex items-center gap-4 px-3 py-2">
          <img
            className="w-8 h-8 rounded-full object-cover shrink-0 border border-outline/20"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC88Bx-zaAmWj17zWgQsnVh_RSTnvY4jrsUZiPQfj6yf9hXip4gOwu2TCVEl7TiCKE6BdxLiSVqFVtASHWnp75sWvWTPx_R999X79xPqB_c-FOdRfhkLCWwSaF8YRC65tnQRjq2DkQRDMS8MWuYEcmlk73veiH3Y0p-LDIenZfD-HJkUJ4wwSWLdLAqUg81fHBhFxF5YdCmsXz5SjXBJPggM2ifTYfWqouI2sluk5Hgfk-Gkymd2YgCfg"
            alt="FIFA Admin"
          />
          <div className="opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden">
            <p className="font-body-md text-on-surface font-semibold truncate text-sm">FIFA Admin</p>
            <p className="text-xs text-on-surface-variant truncate">Command Lead</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
