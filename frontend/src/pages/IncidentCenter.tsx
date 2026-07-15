import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../context/SocketContext';

export default function IncidentCenter() {
  const { events, state } = useTelemetry();
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toTimeString().split(' ')[0]);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const activeCount = events.filter(e => !e.resolved).length;
  const criticalCount = events.filter(e => !e.resolved && e.severity === 'critical').length;
  const pendingCount = events.filter(e => !e.resolved && e.severity !== 'critical').length;

  const getSeverityColor = (severity: string) => {
    if (severity === 'critical') return { border: 'border-l-critical-red', icon: 'bg-critical-red', textColor: 'text-critical-red', label: 'Critical • Security', pulse: true };
    if (severity === 'high') return { border: 'border-l-warning-amber', icon: 'bg-warning-amber', textColor: 'text-warning-amber', label: 'Moderate • Alert', pulse: false };
    return { border: 'border-l-primary', icon: 'bg-primary', textColor: 'text-primary', label: 'Low • Logistics', pulse: false };
  };

  const getSeverityIcon = (severity: string) => {
    if (severity === 'critical') return 'warning';
    if (severity === 'high') return 'medical_services';
    return 'train';
  };

  return (
    <div className="px-container-padding py-8 pb-16 min-h-screen">
      {/* Dashboard Header */}
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Incident Center</h1>
          <p className="font-body-lg text-on-surface-variant mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Stadium Command: Active Session • Match Day 14
          </p>
        </div>
        <div className="flex gap-4">
          <button className="bg-pearl border border-outline/20 px-6 py-2.5 rounded-xl font-medium text-on-surface flex items-center gap-2 hover:bg-white transition-all shadow-sm">
            <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
            Filter
          </button>
          <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-container transition-all shadow-md active:scale-95">
            <span className="material-symbols-outlined">add</span>
            Report Incident
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left: Mission Timeline Feed */}
        <section className="lg:col-span-8 space-y-6">
          <div className="glass-card rounded-[32px] p-8 recessed-effect relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Chronological Mission Feed</h2>
              <span className="font-stats-numeric text-primary bg-primary/5 px-3 py-1 rounded-lg">{clock}</span>
            </div>

            {/* Timeline */}
            <div className="timeline-line relative pl-12 space-y-8">
              {events.length > 0 ? (
                events.map(event => {
                  const sc = getSeverityColor(event.severity);
                  const icon = getSeverityIcon(event.severity);
                  return (
                    <article key={event.id} className={`relative group cursor-pointer ${event.resolved ? 'opacity-60 grayscale hover:grayscale-0 transition-all' : ''}`}>
                      <div className={`absolute -left-12 mt-1.5 w-10 h-10 rounded-full ${event.resolved ? 'bg-slate' : sc.icon} flex items-center justify-center text-white z-10 ring-4 ring-white transition-transform group-hover:scale-110 ${sc.pulse && !event.resolved ? 'pulse-red' : ''}`}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{event.resolved ? 'check' : icon}</span>
                      </div>
                      <div className={`glass-card p-6 rounded-2xl ${event.resolved ? '' : `border-l-4 ${sc.border}`} transition-all duration-300 group-hover:translate-x-2 group-hover:shadow-lg`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-title-md text-title-md text-on-surface font-bold">{event.title}</h3>
                            <span className={`font-label-caps text-label-caps font-bold ${event.resolved ? 'text-on-surface-variant' : sc.textColor}`}>
                              {event.resolved ? 'Resolved' : sc.label}
                            </span>
                          </div>
                          <span className="font-stats-numeric font-body-md text-on-surface-variant">{event.triggerTime}</span>
                        </div>
                        <p className="text-on-surface-variant leading-relaxed mb-4">{event.reasoning}</p>
                        <div className="flex gap-2 flex-wrap">
                          <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps flex items-center gap-1">
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>place</span>
                            {event.departments?.[0] ?? 'Zone Unknown'}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps flex items-center gap-1">
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>timer</span>
                            {event.resolved ? 'Resolved' : 'Active'}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <>
                  {/* Static fallback incidents from Stitch */}
                  <article className="relative group cursor-pointer">
                    <div className="absolute -left-12 mt-1.5 w-10 h-10 rounded-full bg-critical-red flex items-center justify-center text-white z-10 pulse-red ring-4 ring-white transition-transform group-hover:scale-110">
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>warning</span>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border-l-4 border-l-critical-red transition-all duration-300 group-hover:translate-x-2 group-hover:shadow-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-title-md text-title-md text-on-surface font-bold">Gate 4 Malfunction</h3>
                          <span className="font-label-caps text-label-caps text-critical-red font-bold">Critical • Security</span>
                        </div>
                        <span className="font-stats-numeric font-body-md text-on-surface-variant">14:38</span>
                      </div>
                      <p className="text-on-surface-variant leading-relaxed mb-4">Turnstile entry system for South Gate 4 is unresponsive. 450+ fans queued. Manual scanning initiated. Technical response team ETA 4 mins.</p>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps flex items-center gap-1">
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>person</span>Lead: J. Miller
                        </span>
                        <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps flex items-center gap-1">
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>map</span>South Perimeter
                        </span>
                      </div>
                    </div>
                  </article>
                  <article className="relative group cursor-pointer">
                    <div className="absolute -left-12 mt-1.5 w-10 h-10 rounded-full bg-warning-amber flex items-center justify-center text-white z-10 ring-4 ring-white transition-transform group-hover:scale-110">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border-l-4 border-l-warning-amber transition-all duration-300 group-hover:translate-x-2 group-hover:shadow-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-title-md text-title-md text-on-surface font-bold">Minor Medical in Block C</h3>
                          <span className="font-label-caps text-label-caps text-warning-amber font-bold">Moderate • Medical</span>
                        </div>
                        <span className="font-stats-numeric font-body-md text-on-surface-variant">14:25</span>
                      </div>
                      <p className="text-on-surface-variant leading-relaxed">Heat-related exhaustion reported in Row 12. Medical response unit B4 dispatched. Patient stable, awaiting evacuation to cooling center.</p>
                    </div>
                  </article>
                  <article className="relative group opacity-60 grayscale hover:grayscale-0 transition-all cursor-pointer">
                    <div className="absolute -left-12 mt-1.5 w-10 h-10 rounded-full bg-slate flex items-center justify-center text-white z-10 ring-4 ring-white">
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check</span>
                    </div>
                    <div className="glass-card p-6 rounded-2xl transition-all duration-300 group-hover:translate-x-2 group-hover:shadow-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-title-md text-title-md text-on-surface font-bold">Supply Chain: Ice Refresh</h3>
                          <span className="font-label-caps text-label-caps text-on-surface-variant">Resolved • Catering</span>
                        </div>
                        <span className="font-stats-numeric font-body-md text-on-surface-variant">13:45</span>
                      </div>
                      <p className="text-on-surface-variant leading-relaxed">Concourse 2 inventory replenishment completed. All kiosks fully operational for pre-match surge.</p>
                    </div>
                  </article>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Right: Context & Stats */}
        <section className="lg:col-span-4 space-y-gutter">
          {/* Real-Time Status */}
          <div className="glass-card rounded-[32px] p-6 border border-white">
            <h3 className="font-label-caps text-on-surface-variant mb-6">Real-Time Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="font-stats-numeric text-stats-numeric text-critical-red">{String(criticalCount || 1).padStart(2, '0')}</span>
                <span className="font-label-caps text-label-caps mt-1">Critical</span>
              </div>
              <div className="bg-surface-container p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="font-stats-numeric text-stats-numeric text-warning-amber">{String(pendingCount || 4).padStart(2, '0')}</span>
                <span className="font-label-caps text-label-caps mt-1">Pending</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-outline/10">
              <div className="flex justify-between items-center mb-4">
                <span className="font-body-md text-on-surface">Response Health</span>
                <span className="font-stats-numeric text-primary" style={{ fontSize: '18px' }}>98%</span>
              </div>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[98%]" />
              </div>
            </div>
          </div>

          {/* Digital Twin Mini Map */}
          <div className="glass-card rounded-[32px] overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
            <div className="relative w-full h-full">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9jT7U01Mjjj7tihHJn81ZTspjYagt_JeKhUDfWRbt36X85O4SbXjWN8FG7MSOTV1fth1-Yd5xu_nIwO-yJlU-3inHxk0kFnMGugAnGjvhT9DXMFeQJscpFYDqifebkvyBdhyRUDQkrm-tAFjbs6kQVGTYEKxTvLhbX-3c5qaa9p7g4vsZWOkrJwMl3kJAtNFguH0C896K12oRSVZtmy3PUHt79GXhCOvn9l8yoodwlVcftRj9JHAyog"
                alt="Stadium incident map"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg font-label-caps text-on-surface font-bold flex items-center gap-2 border border-pearl text-sm">
                  <span className="w-2 h-2 rounded-full bg-critical-red animate-pulse" />Live Tracker
                </span>
              </div>
              <button className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg hover:bg-white transition-all active:scale-90 border border-pearl">
                <span className="material-symbols-outlined text-primary">fullscreen</span>
              </button>
            </div>
          </div>

          {/* AI Copilot Suggestion */}
          <div className="bg-primary-container text-on-primary-container rounded-[32px] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              <h4 className="font-title-md text-title-md">Copilot Insight</h4>
            </div>
            <p className="font-body-md opacity-90 mb-6 leading-relaxed text-sm">
              "Gate 4 disruption correlates with the Green Line Metro delay. Recommend redirecting overflow to East Perimeter Gate 7 to balance load."
            </p>
            <button className="w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-pearl transition-all flex items-center justify-center gap-2">
              Execute Redirection
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
