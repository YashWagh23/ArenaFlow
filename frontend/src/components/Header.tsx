import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTelemetry } from '../context/SocketContext';

export default function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: { isMobileMenuOpen?: boolean; setIsMobileMenuOpen?: (v: boolean) => void }) {
  const { state, events } = useTelemetry();
  const [clock, setClock] = useState('');
  const activeIncidentsCount = events.filter(e => !e.resolved).length;

  // Live UTC clock — preserved from original
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      setClock(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center select-none px-4 md:px-6 md:pl-[64px]"
      style={{
        height: '60px',
        background: '#FFFFFF',
        borderBottom: '1px solid #E7E6DF',
      }}
    >
      {/* Left: Wordmark & Hamburger */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Menu Button */}
        <button
          className="md:hidden flex items-center justify-center w-11 h-11 -ml-2 rounded-md hover:bg-black/5 text-[#1C1C1C]"
          onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>

        <NavLink
          to="/dashboard"
          className="flex items-center gap-2.5 no-underline"
          style={{ textDecoration: 'none' }}
        >
          {/* Logo mark */}
          <img
            src="/images/arenaflow-logo.png"
            alt="ArenaFlow"
            style={{
              width: '20px',
              height: '20px',
              flexShrink: 0,
              objectFit: 'contain',
            }}
          />

          {/* Wordmark */}
          <span
            className="hidden sm:inline-block"
            style={{
              fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '-0.025em',
              color: '#1C1C1C',
            }}
          >
            ArenaFlow
          </span>

          {/* Separator */}
          <span className="hidden sm:inline-block" style={{ color: 'rgba(0,0,0,0.12)', fontSize: '12px', fontWeight: 300 }}>/</span>

          {/* Context label */}
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.10em',
              color: '#7A7A7A',
              textTransform: 'uppercase',
            }}
          >
            FIFA 2026
          </span>
        </NavLink>
      </div>

      {/* Right: Status indicators */}
      <div className="flex items-center gap-5">

        {/* Active incident — only visible when critical */}
        {state && activeIncidentsCount > 0 && (
          <div
            className="flex items-center gap-1.5"
            style={{ animation: 'pulse-critical 1.8s ease infinite' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#C84A4A' }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.10em',
                color: '#C84A4A',
                textTransform: 'uppercase',
              }}
            >
              {activeIncidentsCount} Incident{activeIncidentsCount > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* System status — nominal indicator */}
        {state && activeIncidentsCount === 0 && (
          <div 
            className="flex items-center gap-1.5"
            style={{
              background: '#EAF7EA',
              padding: '4px 10px',
              borderRadius: '999px',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full pulse-live" style={{ background: '#2E7D32' }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#2E7D32',
                textTransform: 'uppercase',
              }}
            >
              Nominal
            </span>
          </div>
        )}

        {/* UTC Clock — minimal, just the number */}
        <div className="flex items-center gap-1.5">
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px',
              fontWeight: 500,
              color: 'rgba(0,0,0,0.25)',
              letterSpacing: '0.06em',
            }}
          >
            UTC
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(0,0,0,0.55)',
              letterSpacing: '0.06em',
            }}
          >
            {clock}
          </span>
        </div>
      </div>
    </header>
  );
}
