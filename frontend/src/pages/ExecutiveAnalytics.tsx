import React from 'react';
import { useTelemetry } from '../context/SocketContext';
import { motion } from 'framer-motion';

/* ── Large Safety Gauge — editorial dark ────────────────── */
function SafetyGauge({ score }: { score: number }) {
  const size = 220;
  const strokeWidth = 10;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * score) / 100;
  const color = score > 85 ? '#FFFFCC' : score > 60 ? '#F3C969' : '#E86C5D';

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} className="transform -rotate-90" style={{ position: 'absolute', inset: 0 }}>
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,204,0.05)" strokeWidth={strokeWidth} fill="none" />
        {/* Zone: danger 0–60 */}
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(232,108,93,0.08)" strokeWidth={strokeWidth} fill="none"
          strokeDasharray={`${circ * 0.60} ${circ * 0.40}`} strokeDashoffset={0} />
        {/* Zone: warning 60–85 */}
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(243,201,105,0.08)" strokeWidth={strokeWidth} fill="none"
          strokeDasharray={`${circ * 0.25} ${circ * 0.75}`} strokeDashoffset={-(circ * 0.60)} />
        {/* Zone: safe 85–100 */}
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,204,0.08)" strokeWidth={strokeWidth} fill="none"
          strokeDasharray={`${circ * 0.15} ${circ * 0.85}`} strokeDashoffset={-(circ * 0.85)} />
        {/* Score arc */}
        <circle cx={size/2} cy={size/2} r={r}
          stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.25,0.46,0.45,0.94), stroke 0.6s ease' }}
        />
      </svg>
      {/* Center content */}
      <div style={{ textAlign: 'center', zIndex: 10 }}>
        <span style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 900, fontSize: '56px', color, letterSpacing: '-0.05em', lineHeight: 1.0, display: 'block' }}>
          {score}
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,204,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginTop: '4px' }}>
          / 100
        </span>
      </div>
    </div>
  );
}

/* ── Mini ring gauge ──────────────────────────────────── */
function MiniRing({ value, color, size = 72 }: { value: number; color: string; size?: number }) {
  const sw = 6;
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * value) / 100;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,204,0.06)" strokeWidth={sw} fill="none" />
      <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={sw} fill="none"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.25,0.46,0.45,0.94)' }}
      />
    </svg>
  );
}

