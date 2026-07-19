import React, { useEffect, useState } from 'react';
import { useTelemetry } from '../context/SocketContext';
import StadiumMap from '../components/DigitalTwin/StadiumMap';
import { motion, AnimatePresence } from 'framer-motion';
import { useClock } from '../hooks/useClock';
import { useConnectionStatus } from '../hooks/useConnectionStatus';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { usePlaybookExecution } from '../hooks/usePlaybookExecution';
import { formatLocalClock, formatNumber } from '../utils/format';

/* ── Phase definitions — preserved from original ───────── */
const phasesList = [
  { key: 'detection',          label: 'Detect'   },
  { key: 'prediction',         label: 'Predict'  },
  { key: 'playbook_generated', label: 'Playbook' },
  { key: 'operator_approval',  label: 'Approve'  },
  { key: 'execution',          label: 'Execute'  },
  { key: 'resolved',           label: 'Resolved' },
];

/* ── Scenario details lookup — preserved exactly ───────── */
const getScenarioDetails = (eventId: string) => {
  const lowercaseId = eventId.toLowerCase();
  if (lowercaseId.includes('metro-delay')) {
    return {
      impact: 'CROWD DENSITY risk Level 4 at East transit exit ramps within 8 minutes.',
      resolutionTime: '3 mins',
      resources: ['3 Transit Coordinators', '6 Transport Stewards', '3 Safety Officers', 'Open Gate B & D', 'Redirect Transit Flow'],
      noAction: { safety: '70%', crowd: '4.5/m²', wait: '40m', risk: 'Critical', affected: '3,200' },
      withAI:   { safety: '98%', crowd: '1.2/m²', wait: '3m',  risk: 'Low',      time: '3 mins' },
    };
  }
  if (lowercaseId.includes('gate-failure') || lowercaseId.includes('gate-c')) {
    return {
      impact: 'Inflow backlog wait time rising to 45 minutes; potential crowd crushing at outer barriers.',
      resolutionTime: '5 mins',
      resources: ['4 IT Support Technicians', '8 Crowd Marshals', '2 Medical First Responders', 'Deploy 12 Backup Scanners'],
      noAction: { safety: '65%', crowd: '5.2/m²', wait: '50m', risk: 'Critical', affected: '4,800' },
      withAI:   { safety: '98%', crowd: '1.1/m²', wait: '4m',  risk: 'Low',      time: '5 mins' },
    };
  }
  if (lowercaseId.includes('medical-emergency') || lowercaseId.includes('medical')) {
    return {
      impact: 'Critical incident response time must stay below 4 minutes to ensure safety.',
      resolutionTime: '2 mins',
      resources: ['1 Emergency Medical Team', '3 Security Escorts', '1 Trauma Nurse', 'Clear Med-Evac Route West'],
      noAction: { safety: '75%', crowd: 'N/A', wait: '15m dispatch', risk: 'High',    affected: '1' },
      withAI:   { safety: '99%', crowd: 'N/A', wait: '2m dispatch',  risk: 'Nominal', time: '2 mins' },
    };
  }
  if (lowercaseId.includes('heavy-rain') || lowercaseId.includes('weather') || lowercaseId.includes('parking')) {
    return {
      impact: 'SAFETY SCORE drop to 80% due to slip hazards; entry bottlenecks at open gates.',
      resolutionTime: '4 mins',
      resources: ['4 Maintenance Crew (Mats)', '10 Concourse Volunteers', '2 Shuttle Route Adjusters', 'Activate Dynamic Signage'],
      noAction: { safety: '80%', crowd: '3.8/m²', wait: '25m', risk: 'Warning', affected: '8,500' },
      withAI:   { safety: '96%', crowd: '1.5/m²', wait: '5m',  risk: 'Low',     time: '4 mins' },
    };
  }
  if (lowercaseId.includes('match-end') || lowercaseId.includes('gate-d')) {
    return {
      impact: 'Heavy transit congestion and wait times exceeding 45 minutes at Metro platforms.',
      resolutionTime: '6 mins',
      resources: ['15 General Stewards', '6 Police Officers', '4 Traffic Controllers', 'Open All Exit Corridors'],
      noAction: { safety: '70%', crowd: '4.8/m²', wait: '45m', risk: 'Warning', affected: '80,000' },
      withAI:   { safety: '98%', crowd: '1.3/m²', wait: '6m',  risk: 'Low',     time: '6 mins' },
    };
  }
  return {
    impact: 'Minor localized delay and flow capacity drop.',
    resolutionTime: '3 mins',
    resources: ['5 Stewards', '2 Security Officers', 'Activate Dynamic Signage'],
    noAction: { safety: '78%', crowd: '3.5/m²', wait: '22m', risk: 'Warning', affected: '1,500' },
    withAI:   { safety: '98%', crowd: '1.2/m²', wait: '3m',  risk: 'Low',     time: '3 mins' },
  };
};

