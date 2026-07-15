import React from 'react';
import { useTelemetry } from '../context/SocketContext';

export default function ExecutiveAnalytics() {
  const { state, analytics } = useTelemetry();

  const northGate = state?.zones['stand-north'].currentLoad ?? 22104;
  const southGate = state?.zones['stand-south'].currentLoad ?? 19842;
  const eastGate = state?.zones['stand-east'].currentLoad ?? 24300;
  const westGate = state?.zones['stand-west'].currentLoad ?? 18045;
  const totalAttendance = northGate + southGate + eastGate + westGate;
  const capacity = 89000;
  const capacityPct = Math.round((totalAttendance / capacity) * 100);

  return (
    <div className="pt-6 pl-6 pr-container-padding pb-container-padding min-h-screen">
      <div className="max-w-[1600px] mx-auto">

        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="font-label-caps text-primary mb-2 block tracking-[0.2em]">EXECUTIVE COMMAND CENTER</span>
            <h1 className="font-headline-xl text-headline-xl text-on-surface">Stadium Analytics</h1>
          </div>
          <div className="flex gap-4">
            <button className="bg-white border border-outline/10 px-6 py-2.5 rounded-lg font-medium text-on-surface-variant hover:bg-surface-container transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Match Day: Qatar vs Senegal
            </button>
            <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 shadow-lg shadow-primary/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">share</span>
              Export Report
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-gutter">

          {/* Large Chart: Attendance Trends */}
          <div className="col-span-12 lg:col-span-8 glass-panel rounded-3xl p-8 relative overflow-hidden recessed-effect">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="font-title-md text-title-md text-on-surface">Live Attendance Flux</h3>
                <p className="text-on-surface-variant font-body-md opacity-70">Real-time gateway scanning vs projected flow</p>
              </div>
              <div className="text-right">
                <span className="font-stats-numeric text-display-lg text-primary leading-none">{totalAttendance.toLocaleString()}</span>
                <span className="block font-label-caps text-on-surface-variant mt-1">{capacityPct}% CAPACITY</span>
              </div>
            </div>

            {/* SVG Chart */}
            <div className="h-64 relative">
              <div className="absolute inset-0">
                <svg className="w-full h-full" viewBox="0 0 800 200">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#006b3f" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#006b3f" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,150 Q100,140 200,120 T400,100 T600,60 T800,20 L800,200 L0,200 Z" fill="url(#chartGradient)" />
                  <path d="M0,150 Q100,140 200,120 T400,100 T600,60 T800,20" fill="none" stroke="#006b3f" strokeWidth="3" />
                  <circle cx="400" cy="100" fill="#006b3f" r="4" />
                  <circle cx="800" cy="20" fill="#006b3f" r="6" />
                </svg>
              </div>
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between opacity-5 pointer-events-none">
                {[0, 1, 2, 3].map(i => <div key={i} className="border-t border-on-surface w-full" />)}
              </div>
            </div>

            <div className="mt-6 flex gap-12 border-t border-on-surface/5 pt-6">
              {[
                { label: 'NORTH GATE', value: northGate.toLocaleString() },
                { label: 'SOUTH GATE', value: southGate.toLocaleString() },
                { label: 'EAST GATE', value: eastGate.toLocaleString() },
                { label: 'WEST GATE', value: westGate.toLocaleString() },
              ].map(gate => (
                <div key={gate.label}>
                  <span className="font-label-caps text-[10px] text-on-surface-variant block mb-1">{gate.label}</span>
                  <span className="font-stats-numeric text-title-md text-on-surface">{gate.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stadium Health Gauges */}
          <div className="col-span-12 lg:col-span-4 glass-panel rounded-3xl p-8 flex flex-col justify-between">
            <h3 className="font-title-md text-title-md text-on-surface mb-6">Stadium Pulse</h3>
            <div className="space-y-8">
              {[
                { pct: 82, offset: 40, color: '#006b3f', label: 'STRUCTURAL LOAD', status: 'Optimal Range', statusColor: 'text-on-surface' },
                { pct: 14, offset: 180, color: '#E03131', label: 'NETWORK LATENCY', status: 'High Peak Detected', statusColor: 'text-critical-red' },
                { pct: 96, offset: 20, color: '#006b3f', label: 'AIR QUALITY INDEX', status: 'Premium Airflow', statusColor: 'text-on-surface' },
              ].map((gauge, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="relative w-20 h-20 shrink-0">
                    <svg className="w-20 h-20" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="40" cy="40" fill="transparent" r="34" stroke="#e8e8ea" strokeWidth="6" />
                      <circle cx="40" cy="40" fill="transparent" r="34" stroke={gauge.color} strokeDasharray="213.6" strokeDashoffset={gauge.offset} strokeWidth="6" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-stats-numeric text-lg">{gauge.pct}%</div>
                  </div>
                  <div>
                    <span className="font-label-caps text-[10px] text-on-surface-variant">{gauge.label}</span>
                    <p className={`font-body-md font-semibold ${gauge.statusColor}`}>{gauge.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Revenue */}
          <div className="col-span-12 lg:col-span-5 glass-panel rounded-3xl p-8 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-title-md text-title-md text-on-surface">Ticket Revenue</h3>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <div className="w-3 h-3 rounded-full bg-primary-container" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="font-stats-numeric text-headline-xl text-on-surface">$12.4M</span>
              <span className="text-primary font-medium flex items-center text-sm">
                <span className="material-symbols-outlined text-sm">trending_up</span>+14.2%
              </span>
            </div>
            <div className="space-y-4">
              {[
                { label: 'VIP Boxes', pct: 88 },
                { label: 'Premium Tier', pct: 94 },
                { label: 'Standard', pct: 100 },
              ].map(tier => (
                <div key={tier.label} className="flex justify-between items-center">
                  <span className="text-on-surface-variant font-body-md">{tier.label}</span>
                  <div className="flex items-center gap-4 flex-1 max-w-[200px] ml-4">
                    <div className="h-2 flex-1 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all" style={{ width: `${tier.pct}%` }} />
                    </div>
                    <span className="font-stats-numeric text-sm w-12 text-right">{tier.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Grid Consumption */}
          <div className="col-span-12 lg:col-span-7 glass-panel rounded-3xl p-8 bg-graphite text-pearl shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="font-title-md text-title-md text-white">Smart Grid Consumption</h3>
                  <p className="text-pearl/60 font-body-md">Sustainable energy monitoring</p>
                </div>
                <div className="bg-primary/20 text-primary-fixed border border-primary/30 px-3 py-1 rounded-full text-xs font-label-caps">
                  LIVE EFFICIENCY: 98.2%
                </div>
              </div>
              <div className="grid grid-cols-3 gap-8">
                {[
                  { label: 'HVAC LOAD', value: '412', unit: 'kW', w: '66%' },
                  { label: 'LIGHTING', value: '1,204', unit: 'kW', w: '50%' },
                  { label: 'BROADCAST', value: '880', unit: 'kW', w: '75%' },
                ].map(item => (
                  <div key={item.label} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="font-label-caps text-[10px] text-pearl/50 block mb-2">{item.label}</span>
                    <div className="font-stats-numeric text-stats-numeric text-white">{item.value} <span className="text-sm font-normal text-pearl/50">{item.unit}</span></div>
                    <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-fixed" style={{ width: item.w }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Digital Twin Mini Map */}
          <div className="col-span-12 glass-panel rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2 h-64 rounded-2xl overflow-hidden relative border border-outline/10">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAjrqVGdsZ7gAhwa0WXU0VWa-a7CTir65SkZzwAZvGB3VXEcfc8rrIZVkcAhu7pz9ivcB68nUInYwdyWotnlXlqNhj0-QZetbNc26DXGOrqLI496Dne0UPtEBykuQI5vMcUq9_upxyFYpRgMJoSmBkl-au1wt4qQgarMQgYMVEL3pXUDSkbmfAqsNUCqvWv5S9VC1AxuAzgniKVAGLfBZv_two4mrq56MiE2gGNLRYVfdQjD41634diA"
                alt="Stadium Digital Twin"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg text-white font-label-caps text-[10px] border border-white/20">
                Stadium Digital Twin (Active)
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="bg-primary/90 text-white p-2 rounded-lg backdrop-blur-md shadow-lg">
                  <span className="material-symbols-outlined">3d_rotation</span>
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="font-title-md text-title-md text-on-surface mb-2">Real-time Heat Density</h3>
              <p className="text-on-surface-variant font-body-md mb-6">
                Automated crowd flow analysis detected a minor bottleneck at Section 302, Zone B. Copilot has recalculated exit routing protocols.
              </p>
              <div className="flex gap-4">
                <div className="flex-1 p-4 rounded-xl border border-outline/10 bg-surface-container-low">
                  <span className="material-symbols-outlined text-primary mb-2 block">groups</span>
                  <span className="block font-label-caps text-[10px] text-on-surface-variant">PEAK FLOW</span>
                  <span className="font-stats-numeric text-title-md">1.2k/min</span>
                </div>
                <div className="flex-1 p-4 rounded-xl border border-outline/10 bg-surface-container-low">
                  <span className="material-symbols-outlined text-warning-amber mb-2 block">warning</span>
                  <span className="block font-label-caps text-[10px] text-on-surface-variant">BOTTLENECKS</span>
                  <span className="font-stats-numeric text-title-md">2 Detected</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating AI Copilot FAB */}
      <button className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
        <div className="absolute -top-2 -right-2 bg-critical-red text-white text-[10px] px-2 py-0.5 rounded-full font-bold pulse-critical">AI</div>
      </button>
    </div>
  );
}
