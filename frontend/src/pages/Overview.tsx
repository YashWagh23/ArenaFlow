import React, { useEffect, useRef, useState } from 'react';
import { useTelemetry } from '../context/SocketContext';
import StadiumMap from '../components/DigitalTwin/StadiumMap';

export default function Overview() {
  const { state, analytics, events, timeline } = useTelemetry();
  const [clock, setClock] = useState('');

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

  if (!state || !analytics) {
    return (
      <div className="flex-1 flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">autorenew</span>
          <p className="font-label-caps text-label-caps text-on-surface-variant">Connecting Telemetry...</p>
        </div>
      </div>
    );
  }

  const totalOccupancy =
    state.zones['stand-north'].currentLoad +
    state.zones['stand-south'].currentLoad +
    state.zones['stand-east'].currentLoad +
    state.zones['stand-west'].currentLoad;

  const safetyScore = state.globalSafetyScore;

  return (
    <div className="p-container-padding pb-16 min-h-screen select-none">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-1">STADIUM COMMAND CENTER</p>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">ArenaFlow Executive Dashboard</h1>
        </div>
        <div className="glass-card px-6 py-3 rounded-xl flex items-center gap-3">
          <span className="font-label-caps text-label-caps text-on-surface-variant">STADIUM LOCAL TIME</span>
          <span className="font-stats-numeric text-stats-numeric text-on-surface">{clock}</span>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 grid-rows-6 gap-gutter" style={{ minHeight: 'calc(100vh - 200px)' }}>

        {/* Crowd Density */}
        <div className="col-span-3 row-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between border-l-4 border-primary">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg">groups</span>
            <span className="font-label-caps text-label-caps text-primary">+4.2% Trend</span>
          </div>
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">CROWD DENSITY</p>
            <div className="flex items-baseline gap-2">
              <h2 className="font-stats-numeric text-4xl font-bold text-on-surface">{totalOccupancy.toLocaleString()}</h2>
              <span className="text-on-surface-variant/60 font-body-md text-body-md">/ 85k</span>
            </div>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-full transition-all duration-500" style={{ width: `${Math.min((totalOccupancy / 85000) * 100, 100)}%` }} />
          </div>
        </div>

        {/* Transport Status */}
        <div className="col-span-3 row-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between border-l-4 border-primary">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg">train</span>
            <span className="font-label-caps text-label-caps text-primary">OPERATIONAL</span>
          </div>
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">TRANSPORT FLOW</p>
            <h2 className="font-stats-numeric text-4xl font-bold text-on-surface">94.8%</h2>
          </div>
          <div className="flex gap-1 h-6 items-end">
            <div className="bg-primary/20 w-full h-2 rounded-t-sm" />
            <div className="bg-primary/30 w-full h-3 rounded-t-sm" />
            <div className="bg-primary/40 w-full h-5 rounded-t-sm" />
            <div className="bg-primary/60 w-full h-4 rounded-t-sm" />
            <div className="bg-primary w-full h-6 rounded-t-sm" />
          </div>
        </div>

        {/* Security Alerts */}
        <div className="col-span-3 row-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between border-l-4 border-warning-amber">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-warning-amber p-2 bg-warning-amber/10 rounded-lg">security</span>
            <div className="flex items-center gap-1 text-warning-amber font-label-caps text-label-caps pulse-critical">
              <span className="w-2 h-2 rounded-full bg-warning-amber" />
              <span>ACTIVE INCIDENTS</span>
            </div>
          </div>
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">SECURITY STATUS</p>
            <h2 className="font-stats-numeric text-4xl font-bold text-on-surface">AMBER</h2>
          </div>
          <p className="font-body-md text-on-surface-variant/80">3 perimeter breaches reported</p>
        </div>

        {/* Medical Status */}
        <div className="col-span-3 row-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between border-l-4 border-primary-fixed-dim">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg">medical_services</span>
            <span className="font-label-caps text-label-caps text-primary-fixed-dim">STABLE</span>
          </div>
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">MEDICAL RESPONSE</p>
            <h2 className="font-stats-numeric text-4xl font-bold text-on-surface">NOMINAL</h2>
          </div>
          <div className="flex justify-between text-on-surface-variant/60 font-label-caps text-label-caps">
            <span>STATION 1-8 OK</span>
            <span>ER READINESS {safetyScore}%</span>
          </div>
        </div>

        {/* Central Live Twin Viewport — 8 cols × 4 rows */}
        <div className="col-span-8 row-span-4 glass-card rounded-[32px] overflow-hidden relative border border-white/50 group">
          {/* Stadium map or image */}
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full flex items-center justify-center bg-surface-container-low">
              <StadiumMap />
            </div>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-graphite/20 to-transparent pointer-events-none z-10" />

          {/* Top controls */}
          <div className="absolute top-6 left-6 flex gap-2 z-20">
            <button className="glass-card px-4 py-2 rounded-full font-label-caps text-label-caps text-primary border border-primary/20 bg-white/90">HEATMAP ON</button>
            <button className="glass-card px-4 py-2 rounded-full font-label-caps text-label-caps text-on-surface-variant hover:bg-white/90 transition-colors">ZONES</button>
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
            <button className="glass-card w-12 h-12 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary transition-all">
              <span className="material-symbols-outlined">add</span>
            </button>
            <button className="glass-card w-12 h-12 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary transition-all">
              <span className="material-symbols-outlined">remove</span>
            </button>
          </div>

          {/* Sector label */}
          <div className="absolute bottom-6 left-6 z-20">
            <div className="glass-card px-6 py-4 rounded-2xl flex flex-col gap-1">
              <span className="font-label-caps text-[10px] text-on-surface-variant opacity-60">FOCUSED SECTOR</span>
              <span className="font-title-md text-title-md font-bold text-on-surface">NORTH CONCOURSE B</span>
            </div>
          </div>
        </div>

        {/* AI Copilot Panel — 4 cols × 4 rows */}
        <div className="col-span-4 row-span-4 glass-card rounded-2xl flex flex-col p-6 overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary-fixed-dim flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            </div>
            <div>
              <h3 className="font-title-md text-title-md font-bold text-on-surface">ArenaFlow Copilot</h3>
              <p className="text-[12px] text-primary font-medium">Monitoring {analytics.volunteersAvailable} data streams...</p>
            </div>
          </div>

          {/* Chat feed */}
          <div className="flex-grow flex flex-col gap-4 overflow-y-auto mb-4 scrollbar-none">
            {events.slice(0, 3).map((event, i) => (
              <div
                key={event.id}
                className={`p-4 rounded-xl border max-w-[90%] ${
                  i % 2 === 0
                    ? 'bg-surface-container-low border-outline/10 rounded-tl-none'
                    : 'bg-primary/5 border-primary/10 rounded-tr-none ml-auto'
                }`}
              >
                <p className="font-body-md text-on-surface text-sm">{event.title}: {event.reasoning}</p>
                <span className="text-[10px] text-on-surface-variant opacity-50 block mt-2">{event.triggerTime}</span>
              </div>
            ))}
            {events.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <p className="font-label-caps text-label-caps text-on-surface-variant">No active alerts. Stadium nominal.</p>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="relative mt-auto">
            <input
              className="w-full bg-surface-container h-12 px-5 rounded-xl border-none focus:ring-2 focus:ring-primary/20 font-body-md pr-12 text-on-surface"
              placeholder="Ask Copilot..."
              type="text"
              readOnly
            />
            <button className="absolute right-2 top-2 h-8 w-8 bg-primary rounded-lg text-white flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>send</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