/* ── Arc Gauge — preserved logic, dark styling ─────────── */
function ArcGauge({ value, size = 80, strokeWidth = 6, color = '#00D46A' }: {
  value: number; size?: number; strokeWidth?: number; color?: string;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * value) / 100;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} fill="none" />
      <circle
        cx={size/2} cy={size/2} r={r}
        stroke={color} strokeWidth={strokeWidth} fill="none"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.25,0.46,0.45,0.94)' }}
      />
    </svg>
  );
}

/* ── KPI Card ─────────────────────────────────────────── */
function KPICard({
  label,
  value,
  unit,
  color,
  children,
  pulse,
  sub,
}: {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  children?: React.ReactNode;
  pulse?: boolean;
  sub?: string;
}) {
  return (
    <div
      className={`glass-card card-hover rounded-2xl p-5 flex flex-col gap-2 ${pulse ? 'pulse-red' : ''}`}
      style={{
        borderColor: pulse ? 'rgba(255,68,68,0.20)' : undefined,
      }}
    >
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.30)' }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
        {children}
        <span style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 900, fontSize: '40px', letterSpacing: '-0.04em', lineHeight: 1.0, color: color || '#F0F0EE' }}>
          {value}
        </span>
        {unit && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginBottom: '6px' }}>{unit}</span>}
      </div>
      {sub && (
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: color ? `${color}99` : 'rgba(255,255,255,0.25)' }}>
          {sub}
        </span>
      )}
    </div>
  );
}

