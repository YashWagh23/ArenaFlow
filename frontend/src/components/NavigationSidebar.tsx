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
      className="fixed left-0 top-12 bottom-0 z-40 flex flex-col select-none"
      style={{
        width: '48px',
        background: 'rgba(8,12,10,0.60)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
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
              borderRadius: '10px',
              background: isActive ? 'rgba(0,212,106,0.08)' : 'transparent',
              color: isActive ? '#00D46A' : 'rgba(255,255,255,0.30)',
              transition: 'all 200ms cubic-bezier(0.25,0.46,0.45,0.94)',
              textDecoration: 'none',
            })}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              if (!el.classList.contains('active')) {
                el.style.color = 'rgba(255,255,255,0.70)';
                el.style.background = 'rgba(255,255,255,0.05)';
              }
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              // Reset only if not active — active state is controlled by NavLink
              if (!el.getAttribute('aria-current')) {
                el.style.color = 'rgba(255,255,255,0.30)';
                el.style.background = 'transparent';
              }
            }}
          >
            {({ isActive }) => (
              <>
                {/* Active left-edge indicator */}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      left: '-1px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '2px',
                      height: '18px',
                      background: '#00D46A',
                      borderRadius: '0 2px 2px 0',
                      boxShadow: '0 0 8px rgba(0,212,106,0.60)',
                    }}
                  />
                )}
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '18px',
                    color: isActive ? '#00D46A' : undefined,
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
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}
      >
        <div
          title="FIFA Admin · Command Lead"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #006B3F 0%, #00D46A 100%)',
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
              color: '#080C0A',
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
