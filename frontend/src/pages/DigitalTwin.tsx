import React, { useState } from 'react';
import { useTelemetry } from '../context/SocketContext';
import StadiumMap from '../components/DigitalTwin/StadiumMap';

export default function DigitalTwin() {
  const { state, isPlaying, setPlaying, scrubSim, isReplaying, startMissionReplay } = useTelemetry();

  const elapsed = state ? state.elapsedMinutes : 0;
  const parkingLoad = state ? Math.round((state.zones['parking-lot'].currentLoad / state.zones['parking-lot'].capacity) * 100) : 0;
  const transitLoad = state ? Math.round((state.zones['transit-station'].currentLoad / state.zones['transit-station'].capacity) * 100) : 0;
  const medicalLoad = state ? state.zones['medical-center'].currentLoad : 0;
  const vipLoad = state ? state.zones['vip-area'].currentLoad : 0;

  const totalSpectators = state
    ? state.zones['stand-north'].currentLoad + state.zones['stand-south'].currentLoad +
      state.zones['stand-east'].currentLoad + state.zones['stand-west'].currentLoad
    : 0;

  return (
    <div className="h-[calc(100vh-64px)] p-gutter flex gap-gutter overflow-hidden">
      {/* Hero: Stadium Digital Twin Viewport */}
      <div className="flex-grow relative rounded-[32px] overflow-hidden bg-surface-container-lowest border border-pearl shadow-xl recessed-effect">
        {/* Map */}
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-surface-container-low">
          <StadiumMap />
        </div>

        {/* Overlay sensors */}
        <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-primary rounded-full border-2 border-white pulse-critical cursor-pointer z-10 group">
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all glass-panel p-3 rounded-xl w-48 z-10">
            <p className="font-label-caps text-[10px] text-primary">SENSOR G-04</p>
            <p className="font-title-md text-on-surface text-sm">Gate Entrance</p>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-on-surface-variant">Throughput</span>
              <span className="text-xs font-stats-numeric">84/min</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-warning-amber rounded-full border-2 border-white pulse-critical cursor-pointer z-10 group">
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all glass-panel p-3 rounded-xl w-48 z-10">
            <p className="font-label-caps text-[10px] text-warning-amber">SENSOR T-12</p>
            <p className="font-title-md text-on-surface text-sm">Crowd Density</p>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-on-surface-variant">Density Level</span>
              <span className="text-xs font-stats-numeric">HIGH</span>
            </div>
          </div>
        </div>

        {/* Top Floating Legend */}
        <div className="absolute top-6 left-6 flex gap-4 z-10">
          <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-6">
            <div className="flex flex-col">
              <span className="font-label-caps text-[10px] text-on-surface-variant">TOTAL SPECTATORS</span>
              <span className="font-stats-numeric text-headline-lg text-primary">{totalSpectators.toLocaleString()}</span>
            </div>
            <div className="w-px h-10 bg-outline/20" />
            <div className="flex flex-col">
              <span className="font-label-caps text-[10px] text-on-surface-variant">PARKING</span>
              <span className="font-stats-numeric text-headline-lg text-secondary">{parkingLoad}%</span>
            </div>
          </div>
        </div>

        {/* Bottom Control Panel */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-panel px-8 py-4 rounded-full flex items-center gap-10 z-10">
          {/* Play/Pause */}
          <button
            onClick={() => setPlaying(!isPlaying)}
            className={`flex items-center gap-2 cursor-pointer transition-colors ${isPlaying ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isPlaying ? "'FILL' 1" : "'FILL' 0" }}>
              {isPlaying ? 'pause_circle' : 'play_circle'}
            </span>
            <span className="font-body-md font-semibold">{isPlaying ? 'Live' : 'Paused'}</span>
          </button>

          <div className="flex items-center gap-2 cursor-pointer text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">groups</span>
            <span className="font-body-md font-medium">Heatmap</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">security</span>
            <span className="font-body-md font-medium">Security</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">settings_input_antenna</span>
            <span className="font-body-md font-medium">Sensors</span>
          </div>
        </div>

        {/* Replay button */}
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={startMissionReplay}
            disabled={isReplaying}
            className="glass-card px-4 py-2 rounded-full font-label-caps text-label-caps text-on-surface disabled:opacity-50 flex items-center gap-2 hover:bg-white/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">replay</span>
            {isReplaying ? 'Replaying...' : 'Replay'}
          </button>
        </div>

        {/* Timeline scrubber */}
        <div className="absolute bottom-20 left-6 right-6 z-10">
          <div className="glass-panel px-6 py-3 rounded-2xl flex items-center gap-4">
            <span className="font-label-caps text-[10px] text-on-surface-variant">00m</span>
            <input
              type="range"
              min="0"
              max="95"
              value={elapsed}
              onChange={(e) => scrubSim(Number(e.target.value))}
              className="flex-1 h-1 rounded-full cursor-pointer accent-primary"
              style={{
                background: `linear-gradient(to right, #006b3f 0%, #006b3f ${(elapsed / 95) * 100}%, #eeeef0 ${(elapsed / 95) * 100}%, #eeeef0 100%)`
              }}
            />
            <span className="font-label-caps text-[10px] text-on-surface-variant">95m</span>
            <span className="font-stats-numeric text-primary text-sm">{elapsed}m</span>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Active Incidents + AI Copilot */}
      <aside className="w-96 flex flex-col gap-card-gap overflow-y-auto scrollbar-none">
        {/* Active Incidents */}
        <div className="glass-panel p-6 rounded-[24px] flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-title-md text-on-surface">Active Incidents</h3>
            <span className="bg-critical-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {medicalLoad > 0 ? '2 NEW' : '0 NEW'}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="p-4 bg-white rounded-xl border border-error/20 flex gap-4 items-start shadow-sm border-l-4 border-l-critical-red">
              <span className="material-symbols-outlined text-critical-red pulse-critical">warning</span>
              <div>
                <p className="font-body-md font-bold text-on-surface">Congestion at Gate 4</p>
                <p className="text-sm text-on-surface-variant">Flow rate dropped to 12% below threshold.</p>
                <div className="mt-2 flex gap-2">
                  <button className="text-[10px] font-bold py-1 px-3 bg-critical-red text-white rounded-full">DEPLOY TEAM</button>
                  <button className="text-[10px] font-bold py-1 px-3 border border-outline/20 rounded-full">DISMISS</button>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-warning-amber/20 flex gap-4 items-start shadow-sm border-l-4 border-l-warning-amber">
              <span className="material-symbols-outlined text-warning-amber">ac_unit</span>
              <div>
                <p className="font-body-md font-bold text-on-surface">HVAC Zone B-2</p>
                <p className="text-sm text-on-surface-variant">Temp rising in VIP suite 402.</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Copilot Panel */}
        <div className="flex-grow glass-panel p-6 rounded-[24px] flex flex-col relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            </div>
            <div>
              <h3 className="font-title-md text-on-surface">AI Copilot</h3>
              <p className="text-[10px] font-label-caps text-primary">REAL-TIME ADVISORY</p>
            </div>
          </div>
          <div className="flex-grow flex flex-col gap-4 overflow-y-auto scrollbar-none">
            <div className="bg-surface-container-low p-4 rounded-2xl rounded-tl-none border border-outline/5">
              <p className="text-sm text-on-surface leading-relaxed italic">
                "Analyzing Gate 4 flow. I recommend opening auxiliary Gate 4B to redirect 15% of the current queue. Stadium transit data suggests a 4-minute wait time spike."
              </p>
            </div>
            <div className="bg-primary/5 p-4 rounded-2xl rounded-tr-none ml-8 border border-primary/10">
              <p className="text-sm text-primary font-medium">Proposal: Open Gate 4B immediately.</p>
            </div>
            <div className="bg-surface-container-low p-4 rounded-2xl rounded-tl-none border border-outline/5">
              <p className="text-sm text-on-surface leading-relaxed">
                Transit Status updated. 12 shuttle buses arriving in 3 mins. Flow normalized.
              </p>
            </div>
          </div>
          <div className="mt-6 relative">
            <input
              className="w-full bg-white/50 border border-outline/20 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none transition-all pr-12"
              placeholder="Ask ArenaFlow..."
              type="text"
              readOnly
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary cursor-pointer">send</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
