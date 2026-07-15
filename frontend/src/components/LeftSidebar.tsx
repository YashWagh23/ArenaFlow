import React, { useState } from 'react';
import { Sparkles, MessageSquare, ArrowUpRight, History, Bell, AlertTriangle, ShieldCheck, Play, Brain, CheckCircle } from 'lucide-react';
import { useTelemetry } from '../context/SocketContext';
import { motion } from 'framer-motion';

export default function LeftSidebar() {
  const { events, timeline, setSelectedZoneId, isReplaying, startMissionReplay } = useTelemetry();
  const [activeTab, setActiveTab] = useState<'copilot' | 'timeline'>('copilot');
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning'>('all');

  const filteredAlerts = events.filter((alert) => {
    if (filter === 'all') return true;
    return alert.severity === filter;
  });

  const getTimelineIcon = (iconName: string) => {
    switch (iconName) {
      case 'Warning': return <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />;
      case 'Sparkles': return <Sparkles className="h-3.5 w-3.5 text-indigo-500" />;
      case 'Brain': return <Brain className="h-3.5 w-3.5 text-violet-500" />;
      case 'Play': return <Play className="h-3.5 w-3.5 text-slate-700" fill="currentColor" />;
      case 'CheckCircle': return <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />;
      default: return <History className="h-3.5 w-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="w-[380px] p-6 flex flex-col h-[calc(100vh-5rem)] border-r border-slate-200 bg-white">
      
      {/* Tab Switcher (macOS slider style) */}
      <div className="flex bg-slate-100 p-0.5 border border-slate-200 rounded-xl mb-6 relative">
        <button
          onClick={() => setActiveTab('copilot')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all z-10 ${
            activeTab === 'copilot'
              ? 'text-slate-900 bg-white shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Sparkles className="h-3 w-3" />
          <span>Copilot Feed</span>
        </button>
        
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all z-10 ${
            activeTab === 'timeline'
              ? 'text-slate-900 bg-white shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <History className="h-3 w-3" />
          <span>Incident Log</span>
        </button>
      </div>

      {activeTab === 'copilot' ? (
        <>
          {/* Header */}
          <div className="mb-4 space-y-1">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Active Predictions</h2>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
              Cross-department operational alerts projected by ArenaFlow.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex space-x-1.5 mb-4">
            {(['all', 'critical', 'warning'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1 rounded-full text-[9px] uppercase font-bold tracking-wider transition-all border ${
                  filter === type
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Wallet-style prediction cards */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin">
            {filteredAlerts.map((alert) => {
              const isCritical = alert.severity === 'critical';
              
              return (
                <motion.div
                  key={alert.id}
                  whileHover={{ y: -3, scale: 1.01 }}
                  onClick={() => alert.playbook.steps[0]?.target && setSelectedZoneId(alert.playbook.steps[0].target)}
                  className={`group relative overflow-hidden rounded-2xl border bg-white p-5 transition-all duration-300 cursor-pointer shadow-sm ${
                    isCritical 
                      ? 'border-rose-200 hover:border-rose-300' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-md ${
                        isCritical ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 rounded-full px-2 py-0.5 font-mono">
                      {alert.triggerTime}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-slate-800 transition-colors mb-1.5 leading-snug">
                    {alert.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 leading-relaxed mb-4">
                    {alert.reasoning}
                  </p>

                  {/* Tiny progress bar showing confidence level */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-100">
                    <div className="flex justify-between text-[9px] font-bold text-slate-400 font-mono">
                      <span>CONFIDENCE</span>
                      <span>{alert.probability}%</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isCritical ? 'bg-rose-500' : 'bg-amber-500'}`} 
                        style={{ width: `${alert.probability}%` }} 
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {filteredAlerts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="h-7 w-7 text-slate-350 mb-3" />
                <p className="text-xs text-slate-400 font-medium">All channels quiet. No active alerts.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Chronological Timeline Log view */
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Timeline Log</h2>
              <p className="text-[10px] text-slate-400 font-medium">Chronological history of operations.</p>
            </div>
            
            <button
              onClick={startMissionReplay}
              disabled={isReplaying}
              className="flex items-center space-x-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 rounded-full text-[9px] uppercase font-bold tracking-wider transition shadow-sm text-white"
            >
              <span>{isReplaying ? 'Replaying...' : '🎥 Replay'}</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 relative border-l border-slate-100 pl-4 ml-2.5">
            {timeline.map((item) => (
              <div
                key={item.id}
                onClick={() => item.zoneId && setSelectedZoneId(item.zoneId)}
                className={`relative group cursor-pointer p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition shadow-sm`}
              >
                {/* Node connector indicator dot */}
                <div className="absolute -left-[22.5px] top-4.5 h-1.5 w-1.5 rounded-full bg-slate-300 border-2 border-white group-hover:bg-slate-900 transition" />
                
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center space-x-2">
                    {getTimelineIcon(item.icon)}
                    <span className="text-[10px] font-bold text-slate-800">{item.title}</span>
                  </div>
                  <span className="text-[8px] font-mono text-slate-400 font-bold">{item.timestamp}</span>
                </div>
                {item.zoneId && (
                  <span className="block text-[8px] font-mono text-slate-500 font-semibold uppercase tracking-wider">
                    TARGET: {item.zoneId}
                  </span>
                )}
              </div>
            ))}

            {timeline.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-[10px] font-mono">
                No logs recorded.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
