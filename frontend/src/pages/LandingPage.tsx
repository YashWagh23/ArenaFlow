import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Inline Stadium SVG — aerial pitch view ───────────── */
function StadiumAerial() {
  return (
    <svg
      viewBox="0 0 900 500"
      fill="none"
      style={{ width: '100%', height: '100%', opacity: 1 }}
      aria-hidden="true"
    >
      {/* Outer stadium bowl */}
      <ellipse cx="450" cy="250" rx="440" ry="235" stroke="rgba(46,125,50,0.12)" strokeWidth="1"/>
      <ellipse cx="450" cy="250" rx="400" ry="210" stroke="rgba(46,125,50,0.08)" strokeWidth="0.5"/>
      <ellipse cx="450" cy="250" rx="360" ry="188" stroke="rgba(46,125,50,0.06)" strokeWidth="0.5"/>

      {/* Pitch rectangle */}
      <rect x="100" y="90" width="700" height="320" rx="4" stroke="rgba(46,125,50,0.20)" strokeWidth="1"/>

      {/* Midfield line */}
      <line x1="450" y1="90" x2="450" y2="410" stroke="rgba(46,125,50,0.15)" strokeWidth="0.7"/>

      {/* Center circle */}
      <circle cx="450" cy="250" r="70" stroke="rgba(46,125,50,0.18)" strokeWidth="0.7"/>

      {/* Center spot */}
      <circle cx="450" cy="250" r="4" fill="rgba(46,125,50,0.40)"/>

      {/* Left penalty area */}
      <rect x="100" y="160" width="110" height="180" rx="2" stroke="rgba(46,125,50,0.14)" strokeWidth="0.6"/>
      {/* Left goal area */}
      <rect x="100" y="200" width="48" height="100" rx="1" stroke="rgba(46,125,50,0.10)" strokeWidth="0.5"/>
      {/* Left penalty spot */}
      <circle cx="210" cy="250" r="3" fill="rgba(46,125,50,0.30)"/>
      {/* Left arc */}
      <path d="M 210 180 A 70 70 0 0 1 210 320" stroke="rgba(46,125,50,0.10)" strokeWidth="0.6" fill="none"/>

      {/* Right penalty area */}
      <rect x="690" y="160" width="110" height="180" rx="2" stroke="rgba(46,125,50,0.14)" strokeWidth="0.6"/>
      {/* Right goal area */}
      <rect x="752" y="200" width="48" height="100" rx="1" stroke="rgba(46,125,50,0.10)" strokeWidth="0.5"/>
      {/* Right penalty spot */}
      <circle cx="690" cy="250" r="3" fill="rgba(46,125,50,0.30)"/>
      {/* Right arc */}
      <path d="M 690 180 A 70 70 0 0 0 690 320" stroke="rgba(46,125,50,0.10)" strokeWidth="0.6" fill="none"/>

      {/* Corner arcs */}
      <path d="M 100 100 A 12 12 0 0 1 112 90" stroke="rgba(46,125,50,0.14)" strokeWidth="0.6" fill="none"/>
      <path d="M 790 90 A 12 12 0 0 1 800 100" stroke="rgba(46,125,50,0.14)" strokeWidth="0.6" fill="none"/>
      <path d="M 800 400 A 12 12 0 0 1 790 410" stroke="rgba(46,125,50,0.14)" strokeWidth="0.6" fill="none"/>
      <path d="M 112 410 A 12 12 0 0 1 100 400" stroke="rgba(46,125,50,0.14)" strokeWidth="0.6" fill="none"/>

      {/* Stadium seating rows (abstract) */}
      {[1,2,3,4,5].map(i => (
        <ellipse key={i} cx="450" cy="250"
          rx={355 + i*6} ry={183 + i*5}
          stroke={`rgba(46,125,50,${0.025 - i*0.004})`} strokeWidth="0.4" fill="none"
        />
      ))}

      {/* Floodlight towers — 4 corners */}
      {[[95, 85], [805, 85], [95, 415], [805, 415]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="6" fill="rgba(46,125,50,0.15)" stroke="rgba(46,125,50,0.30)" strokeWidth="0.8"/>
          <circle cx={x} cy={y} r="3" fill="rgba(46,125,50,0.50)"/>
          {/* Glow */}
          <circle cx={x} cy={y} r="14" fill="rgba(46,125,50,0.06)"/>
        </g>
      ))}

      {/* Crowd density heatmap — abstract colored zones */}
      <ellipse cx="450" cy="95" rx="160" ry="20" fill="rgba(46,125,50,0.06)"/>
      <ellipse cx="450" cy="405" rx="160" ry="20" fill="rgba(46,125,50,0.06)"/>
      <ellipse cx="108" cy="250" rx="20" ry="90" fill="rgba(46,125,50,0.05)"/>
      <ellipse cx="792" cy="250" rx="20" ry="90" fill="rgba(46,125,50,0.05)"/>
    </svg>
  );
}

