import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import NavigationSidebar from './components/NavigationSidebar';
import { SocketProvider } from './context/SocketContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageSkeleton } from './components/PageSkeleton';
import { SPLASH_TOTAL_MS } from './constants/timings';
import { motion, AnimatePresence } from 'framer-motion';

// Dashboard is eager — primary screen, must load instantly
import Overview from './pages/Overview';

// Non-critical pages are lazy-loaded — split from main bundle
const LandingPage = lazy(() => import('./pages/LandingPage'));
const ScenarioSimulator = lazy(() => import('./pages/ScenarioSimulator'));
const ExecutiveAnalytics = lazy(() => import('./pages/ExecutiveAnalytics'));

/* ── Page transition wrapper ─────────────────────────── */
function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ willChange: 'opacity, transform' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Dashboard layout shell ──────────────────────────── */
function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div
      className="h-screen w-screen overflow-hidden relative"
      style={{ background: '#F7F6F1' }}
    >
      {/* Ambient pitch grid — very subtle */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(46,125,50,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(46,125,50,0.025) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          opacity: 0.6,
        }}
      />

      {/* Fixed Top Header */}
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* Fixed Left Sidebar */}
      <NavigationSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Scrollable main canvas — offset for sidebar (48px) + header (60px) */}
      <div
        className="absolute scrollbar-thin overflow-y-auto left-0 md:left-[48px]"
        style={{
          top: '60px',
          right: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

/* ── Animated Splash Screen ──────────────────────────── */
function SplashScreen() {
  const steps = [
    'Initializing Core Systems',
    'Connecting World Cup Telemetry',
    'Rendering Stadium Digital Twin',
    'Establishing AI Orchestrator',
    'Mission Control Active',
  ];

  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (loadingStep < steps.length) {
      const t = setTimeout(() => setLoadingStep(p => p + 1), 440);
      return () => clearTimeout(t);
    }
  }, [loadingStep]);

  const progress = (loadingStep / steps.length) * 100;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: '#F7F6F1' }}
    >
      {/* Floodlight beams */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 800px 600px at 0% 0%, rgba(46,125,50,0.06) 0%, transparent 65%),
            radial-gradient(ellipse 600px 500px at 100% 0%, rgba(46,125,50,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 400px 600px at 50% 100%, rgba(46,125,50,0.03) 0%, transparent 70%)
          `,
        }}
      />

      {/* Ambient pitch grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(46,125,50,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(46,125,50,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Stadium oval rings */}
      <div className="absolute" style={{ width: '700px', height: '700px', border: '1px solid rgba(46,125,50,0.05)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      <div className="absolute" style={{ width: '1100px', height: '1100px', border: '1px solid rgba(46,125,50,0.03)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center" style={{ gap: '32px' }}>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.90 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
        >
          {/* Logo mark */}
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 40px rgba(46,125,50,0.20), 0 8px 32px rgba(0,0,0,0.40)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#F7F6F1', fontVariationSettings: "'FILL' 1" }}>
              stadium
            </span>
          </div>

          <div>
            <h1
              style={{
                fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif",
                fontWeight: 900,
                fontSize: '32px',
                letterSpacing: '-0.04em',
                color: '#1C1C1C',
                lineHeight: 1.0,
              }}
            >
              ArenaFlow
            </h1>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '0.14em',
                color: 'rgba(0,0,0,0.25)',
                textTransform: 'uppercase',
                marginTop: '6px',
              }}
            >
              FIFA World Cup 2026 · Stadium OS
            </p>
          </div>
        </motion.div>

        {/* Loading state */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{ width: '280px' }}
        >
          {/* Current step */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div
              style={{
                width: '14px',
                height: '14px',
                border: '2px solid #2E7D32',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                flexShrink: 0,
                animation: 'spin 1s linear infinite',
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                fontWeight: 600,
                color: 'rgba(0,0,0,0.45)',
                letterSpacing: '0.04em',
              }}
            >
              {steps[Math.min(loadingStep, steps.length - 1)]}
            </span>
          </div>

          {/* Progress track */}
          <div
            style={{
              width: '100%',
              height: '1px',
              background: 'rgba(0,0,0,0.06)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <motion.div
              style={{ height: '100%', background: '#2E7D32', borderRadius: '9999px' }}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
        </motion.div>
      </div>

      {/* Version tag */}
      <div
        className="absolute bottom-8"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '9px',
          fontWeight: 500,
          color: 'rgba(0,0,0,0.15)',
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
        }}
      >
        v2.0 · AI-Powered Stadium Intelligence
      </div>
    </div>
  );
}

/* ── App Content ────────────────────────────────────── */
function AppContent() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAppReady(true), SPLASH_TOTAL_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen w-full" style={{ background: '#F7F6F1' }}>

      {/* Splash Screen */}
      <AnimatePresence>
        {!appReady && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(12px)', scale: 1.02 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ position: 'fixed', inset: 0, zIndex: 100 }}
          >
            <SplashScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {/* App Routes */}
      <ErrorBoundary>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Overview />} />
              <Route path="/scenarios" element={<ScenarioSimulator />} />
              <Route path="/analytics" element={<ExecutiveAnalytics />} />
              <Route path="*" element={<Overview />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
