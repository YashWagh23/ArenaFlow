import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../context/SocketContext';
import { ShieldAlert, AlertTriangle, CheckCircle, Users, Clock, Flame, Shield, TrendingUp, Sparkles, Volume2, VolumeX, Loader2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExecutiveDashboard() {
  const { state, analytics, events, briefingText, briefingLoading, requestBriefing, clearBriefing } = useTelemetry();
  const [typedText, setTypedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'load' | 'status'>('name');

  // Check if browser supports speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSupported(true);
    }
  }, []);

  // Typing effect animation
  useEffect(() => {
    if (briefingText) {
      let index = 0;
      setTypedText('');
      const interval = setInterval(() => {
        setTypedText(prev => prev + briefingText.charAt(index));
        index++;
        if (index >= briefingText.length) {
          clearInterval(interval);
        }
      }, 12);
      return () => clearInterval(interval);
    } else {
      setTypedText('');
    }
  }, [briefingText]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(briefingText);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!state || !analytics) {
    return (
      <div className="flex h-full w-full items-center justify-center text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span className="text-xs font-mono">Loading Executive Interface...</span>
      </div>
    );
  }

  // Color mappings
  const safetyColor = state.globalSafetyScore > 85 
    ? 'stroke-emerald-500' 
    : state.globalSafetyScore > 60 
    ? 'stroke-amber-500' 
    : 'stroke-rose-500';

  const safetyBG = state.globalSafetyScore > 85 
    ? 'bg-emerald-50 text-emerald-700' 
    : state.globalSafetyScore > 60 
    ? 'bg-amber-50 text-amber-700' 
    : 'bg-rose-50 text-rose-700';

  // Filter & Sort zones
  const filteredZones = Object.values(state.zones)
    .filter(z => z.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'load') return b.currentLoad - a.currentLoad;
      return a.status.localeCompare(b.status);
    });

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none h-[500px] relative bg-[#FAFAFA]">
      
      {/* Top Hero Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Safety Score Card (Bloomberg/F1 dashboard layout) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
          <div className="absolute top-4 left-4 text-[9px] font-bold font-mono text-slate-400 uppercase tracking-widest">
            Safety Scorecard
          </div>
          
          <div className="relative h-28 w-28 flex items-center justify-center mt-3">
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="46"
                className="stroke-slate-100"
                strokeWidth="7"
                fill="transparent"
              />
              <motion.circle
                cx="56"
                cy="56"
                r="46"
                className={safetyColor}
                strokeWidth="7"
                fill="transparent"
                strokeDasharray={289}
                initial={{ strokeDashoffset: 289 }}
                animate={{ strokeDashoffset: 289 - (289 * state.globalSafetyScore) / 100 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </svg>
            <span className="font-mono text-2xl font-extrabold text-slate-900">
              {state.globalSafetyScore}%
            </span>
          </div>
        </div>

        {/* AI Briefing Summary Box - ChatGPT chat UI style */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2 relative overflow-hidden flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-slate-700 animate-pulse" />
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Operations Briefing</h3>
            </div>

            <button
              onClick={requestBriefing}
              disabled={briefingLoading}
              className="flex items-center space-x-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 rounded-full text-[9px] uppercase font-bold tracking-wider transition shadow-sm text-white"
            >
              {briefingLoading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <span>🎙 Briefing Mode</span>
                </>
              )}
            </button>
          </div>
          
          <div className="p-3 bg-slate-50 border border-slate-250/60 rounded-2xl relative mb-3">
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              "{analytics.executiveSummary}"
            </p>
          </div>

          <div className="flex space-x-4 border-t border-slate-100 pt-3 text-[9px] text-slate-400 font-bold font-mono">
            <span>Orchestrator Link: ONLINE</span>
          </div>
        </div>
      </div>

      {/* AI briefing conversational block when active */}
      <AnimatePresence>
        {briefingText && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-slate-250 bg-white p-5 shadow-sm relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-indigo-500 animate-bounce" />
                <span className="text-[9px] font-bold text-indigo-600 font-mono uppercase tracking-widest">
                  AI Vocalized Briefing Readout
                </span>
              </div>
              <div className="flex space-x-1">
                {speechSupported && (
                  <button
                    onClick={handleSpeak}
                    aria-label="Vocalization speaker play toggle button"
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
                  >
                    {isSpeaking ? <VolumeX className="h-4 w-4 text-rose-500 animate-pulse" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                )}
                <button
                  onClick={clearBriefing}
                  className="text-[9px] text-slate-400 hover:text-slate-600 font-bold uppercase tracking-wider"
                >
                  Dismiss
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed font-semibold min-h-[50px]">
              {typedText}
              <span className="inline-block w-1.5 h-3.5 bg-slate-900 ml-0.5 animate-pulse" />
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metrics distributions grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Crowd Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-5 flex items-center">
            <Users className="h-4 w-4 mr-2 text-slate-500" />
            Crowd Distribution
          </h4>

          <div className="space-y-4">
            {Object.entries(analytics.crowdDistribution).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-[10px] mb-1.5 capitalize text-slate-500 font-bold font-mono">
                  <span>{key}</span>
                  <span className="text-slate-800">{val.toLocaleString()} Pax</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-slate-900 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (val / 30000) * 100)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Scorecard */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-5 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-slate-500" />
            Operational Metrics
          </h4>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1 font-mono">Avg Gate Wait</span>
              <span className="font-mono text-base font-bold text-slate-800">{analytics.avgGateWait} min</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1 font-mono">Parking Load</span>
              <span className="font-mono text-base font-bold text-slate-800">{analytics.parkingCapacityPercent}%</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1 font-mono">Transit Load</span>
              <span className="font-mono text-base font-bold text-slate-800">{analytics.transitLoadPercent}%</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1 font-mono">Concessions</span>
              <span className="font-mono text-base font-bold text-slate-800">{analytics.avgFoodQueue} min</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1 font-mono">Medical Cases</span>
              <span className="font-mono text-base font-bold text-rose-600">{analytics.medicalRequests}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1 font-mono">Stewards Free</span>
              <span className="font-mono text-base font-bold text-emerald-600">{analytics.volunteersAvailable}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Health Index table with Search / Sort controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 mb-5">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Zone Health Index</h4>
          
          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search zones..."
                value={searchQuery}
                aria-label="Zone health index search box"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8.5 pr-3 py-1.5 w-full sm:w-44 text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 rounded-xl"
              />
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              aria-label="Sort zone health metrics sorting index list"
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 rounded-xl font-medium"
            >
              <option value="name">Sort: Name</option>
              <option value="load">Sort: Crowd</option>
              <option value="status">Sort: Status</option>
            </select>
          </div>
        </div>

        <div className="max-h-[220px] overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredZones.map((z) => (
            <div
              key={z.id}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between shadow-sm"
            >
              <div>
                <span className="text-xs font-bold text-slate-800 block">{z.name}</span>
                <span className="text-[9px] font-mono text-slate-400 font-bold block uppercase mt-0.5">
                  Wait: {z.waitTime}m | Load: {z.currentLoad}
                </span>
              </div>
              <span className={`text-[10px] font-bold capitalize ${
                z.status === 'critical' ? 'text-rose-600' : z.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {z.status}
              </span>
            </div>
          ))}

          {filteredZones.length === 0 && (
            <div className="py-6 text-center text-slate-400 text-xs font-mono col-span-3">
              No matching zones found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
