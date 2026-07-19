import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', icon: 'dashboard',  label: 'Dashboard'  },
  { to: '/scenarios', icon: 'science',    label: 'Scenarios'  },
  { to: '/analytics', icon: 'monitoring', label: 'Analytics'  },
];

export default function NavigationSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
          style={{ transition: 'opacity 0.3s' }}
        />
      )}

      {/* Sidebar / Drawer */}
      <aside
        className={`fixed left-0 top-[60px] bottom-0 z-50 flex flex-col select-none bg-white border-r border-[#E7E6DF] transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64 md:w-[48px]`}
      >
        {/* Nav rail */}
        <div className="flex flex-col md:items-center gap-1 pt-4 flex-grow px-2 md:px-0">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => { if (window.innerWidth < 768 && onClose) onClose(); }}
              title={item.label}
              className="relative flex items-center justify-start md:justify-center transition-colors w-full md:w-[40px] h-[44px] md:h-[40px] rounded-lg md:rounded-full px-4 md:px-0"
              style={({ isActive }) => ({
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
                    className="material-symbols-outlined shrink-0"
                    style={{
                      fontSize: '20px',
                      color: isActive ? '#FFFFFF' : undefined,
                      fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                      transition: 'all 150ms',
                    }}
                  >
                    {item.icon}
                  </span>
                  <span className="md:hidden ml-3 font-sans font-medium text-[15px]">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom: Avatar */}
        <div
          className="flex items-center justify-start md:justify-center pb-6 md:pb-4 px-6 md:px-0 pt-4"
          style={{ borderTop: '1px solid #E7E6DF' }}
        >
          <div className="flex items-center gap-3">
            <div
              title="FIFA Admin · Command Lead"
              style={{
                width: '32px',
                height: '32px',
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
                  fontSize: '11px',
                  color: '#F7F6F1',
                  letterSpacing: '0.02em',
                }}
              >
                FA
              </span>
            </div>
            <div className="md:hidden flex flex-col">
              <span className="font-sans font-semibold text-[14px] text-[#1C1C1C]">FIFA Admin</span>
              <span className="font-mono text-[10px] text-[#7A7A7A] uppercase tracking-wider">Command Lead</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
