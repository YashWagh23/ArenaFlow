import React, { useState } from 'react';
import { Play, Pause, Compass, Layers, Globe, BarChart2, Map } from 'lucide-react';
import StadiumMap from './DigitalTwin/StadiumMap';
import ExecutiveDashboard from './ExecutiveDashboard';
import { useTelemetry } from '../context/SocketContext';

export default function CenterPanel() {
  const { state, isPlaying, setPlaying, scrubSim } = useTelemetry();
  const [activeTab, setActiveTab] = useState<'map' | 'analytics'>('map');

  const elapsed = state ? state.elapsedMinutes : 0;

  return (
    <div className="flex-1 p-6 flex flex-col h-[calc(100vh-5rem)] bg-[#F6F7F9] overflow-hidden">
      
      {/* View Toggle Bar (Top header layout) */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-1 bg-slate-100 border border-slate-200 rounded-xl p-0.5">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition ${
              activeTab === 'map'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'bg-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Map className="h-3.5 w-3.5" />
            <span>Digital Twin Map</span>
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition ${
              activeTab === 'analytics'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'bg-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            <span>Executive Analytics</span>
          </button>
        </div>

        <div className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest bg-white border border-slate-200 px-3.5 py-1 rounded-full shadow-sm">
          {activeTab === 'map' ? 'Spatial Telemetry' : 'Executive Overview'}
        </div>
      </div>

      {/* Main Center Canvas Container Card */}
      <div className="flex-1 rounded-3xl border border-slate-200 bg-white relative overflow-hidden flex flex-col shadow-sm">
        
        {/* Soft Background Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />

        {/* Render View */}
        {activeTab === 'map' ? (
          <>
            {/* Top Control Bar */}
            <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-center pointer-events-none">
              <div className="flex items-center space-x-2 bg-white/90 border border-slate-200 rounded-xl px-4 py-1.5 shadow-sm pointer-events-auto">
                <Layers className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest font-mono">Inflow Channels Active</span>
              </div>
              
              <div className="flex space-x-1 bg-white/90 border border-slate-200 rounded-xl p-0.5 shadow-sm pointer-events-auto">
                <button className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-600">
                  <Compass className="h-3.5 w-3.5" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400">
                  <Globe className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Stadium Interactive Map Vector Grid */}
            <div className="flex-1 flex flex-col relative">
              <StadiumMap />
            </div>

            {/* Legend Panel */}
            <div className="absolute bottom-6 left-6 flex space-x-6 bg-white/90 border border-slate-200 rounded-xl px-5 py-2.5 shadow-sm text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Normal</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Elevated</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span>Predicted Surge</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col relative z-10">
            <ExecutiveDashboard />
          </div>
        )}
      </div>

      {/* Control Console (Timeline slider) */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4.5 flex items-center gap-6 shadow-sm">
        {/* Playback Toggle */}
        <button
          onClick={() => setPlaying(!isPlaying)}
          aria-label="Simulation playback play pause toggle button"
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-950 hover:bg-slate-800 text-white transition shadow-sm"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" fill="currentColor" />}
        </button>

        {/* Apple Video-Style Timeline Slider */}
        <div className="flex-1 flex items-center space-x-4">
          <span className="text-[9px] font-bold font-mono tracking-widest text-slate-400 uppercase">00m</span>
          <div className="flex-1 relative flex flex-col justify-center">
            <input
              type="range"
              min="0"
              max="95"
              value={elapsed}
              aria-label="Simulation match minute timeline scrub slider"
              onChange={(e) => scrubSim(Number(e.target.value))}
              className="w-full h-1 bg-slate-100 rounded-full appearance-none cursor-pointer accent-slate-900 hover:accent-slate-800"
              style={{
                background: `linear-gradient(to right, #0f172a 0%, #0f172a ${(elapsed / 95) * 100}%, #f1f5f9 ${(elapsed / 95) * 100}%, #f1f5f9 100%)`
              }}
            />
            <div className="flex justify-between px-0.5 text-[8px] font-bold font-mono text-slate-400 mt-2">
              <span>Start</span>
              <span>Halftime (45m)</span>
              <span>Fulltime (90m)</span>
              <span>Complete (95m)</span>
            </div>
          </div>
          <span className="text-[9px] font-bold font-mono tracking-widest text-slate-400 uppercase">95m</span>
        </div>
      </div>
    </div>
  );
}
