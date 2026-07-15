import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import NavigationSidebar from './components/NavigationSidebar';
import Footer from './components/Footer';
import { SocketProvider } from './context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';

// Import Pages
import LandingPage from './pages/LandingPage';
import Overview from './pages/Overview';
import DigitalTwin from './pages/DigitalTwin';
import AICopilot from './pages/AICopilot';
import ExecutiveAnalytics from './pages/ExecutiveAnalytics';
import IncidentCenter from './pages/IncidentCenter';
import ScenarioSimulator from './pages/ScenarioSimulator';
import Settings from './pages/Settings';

function AppContent() {
  const [loadingStep, setLoadingStep] = useState(0);
  const [appReady, setAppReady] = useState(false);
  const location = useLocation();

  const steps = [
    'Initializing Core Systems...',
    'Connecting World Cup Telemetry...',
    'Rendering Stadium Digital Twin...',
    'Establishing Gemini AI Orchestrator Link...',
    'Mission Control Active',
  ];

  useEffect(() => {
    if (loadingStep < steps.length) {
      const timeout = setTimeout(() => {
        setLoadingStep(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setAppReady(true);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [loadingStep]);

  const isLandingPage = location.pathname === '/';

  return (
    <AnimatePresence mode="wait">
      {!appReady ? (
        // Splash loader — Stitch themed
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-titanium-white pitch-pattern"
        >
          {/* Stadium arc decorations */}
          <div className="stadium-arc" />
          <div className="stadium-arc" style={{ width: '1200px', height: '1200px' }} />

          <div className="text-center space-y-6 relative max-w-sm px-6 z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-outline/20 shadow-xl">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px', fontVariationSettings: "'FILL' 1" }}>stadium</span>
              </div>
            </motion.div>

            <div className="space-y-1.5">
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">ArenaFlow</h1>
              <p className="font-label-caps text-label-caps text-on-surface-variant">
                FIFA World Cup 2026 · Stadium OS
              </p>
            </div>

            {/* Steps Log */}
            <div className="glass-card rounded-2xl p-4 min-h-[80px] flex flex-col justify-center">
              <div className="flex items-center space-x-3 text-left">
                <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '16px' }}>autorenew</span>
                <span className="font-label-caps text-on-surface-variant text-[11px]">
                  {steps[Math.min(loadingStep, steps.length - 1)]}
                </span>
              </div>
              <div className="w-full bg-surface-container h-1 rounded-full mt-4 overflow-hidden">
                <motion.div
                  className="bg-primary h-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(loadingStep / steps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ) : isLandingPage ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="h-screen w-screen overflow-hidden bg-titanium-white pitch-pattern"
        >
          {/* Stadium arc decorations */}
          <div className="stadium-arc pointer-events-none" />
          <div className="stadium-arc pointer-events-none" style={{ width: '1200px', height: '1200px' }} />

          {/* Fixed Top Header */}
          <Header />

          {/* Fixed Left Sidebar */}
          <NavigationSidebar />

          {/* Scrollable main canvas: offset for header (h-16=pt-16) and sidebar (ml-20) */}
          <div className="ml-20 pt-16 h-full overflow-y-auto scrollbar-thin relative z-10">
            <Routes>
              <Route path="/dashboard" element={<Overview />} />
              <Route path="/twin" element={<DigitalTwin />} />
              <Route path="/copilot" element={<AICopilot />} />
              <Route path="/analytics" element={<ExecutiveAnalytics />} />
              <Route path="/incidents" element={<IncidentCenter />} />
              <Route path="/scenarios" element={<ScenarioSimulator />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>

          {/* Mobile Bottom Nav Footer */}
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
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
