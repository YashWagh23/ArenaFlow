import React, { useState, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { useTelemetry } from '../context/SocketContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function Header() {
  const { notifications, markNotificationsRead } = useTelemetry();
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [clock, setClock] = useState('');
  const location = useLocation();

  const unreadCount = notifications.filter(n => n.unread).length;

  // Live UTC clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setClock(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleToggleNotif = () => {
    setShowNotifPanel(prev => !prev);
    if (!showNotifPanel) markNotificationsRead();
  };

  // Page label based on route
  const routeLabels: Record<string, string> = {
    '/dashboard': 'Overview',
    '/twin': 'Digital Twin',
    '/copilot': 'AI Copilot',
    '/analytics': 'Analytics',
    '/incidents': 'Incidents',
    '/scenarios': 'Simulator',
    '/settings': 'Settings',
  };

  const currentPageLabel = routeLabels[location.pathname] ?? 'Overview';

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-[40px] h-16 bg-surface/80 backdrop-blur-xl border-b border-white/30 shadow-sm select-none">
      {/* Left: Brand + Active page nav */}
      <div className="flex items-center gap-8">
        <NavLink to="/dashboard" className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">
          ArenaFlow
        </NavLink>
        <nav className="hidden md:flex items-center gap-6">
          {Object.entries(routeLabels).slice(0, 4).map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                isActive
                  ? 'text-primary font-semibold border-b-2 border-primary py-4'
                  : 'text-on-surface-variant font-medium hover:text-primary transition-colors py-4'
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Right: Live badge, clock, actions */}
      <div className="flex items-center gap-4">
        {/* Live Connection Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-label-caps text-label-caps text-primary">Live Connection</span>
        </div>

        {/* Live Clock */}
        <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-2 hidden md:flex">
          <span className="font-label-caps text-on-surface-variant text-[11px]">UTC</span>
          <span className="font-stats-numeric text-on-surface" style={{ fontSize: '16px' }}>{clock}</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={handleToggleNotif}
            aria-label="Notification center"
            className="p-2 text-on-surface-variant hover:bg-white/20 transition-colors rounded-full relative"
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-critical-red" />
            )}
          </button>

          <AnimatePresence>
            {showNotifPanel && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl p-4 z-50 flex flex-col max-h-[360px] overflow-hidden"
              >
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-outline/10">
                  <span className="font-label-caps text-on-surface-variant">NOTIFICATIONS</span>
                  <button
                    onClick={() => setShowNotifPanel(false)}
                    className="text-on-surface-variant hover:text-on-surface text-xs font-bold"
                  >
                    Close
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3 bg-surface-container-low rounded-xl border border-outline/10"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-label-caps text-on-surface text-[11px] truncate pr-2">{notif.title}</span>
                        <span className="font-stats-numeric text-on-surface-variant text-[10px] shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{notif.description}</p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="py-8 text-center text-on-surface-variant font-label-caps text-label-caps">
                      No notifications logged.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Emergency button */}
        <button
          aria-label="Emergency home"
          className="p-2 text-on-surface-variant hover:bg-white/20 transition-colors rounded-full"
        >
          <span className="material-symbols-outlined">emergency_home</span>
        </button>

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
