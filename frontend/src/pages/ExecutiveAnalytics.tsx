import React from 'react';
import { useTelemetry } from '../context/SocketContext';

export default function ExecutiveAnalytics() {
  const { state, analytics, connectionError } = useTelemetry();

  if (connectionError && (!state || !analytics)) {
    return (
      <div className="flex-grow flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center space-y-6 max-w-sm px-6 py-8 glass-card rounded-3xl border border-error-container/30">
          <span className="material-symbols-outlined text-critical-red text-5xl">cloud_off</span>
          <div className="space-y-1.5">
            <h3 className="font-title-md text-title-md font-bold text-slate-900">Analytics Offline</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              The live stadium telemetry server is currently unreachable. Make sure the backend service is deployed and running at:
            </p>
            <code className="block text-[10px] bg-slate-100 p-2.5 rounded-xl font-mono break-all select-all">
              https://arena-flow-backend.vercel.app
            </code>
          </div>
        </div>
      </div>
    );
  }

  if (!state || !analytics) {
    return (
      <div className="flex-grow flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">autorenew</span>
          <p className="font-label-caps text-label-caps text-on-surface-variant">Connecting Analytics...</p>
        </div>
      </div>
    );
  }

  const northGate = state.zones['stand-north'].currentLoad;
  const southGate = state.zones['stand-south'].currentLoad;
  const eastGate = state.zones['stand-east'].currentLoad;
  const westGate = state.zones['stand-west'].currentLoad;
  const totalAttendance = northGate + southGate + eastGate + westGate;
  const capacity = 85000;
  const capacityPct = Math.round((totalAttendance / capacity) * 100);

  // Safety Score Color
  const safetyColor = state.globalSafetyScore > 85 
    ? 'stroke-emerald-500' 
    : state.globalSafetyScore > 60 
    ? 'stroke-amber-500' 
    : 'stroke-rose-500';

  return (
    <div className="pt-6 pl-6 pr-container-padding pb-container-padding min-h-screen">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="font-label-caps text-primary mb-2 block tracking-[0.2em]">EXECUTIVE COMMAND CENTER</span>
            <h1 className="font-headline-xl text-headline-xl text-on-surface">Stadium Analytics</h1>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-gutter">
          
          {/* Safety Gauge (Bloomberg/F1 dashboard layout) */}
          <div className="col-span-12 md:col-span-4 glass-panel rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-sm h-[320px]">
            <div className="absolute top-4 left-4 text-[9px] font-bold font-mono text-slate-400 uppercase tracking-widest">
              Safety Gauge
            </div>
            
            <div className="relative h-40 w-40 flex items-center justify-center mt-3">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="stroke-slate-100"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className={safetyColor}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * state.globalSafetyScore) / 100}
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>
              <div className="text-center">
                <span className="font-stats-numeric text-3xl font-extrabold text-slate-900 block">
                  {state.globalSafetyScore}%
                </span>
                <span className="font-label-caps text-[9px] text-on-surface-variant block uppercase tracking-widest mt-1">
                  Global Safety
                </span>
              </div>
            </div>
          </div>

          {/* Crowd Density (Attendance Flux) */}
          <div className="col-span-12 md:col-span-8 glass-panel rounded-3xl p-8 relative overflow-hidden recessed-effect h-[320px] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-title-md text-title-md text-on-surface">Crowd Density & capacity</h3>
                <p className="text-on-surface-variant font-body-md opacity-70">Real-time attendance vs projected flow</p>
              </div>
              <div className="text-right">
                <span className="font-stats-numeric text-4xl text-primary font-bold leading-none">{totalAttendance.toLocaleString()}</span>
                <span className="block font-label-caps text-on-surface-variant mt-1 text-xs">{capacityPct}% CAPACITY</span>
              </div>
            </div>

            <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
              <div className="bg-primary h-full transition-all duration-500" style={{ width: `${capacityPct}%` }} />
            </div>

            <div className="flex gap-12 border-t border-on-surface/5 pt-6">
              {[
                { label: 'NORTH STAND', value: northGate.toLocaleString() },
                { label: 'SOUTH STAND', value: southGate.toLocaleString() },
                { label: 'EAST STAND', value: eastGate.toLocaleString() },
                { label: 'WEST STAND', value: westGate.toLocaleString() },
              ].map((gate) => (
                <div key={gate.label}>
                  <span className="font-label-caps text-[10px] text-on-surface-variant block mb-1">{gate.label}</span>
                  <span className="font-stats-numeric text-title-md text-on-surface">{gate.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stand Occupancy (regional crowd distribution) */}
          <div className="col-span-12 md:col-span-5 glass-panel rounded-3xl p-8 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-5">
              Stand Occupancy Distribution
            </h4>
            <div className="space-y-4">
              {[
                { label: 'North Stand', val: northGate, cap: 18000 },
                { label: 'South Stand', val: southGate, cap: 18000 },
                { label: 'East Stand', val: eastGate, cap: 20000 },
                { label: 'West Stand', val: westGate, cap: 20000 },
              ].map((stand) => (
                <div key={stand.label}>
                  <div className="flex justify-between text-[10px] mb-1.5 capitalize text-slate-500 font-bold font-mono">
                    <span>{stand.label}</span>
                    <span className="text-slate-800">{stand.val.toLocaleString()} / {stand.cap.toLocaleString()} Pax</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (stand.val / stand.cap) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone Health Index */}
          <div className="col-span-12 md:col-span-7 glass-panel rounded-3xl p-8 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-5">
              Zone Health Index
            </h4>
            <div className="max-h-[220px] overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3 scrollbar-thin">
              {Object.values(state.zones).map((z) => (
                <div
                  key={z.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between shadow-sm"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{z.name}</span>
                    <span className="text-[9px] font-mono text-slate-400 font-bold block uppercase mt-0.5">
                      Wait: {z.waitTime}m | Load: {z.currentLoad}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold capitalize ${
                    z.status === 'critical' ? 'text-rose-600' : z.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {z.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