/* ── Main Overview Component ──────────────────────────── */
export default function Overview() {
  const { timeline, scrubSim, setPlaying } = useTelemetry();
  
  const now = useClock();
  const clock = formatLocalClock(now);
  const { hasError, socketUrl } = useConnectionStatus();
  
  const {
    state,
    analytics,
    events,
    activeEvent,
    isPlaying,
    totalOccupancy,
    capacityPct,
    safetyScore,
    safetyColor,
    activeIncidentsCount,
    aiConfidence
  } = useDashboardMetrics();

  const {
    executingEventId,
    currentStepIndex,
    isComplete,
    handleAuthorize
  } = usePlaybookExecution(activeEvent);

  /* ── Error state ─────────────────────────────────────── */
  if (hasError && (!state || !analytics)) {
    return (
      <div style={{ height: 'calc(100vh - 48px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          className="glass-card"
          style={{ maxWidth: '400px', width: '100%', padding: '48px 40px', borderRadius: '24px', textAlign: 'center' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#FF4444', display: 'block', marginBottom: '16px' }}>cloud_off</span>
          <h3 style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: '18px', color: '#F0F0EE', marginBottom: '10px' }}>Telemetry Backend Offline</h3>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>
            The live stadium telemetry server is currently unreachable. Make sure the backend service is running at:
          </p>
          <code style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '10px 14px', marginTop: '14px', wordBreak: 'break-all' }}>
            {socketUrl}
          </code>
        </div>
      </div>
    );
  }

  /* ── Loading state ────────────────────────────────────── */
  if (!state || !analytics) {
    return (
      <div style={{ height: 'calc(100vh - 48px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '32px', height: '32px', border: '2px solid #00D46A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 600, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>Connecting Telemetry...</p>
        </div>
      </div>
    );
  }

  /* ── Computed values — preserved exactly ─────────────── */
  const scenDetails = activeEvent ? getScenarioDetails(activeEvent.id) : null;

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 48px)',
        background: '#080C0A',
        padding: '32px 32px 56px',
      }}
    >

      {/* ── Page Header ─────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <span className="section-eyebrow" style={{ display: 'block', marginBottom: '8px' }}>Stadium Command Center</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <h1 style={{
              fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(28px, 3vw, 44px)',
              letterSpacing: '-0.04em',
              color: '#F0F0EE',
              lineHeight: 1.0,
            }}>
              ArenaFlow Dashboard
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'rgba(0,212,106,0.08)', border: '1px solid rgba(0,212,106,0.15)', borderRadius: '9999px' }}>
              <span className="w-1.5 h-1.5 rounded-full pulse-live" style={{ background: '#00D46A' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#00D46A', letterSpacing: '0.10em', textTransform: 'uppercase' }}>LIVE</span>
            </div>
          </div>
        </div>

        {/* Clock */}
        <div className="glass-card" style={{ padding: '12px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.25)' }}>schedule</span>
          <div>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>Local Time</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '20px', fontWeight: 700, color: '#F0F0EE', letterSpacing: '0.02em', lineHeight: 1.2 }}>{clock}</p>
          </div>
        </div>
      </div>

      {/* ── KPI Row ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>

        {/* SAFETY SCORE */}
        <div className="glass-card rounded-2xl p-5" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <ArcGauge value={safetyScore} size={68} strokeWidth={5} color={safetyColor} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 700, color: safetyColor }}>{safetyScore}</span>
            </div>
          </div>
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', display: 'block', marginBottom: '4px' }}>SAFETY SCORE</span>
            <span style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 900, fontSize: '36px', letterSpacing: '-0.04em', lineHeight: 1.0, color: safetyColor }}>{safetyScore}%</span>
          </div>
        </div>

        {/* ACTIVE INCIDENTS */}
        <KPICard
          label="ACTIVE INCIDENTS"
          value={activeIncidentsCount}
          color={activeIncidentsCount > 0 ? '#FF4444' : '#F0F0EE'}
          pulse={activeIncidentsCount > 0}
          sub={activeIncidentsCount > 0 ? 'Mitigation Required' : 'Stadium Normal'}
        />

        {/* CROWD DENSITY */}
        <div className="glass-card rounded-2xl p-5">
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', display: 'block', marginBottom: '8px' }}>CROWD DENSITY</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '10px' }}>
            <span style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 900, fontSize: '32px', letterSpacing: '-0.04em', lineHeight: 1.0, color: '#F0F0EE' }}>{totalOccupancy.toLocaleString()}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>/ 85k</span>
          </div>
          <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${capacityPct}%`, background: '#00D46A', borderRadius: '9999px', transition: 'width 700ms cubic-bezier(0.25,0.46,0.45,0.94)' }} />
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.25)', marginTop: '6px', display: 'block' }}>{capacityPct}% capacity</span>
        </div>

        {/* AI CONFIDENCE */}
        <KPICard
          label="AI CONFIDENCE"
          value={aiConfidence}
          color="#F5C842"
          sub="Active Orchestrator"
        />
      </div>

      {/* ── Main Grid: Digital Twin (8-col) + AI Copilot (4-col) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>

        {/* Stadium Map — 2/3 width */}
        <div
          style={{
            gridColumn: 'span 2',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Stadium Map Card */}
          <div
            className="glass-card"
            style={{
              height: '480px',
              borderRadius: '20px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Header overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 20,
                padding: '16px 20px',
                background: 'linear-gradient(to bottom, rgba(8,12,10,0.90) 0%, rgba(8,12,10,0) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="w-1.5 h-1.5 rounded-full pulse-live" style={{ background: '#00D46A' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' }}>
                  Digital Twin · Al Bayt Stadium
                </span>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.20)', letterSpacing: '0.08em' }}>FIFA 2026</span>
            </div>

            {/* Map */}
            <div style={{ position: 'absolute', inset: 0, background: '#0A120E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <StadiumMap />
            </div>
          </div>

          {/* Simulation Console — dark terminal strip */}
          <div
            style={{
              background: '#050805',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '14px',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <button
              onClick={() => setPlaying(!isPlaying)}
              aria-label="Simulation playback toggle"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                border: 'none',
                background: isPlaying ? '#00D46A' : 'rgba(255,255,255,0.08)',
                color: isPlaying ? '#080C0A' : '#F0F0EE',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 200ms',
                flexShrink: 0,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>

            <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>00m</span>
              <div style={{ flexGrow: 1, position: 'relative' }}>
                <input
                  type="range"
                  min="0"
                  max="95"
                  value={state.elapsedMinutes}
                  aria-label="Simulation match minute timeline scrub slider"
                  onChange={e => scrubSim(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '3px',
                    borderRadius: '9999px',
                    background: `linear-gradient(to right, #00D46A 0%, #00D46A ${(state.elapsedMinutes / 95) * 100}%, rgba(255,255,255,0.08) ${(state.elapsedMinutes / 95) * 100}%, rgba(255,255,255,0.08) 100%)`,
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                  {['Kick-off', '45m HT', '90m FT', '95m'].map(label => (
                    <span key={label} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 600, color: 'rgba(255,255,255,0.20)', letterSpacing: '0.06em' }}>{label}</span>
                  ))}
                </div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>95m</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '16px', fontWeight: 700, color: '#00D46A', letterSpacing: '0.02em', minWidth: '36px' }}>{state.elapsedMinutes}m</span>
            </div>
          </div>
        </div>

        {/* AI Copilot — THE signature component */}
        <div
          className="glass-card glass-dark"
          style={{
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: '508px',
          }}
        >
          {/* Copilot Header */}
          <div
            style={{
              padding: '20px 20px 16px',
              borderBottom: '1px solid rgba(0,212,106,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #006B3F 0%, #00D46A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 0 20px rgba(0,212,106,0.30)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#080C0A', fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 800, fontSize: '16px', color: '#F0F0EE', letterSpacing: '-0.02em', lineHeight: 1.1 }}>AI Copilot</h3>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: '#00D46A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Predictive Operations</p>
            </div>
          </div>

          {/* Copilot Body */}
          <div className="flex-grow overflow-y-auto scrollbar-thin" style={{ padding: '16px 20px' }}>
            <AnimatePresence mode="wait">
              {activeEvent && scenDetails ? (
                <motion.div
                  key="active-playbook"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  {/* Anomaly header */}
                  <div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                      AI Prediction Anomaly
                    </span>
                    <h4 style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: '15px', color: '#F0F0EE', letterSpacing: '-0.015em', lineHeight: 1.3 }}>
                      {activeEvent.title}
                    </h4>
                  </div>

                  {/* Phase stepper — horizontal */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {phasesList.map((phase, idx) => {
                      const currentIdx = phasesList.findIndex(p => p.key === activeEvent.currentPhase);
                      const isCurrent = idx === currentIdx;
                      const isPast = idx < currentIdx;
                      return (
                        <React.Fragment key={phase.key}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <div
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                background: isCurrent ? '#00D46A' : isPast ? 'rgba(0,212,106,0.20)' : 'rgba(255,255,255,0.06)',
                                border: isCurrent ? '2px solid #00D46A' : 'none',
                                boxShadow: isCurrent ? '0 0 10px rgba(0,212,106,0.40)' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {isPast && <span className="material-symbols-outlined" style={{ fontSize: '10px', color: '#00D46A', fontVariationSettings: "'FILL' 1" }}>check</span>}
                              {isCurrent && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#080C0A' }} />}
                            </div>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '6px', fontWeight: 700, color: isCurrent ? '#00D46A' : isPast ? 'rgba(0,212,106,0.50)' : 'rgba(255,255,255,0.15)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                              {phase.label}
                            </span>
                          </div>
                          {idx < phasesList.length - 1 && (
                            <div style={{ flexGrow: 1, height: '1px', background: idx < phasesList.findIndex(p => p.key === activeEvent.currentPhase) ? 'rgba(0,212,106,0.25)' : 'rgba(255,255,255,0.05)', marginBottom: '14px' }} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Confidence + Safety Delta */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px' }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.10em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Confidence</span>
                      <span style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 900, fontSize: '24px', color: '#F5C842', letterSpacing: '-0.03em' }}>{activeEvent.probability}%</span>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px' }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.10em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Safety Delta</span>
                      <span style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 900, fontSize: '24px', color: '#FF4444', letterSpacing: '-0.03em' }}>
                        ↓ {100 - parseInt(scenDetails.noAction.safety)}pts
                      </span>
                    </div>
                  </div>

                  {/* AI Reasoning */}
                  <div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>AI Reasoning</span>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', lineHeight: 1.65, color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      "{activeEvent.reasoning}"
                    </p>
                  </div>

                  {/* Resources */}
                  <div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Recommended Resources</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                      {scenDetails.resources.map((res, i) => (
                        <span key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 600, color: '#00D46A', background: 'rgba(0,212,106,0.08)', border: '1px solid rgba(0,212,106,0.15)', borderRadius: '9999px', padding: '3px 10px', letterSpacing: '0.04em' }}>
                          {res}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Deployment ETA</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#00D46A', letterSpacing: '0.06em' }}>{scenDetails.resolutionTime}</span>
                    </div>
                  </div>

                  {/* Playbook Steps */}
                  <div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Playbook Steps</span>
                    <div className="space-y-2 scrollbar-none" style={{ maxHeight: '140px', overflowY: 'auto' }}>
                      {activeEvent.playbook.steps.map((step, idx) => {
                        const isExecuted = step.status === 'completed';
                        const isExecuting = executingEventId === activeEvent.id && idx === currentStepIndex;
                        return (
                          <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                            <span
                              className={`material-symbols-outlined ${isExecuting ? 'animate-spin' : ''} ${isExecuted ? 'animate-check-in' : ''}`}
                              style={{ fontSize: '14px', color: isExecuted ? '#00D46A' : isExecuting ? '#F5C842' : 'rgba(255,255,255,0.15)', flexShrink: 0, fontVariationSettings: "'FILL' 1" }}
                            >
                              {isExecuted ? 'check_circle' : isExecuting ? 'sync' : 'radio_button_unchecked'}
                            </span>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 500, color: isExecuted ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.75)', textDecoration: isExecuted ? 'line-through' : 'none', lineHeight: 1.4 }}>
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
                  transition={{ duration: 0.25 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', textAlign: 'center', gap: '16px' }}
                >
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,212,106,0.08)', border: '1px solid rgba(0,212,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#00D46A', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: '15px', color: '#F0F0EE', marginBottom: '6px' }}>System Nominal</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>Monitoring stadium operations.<br />No active incidents detected.</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#00D46A', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '16px' }}>Telemetry Link: GREEN</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Deploy Button */}
          {activeEvent && (
            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(0,212,106,0.08)' }}>
              {executingEventId === activeEvent.id ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(0,212,106,0.08)',
                    border: '1px solid rgba(0,212,106,0.15)',
                  }}
                >
                  {!isComplete && <div style={{ width: '12px', height: '12px', border: '2px solid #00D46A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
                  {isComplete && <span className="material-symbols-outlined animate-check-in" style={{ fontSize: '16px', color: '#00D46A', fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: '#00D46A', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                    {isComplete ? 'Playbook Deployed' : 'Executing Playbook...'}
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleAuthorize}
                  className="w-full glow-pulse"
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #006B3F 0%, #00D46A 100%)',
                    color: '#080C0A',
                    cursor: 'pointer',
                    fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif",
                    fontWeight: 800,
                    fontSize: '13px',
                    letterSpacing: '-0.01em',
                    transition: 'all 200ms',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.10)'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)'}
                >
                  Approve & Deploy Playbook →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Grid: Timeline + Impact Forecast ────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>

        {/* Timeline — 2/3 */}
        <div
          className="glass-card"
          style={{ gridColumn: 'span 2', borderRadius: '20px', padding: '20px', height: '320px', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="w-1.5 h-1.5 rounded-full pulse-live" style={{ background: '#00D46A' }} />
              <h3 style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: '15px', color: '#F0F0EE', letterSpacing: '-0.015em' }}>Live Event Feed</h3>
            </div>
            <span className="pill-badge pill-badge-green">Active Feed</span>
          </div>

          <div className="flex-grow overflow-y-auto scrollbar-thin" style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '4px' }}>
            {timeline.map((item, idx) => (
              <motion.div
                key={`${item.id}-${idx}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  cursor: 'default',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '7px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: item.severity === 'critical' ? 'rgba(255,68,68,0.10)' : item.severity === 'warning' ? 'rgba(255,184,0,0.10)' : 'rgba(0,212,106,0.08)',
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '13px', fontVariationSettings: "'FILL' 1", color: item.severity === 'critical' ? '#FF4444' : item.severity === 'warning' ? '#FFB800' : '#00D46A' }}
                  >
                    {item.severity === 'critical' ? 'warning' : item.severity === 'warning' ? 'emergency' : 'info'}
                  </span>
                </div>
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: '12px', color: '#F0F0EE', lineHeight: 1.3 }}>{item.title}</h4>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 500, color: 'rgba(255,255,255,0.25)', flexShrink: 0, marginLeft: '8px' }}>{item.timestamp}</span>
                  </div>
                  {item.zoneId && (
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#00D46A', letterSpacing: '0.08em', textTransform: 'uppercase' as const, display: 'block', marginTop: '2px' }}>
                      Zone: {item.zoneId.toUpperCase()}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
            {timeline.length === 0 && (
              <div style={{ paddingTop: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.20)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px', display: 'block', marginBottom: '8px', opacity: 0.4 }}>feed</span>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase' }}>No events logged · Stadium nominal</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Impact Forecast — 1/3 */}
        <div
          className="glass-card"
          style={{ borderRadius: '20px', padding: '20px', height: '320px', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#F5C842', fontVariationSettings: "'FILL' 1" }}>monitoring</span>
            <h3 style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: '14px', color: '#F0F0EE', letterSpacing: '-0.015em' }}>AI Impact Forecast</h3>
          </div>

          {activeEvent && scenDetails ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', flexGrow: 1 }}>
              {/* Without AI */}
              <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,68,68,0.04)', border: '1px solid rgba(255,68,68,0.12)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: '#FF4444', letterSpacing: '0.10em', textTransform: 'uppercase' }}>Without AI</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
                  {[
                    { label: 'Safety', value: `↓ ${scenDetails.noAction.safety}` },
                    { label: 'Wait',   value: `↑ ${scenDetails.noAction.wait}` },
                    { label: 'Crowd',  value: `↑ ${scenDetails.noAction.crowd}` },
                    { label: 'Risk',   value: scenDetails.noAction.risk },
                  ].map(m => (
                    <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{m.label}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#FF4444' }}>{m.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid rgba(255,68,68,0.10)', paddingTop: '8px' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: '#FF4444', letterSpacing: '0.06em' }}>AFFECTED: {scenDetails.noAction.affected}</span>
                </div>
              </div>

              {/* With ArenaFlow AI */}
              <motion.div
                animate={isComplete ? { borderColor: 'rgba(0,212,106,0.30)', background: 'rgba(0,212,106,0.06)' } : {}}
                transition={{ duration: 0.4 }}
                style={{ padding: '14px', borderRadius: '12px', background: 'rgba(0,212,106,0.03)', border: '1px solid rgba(0,212,106,0.12)', display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: '#00D46A', letterSpacing: '0.10em', textTransform: 'uppercase' }}>ArenaFlow AI</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
                  {[
                    { label: 'Safety', value: `↑ ${scenDetails.withAI.safety}` },
                    { label: 'Wait',   value: `↓ ${scenDetails.withAI.wait}` },
                    { label: 'Crowd',  value: `↓ ${scenDetails.withAI.crowd}` },
                    { label: 'Risk',   value: 'Reduced' },
                  ].map(m => (
                    <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{m.label}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#00D46A' }}>{m.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid rgba(0,212,106,0.12)', paddingTop: '8px' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: '#00D46A', letterSpacing: '0.06em' }}>RESOLVED: {scenDetails.withAI.time}</span>
                </div>
              </motion.div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, textAlign: 'center', gap: '10px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#00D46A', opacity: 0.3, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'rgba(255,255,255,0.30)', lineHeight: 1.6 }}>Telemetry parameters nominal.<br />No active impact forecast required.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
