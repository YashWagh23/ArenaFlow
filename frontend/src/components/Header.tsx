import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTelemetry } from '../context/SocketContext';

export default function Header() {
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
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center select-none"
      style={{
        height: '48px',
        paddingLeft: '64px',
        paddingRight: '24px',
        background: 'rgba(8,12,10,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      {/* Left: Wordmark */}
      <NavLink
        to="/dashboard"
        className="flex items-center gap-2.5 no-underline"
        style={{ textDecoration: 'none' }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '5px',
            background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '12px', color: '#F7F6F1', fontVariationSettings: "'FILL' 1", fontWeight: '700' }}
          >
            stadium
          </span>
        </div>

        {/* Wordmark */}
        <span
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
        <span style={{ color: 'rgba(0,0,0,0.12)', fontSize: '12px', fontWeight: 300 }}>/</span>

        {/* Context label */}
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.10em',
            color: 'rgba(0,0,0,0.30)',
            textTransform: 'uppercase',
          }}
        >
          FIFA 2026
        </span>
      </NavLink>

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
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full pulse-live" style={{ background: '#2E7D32' }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: 'rgba(46,125,50,0.70)',
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
