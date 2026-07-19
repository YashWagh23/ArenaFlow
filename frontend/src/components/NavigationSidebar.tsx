import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', icon: 'dashboard',  label: 'Dashboard'  },
  { to: '/scenarios', icon: 'science',    label: 'Scenarios'  },
  { to: '/analytics', icon: 'monitoring', label: 'Analytics'  },
];

export default function NavigationSidebar() {
  return (
    <aside
      className="fixed left-0 top-[60px] bottom-0 z-40 flex flex-col select-none"
      style={{
        width: '48px',
        background: '#FFFFFF',
        borderRight: '1px solid #E7E6DF',
      }}
    >
      {/* Nav rail */}
      <div className="flex flex-col items-center gap-1 pt-4 flex-grow">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.label}
            className="relative flex items-center justify-center transition-colors"
            style={({ isActive }) => ({
              width: '40px',
              height: '40px',
              borderRadius: '999px',
              background: isActive ? '#2E7D32' : 'transparent',
              color: isActive ? '#FFFFFF' : '#7A7A7A',
              transition: 'all 200ms cubic-bezier(0.25,0.46,0.45,0.94)',
              textDecoration: 'none',
            })}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              if (!el.getAttribute('aria-current')) {
                el.style.color = '#555555';
                el.style.background = 'rgba(46,125,50,0.08)';
              }
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              if (!el.getAttribute('aria-current')) {
                el.style.color = '#7A7A7A';
                el.style.background = 'transparent';
              }
            }}
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '18px',
                    color: isActive ? '#FFFFFF' : undefined,
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                    transition: 'all 150ms',
                  }}
                >
                  {item.icon}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom: Avatar */}
      <div
        className="flex items-center justify-center pb-4"
        style={{ borderTop: '1px solid #E7E6DF', paddingTop: '12px' }}
      >
        <div
          title="FIFA Admin · Command Lead"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'default',
          }}
        >
          <span
            style={{
              fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: '9px',
              color: '#F7F6F1',
              letterSpacing: '0.02em',
            }}
          >
            FA
          </span>
        </div>
      </div>
    </aside>
  );
}
