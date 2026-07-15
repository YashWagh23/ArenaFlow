import React, { useState } from 'react';
import { useTelemetry } from '../context/SocketContext';

export default function ScenarioSimulator() {
  const { triggerScenario, state, isPlaying, setPlaying, scrubSim } = useTelemetry();
  const [crowdSize, setCrowdSize] = useState(82500);
  const [ingressIntensity, setIngressIntensity] = useState(1.2);
  const [extraSecurity, setExtraSecurity] = useState(true);
  const [extendedShuttle, setExtendedShuttle] = useState(false);
  const [limitedConcession, setLimitedConcession] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string | null>('early-full-capacity');

  const scenarios = [
    {
      id: 'thunderstorm',
      icon: 'thunderstorm',
      iconBg: 'bg-secondary-container/30',
      iconColor: 'text-secondary',
      category: 'ENVIRONMENT',
      title: 'Sudden Thunderstorm',
      desc: 'Simulates heavy rainfall and electrical storms affecting ingress and concourse density.',
      tags: [{ label: 'HIGH IMPACT', bg: 'bg-error-container/20', text: 'text-critical-red' }, { label: '20 MIN DURATION', bg: 'bg-outline/10', text: 'text-on-surface-variant' }],
    },
    {
      id: 'metro-strike',
      icon: 'train',
      iconBg: 'bg-tertiary-container/30',
      iconColor: 'text-tertiary',
      category: 'LOGISTICS',
      title: 'Metro Strike',
      desc: 'Models a 40% reduction in public transport capacity, shifting load to local parking/rideshare.',
      tags: [{ label: 'CRITICAL LOAD', bg: 'bg-warning-amber/20', text: 'text-secondary' }, { label: 'EXTERNAL', bg: 'bg-outline/10', text: 'text-on-surface-variant' }],
    },
    {
      id: 'early-full-capacity',
      icon: 'groups',
      iconBg: 'bg-primary-container/20',
      iconColor: 'text-primary',
      category: 'ACTIVE SIM',
      title: 'Early Full Capacity',
      desc: 'Fans arriving 90 minutes earlier than expected. Analyzing concourse bottlenecking at Gate 4.',
      tags: [{ label: 'INGRESS', bg: 'bg-primary/10', text: 'text-primary' }, { label: 'REAL-TIME SYNC', bg: 'bg-outline/10', text: 'text-on-surface-variant' }],
      active: true,
    },
  ];

  const forecastMetrics = [
    { label: 'PEAK CONCURRENCY', icon: 'trending_up', value: `${Math.round(crowdSize / 6).toLocaleString()}`, unit: 'fans/min', delta: '+22% vs baseline', deltaColor: 'text-critical-red', deltaIcon: 'arrow_upward' },
    { label: 'AVG CLEARANCE', icon: 'timer', value: '18.5', unit: 'min', delta: 'Nominal range', deltaColor: 'text-secondary', deltaIcon: 'remove' },
    { label: 'RISK INDEX', icon: 'warning', value: 'High', unit: '', delta: 'Gate 4 Overflow Prob: 68%', deltaColor: 'text-on-surface-variant', deltaIcon: '' },
    { label: 'STAFF EFFICIENCY', icon: 'speed', value: '91%', unit: '', delta: 'Optimal utilization', deltaColor: 'text-primary', deltaIcon: 'expand_less' },
  ];

  const handleSelectScenario = (id: string) => {
    setActiveScenario(id === activeScenario ? null : id);
    triggerScenario(id);
  };

  return (
    <div className="px-container-padding py-8 relative min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface">Scenario Simulator</h1>
            <p className="font-body-lg text-on-surface-variant max-w-2xl mt-2">
              Predict venue dynamics by adjusting operational variables. Leverage AI-driven forecasting to pressure-test stadium response strategies for 2026.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="bg-pearl border border-outline/20 text-graphite px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined">history</span>View History
            </button>
            <button
              onClick={() => scenarios.forEach(s => triggerScenario(s.id))}
              className="bg-primary text-on-primary px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              Run All Scenarios
            </button>
          </div>
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-gutter">
          {/* Left: Scenario Templates */}
          <div className="col-span-12 lg:col-span-8 space-y-gutter">
            <h2 className="font-title-md text-title-md text-primary flex items-center gap-2 uppercase tracking-widest px-1">
              <span className="w-8 h-[2px] bg-primary" />Active Scenarios
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {scenarios.map(s => (
                <div
                  key={s.id}
                  className={`glass-card rounded-3xl p-6 group cursor-pointer hover:border-primary/40 transition-all ${s.active && activeScenario === s.id ? 'border-2 border-primary/40 shadow-xl shadow-primary/5' : ''}`}
                  onClick={() => handleSelectScenario(s.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 ${s.iconBg} ${s.iconColor} rounded-2xl`}>
                      <span className="material-symbols-outlined text-3xl">{s.icon}</span>
                    </div>
                    {s.active && activeScenario === s.id ? (
                      <div className="flex gap-1 items-center bg-primary text-on-primary px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        <span className="font-label-caps text-[10px]">ACTIVE SIM</span>
                      </div>
                    ) : (
                      <span className="bg-surface-container-highest px-3 py-1 rounded-full font-label-caps text-[10px]">{s.category}</span>
                    )}
                  </div>
                  <h3 className="font-title-md text-title-md mb-2">{s.title}</h3>
                  <p className="font-body-md text-on-surface-variant mb-6 text-sm">{s.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {s.tags.map(tag => (
                      <span key={tag.label} className={`${tag.bg} ${tag.text} px-2 py-0.5 rounded-md font-label-caps text-[10px]`}>{tag.label}</span>
                    ))}
                  </div>
                  <button className={`w-full py-2 font-semibold rounded-xl transition-all ${activeScenario === s.id ? 'bg-primary text-white shadow-md' : 'bg-pearl border border-outline-variant text-primary group-hover:bg-primary group-hover:text-white'}`}>
                    {activeScenario === s.id ? 'Modify Settings' : 'Select Model'}
                  </button>
                </div>
              ))}
            </div>

            {/* Digital Twin Viewport */}
            <div className="glass-card rounded-[32px] overflow-hidden aspect-video relative group">
              <div className="absolute top-6 left-6 z-20 space-y-3">
                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>sensors</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-label-caps text-white/60">SIMULATION FIDELITY</span>
                    <span className="font-stats-numeric text-sm">94.2% ACCURACY</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfxXEYvzQiHtjIJL0mzAuAmryN5LTAb_NFL9wt8pbVwUPK_nw0a76Yo5WoIXRy25nwCZkx77zQXekN1_dpxo_qFgF16OlGmCaaXGcIwYKhrwKRXMWkj9uEpBFZiRNkTTQe4le6w6ajVR0oliguRmjDi_NsJsmmhrftPxUSfUbpIbwzPU6meYWkNJg9KwndO2l0wc85Mp7nfhzC-HzNJnA9qaR8ttCDaauJJF8RW8LErTGjRLjxaDZMkA"
                alt="Scenario simulation stadium"
              />
              <div className="absolute bottom-8 right-8 z-20 glass-card bg-black/40 border-white/10 p-4 rounded-2xl flex flex-col gap-2">
                <span className="text-[10px] font-label-caps text-white mb-1 uppercase tracking-tighter">Congestion Levels</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-12 rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-600" />
                  <span className="text-xs text-white/80 font-stats-numeric">LOW - CRITICAL</span>
                </div>
              </div>
              {/* Animated Pulse Point */}
              <div className="absolute top-1/2 left-1/3 w-8 h-8 bg-critical-red rounded-full animate-ping opacity-75 z-20" />
              <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-critical-red rounded-full z-20 shadow-lg shadow-critical-red/50" />
              <div className="absolute z-30 bg-white px-2 py-1 rounded-md shadow-xl" style={{ top: 'calc(50% - 40px)', left: 'calc(33% - 16px)' }}>
                <span className="text-[10px] font-bold text-critical-red font-stats-numeric">BOTTLENECK B-4</span>
              </div>
            </div>
          </div>

          {/* Right: Controls & AI Copilot */}
          <div className="col-span-12 lg:col-span-4 space-y-gutter">
            {/* Controls Card */}
            <div className="glass-card rounded-[32px] p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-lg text-headline-lg text-on-surface">Parameters</h3>
                <span className="material-symbols-outlined text-primary">tune</span>
              </div>
              <div className="space-y-6">
                {/* Crowd Size Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-body-md font-semibold">Crowd Size</label>
                    <span className="font-stats-numeric text-primary text-xl">{crowdSize.toLocaleString()}</span>
                  </div>
                  <input
                    type="range" min="0" max="100000" value={crowdSize}
                    onChange={(e) => setCrowdSize(Number(e.target.value))}
                    className="w-full h-1 rounded-full cursor-pointer accent-primary"
                    style={{ background: `linear-gradient(to right, #006b3f 0%, #006b3f ${(crowdSize / 100000) * 100}%, #e2e2e4 ${(crowdSize / 100000) * 100}%, #e2e2e4 100%)` }}
                  />
                  <div className="flex justify-between text-[10px] font-label-caps text-on-surface-variant">
                    <span>EMPTY</span><span>OVER CAPACITY</span>
                  </div>
                </div>

                {/* Ingress Intensity Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-body-md font-semibold">Ingress Intensity</label>
                    <span className="font-stats-numeric text-primary text-xl">{ingressIntensity}x</span>
                  </div>
                  <input
                    type="range" min="0.5" max="3" step="0.1" value={ingressIntensity}
                    onChange={(e) => setIngressIntensity(parseFloat(e.target.value))}
                    className="w-full h-1 rounded-full cursor-pointer accent-primary"
                    style={{ background: `linear-gradient(to right, #006b3f 0%, #006b3f ${((ingressIntensity - 0.5) / 2.5) * 100}%, #e2e2e4 ${((ingressIntensity - 0.5) / 2.5) * 100}%, #e2e2e4 100%)` }}
                  />
                  <div className="flex justify-between text-[10px] font-label-caps text-on-surface-variant">
                    <span>STAGGERED</span><span>SURGE</span>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-4 pt-4 border-t border-outline-variant/30">
                  {[
                    { label: 'Extra Security Staff', icon: 'shield_person', state: extraSecurity, toggle: () => setExtraSecurity(!extraSecurity) },
                    { label: 'Extended Shuttle Frequency', icon: 'shuffle_on', state: extendedShuttle, toggle: () => setExtendedShuttle(!extendedShuttle) },
                    { label: 'Limited Concession Operations', icon: 'fastfood', state: limitedConcession, toggle: () => setLimitedConcession(!limitedConcession) },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-on-surface-variant">{item.icon}</span>
                        <span className="font-body-md font-medium">{item.label}</span>
                      </div>
                      <button
                        onClick={item.toggle}
                        className={`w-12 h-6 rounded-full relative transition-all ${item.state ? 'bg-primary' : 'bg-surface-container-highest'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.state ? 'right-1' : 'left-1 bg-on-surface-variant/40'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full py-4 bg-primary text-on-primary font-bold rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-3">
                <span className="material-symbols-outlined">refresh</span>
                RECALCULATE PREDICTIONS
              </button>
            </div>

            {/* AI Copilot Insights */}
            <div className="glass-card rounded-[32px] p-6 bg-primary/5 border-primary/10 space-y-4 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-primary p-2 rounded-lg text-white">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                </div>
                <span className="font-label-caps text-primary tracking-widest text-[10px]">COPILOT INSIGHT</span>
              </div>
              <div className="space-y-3 relative z-10">
                <p className="font-body-md italic text-on-surface leading-relaxed">
                  "Increasing crowd size to <span className="font-bold text-primary">{crowdSize >= 82000 ? '82k' : Math.round(crowdSize / 1000) + 'k'}</span> during an <span className="font-bold text-primary">Early Capacity</span> surge will likely cause a <span className="text-critical-red font-bold">12-minute delay</span> at North Turnstiles. Suggest activating Queue Buffer A-3."
                </p>
                <div className="flex gap-2">
                  <button className="text-[10px] font-label-caps bg-white px-3 py-2 rounded-lg border border-primary/20 text-primary hover:bg-primary/10 transition-all">Apply Strategy</button>
                  <button className="text-[10px] font-label-caps bg-transparent px-3 py-2 rounded-lg text-on-surface-variant hover:underline transition-all">Explain logic</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forecast Metrics */}
        <section className="space-y-gutter pb-section-margin">
          <h2 className="font-title-md text-title-md text-primary flex items-center gap-2 uppercase tracking-widest px-1">
            <span className="w-8 h-[2px] bg-primary" />Forecast Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {forecastMetrics.map(metric => (
              <div key={metric.label} className="glass-card p-6 rounded-3xl flex flex-col justify-between h-40">
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span className="font-label-caps text-[10px]">{metric.label}</span>
                  <span className="material-symbols-outlined text-xl">{metric.icon}</span>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-stats-numeric text-on-surface">
                    {metric.value}{metric.unit && <span className="text-sm font-normal text-on-surface-variant ml-1">{metric.unit}</span>}
                  </div>
                  <div className={`text-xs ${metric.deltaColor} flex items-center gap-1`}>
                    {metric.deltaIcon && <span className="material-symbols-outlined text-xs">{metric.deltaIcon}</span>}
                    {metric.delta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