/* ── Walkthrough steps data — preserved from original ─── */
const walkthroughSteps = [
  {
    title: 'Normal Stadium Operations',
    description: 'The stadium is running normally. Crowd flows are optimal across all concourses, and the overall Safety Score is at 98%. ArenaFlow monitors every zone in real time.',
    icon: 'stadium',
    badge: 'SAFETY SCORE: 98%',
    badgeColor: '#2E7D32',
  },
  {
    title: 'Unexpected Incident Detected',
    description: 'An unexpected Metro Delay occurs, causing rail transport capacity to drop. Fans begin aggregating and congestion builds rapidly at outer transit platforms.',
    icon: 'train',
    badge: 'TRANSIT TERMINAL SURGE',
    badgeColor: '#C48A00',
  },
  {
    title: 'AI Prediction Anomaly',
    description: 'ArenaFlow processes real-time sensors. AI predicts crowd choke risks near Gate C, 4 minutes before a delay threshold is breached. Confidence: 94%.',
    icon: 'smart_toy',
    badge: '94% CONFIDENCE INDEX',
    badgeColor: '#6BCB6E',
  },
  {
    title: 'Digital Twin Response',
    description: 'The Digital Twin map highlights affected sectors in real time. Safety Score indicators decline, and the AI Copilot compiles recommended mitigation steps.',
    icon: 'language',
    badge: 'SAFETY WARNING ACTIVE',
    badgeColor: '#C84A4A',
  },
  {
    title: 'AI Playbook Execution',
    description: 'The operator deploys the AI playbook. Transit gates are adjusted, shuttle buses rerouted, and crowd flow is balanced. The incident resolves — safety score recovers.',
    icon: 'check_circle',
    badge: 'RESOLUTION NOMINAL',
    badgeColor: '#2E7D32',
  },
];

