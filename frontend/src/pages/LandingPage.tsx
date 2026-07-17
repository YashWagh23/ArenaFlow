import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();
  const trophyRef = useRef<HTMLImageElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [utcClock, setUtcClock] = useState('');

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const trophy = trophyRef.current;
      if (!trophy) return;
      const x = (window.innerWidth - e.pageX * 2) / 100;
      const y = (window.innerHeight - e.pageY * 2) / 100;
      trophy.style.transform = `translate(${x}px, calc(-50% + ${y}px))`;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{ backgroundColor: '#F5F5F7' }}
    >
      {/* ── Pitch Geometry Overlay ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(#006b3f 1px, transparent 1px), linear-gradient(90deg, #006b3f 1px, transparent 1px)',
            backgroundSize: '100px 100px',
            opacity: 0.03,
          }}
        />
        {/* Center circle ghost */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/10 rounded-full" />
      </div>

      {/* ── Top Navigation Bar ── */}
      <nav
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-container-padding h-16 border-b border-white/30 shadow-sm"
        style={{ background: 'rgba(249,249,251,0.80)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
      >
        {/* Left: Logo + Home */}
        <div className="flex items-center gap-8">
          <span className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">
            ArenaFlow
          </span>
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-primary font-semibold border-b-2 border-primary py-1 text-sm"
            >
              Home
            </a>
          </div>
        </div>

        {/* Right: Live UTC Clock */}
        <div className="flex items-center gap-3">
          <span className="font-stats-numeric text-primary" style={{ fontSize: '14px' }}>
            {utcClock}
          </span>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <main className="relative h-screen flex items-center px-container-padding overflow-hidden">

        {/* Trophy Image Asset — right side */}
        <div
          className="absolute right-0 top-0 h-full z-10 flex items-center justify-center"
          style={{ width: '66.666%', transform: 'translateX(3rem)', opacity: 0.9 }}
        >
          <div className="relative w-full h-full">
            {/* Trophy */}
            <img
              ref={trophyRef}
              alt="FIFA World Cup Trophy Monumental Detail"
              src="https://lh3.googleusercontent.com/aida/AP1WRLuhdvK2pdrppNdcLMsLnsiJmjKEbBf32biWWvk9gRfLZwjNXMbtnM4N1rZT2De69qcrHC1hzye3knQ98nl_lV9ORBvYp36mfdWSjQ3SeHt0hWIJPHHH92eeIBT2jYwveTz7nxRGF_atNrH9uJdv3OfB4YTGAmwADHElhx7mpDZqBuLP5psF8L1pKkIXMEadq400CX-uf27NRAUuqw-_XGBrOKoBiVAaQEvRjkWoNWigWe5Cl6TbtywwOJ_4"
              className="absolute right-0 top-1/2 w-auto object-contain mix-blend-multiply transition-all duration-1000 hover:scale-105"
              style={{
                height: '120%',
                transform: 'translateY(-50%)',
                filter: 'drop-shadow(0 0 40px rgba(0,107,63,0.15))',
              }}
            />
            {/* Masking radial gradient overlay — fades trophy into background */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 70% 50%, rgba(255,255,255,0) 0%, rgba(245,245,247,1) 100%)',
              }}
            />
          </div>
        </div>

        {/* Content Overlay — left side */}
        <div className="relative z-20 max-w-2xl">

          {/* Eyebrow labels */}
          <div className="mb-6 flex items-center gap-3">
            <span
              className="text-primary px-3 py-1 rounded-full border border-primary/20 font-label-caps text-label-caps"
              style={{ background: 'rgba(0,107,63,0.10)' }}
            >
              Stadium Operating System
            </span>
            <span className="font-label-caps text-label-caps" style={{ color: 'rgba(62,74,65,0.60)' }}>
              FIFA 2026 OFFICIAL PARTNER
            </span>
          </div>

          {/* Main headline */}
          <h1 className="font-headline-xl text-headline-xl text-graphite mb-6 leading-tight max-w-xl">
            The Operating System for the{' '}
            <span className="text-primary italic font-bold">World's Game.</span>
          </h1>

          {/* Subtitle */}
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-md leading-relaxed">
            Precision command for the global stage. Manage crowds, logistics, and incident response with surgical efficiency.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="group relative px-8 py-4 bg-primary text-on-primary rounded-full font-title-md text-title-md flex items-center gap-3 transition-all duration-300 active:scale-95"
              style={{
                boxShadow: '0 4px 16px rgba(0,107,63,0.20)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(0,107,63,0.30)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(0,107,63,0.20)';
              }}
            >
              Launch ArenaFlow
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
            <button
              onClick={() => {
                setActiveStep(0);
                setModalOpen(true);
              }}
              className="px-8 py-4 rounded-full font-title-md text-title-md text-on-surface hover:bg-white/60 transition-all duration-300 active:scale-95 shadow-sm"
              style={{
                background: 'rgba(250,250,251,0.40)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,1)',
              }}
            >
              Watch Demo Flow
            </button>
          </div>

          {/* Dashboard Preview Stats */}
          <div className="mt-20 grid grid-cols-3 gap-6">
            {/* Stat 1: Peak Capacity */}
            <div
              className="p-4 rounded-xl border border-white/40 shadow-sm flex flex-col gap-2"
              style={{
                background: 'rgba(255,255,255,0.80)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.30)',
              }}
            >
              <span className="font-label-caps text-label-caps text-on-surface-variant/70 uppercase">
                Peak Capacity
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-stats-numeric text-stats-numeric text-primary">82,400</span>
                <span className="text-primary text-[12px] material-symbols-outlined">trending_up</span>
              </div>
            </div>

            {/* Stat 2: Logistics Status */}
            <div
              className="p-4 rounded-xl border border-white/40 shadow-sm flex flex-col gap-2"
              style={{
                background: 'rgba(255,255,255,0.80)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.30)',
              }}
            >
              <span className="font-label-caps text-label-caps text-on-surface-variant/70 uppercase">
                Logistics Status
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-title-md text-title-md text-graphite">Nominal</span>
              </div>
            </div>

            {/* Stat 3: Active Incidents */}
            <div
              className="p-4 rounded-xl border border-white/40 shadow-sm flex flex-col gap-2"
              style={{
                background: 'rgba(255,255,255,0.80)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.30)',
              }}
            >
              <span className="font-label-caps text-label-caps text-on-surface-variant/70 uppercase">
                Active Incidents
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-stats-numeric text-stats-numeric text-critical-red">0</span>
                <span
                  className="text-on-surface-variant/50 text-[12px] material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Walkthrough Demo Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="bg-white/95 border border-white max-w-xl w-full rounded-[32px] p-8 shadow-2xl relative flex flex-col gap-6"
              style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            >
              {/* Close Button */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-6 right-6 text-on-surface-variant hover:text-primary transition-colors h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center border border-outline/10 shadow-sm hover:scale-105 active:scale-95 duration-200"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              {/* Title & Metadata */}
              <div className="border-b border-outline/10 pb-4">
                <span className="font-label-caps text-[9px] text-slate-400 uppercase tracking-widest font-mono">
                  ArenaFlow Presentation Walkthrough
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Watch Demo Flow
                </h3>
              </div>

              {/* Step content */}
              <div className="min-h-[160px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${walkthroughSteps[activeStep].accent}`}>
                        <span className="material-symbols-outlined text-2xl">{walkthroughSteps[activeStep].icon}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-bold font-mono tracking-widest text-slate-400 uppercase">
                          STEP {activeStep + 1} OF 5
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          {walkthroughSteps[activeStep].title}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-outline/10">
                      {walkthroughSteps[activeStep].description}
                    </p>

                    <div className="flex">
                      <span className={`px-2.5 py-1 text-[8px] font-bold font-mono uppercase tracking-wider rounded-lg border bg-white ${walkthroughSteps[activeStep].stepColor}`}>
                        {walkthroughSteps[activeStep].badge}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Indicators */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-outline/10">
                {/* Dots */}
                <div className="flex gap-2">
                  {walkthroughSteps.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStep(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === activeStep ? 'w-6 bg-primary' : 'w-2 bg-slate-200 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Next / Back Actions */}
                <div className="flex gap-2">
                  {activeStep > 0 && (
                    <button
                      onClick={() => setActiveStep(prev => prev - 1)}
                      className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:text-primary bg-slate-50 hover:bg-slate-100 rounded-full border border-outline/10 transition-colors"
                    >
                      Back
                    </button>
                  )}
                  {activeStep < 4 ? (
                    <button
                      onClick={() => setActiveStep(prev => prev + 1)}
                      className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-container rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setModalOpen(false);
                        navigate('/dashboard');
                      }}
                      className="px-6 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-container rounded-full shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-wider"
                    >
                      Launch Live Dashboard
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const walkthroughSteps = [
  {
    step: 1,
    title: 'Normal Stadium Operations',
    description: 'The stadium is running normally. Crowd flows are optimal across all concourses, and the overall Safety Score is at 98%.',
    accent: 'bg-primary/10 text-primary',
    stepColor: 'text-primary border-primary/20',
    icon: 'stadium',
    badge: '🏟 SAFETY SCORE: 98%'
  },
  {
    step: 2,
    title: 'Unexpected Incident',
    description: 'An unexpected Metro Delay occurs, causing rail transport capacity to drop. Fans begin aggregating and congestion builds rapidly at outer transit platforms.',
    accent: 'bg-warning-amber/10 text-secondary',
    stepColor: 'text-secondary border-warning-amber/20',
    icon: 'train',
    badge: '🚇 TRANSIT TERMINAL SURGE'
  },
  {
    step: 3,
    title: 'AI Prediction Anomaly',
    description: 'ArenaFlow ingestion layers process real-time sensors. Gemini AI predicts crowd choke risks near Gate C, 4 minutes before a delay threshold is breached.',
    accent: 'bg-primary/10 text-primary',
    stepColor: 'text-primary border-primary/20',
    icon: 'smart_toy',
    badge: '🤖 94% CONFIDENCE INDEX'
  },
  {
    step: 4,
    title: 'Digital Twin Response',
    description: 'The Digital Twin map highlights affected sectors in real time. Safety Score indicators decline, and the AI Copilot compiles recommended mitigation steps.',
    accent: 'bg-critical-red/10 text-critical-red',
    stepColor: 'text-critical-red border-critical-red/20',
    icon: 'language',
    badge: '📍 SAFETY WARNING ACTIVE'
  },
  {
    step: 5,
    title: 'AI Playbook Execution',
    description: 'The operator deploys the AI playbook. Transit gates are adjusted, shuttle buses are rerouted, and crowd flow is balanced. The incident is resolved, and safety score recovers.',
    accent: 'bg-primary/10 text-primary',
    stepColor: 'text-primary border-primary/20',
    icon: 'check_circle',
    badge: '✅ RESOLUTION NOMINAL'
  }
];
