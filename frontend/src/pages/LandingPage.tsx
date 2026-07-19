import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';

/* ── DATA CONSTANTS ────────────────────────────────────────────── */
const FEATURES = [
  { title: "Live Telemetry", desc: "Ingest thousands of sensors per second across gates and concourses.", icon: "sensors" },
  { title: "Digital Twin", desc: "Command the entire stadium from a unified spatial interface.", icon: "layers" },
  { title: "AI Copilot", desc: "Generate real-time mitigation playbooks for active crowd incidents.", icon: "smart_toy" },
  { title: "Executive Analytics", desc: "Review matchday performance, safety scoring, and efficiency.", icon: "insights" },
];

const TIMELINE = [
  { time: "3:00 PM", desc: "Fans arrive." },
  { time: "6:10 PM", desc: "Crowd density rises." },
  { time: "6:25 PM", desc: "Metro delay detected." },
  { time: "6:26 PM", desc: "ArenaFlow predicts congestion." },
  { time: "6:27 PM", desc: "AI generates playbook." },
  { time: "6:28 PM", desc: "Operations approve." },
  { time: "6:35 PM", desc: "Normal flow restored." }
];

const AI_STEPS = [
  "Metro Delay detected...",
  "Analyzing crowd density...",
  "Predicting congestion...",
  "Generating mitigation plan...",
  "Playbook Ready ✓"
];

const KPIS = [
  { label: "Safety Score", value: "98.4", suffix: "%" },
  { label: "Occupancy", value: "82,410", suffix: "" },
  { label: "Incident Resolution", value: "1.2", suffix: "m" },
  { label: "Prediction Accuracy", value: "94.7", suffix: "%" }
];

const TECH_STACK = ["React", "TypeScript", "Fastify", "Socket.IO", "Gemini", "Framer Motion"];

/* ── COMPONENTS ────────────────────────────────────────────── */

