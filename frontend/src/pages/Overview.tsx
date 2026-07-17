import React, { useEffect, useState } from 'react';
import { useTelemetry } from '../context/SocketContext';
import StadiumMap from '../components/DigitalTwin/StadiumMap';
import { motion, AnimatePresence } from 'framer-motion';

const phasesList = [
  { key: 'detection', label: 'Detect' },
  { key: 'prediction', label: 'Predict' },
  { key: 'playbook_generated', label: 'Playbook' },
  { key: 'operator_approval', label: 'Approve' },
  { key: 'execution', label: 'Execute' },
  { key: 'resolved', label: 'Resolved' },
];

const getScenarioDetails = (eventId: string) => {
  const lowercaseId = eventId.toLowerCase();
  
  if (lowercaseId.includes('metro-delay')) {
    return {
      impact: 'Crowd density risk Level 4 at East transit exit ramps within 8 minutes.',
      resolutionTime: '3 mins',
      resources: [
        '3 Transit Coordinators',
        '6 Transport Stewards',
        '3 Safety Officers',
        'Open Gate B & D',
        'Redirect Transit Flow'
      ],
      noAction: { safety: '70%', crowd: '4.5/m²', wait: '40m', risk: 'Critical', affected: '3,200' },
      withAI: { safety: '98%', crowd: '1.2/m²', wait: '3m', risk: 'Low', time: '3 mins' }
    };
  }
  
  if (lowercaseId.includes('gate-failure') || lowercaseId.includes('gate-c')) {
    return {
      impact: 'Inflow backlog wait time rising to 45 minutes; potential crowd crushing at outer barriers.',
      resolutionTime: '5 mins',
      resources: [
        '4 IT Support Technicians',
        '8 Crowd Marshals',
        '2 Medical First Responders',
        'Deploy 12 Backup Scanners'
      ],
      noAction: { safety: '65%', crowd: '5.2/m²', wait: '50m', risk: 'Critical', affected: '4,800' },
      withAI: { safety: '98%', crowd: '1.1/m²', wait: '4m', risk: 'Low', time: '5 mins' }
    };
  }
  
  if (lowercaseId.includes('medical-emergency') || lowercaseId.includes('medical')) {
    return {
      impact: 'Critical incident response time must stay below 4 minutes to ensure safety.',
      resolutionTime: '2 mins',
      resources: [
        '1 Emergency Medical Team',
        '3 Security Escorts',
        '1 Trauma Nurse',
        'Clear Med-Evac Route West'
      ],
      noAction: { safety: '75%', crowd: 'N/A', wait: '15m dispatch', risk: 'High', affected: '1' },
      withAI: { safety: '99%', crowd: 'N/A', wait: '2m dispatch', risk: 'Nominal', time: '2 mins' }
    };
  }
  
  if (lowercaseId.includes('heavy-rain') || lowercaseId.includes('weather') || lowercaseId.includes('parking')) {
    return {
      impact: 'Safety score drop to 80% due to slip hazards; entry bottlenecks at open gates.',
      resolutionTime: '4 mins',
      resources: [
        '4 Maintenance Crew (Mats)',
        '10 Concourse Volunteers',
        '2 Shuttle Route Adjusters',
        'Activate Dynamic Signage'
      ],
      noAction: { safety: '80%', crowd: '3.8/m²', wait: '25m', risk: 'Warning', affected: '8,500' },
      withAI: { safety: '96%', crowd: '1.5/m²', wait: '5m', risk: 'Low', time: '4 mins' }
    };
  }
  
  if (lowercaseId.includes('match-end') || lowercaseId.includes('gate-d')) {
    return {
      impact: 'Heavy transit congestion and wait times exceeding 45 minutes at Metro platforms.',
      resolutionTime: '6 mins',
      resources: [
        '15 General Stewards',
        '6 Police Officers',
        '4 Traffic Controllers',
        'Open All Exit Corridors'
      ],
      noAction: { safety: '70%', crowd: '4.8/m²', wait: '45m', risk: 'Warning', affected: '80,000' },
      withAI: { safety: '98%', crowd: '1.3/m²', wait: '6m', risk: 'Low', time: '6 mins' }
    };
  }

  return {
    impact: 'Minor localized delay and flow capacity drop.',
    resolutionTime: '3 mins',
    resources: [
      '5 Stewards',
      '2 Security Officers',
      'Activate Dynamic Signage'
    ],
    noAction: { safety: '78%', crowd: '3.5/m²', wait: '22m', risk: 'Warning', affected: '1,500' },
    withAI: { safety: '98%', crowd: '1.2/m²', wait: '3m', risk: 'Low', time: '3 mins' }
  };
};