/* ── Main Landing Page ───────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [utcClock, setUtcClock] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);

  // Live UTC clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcClock(`${h}:${m}:${s} UTC`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Subtle parallax on hero — preserved from original
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const el = heroRef.current;
      if (!el) return;
      const x = (window.innerWidth / 2 - e.pageX) / 60;
      const y = (window.innerHeight / 2 - e.pageY) / 80;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{ background: '#F7F6F1' }}
    >

      {/* ── Floodlight Beams ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 1000px 700px at -5% -10%, rgba(46,125,50,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 700px 600px at 105% -8%, rgba(46,125,50,0.07) 0%, transparent 55%),
            radial-gradient(ellipse 500px 800px at 50% 110%, rgba(46,125,50,0.04) 0%, transparent 60%)
          `,
        }}
      />

      {/* ── Pitch grid ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(46,125,50,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(46,125,50,0.035) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          opacity: 0.7,
        }}
      />

      {/* ── Stadium silhouette — right half ── */}
      <div
        ref={heroRef}
        className="absolute pointer-events-none z-5"
        style={{
          right: '-4%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '58%',
          height: '80%',
          transition: 'transform 0.1s ease-out',
        }}
      >
        <StadiumAerial />
        {/* Fade gradient over SVG — left side */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, #F7F6F1 0%, rgba(8,12,10,0.60) 25%, rgba(8,12,10,0) 60%)',
          }}
        />
        {/* Fade gradient over SVG — bottom */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, #F7F6F1 0%, rgba(8,12,10,0) 40%)',
          }}
        />
      </div>

      {/* ── Top Navigation ── */}
      <nav
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center"
        style={{
          height: '52px',
          padding: '0 40px',
          background: 'rgba(8,12,10,0.70)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        {/* Wordmark */}
        <div className="flex items-center gap-2.5">
          <div
            style={{
              width: '20px', height: '20px',
              borderRadius: '5px',
              background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '12px', color: '#F7F6F1', fontVariationSettings: "'FILL' 1" }}>stadium</span>
          </div>
          <span style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: '14px', letterSpacing: '-0.025em', color: '#1C1C1C' }}>ArenaFlow</span>
        </div>

        {/* Right: clock + status */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full pulse-live" style={{ background: '#2E7D32' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 600, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.06em' }}>
              {utcClock}
            </span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(0,0,0,0.50)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              padding: '6px 12px',
              borderRadius: '6px',
              transition: 'color 150ms, background 150ms',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = '#1C1C1C';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.06)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(0,0,0,0.50)';
              (e.currentTarget as HTMLButtonElement).style.background = 'none';
            }}
          >
            Dashboard →
          </button>
        </div>
      </nav>

      {/* ── Hero Content ── */}
      <main
        className="relative h-screen flex items-center"
        style={{ paddingLeft: '80px', paddingRight: '60%' }}
      >
        <div className="relative z-20 flex flex-col" style={{ maxWidth: '620px' }}>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ marginBottom: '28px' }}
          >
            <div className="inline-flex items-center gap-2" style={{ padding: '5px 12px', border: '1px solid rgba(46,125,50,0.20)', borderRadius: '9999px', background: 'rgba(46,125,50,0.06)' }}>
              <span className="w-1.5 h-1.5 rounded-full pulse-live" style={{ background: '#2E7D32' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', color: '#2E7D32', textTransform: 'uppercase' }}>
                Live · FIFA 2026 · AI Stadium Operations
              </span>
            </div>
          </motion.div>

          {/* Headline — massive editorial typography */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(52px, 6.5vw, 96px)',
              lineHeight: 0.96,
              letterSpacing: '-0.05em',
              color: '#1C1C1C',
              marginBottom: '24px',
            }}
          >
            Stadium<br />
            Intelligence.<br />
            <span style={{ color: '#2E7D32' }}>At Scale.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: '17px',
              lineHeight: 1.7,
              color: 'rgba(28,28,28,0.50)',
              maxWidth: '440px',
              marginBottom: '40px',
            }}
          >
            ArenaFlow gives stadium operators real-time AI assistance,
            predictive incident response, and operational awareness
            during the world's largest sporting events.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '60px' }}
          >
            {/* Primary CTA */}
            <button
              id="launch-arenaflow-btn"
              onClick={() => navigate('/dashboard')}
              className="group flex items-center gap-2.5"
              style={{
                padding: '13px 24px',
                background: '#2E7D32',
                color: '#F7F6F1',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: '14px',
                letterSpacing: '-0.01em',
                boxShadow: '0 0 0 1px rgba(46,125,50,0.50), 0 4px 20px rgba(46,125,50,0.25)',
                transition: 'all 200ms cubic-bezier(0.25,0.46,0.45,0.94)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = '#1AE078';
                el.style.boxShadow = '0 0 0 1px rgba(46,125,50,0.60), 0 8px 32px rgba(46,125,50,0.35)';
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = '#2E7D32';
                el.style.boxShadow = '0 0 0 1px rgba(46,125,50,0.50), 0 4px 20px rgba(46,125,50,0.25)';
                el.style.transform = 'translateY(0)';
              }}
            >
              Launch ArenaFlow
              <span className="material-symbols-outlined" style={{ fontSize: '17px', fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
            </button>

            {/* Ghost CTA */}
            <button
              onClick={() => { setActiveStep(0); setModalOpen(true); }}
              style={{
                padding: '12px 20px',
                background: 'transparent',
                color: 'rgba(28,28,28,0.55)',
                border: '1px solid rgba(0,0,0,0.10)',
                borderRadius: '10px',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 200ms cubic-bezier(0.25,0.46,0.45,0.94)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.color = '#1C1C1C';
                el.style.borderColor = 'rgba(0,0,0,0.20)';
                el.style.background = 'rgba(0,0,0,0.04)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.color = 'rgba(28,28,28,0.55)';
                el.style.borderColor = 'rgba(0,0,0,0.10)';
                el.style.background = 'transparent';
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>play_circle</span>
              Watch Demo
            </button>
          </motion.div>

          {/* Stats row — dark floating chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.50 }}
            style={{ display: 'flex', gap: '12px' }}
          >
            {[
              { value: '82,400', label: 'Peak Capacity' },
              { value: 'Nominal', label: 'Logistics Status', dot: true },
              { value: '0', label: 'Active Incidents', check: true },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: '14px 18px',
                  background: 'rgba(0,0,0,0.04)',
                  border: '1px solid rgba(0,0,0,0.07)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.25)' }}>
                  {stat.label}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {stat.dot && <span className="w-1.5 h-1.5 rounded-full pulse-live" style={{ background: '#2E7D32' }} />}
                  <span style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontSize: '18px', fontWeight: 800, letterSpacing: '-0.025em', color: '#1C1C1C', lineHeight: 1 }}>
                    {stat.value}
                  </span>
                  {stat.check && <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#2E7D32', fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* ── Demo Walkthrough Modal — preserved logic, redesigned ── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
            onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                width: '100%',
                maxWidth: '520px',
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.09)',
                borderRadius: '24px',
                boxShadow: '0 40px 120px rgba(0,0,0,0.70)',
                overflow: 'hidden',
              }}
            >
              {/* Modal header */}
              <div
                style={{
                  padding: '24px 28px 20px',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.25)' }}>
                    ArenaFlow · Demo Walkthrough
                  </span>
                  <h3 style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 800, fontSize: '20px', letterSpacing: '-0.025em', color: '#1C1C1C', marginTop: '6px', lineHeight: 1.1 }}>
                    Watch Demo Flow
                  </h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.30)', padding: '4px', borderRadius: '6px', transition: 'color 150ms' }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#1C1C1C'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'rgba(0,0,0,0.30)'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                </button>
              </div>

              {/* Step indicators */}
              <div style={{ padding: '20px 28px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {walkthroughSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    style={{
                      width: idx === activeStep ? '24px' : '20px',
                      height: idx === activeStep ? '24px' : '20px',
                      borderRadius: '50%',
                      background: idx === activeStep ? '#2E7D32' : idx < activeStep ? 'rgba(46,125,50,0.20)' : 'rgba(0,0,0,0.08)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '9px',
                      fontWeight: 700,
                      color: idx === activeStep ? '#F7F6F1' : idx < activeStep ? '#2E7D32' : 'rgba(0,0,0,0.30)',
                      transition: 'all 200ms',
                      flexShrink: 0,
                    }}
                  >
                    {idx < activeStep ? (
                      <span className="material-symbols-outlined" style={{ fontSize: '11px', fontVariationSettings: "'FILL' 1" }}>check</span>
                    ) : idx + 1}
                  </button>
                ))}
                <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.06)' }} />
              </div>

              {/* Step content */}
              <div style={{ padding: '20px 28px', minHeight: '180px' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: 'rgba(0,0,0,0.05)',
                          border: '1px solid rgba(0,0,0,0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '22px', color: walkthroughSteps[activeStep].badgeColor, fontVariationSettings: "'FILL' 1" }}>
                          {walkthroughSteps[activeStep].icon}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.25)', display: 'block', marginBottom: '4px' }}>
                          Step {activeStep + 1} of {walkthroughSteps.length}
                        </span>
                        <h4 style={{ fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: '15px', letterSpacing: '-0.01em', color: '#1C1C1C', lineHeight: 1.2 }}>
                          {walkthroughSteps[activeStep].title}
                        </h4>
                      </div>
                    </div>

                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', lineHeight: 1.7, color: 'rgba(28,28,28,0.55)', marginBottom: '14px' }}>
                      {walkthroughSteps[activeStep].description}
                    </p>

                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      background: `${walkthroughSteps[activeStep].badgeColor}15`,
                      border: `1px solid ${walkthroughSteps[activeStep].badgeColor}30`,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0.10em',
                      textTransform: 'uppercase' as const,
                      color: walkthroughSteps[activeStep].badgeColor,
                    }}>
                      {walkthroughSteps[activeStep].badge}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Modal footer */}
              <div
                style={{
                  padding: '16px 28px 24px',
                  borderTop: '1px solid rgba(0,0,0,0.06)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                }}
              >
                {activeStep > 0 && (
                  <button
                    onClick={() => setActiveStep(p => p - 1)}
                    style={{
                      padding: '9px 18px',
                      background: 'transparent',
                      border: '1px solid rgba(0,0,0,0.10)',
                      borderRadius: '8px',
                      color: 'rgba(0,0,0,0.45)',
                      cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '13px',
                      fontWeight: 500,
                      transition: 'all 150ms',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.20)'; (e.currentTarget as HTMLButtonElement).style.color = '#1C1C1C'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.10)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(0,0,0,0.45)'; }}
                  >
                    Back
                  </button>
                )}
                {activeStep < walkthroughSteps.length - 1 ? (
                  <button
                    onClick={() => setActiveStep(p => p + 1)}
                    style={{
                      padding: '9px 20px',
                      background: '#2E7D32',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#F7F6F1',
                      cursor: 'pointer',
                      fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif",
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      transition: 'all 150ms',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#1AE078'}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#2E7D32'}
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={() => { setModalOpen(false); navigate('/dashboard'); }}
                    style={{
                      padding: '9px 20px',
                      background: '#2E7D32',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#F7F6F1',
                      cursor: 'pointer',
                      fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif",
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Launch Dashboard →
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