export default function LandingPage() {
  const navigate = useNavigate();
  const [utcClock, setUtcClock] = useState('');

  // Live UTC Clock
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

  return (
    <div className="relative w-full bg-[#F9F9F7] text-[#1C1C1C] selection:bg-[#2E7D32] selection:text-white font-sans">
      
      {/* ── TOP NAVIGATION ── */}
      <nav
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center"
        style={{
          height: '60px',
          padding: '0 40px',
          background: 'rgba(249, 249, 247, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <img src="/images/arenaflow-logo.png" alt="ArenaFlow" className="w-5 h-5 object-contain" />
          <span className="font-display font-bold text-[14px] tracking-[-0.025em] text-[#1C1C1C]">ArenaFlow</span>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full pulse-live" style={{ background: '#2E7D32' }} />
            <span className="font-mono text-[10px] font-semibold text-[#7A7A7A] tracking-[0.06em]">
              {utcClock}
            </span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="font-display text-[12px] font-semibold text-[#7A7A7A] hover:text-[#1C1C1C] hover:bg-black/5 px-3 py-1.5 rounded-md transition-all duration-150"
            style={{ letterSpacing: '-0.01em' }}
          >
            Dashboard →
          </button>
        </div>
      </nav>

      {/* ── HERO CONTENT ── */}
      <main className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
        
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: 'url(/images/tunnel-bg.png)', 
              opacity: 0.65,
              filter: 'blur(4px) grayscale(20%)',
              mixBlendMode: 'multiply'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F9F9F7]/40 via-[#F9F9F7]/80 to-[#F9F9F7]" />
        </div>

        <div className="relative z-20 flex flex-col items-center px-6 mt-16" style={{ maxWidth: '800px' }}>


          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ marginBottom: '24px' }}
          >
            <div className="inline-flex items-center gap-2" style={{ padding: '5px 12px', border: '1px solid rgba(46,125,50,0.20)', borderRadius: '9999px', background: 'rgba(46,125,50,0.06)' }}>
              <span className="w-1.5 h-1.5 rounded-full pulse-live" style={{ background: '#2E7D32' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', color: '#2E7D32', textTransform: 'uppercase' }}>
                Live · FIFA 2026 · AI Stadium Operations
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-[80px]"
            style={{
              lineHeight: 0.96,
              letterSpacing: '-0.05em',
              color: '#1C1C1C',
              marginBottom: '24px',
            }}
          >
            Every Second Matters.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="font-sans text-base sm:text-lg text-[#606060]"
            style={{
              lineHeight: 1.7,
              maxWidth: '540px',
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
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            style={{ marginBottom: '60px' }}
          >
            {/* Primary CTA */}
            <button
              onClick={() => navigate('/dashboard')}
              className="group flex items-center justify-center gap-2.5 font-display w-full sm:w-auto"
              style={{
                padding: '13px 28px',
                background: '#2E7D32',
                color: '#F7F6F1',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '15px',
                letterSpacing: '-0.01em',
                minHeight: '44px',
                boxShadow: '0 0 0 1px rgba(46,125,50,0.50), 0 6px 24px rgba(46,125,50,0.25)',
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
                el.style.boxShadow = '0 0 0 1px rgba(46,125,50,0.50), 0 6px 24px rgba(46,125,50,0.25)';
                el.style.transform = 'translateY(0)';
              }}
            >
              Launch Dashboard
            </button>

            {/* Ghost CTA */}
            <button
              onClick={() => { window.scrollTo({ top: window.innerHeight, behavior: 'smooth' }); }}
              className="font-sans flex items-center justify-center gap-2 w-full sm:w-auto"
              style={{
                padding: '13px 28px',
                background: '#FFFFFF',
                color: '#1C1C1C',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '15px',
                minHeight: '44px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'all 200ms cubic-bezier(0.25,0.46,0.45,0.94)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = 'rgba(0,0,0,0.15)';
                el.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = 'rgba(0,0,0,0.08)';
                el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                el.style.transform = 'translateY(0)';
              }}
            >
              View Simulation
            </button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 opacity-40 mt-12"
          >
            <span className="font-mono text-[10px] tracking-widest font-bold">SCROLL</span>
            <div className="w-[1px] h-8 bg-[#1C1C1C]" />
          </motion.div>

        </div>
      </main>

      {/* ── WHY ARENAFLOW ── */}
      <section className="relative z-10 w-full py-16 sm:py-24 md:py-32 lg:py-40 px-4 sm:px-6 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 text-center"
        >
          <h2 className="font-display font-black text-5xl tracking-tight text-[#1C1C1C]">
            Why ArenaFlow
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group p-10 bg-white/40 backdrop-blur-2xl border border-[rgba(0,0,0,0.06)] rounded-3xl transition-all duration-300 hover:-translate-y-1"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.03)' }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(46,125,50,0.08)';
                e.currentTarget.style.borderColor = 'rgba(46,125,50,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.03)';
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
              }}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#F9F9F7] border border-[rgba(0,0,0,0.04)] flex items-center justify-center mb-6 text-[#2E7D32]">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{feat.icon}</span>
              </div>
              <h3 className="font-display font-bold text-2xl mb-3 text-[#1C1C1C]">{feat.title}</h3>
              <p className="font-sans text-[17px] text-[#606060] leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── MATCHDAY STORY (TIMELINE) ── */}
      <section className="relative z-10 w-full py-16 sm:py-24 md:py-32 lg:py-40 px-4 sm:px-6 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-32 text-center"
        >
          <h2 className="font-display font-black text-5xl tracking-tight text-[#1C1C1C]">
            The Matchday Story
          </h2>
        </motion.div>

        <div className="relative pl-8 md:pl-0">
          <TimelineLine />
          
          {TIMELINE.map((step, i) => (
            <motion.div
              key={step.time}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`relative mb-12 lg:mb-16 last:mb-0 lg:w-[calc(50%-40px)] w-full pl-6 md:pl-10 lg:pl-0 ${i % 2 === 0 ? 'lg:ml-auto lg:pl-10' : 'lg:mr-auto lg:pr-10 lg:text-right'}`}
            >
              {/* Timeline Dot */}
              <div className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#2E7D32] border-[3px] border-[#F9F9F7] left-[-6px] lg:left-auto lg:block ${i % 2 === 0 ? 'lg:-left-[46px]' : 'lg:-right-[46px]'}`} style={{ boxShadow: '0 0 0 1px rgba(46,125,50,0.2)' }} />
              
              <span className="font-mono text-xs text-[#A68A36] font-bold block mb-2">{step.time}</span>
              <p className="font-display font-semibold text-xl lg:text-2xl text-[#1C1C1C] tracking-tight">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── DIGITAL TWIN SHOWCASE ── */}
      <section className="relative z-10 w-full py-16 sm:py-24 md:py-32 lg:py-40 px-4 sm:px-6 max-w-[1400px] mx-auto overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url(/images/media__1784464990328.png)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(20px)', mixBlendMode: 'multiply' }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-[16/9] bg-[#121412] bg-cover bg-center rounded-[32px] p-8 border border-white/10 overflow-hidden flex items-center justify-center"
          style={{ 
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
            backgroundImage: 'url(/images/pitch-bg.jpg)'
          }}
        >
          {/* Subtle dark overlay so UI elements remain readable */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          {/* Dashboard UI Frame */}
          <div className="absolute top-0 left-0 w-full h-12 bg-white/5 border-b border-white/5 flex items-center px-6">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
            </div>
          </div>


          {/* Floating UI Mocks */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-24 left-12 p-5 bg-[#1C1F1C]/80 border border-white/10 rounded-2xl backdrop-blur-xl"
          >
            <p className="font-mono text-[10px] text-[#2E7D32] mb-1 tracking-wider">LIVE OCCUPANCY</p>
            <LiveCounter end={82410} suffix="" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-24 right-12 p-5 bg-[#1C1F1C]/80 border border-white/10 rounded-2xl backdrop-blur-xl"
          >
            <p className="font-mono text-[10px] text-[#A68A36] mb-1 tracking-wider">SAFETY SCORE</p>
            <LiveCounter end={98} suffix="%" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── AI COPILOT (TYPING ANIMATION) ── */}
      <section className="relative z-10 w-full py-16 sm:py-24 md:py-32 lg:py-40 px-4 sm:px-6 max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <h2 className="font-display font-black text-5xl tracking-tight text-[#1C1C1C]">
            AI Copilot
          </h2>
        </motion.div>

        <div className="bg-white/60 backdrop-blur-xl border border-[rgba(0,0,0,0.06)] rounded-3xl p-8 md:p-12" style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.03)' }}>
          <AICopilotSequence />
        </div>
      </section>

      {/* ── EXECUTIVE ANALYTICS ── */}
      <section className="relative z-10 w-full py-16 sm:py-24 md:py-32 lg:py-40 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[rgba(0,0,0,0.04)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {KPIS.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="font-display font-bold text-4xl sm:text-5xl text-[#1C1C1C] mb-2">{kpi.value}<span className="text-2xl sm:text-3xl text-[#7A7A7A] ml-1">{kpi.suffix}</span></div>
              <div className="font-mono text-[11px] font-bold text-[#7A7A7A] tracking-wider uppercase">{kpi.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TECHNOLOGY ── */}
      <section className="relative z-10 w-full py-12 sm:py-16 md:py-24 px-4 sm:px-6 text-center max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-4">
          {TECH_STACK.map((tech, i) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="px-6 py-3 bg-white border border-[rgba(0,0,0,0.06)] rounded-full text-[14px] font-sans font-semibold text-[#1C1C1C] transition-all duration-300 hover:border-[#2E7D32]/30 hover:shadow-[0_0_16px_rgba(46,125,50,0.1)]"
            >
              {tech}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 w-full min-h-screen flex items-center justify-center px-6 bg-[#161816] text-[#FFFFFF] overflow-hidden">
        {/* Soft Background Spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#A68A36]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url(/images/media__1784464990381.png)', backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'screen' }} />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center max-w-4xl flex flex-col items-center"
        >
          <h2 className="font-display font-black text-[clamp(40px,6vw,80px)] leading-[0.95] tracking-tight mb-12 text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] to-[#A0A0A0]">
            The Future of<br/>Stadium Operations<br/>Starts Here.
          </h2>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="group relative px-10 py-5 bg-[#F9F9F7] text-[#1C1C1C] rounded-2xl font-display font-bold text-lg tracking-tight transition-all duration-300 hover:-translate-y-1"
            style={{ boxShadow: '0 12px 32px rgba(249, 249, 247, 0.15)' }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(249, 249, 247, 0.25)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(249, 249, 247, 0.15)';
            }}
          >
            Launch ArenaFlow
            <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none" />
          </button>
        </motion.div>
      </section>

    </div>
  );
}

/* ── HELPERS ────────────────────────────────────────────── */

function TimelineLine() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="absolute left-[7px] lg:left-1/2 top-0 bottom-0 w-[2px] bg-[rgba(0,0,0,0.06)] lg:-translate-x-1/2">
      <motion.div className="w-full bg-[#2E7D32]" style={{ height }} />
    </div>
  );
}

function AICopilotSequence() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="flex flex-col gap-6">
      {AI_STEPS.map((step, i) => (
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start gap-4"
        >
          <div className="w-8 h-8 rounded-full bg-[#F9F9F7] border border-[rgba(0,0,0,0.06)] flex items-center justify-center mt-1 shrink-0">
            {i === AI_STEPS.length - 1 ? (
              <span className="material-symbols-outlined text-[16px] text-[#2E7D32]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full pulse-live bg-[#A68A36]" />
            )}
          </div>
          <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-sm border border-[rgba(0,0,0,0.04)] shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
            <p className="font-mono text-[13px] text-[#1C1C1C] font-medium leading-relaxed">{step}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function LiveCounter({ end, suffix }: { end: number, suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();
    
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, end]);

  return (
    <span ref={ref} className="font-display font-bold text-3xl text-white">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

function StadiumAerial() {
  return (
    <svg
      viewBox="0 0 900 500"
      fill="none"
      style={{ width: '100%', height: '100%', opacity: 1 }}
      aria-hidden="true"
    >
      <ellipse cx="450" cy="250" rx="440" ry="235" stroke="rgba(46,125,50,0.12)" strokeWidth="1"/>
      <ellipse cx="450" cy="250" rx="400" ry="210" stroke="rgba(46,125,50,0.08)" strokeWidth="0.5"/>
      <ellipse cx="450" cy="250" rx="360" ry="188" stroke="rgba(46,125,50,0.06)" strokeWidth="0.5"/>
      <rect x="100" y="90" width="700" height="320" rx="4" stroke="rgba(46,125,50,0.20)" strokeWidth="1"/>
      <line x1="450" y1="90" x2="450" y2="410" stroke="rgba(46,125,50,0.15)" strokeWidth="0.7"/>
      <circle cx="450" cy="250" r="70" stroke="rgba(46,125,50,0.18)" strokeWidth="0.7"/>
      <circle cx="450" cy="250" r="4" fill="rgba(46,125,50,0.40)"/>
      <rect x="100" y="160" width="110" height="180" rx="2" stroke="rgba(46,125,50,0.14)" strokeWidth="0.6"/>
      <rect x="100" y="200" width="48" height="100" rx="1" stroke="rgba(46,125,50,0.10)" strokeWidth="0.5"/>
      <circle cx="210" cy="250" r="3" fill="rgba(46,125,50,0.30)"/>
      <path d="M 210 180 A 70 70 0 0 1 210 320" stroke="rgba(46,125,50,0.10)" strokeWidth="0.6" fill="none"/>
      <rect x="690" y="160" width="110" height="180" rx="2" stroke="rgba(46,125,50,0.14)" strokeWidth="0.6"/>
      <rect x="752" y="200" width="48" height="100" rx="1" stroke="rgba(46,125,50,0.10)" strokeWidth="0.5"/>
      <circle cx="690" cy="250" r="3" fill="rgba(46,125,50,0.30)"/>
      <path d="M 690 180 A 70 70 0 0 0 690 320" stroke="rgba(46,125,50,0.10)" strokeWidth="0.6" fill="none"/>
      <path d="M 100 100 A 12 12 0 0 1 112 90" stroke="rgba(46,125,50,0.14)" strokeWidth="0.6" fill="none"/>
      <path d="M 790 90 A 12 12 0 0 1 800 100" stroke="rgba(46,125,50,0.14)" strokeWidth="0.6" fill="none"/>
      <path d="M 800 400 A 12 12 0 0 1 790 410" stroke="rgba(46,125,50,0.14)" strokeWidth="0.6" fill="none"/>
      <path d="M 112 410 A 12 12 0 0 1 100 400" stroke="rgba(46,125,50,0.14)" strokeWidth="0.6" fill="none"/>
      {[1,2,3,4,5].map(i => (
        <ellipse key={i} cx="450" cy="250"
          rx={355 + i*6} ry={183 + i*5}
          stroke={`rgba(46,125,50,${0.025 - i*0.004})`} strokeWidth="0.4" fill="none"
        />
      ))}
      {[[95, 85], [805, 85], [95, 415], [805, 415]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="6" fill="rgba(46,125,50,0.15)" stroke="rgba(46,125,50,0.30)" strokeWidth="0.8"/>
          <circle cx={x} cy={y} r="3" fill="rgba(46,125,50,0.50)"/>
          <circle cx={x} cy={y} r="14" fill="rgba(46,125,50,0.06)"/>
        </g>
      ))}
      <ellipse cx="450" cy="95" rx="160" ry="20" fill="rgba(46,125,50,0.06)"/>
      <ellipse cx="450" cy="405" rx="160" ry="20" fill="rgba(46,125,50,0.06)"/>
      <ellipse cx="108" cy="250" rx="20" ry="90" fill="rgba(46,125,50,0.05)"/>
      <ellipse cx="792" cy="250" rx="20" ry="90" fill="rgba(46,125,50,0.05)"/>
    </svg>
  );
}
