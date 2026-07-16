import React, { useState, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { useTelemetry } from '../context/SocketContext';

export default function Header() {
  const { state } = useTelemetry();
  const [clock, setClock] = useState('');
  const location = useLocation();

  // Live UTC clock
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

  const routeLabels: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/scenarios': 'Scenarios',
    '/analytics': 'Analytics',
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-[40px] h-16 bg-surface/80 backdrop-blur-xl border-b border-white/30 shadow-sm select-none">
      {/* Left: Brand + Subtitle + Active page nav */}
      <div className="flex items-center gap-8">
        <div className="flex flex-col">
          <NavLink to="/dashboard" className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight leading-none">
            ArenaFlow
          </NavLink>
          <span className="font-label-caps text-[9px] text-on-surface-variant/70 mt-1 uppercase tracking-wider">
            FIFA 2026 Stadium Operations
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 ml-6">
          {Object.entries(routeLabels).map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                isActive
                  ? 'text-primary font-semibold border-b-2 border-primary py-4 text-sm'
                  : 'text-on-surface-variant font-medium hover:text-primary transition-colors py-4 text-sm'
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Right: Safety Score badge & Live Clock */}
      <div className="flex items-center gap-4">
        {/* Safety Score Badge */}
        {state && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-label-caps text-label-caps text-primary">
              Safety Score: {state.globalSafetyScore}%
            </span>
          </div>
        )}

        {/* Live UTC Clock */}
        <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-2">
          <span className="font-label-caps text-on-surface-variant text-[11px]">UTC</span>
          <span className="font-stats-numeric text-on-surface text-[14px]">{clock}</span>
        </div>

        {/* Avatar */}
        <div className="h-8 w-8 rounded-full bg-surface-container-high border border-outline/20 overflow-hidden shrink-0">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDI8dGtXx6eQz8dCEMxHqxcptd-Ets5JLBsZaPNjgBIm4sDVLvdjWJKB2BQjEBoZUv0kocYgfkht6z4A2VfRRDXgoar6SA6WKH8BvAtGkcoSm8TngN9DPX3BWH2DhDWhAKpXH5NdH2aKuHxiXks2SlNKz1xp6JUkvcPyUcLIG7MsfcUVLuEgW5ezPGpYNrvVV-eL1jhMVgpJuHZqy6osDmBNiDLHeVrbOvm7Pmvp5TXVCRF_QUfZQZJkQ"
            alt="FIFA Admin"
          />
        </div>
      </div>
    </header>
  );
}