export default function ExecutiveAnalytics() {
  const { state, analytics, connectionError, socketUrl } = useTelemetry();

  /* ── Error state ─────────────────────────────────────── */
  if (connectionError && (!state || !analytics)) {
    return (
      <div style={{ height: 'calc(100vh - 48px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '400px', padding: '48px', borderRadius: '24px', textAlign: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#E86C5D', display: 'block', marginBottom: '16px' }}>cloud_off</span>
          <h3 style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: '18px', color: '#FFFFCC', marginBottom: '10px' }}>Analytics Offline</h3>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: 'rgba(255,255,204,0.45)', lineHeight: 1.65 }}>
            The live stadium telemetry server is currently unreachable. Make sure the backend service is running at:
          </p>
          <code style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(255,255,204,0.35)', background: 'rgba(255,255,204,0.04)', border: '1px solid rgba(255,255,204,0.07)', borderRadius: '8px', padding: '10px', marginTop: '14px', wordBreak: 'break-all' }}>
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
          <div style={{ width: '32px', height: '32px', border: '2px solid #FFFFCC', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 600, letterSpacing: '0.10em', color: 'rgba(255,255,204,0.25)', textTransform: 'uppercase' }}>Connecting Analytics...</p>
        </div>
      </div>
    );
  }

  /* ── Computed values — preserved exactly ─────────────── */
  const northGate = state.zones['stand-north'].currentLoad;
  const southGate = state.zones['stand-south'].currentLoad;
  const eastGate  = state.zones['stand-east'].currentLoad;
  const westGate  = state.zones['stand-west'].currentLoad;
  const totalAttendance = northGate + southGate + eastGate + westGate;
  const capacity = 85000;
  const capacityPct = Math.round((totalAttendance / capacity) * 100);
  const safetyScore = state.globalSafetyScore;
  const safetyColor = safetyScore > 85 ? '#FFFFCC' : safetyScore > 60 ? '#F3C969' : '#E86C5D';
  const predAccuracy = Math.round(analytics.aiConfidence.successRate * 100);

  const stands = [
    { label: 'North Stand', val: northGate, cap: 18000 },
    { label: 'South Stand', val: southGate, cap: 18000 },
    { label: 'East Stand',  val: eastGate,  cap: 20000 },
    { label: 'West Stand',  val: westGate,  cap: 20000 },
  ];

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 48px)',
        background: '#1A1A00',
        padding: '40px 40px 72px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* ── Page Header ─────────────────────────────────── */}
        <div style={{ marginBottom: '56px' }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#E9F4A8',
              display: 'block',
              marginBottom: '14px',
            }}
          >
            Executive Command Center
          </span>
          <h1
            style={{
              fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(40px, 5vw, 72px)',
              letterSpacing: '-0.05em',
              color: '#FFFFCC',
              lineHeight: 0.95,
              marginBottom: '16px',
            }}
          >
            <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>Stadium Analytics</span>
            <span aria-hidden="true">Stadium<br />
            <span style={{ color: 'rgba(255,255,204,0.40)' }}>Analytics</span></span>
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', color: 'rgba(255,255,204,0.40)', lineHeight: 1.7 }}>
            Live intelligence · All metrics update in real time from stadium telemetry
          </p>
        </div>

        {/* ── Hero Metrics Row — Bloomberg style ──────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            background: 'rgba(255,255,204,0.06)',
            border: '1px solid rgba(255,255,204,0.06)',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '24px',
          }}
        >
          {[
            { label: 'Total Attendance', value: totalAttendance.toLocaleString(), unit: 'spectators', color: '#FFFFCC' },
            { label: 'Capacity Used',    value: `${capacityPct}%`,               unit: 'of 85,000',  color: '#FFFFCC' },
            { label: 'Safety Score',     value: `${safetyScore}%`,               unit: 'global index', color: safetyColor },
            { label: 'AI Accuracy',      value: `${predAccuracy}%`,              unit: 'prediction',  color: '#E9F4A8' },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              style={{
                padding: '28px 28px',
                background: '#24240A',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,204,0.25)' }}>{m.label}</span>
              <span style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 900, fontSize: 'clamp(28px, 3vw, 44px)', letterSpacing: '-0.04em', lineHeight: 1.0, color: m.color }}>{m.value}</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'rgba(255,255,204,0.25)' }}>{m.unit}</span>
            </motion.div>
          ))}
        </div>

        {/* ── Main Bento Grid ──────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '16px', marginBottom: '16px' }}>

          {/* Safety Gauge */}
          <div
            className="glass-panel"
            style={{ borderRadius: '20px', padding: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', minHeight: '360px' }}
          >
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,204,0.25)', alignSelf: 'flex-start' }}>Safety Gauge</span>
            <SafetyGauge score={safetyScore} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: '18px', color: safetyColor, marginBottom: '4px' }}>
                {safetyScore > 85 ? 'Excellent' : safetyScore > 60 ? 'Warning' : 'Critical'}
              </p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,204,0.25)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>Global Safety Score</p>
            </div>
          </div>

          {/* Crowd Density + Capacity */}
          <div className="glass-panel" style={{ borderRadius: '20px', padding: '36px', minHeight: '360px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: '18px', color: '#FFFFCC', letterSpacing: '-0.02em', marginBottom: '4px' }}>Crowd Density & Capacity</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: 'rgba(255,255,204,0.30)' }}>Real-time attendance vs projected capacity</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 900, fontSize: '44px', color: '#FFFFCC', letterSpacing: '-0.05em', lineHeight: 1.0, display: 'block' }}>
                  {totalAttendance.toLocaleString()}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,204,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  / {capacity.toLocaleString()} · {capacityPct}%
                </span>
              </div>
            </div>

            {/* Full capacity bar */}
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,204,0.06)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '28px' }}>
              <div style={{ height: '100%', width: `${capacityPct}%`, background: 'linear-gradient(90deg, #E9F4A8, #FFFFCC)', borderRadius: '9999px', transition: 'width 700ms cubic-bezier(0.25,0.46,0.45,0.94)' }} />
            </div>

            {/* Per-stand breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', borderTop: '1px solid rgba(255,255,204,0.06)', paddingTop: '24px' }}>
              {stands.map(stand => {
                const pct = Math.min(100, Math.round((stand.val / stand.cap) * 100));
                const barColor = pct > 85 ? '#E86C5D' : pct > 70 ? '#F3C969' : '#FFFFCC';
                return (
                  <div key={stand.label}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: 'rgba(255,255,204,0.25)', letterSpacing: '0.10em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                      {stand.label.replace(' Stand', '')}
                    </span>
                    <span style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 800, fontSize: '22px', color: '#FFFFCC', letterSpacing: '-0.03em', lineHeight: 1.0, display: 'block', marginBottom: '8px' }}>
                      {stand.val.toLocaleString()}
                    </span>
                    <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,204,0.06)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '4px' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: '9999px', transition: 'width 700ms cubic-bezier(0.25,0.46,0.45,0.94)' }} />
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,204,0.25)' }}>{pct}% full</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Second Row ────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>

          {/* Stand Occupancy Distribution */}
          <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
            <h4 style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: '15px', color: '#FFFFCC', letterSpacing: '-0.015em', marginBottom: '20px' }}>
              Stand Occupancy
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {stands.map(stand => {
                const pct = Math.min(100, Math.round((stand.val / stand.cap) * 100));
                const barColor = pct > 85 ? '#E86C5D' : pct > 70 ? '#F3C969' : '#FFFFCC';
                return (
                  <div key={stand.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, color: '#FFFFCC' }}>{stand.label}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,204,0.45)' }}>
                        {stand.val.toLocaleString()} <span style={{ color: 'rgba(255,255,204,0.20)', fontWeight: 400 }}>/ {stand.cap.toLocaleString()}</span>
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ flexGrow: 1, height: '4px', background: 'rgba(255,255,204,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: '9999px', transition: 'width 700ms cubic-bezier(0.25,0.46,0.45,0.94)' }} />
                      </div>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: barColor, minWidth: '32px', textAlign: 'right' }}>{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Prediction Accuracy */}
          <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', position: 'relative' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,204,0.25)', position: 'absolute', top: '20px', left: '20px' }}>AI Accuracy</span>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MiniRing value={predAccuracy} color="#E9F4A8" size={100} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 900, fontSize: '22px', color: '#E9F4A8', letterSpacing: '-0.03em' }}>{predAccuracy}%</span>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: '14px', color: '#FFFFCC', marginBottom: '3px' }}>Prediction Accuracy</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 600, color: 'rgba(255,255,204,0.25)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>AI Orchestrator</p>
            </div>
          </div>

          {/* Zone Health Index */}
          <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
            <h4 style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: '15px', color: '#FFFFCC', letterSpacing: '-0.015em', marginBottom: '16px' }}>
              Zone Health
            </h4>
            <div
              className="scrollbar-thin"
              style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '4px' }}
            >
              {Object.values(state.zones).map(z => {
                const statusColor = z.status === 'critical' ? '#E86C5D' : z.status === 'warning' ? '#F3C969' : '#FFFFCC';
                return (
                  <div
                    key={z.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,204,0.02)',
                      border: '1px solid rgba(255,255,204,0.04)',
                      transition: 'background 150ms',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,204,0.05)'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,204,0.02)'}
                  >
                    <div>
                      <span style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: '12px', color: '#FFFFCC', display: 'block' }}>{z.name}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'rgba(255,255,204,0.25)', fontWeight: 600, letterSpacing: '0.04em', marginTop: '2px', display: 'block' }}>
                        Wait: {z.waitTime}m · {z.currentLoad.toLocaleString()} pax
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor, flexShrink: 0, display: 'inline-block' }} />
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: statusColor, textTransform: 'capitalize', letterSpacing: '0.04em' }}>
                        {z.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