export default function Overview() {
  const { state, analytics, events, timeline, isPlaying, setPlaying, scrubSim, executeStep } = useTelemetry();
  const [clock, setClock] = useState('');
  const [executingEventId, setExecutingEventId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isComplete, setIsComplete] = useState(false);

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

  // Find the first unresolved event to focus the copilot playbook on
  const activeEvent = events.find(e => !e.resolved) || null;

  // Reset execution status if the active event changes
  useEffect(() => {
    if (activeEvent?.id !== executingEventId) {
      setExecutingEventId(null);
      setCurrentStepIndex(-1);
      setIsComplete(false);
    }
  }, [activeEvent, executingEventId]);

  const handleAuthorize = async () => {
    if (!activeEvent) return;
    setExecutingEventId(activeEvent.id);
    setCurrentStepIndex(0);
    setIsComplete(false);

    const steps = activeEvent.playbook.steps;
    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i);
      await new Promise(resolve => setTimeout(resolve, 800));
      executeStep(activeEvent.id, steps[i].id);
    }
    setCurrentStepIndex(steps.length);
    setIsComplete(true);
  };

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
  const activeIncidentsCount = events.filter(e => !e.resolved).length;
  const aiConfidence = activeEvent ? `${activeEvent.probability}%` : '98.2%';
  const scenDetails = activeEvent ? getScenarioDetails(activeEvent.id) : null;

  return (
    <div className="p-container-padding pb-16 min-h-screen select-none">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-1">STADIUM COMMAND CENTER</p>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">ArenaFlow Dashboard</h1>
        </div>
        <div className="glass-card px-6 py-3 rounded-xl flex items-center gap-3">
          <span className="font-label-caps text-label-caps text-on-surface-variant">LOCAL TIME</span>
          <span className="font-stats-numeric text-stats-numeric text-on-surface">{clock}</span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-8">
        {/* Safety Score Card */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border-l-4 border-primary">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">SAFETY SCORE</p>
            <h2 className="font-stats-numeric text-4xl font-bold text-primary">{safetyScore}%</h2>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden mt-4">
            <div className="bg-primary h-full transition-all duration-500" style={{ width: `${safetyScore}%` }} />
          </div>
        </div>

        {/* Active Incidents Card */}
        <div className={`glass-card rounded-2xl p-6 flex flex-col justify-between border-l-4 ${activeIncidentsCount > 0 ? 'border-critical-red animate-pulse' : 'border-primary'}`}>
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">ACTIVE INCIDENTS</p>
            <h2 className="font-stats-numeric text-4xl font-bold text-on-surface">{activeIncidentsCount}</h2>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-4 font-label-caps">
            {activeIncidentsCount > 0 ? 'MITIGATION REQUIRED' : 'STADIUM NORMAL'}
          </p>
        </div>

        {/* Crowd Density Card */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border-l-4 border-primary">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">CROWD DENSITY</p>
            <div className="flex items-baseline gap-2">
              <h2 className="font-stats-numeric text-4xl font-bold text-on-surface">{totalOccupancy.toLocaleString()}</h2>
              <span className="text-on-surface-variant/60 font-body-md text-body-md">/ 85k</span>
            </div>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden mt-4">
            <div className="bg-primary h-full transition-all duration-500" style={{ width: `${Math.min((totalOccupancy / 85000) * 100, 100)}%` }} />
          </div>
        </div>

        {/* AI Confidence Card */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border-l-4 border-primary">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">AI CONFIDENCE</p>
            <h2 className="font-stats-numeric text-4xl font-bold text-on-surface">{aiConfidence}</h2>
          </div>
          <p className="text-[11px] text-primary mt-4 font-label-caps">ACTIVE ORCHESTRATOR LINK</p>
        </div>
      </div>

      {/* Main Grid: Digital Twin (8-col) + AI Copilot (4-col) */}
      <div className="grid grid-cols-12 gap-gutter mb-8">
        
        {/* Stadium Digital Twin (8 cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="glass-card rounded-[32px] overflow-hidden relative border border-white/50 h-[500px]">
            {/* Stadium Map */}
            <div className="absolute inset-0 z-0">
              <div className="w-full h-full flex items-center justify-center bg-surface-container-low">
                <StadiumMap />
              </div>
            </div>
          </div>

          {/* Integrated Simulation Scrub Console */}
          <div className="glass-card p-6 rounded-2xl flex items-center gap-6 shadow-sm border border-white/40">
            <button
              onClick={() => setPlaying(!isPlaying)}
              aria-label="Simulation playback play pause toggle button"
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-950 hover:bg-slate-800 text-white transition shadow-sm shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {isPlaying ? (
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
              ) : (
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              )}
            </button>

            <div className="flex-grow flex items-center space-x-4">
              <span className="text-[10px] font-bold font-mono tracking-widest text-slate-400 uppercase">00m</span>
              <div className="flex-grow relative flex flex-col justify-center">
                <input
                  type="range"
                  min="0"
                  max="95"
                  value={state.elapsedMinutes}
                  aria-label="Simulation match minute timeline scrub slider"
                  onChange={(e) => scrubSim(Number(e.target.value))}
                  className="w-full h-1 bg-slate-100 rounded-full appearance-none cursor-pointer accent-slate-900 hover:accent-slate-800"
                  style={{
                    background: `linear-gradient(to right, #006b3f 0%, #006b3f ${(state.elapsedMinutes / 95) * 100}%, #eeeef0 ${(state.elapsedMinutes / 95) * 100}%, #eeeef0 100%)`
                  }}
                />
                <div className="flex justify-between px-0.5 text-[8px] font-bold font-mono text-slate-400 mt-2">
                  <span>Start</span>
                  <span>Halftime (45m)</span>
                  <span>Fulltime (90m)</span>
                  <span>Complete (95m)</span>
                </div>
              </div>
              <span className="text-[10px] font-bold font-mono tracking-widest text-slate-400 uppercase">95m</span>
              <span className="font-stats-numeric text-primary text-sm shrink-0">{state.elapsedMinutes}m</span>
            </div>
          </div>
        </div>

        {/* AI Copilot Playbook (4 cols) */}
        <div className="col-span-12 lg:col-span-4 flex">
          <div className="glass-card rounded-[32px] p-6 w-full flex flex-col h-[580px] justify-between overflow-y-auto scrollbar-thin">
            <div>
              <div className="flex items-center gap-3 mb-6 border-b border-outline/10 pb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                </div>
                <div>
                  <h3 className="font-title-md text-title-md font-bold text-on-surface">AI Copilot</h3>
                  <p className="text-[10px] text-primary font-medium uppercase font-mono tracking-wider">Predictive Operations</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {activeEvent && scenDetails ? (
                  <motion.div
                    key="active-playbook"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-5"
                  >
                    {/* Anomaly & Metadata */}
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">
                        AI Prediction Anomaly
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {activeEvent.title}
                      </h4>
                    </div>

                    {/* AI Decision Timeline */}
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">AI Decision Stages</span>
                      <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-outline/10 text-[9px] font-mono font-bold uppercase tracking-wider">
                        {phasesList.map((phase, idx) => {
                          const isCurrent = activeEvent.currentPhase === phase.key;
                          const currentIdx = phasesList.findIndex(p => p.key === activeEvent.currentPhase);
                          const isPast = idx < currentIdx;
                          return (
                            <React.Fragment key={phase.key}>
                              <span className={`${isCurrent ? 'text-primary' : isPast ? 'text-slate-400' : 'text-slate-300'}`}>
                                {phase.label}
                              </span>
                              {idx < phasesList.length - 1 && <span className="text-slate-200">→</span>}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>

                    {/* Problem details */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-outline/10 text-xs">
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-0.5">Problem</span>
                        <span className="font-semibold text-slate-800">{activeEvent.title}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-0.5">Confidence</span>
                        <span className="font-stats-numeric text-primary font-bold">{activeEvent.probability}%</span>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">Why (Reason)</span>
                      <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-outline/10">"{activeEvent.reasoning}"</p>
                    </div>

                    {/* Resource Recommendation */}
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Recommended Resources</span>
                      <div className="bg-slate-50 border border-outline/10 p-3.5 rounded-xl space-y-2">
                        <div className="flex flex-wrap gap-1.5">
                          {scenDetails.resources.map((res, i) => (
                            <span key={i} className="px-2.5 py-1 bg-white border border-outline/10 text-[9px] font-bold font-mono uppercase tracking-wider rounded-lg text-slate-700 shadow-sm">
                              • {res}
                            </span>
                          ))}
                        </div>
                        <div className="border-t border-outline/10 pt-2 flex justify-between text-[9px] font-mono font-bold text-slate-400">
                          <span>DEPLOYMENT ETA</span>
                          <span className="text-primary">{scenDetails.resolutionTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Playbook step checklist */}
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Playbook Steps</span>
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {activeEvent.playbook.steps.map((step, idx) => {
                          const isExecuted = step.status === 'completed';
                          const isExecuting = executingEventId === activeEvent.id && idx === currentStepIndex;
                          return (
                            <div key={step.id} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-outline/10 shadow-sm">
                              <span className={`material-symbols-outlined text-sm ${isExecuted ? 'text-primary font-bold' : isExecuting ? 'text-warning-amber animate-spin' : 'text-on-surface-variant/40'}`}>
                                  {isExecuted ? 'check_circle' : isExecuting ? 'sync' : 'radio_button_unchecked'}
                              </span>
                              <span className={`text-[11px] font-medium leading-tight ${isExecuted ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                                {step.action}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="nominal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-16 text-center space-y-4"
                  >
                    <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">System Nominal</p>
                      <p className="text-xs text-slate-400 mt-1">Monitoring Stadium Operations</p>
                      <p className="text-xs text-slate-500 mt-1">All systems operating normally.</p>
                      <p className="text-[10px] text-primary font-mono uppercase tracking-wider mt-4">Telemetry link: GREEN</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Deployment Button */}
            {activeEvent && (
              <div className="pt-4 border-t border-outline/10 mt-4">
                {executingEventId === activeEvent.id ? (
                  <div className="text-center py-3.5 bg-surface-container-low border border-outline/10 rounded-xl font-label-caps text-xs text-primary font-bold shadow-sm">
                    {isComplete ? '✓ PLAYBOOK DEPLOYED' : 'EXECUTING PLAYBOOK...'}
                  </div>
                ) : (
                  <button
                    onClick={handleAuthorize}
                    className="w-full py-3.5 bg-primary text-white font-bold rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    Approve & Deploy Playbook
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Grid: Timeline (8-col) + Impact Forecast (4-col) */}
      <div className="grid grid-cols-12 gap-gutter">
        
        {/* Timeline / Live Event Feed (8 cols) */}
        <div className="col-span-12 lg:col-span-8 glass-card rounded-[32px] p-8 border border-white/40 shadow-sm flex flex-col h-[340px]">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-outline/10">
            <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">Chronological Timeline & Live Event Feed</h3>
            <span className="font-stats-numeric text-primary bg-primary/5 px-3 py-1 rounded-lg text-sm">Active Feed</span>
          </div>

          <div className="flex-grow overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {timeline.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-4 bg-surface-container-low rounded-xl border border-outline/5 hover:bg-white transition-all shadow-sm">
                <div className={`p-2 rounded-lg text-white shrink-0 ${item.severity === 'critical' ? 'bg-critical-red' : item.severity === 'warning' ? 'bg-warning-amber' : 'bg-primary'}`}>
                  <span className="material-symbols-outlined text-sm">
                    {item.severity === 'critical' ? 'warning' : item.severity === 'warning' ? 'emergency' : 'info'}
                  </span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-title-md text-sm font-bold text-on-surface">{item.title}</h4>
                    <span className="font-stats-numeric text-xs text-on-surface-variant font-semibold">{item.timestamp}</span>
                  </div>
                  {item.zoneId && (
                    <span className="block text-[9px] font-mono text-primary font-bold uppercase tracking-wider mb-1">
                      ZONE: {item.zoneId.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {timeline.length === 0 && (
              <div className="py-12 text-center text-on-surface-variant font-label-caps text-label-caps">
                No timeline items logged. Stadium nominal.
              </div>
            )}
          </div>
        </div>

        {/* Impact Forecast Comparison (4 cols) */}
        <div className="col-span-12 lg:col-span-4 flex">
          <div className="glass-card rounded-[32px] p-6 w-full flex flex-col justify-between h-[340px] relative overflow-hidden">
            <div>
              <div className="flex items-center gap-3 mb-4 pb-2 border-b border-outline/10">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
                <h3 className="font-title-md text-sm font-bold text-on-surface">AI Impact Forecast</h3>
              </div>

              {activeEvent && scenDetails ? (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {/* If No Action Is Taken */}
                  <div className="bg-rose-50/20 border border-rose-200/50 p-3 rounded-2xl flex flex-col justify-between">
                    <span className="block text-[8px] font-bold text-critical-red uppercase tracking-wider font-mono mb-2">No Action Taken</span>
                    <div className="space-y-1.5 text-[10px] text-slate-700">
                      <div className="flex justify-between">
                        <span>Safety Score:</span>
                        <span className="font-bold text-critical-red">↓ {scenDetails.noAction.safety}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wait Time:</span>
                        <span className="font-bold text-critical-red">↑ {scenDetails.noAction.wait}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Crowd:</span>
                        <span className="font-bold text-critical-red">↑ {scenDetails.noAction.crowd}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Risk level:</span>
                        <span className="font-bold text-critical-red">↑ {scenDetails.noAction.risk}</span>
                      </div>
                    </div>
                    <div className="border-t border-rose-100/50 pt-2 mt-2 text-[9px] font-mono text-slate-400 font-bold">
                      AFFECTED: {scenDetails.noAction.affected}
                    </div>
                  </div>

                  {/* With ArenaFlow AI */}
                  <motion.div 
                    animate={isComplete ? { scale: [1, 1.03, 1], backgroundColor: 'rgba(236, 253, 245, 0.40)', borderColor: 'rgba(52, 211, 153, 0.6)' } : {}}
                    transition={{ duration: 0.5 }}
                    className="bg-emerald-50/10 border border-emerald-200/30 p-3 rounded-2xl flex flex-col justify-between"
                  >
                    <span className="block text-[8px] font-bold text-emerald-600 uppercase tracking-wider font-mono mb-2">ArenaFlow AI</span>
                    <div className="space-y-1.5 text-[10px] text-slate-700">
                      <div className="flex justify-between">
                        <span>Safety Score:</span>
                        <span className="font-bold text-emerald-600">↑ {scenDetails.withAI.safety}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wait Time:</span>
                        <span className="font-bold text-emerald-600">↓ {scenDetails.withAI.wait}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Crowd:</span>
                        <span className="font-bold text-emerald-600">↓ {scenDetails.withAI.crowd}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Risk status:</span>
                        <span className="font-bold text-emerald-600">Reduced</span>
                      </div>
                    </div>
                    <div className="border-t border-emerald-100/50 pt-2 mt-2 text-[9px] font-mono text-slate-400 font-bold">
                      RESOLVED: {scenDetails.withAI.time}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                  <span className="material-symbols-outlined text-primary text-3xl opacity-50">check_circle</span>
                  <p className="text-xs text-on-surface-variant font-medium">Telemetry parameters nominal.</p>
                  <p className="text-[10px] text-slate-400 font-mono">No active impact forecast required.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
