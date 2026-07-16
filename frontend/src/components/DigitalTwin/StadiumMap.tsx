import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Clock, AlertTriangle } from 'lucide-react';
import { useTelemetry } from '../../context/SocketContext';

interface ZonePosition {
  id: string;
  name: string;
  type: 'gate' | 'stand' | 'facility' | 'transit' | 'utility';
  x: number;
  y: number;
  w?: number;
  h?: number;
  r?: number;
  shape: 'rect' | 'circle' | 'path';
}

const zoneLayouts: ZonePosition[] = [
  { id: 'gate-a', name: 'Gate A', type: 'gate', x: 200, y: 100, r: 18, shape: 'circle' },
  { id: 'gate-b', name: 'Gate B', type: 'gate', x: 600, y: 100, r: 18, shape: 'circle' },
  { id: 'gate-c', name: 'Gate C', type: 'gate', x: 200, y: 500, r: 18, shape: 'circle' },
  { id: 'gate-d', name: 'Gate D', type: 'gate', x: 600, y: 500, r: 18, shape: 'circle' },
  
  { id: 'stand-north', name: 'North Stand', type: 'stand', x: 260, y: 60, w: 280, h: 50, shape: 'rect' },
  { id: 'stand-south', name: 'South Stand', type: 'stand', x: 260, y: 490, w: 280, h: 50, shape: 'rect' },
  { id: 'stand-east', name: 'East Stand', type: 'stand', x: 620, y: 160, w: 50, h: 280, shape: 'rect' },
  { id: 'stand-west', name: 'West Stand', type: 'stand', x: 130, y: 160, w: 50, h: 280, shape: 'rect' },
  
  { id: 'vip-area', name: 'VIP Lounge', type: 'facility', x: 280, y: 260, w: 50, h: 80, shape: 'rect' },
  
  { id: 'medical-center', name: 'Medical Center', type: 'facility', x: 300, y: 550, w: 90, h: 35, shape: 'rect' },
  { id: 'security-office', name: 'Security HQ', type: 'facility', x: 410, y: 550, w: 90, h: 35, shape: 'rect' },
  { id: 'food-court-a', name: 'Food Court A', type: 'facility', x: 280, y: 10, w: 100, h: 35, shape: 'rect' },
  { id: 'food-court-b', name: 'Food Court B', type: 'facility', x: 420, y: 10, w: 100, h: 35, shape: 'rect' },
  { id: 'restrooms', name: 'Restrooms East', type: 'utility', x: 690, y: 60, w: 70, h: 35, shape: 'rect' },
  
  { id: 'transit-station', name: 'Transit Hub', type: 'transit', x: 20, y: 240, w: 80, h: 120, shape: 'rect' },
  { id: 'parking-lot', name: 'Parking Lot East', type: 'transit', x: 690, y: 480, w: 90, h: 80, shape: 'rect' },
];

const statusText = {
  optimal: 'text-emerald-600',
  warning: 'text-amber-600',
  critical: 'text-rose-600',
  inactive: 'text-slate-400',
};

export default function StadiumMap() {
  const { state, selectedZoneId, setSelectedZoneId } = useTelemetry();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Functional Map States
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [heatmapActive, setHeatmapActive] = useState<boolean>(true);
  const [telemetryMode, setTelemetryMode] = useState<'crowd' | 'wait'>('crowd');

  const zones = zoneLayouts.map(layout => {
    const liveData = state?.zones[layout.id];
    return {
      ...layout,
      status: liveData?.status || ('optimal' as const),
      crowd: liveData?.currentLoad || 0,
      capacity: liveData?.capacity || 1000,
      waitTime: liveData?.waitTime || 0,
      risk: liveData?.risk || ('Low' as const),
    };
  });

  const selectedZone = zones.find(z => z.id === selectedZoneId) || null;
  const hoveredZone = zones.find(z => z.id === hoveredId) || null;

  const handleMouseMove = (e: React.MouseEvent, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (parentRect) {
      setTooltipPos({
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top - 10,
      });
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(2.5, prev + 0.25));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(1.0, prev - 0.25));
  };

  // Status colors based on Heatmap Mode and Telemetry Mode
  const getStatusColors = (zone: typeof zones[0]) => {
    if (!heatmapActive) {
      return 'fill-slate-50 stroke-slate-350 hover:fill-slate-100';
    }

    // If wait time mode is active, color scale by wait time
    if (telemetryMode === 'wait') {
      if (zone.waitTime > 25) {
        return 'fill-rose-500/10 stroke-rose-500/50 hover:fill-rose-500/15';
      }
      if (zone.waitTime > 8) {
        return 'fill-amber-500/10 stroke-amber-500/50 hover:fill-amber-500/15';
      }
      return 'fill-emerald-500/5 stroke-emerald-500/40 hover:fill-emerald-500/10';
    }

    // Default: crowd state status colors
    if (zone.status === 'critical') {
      return 'fill-rose-500/10 stroke-rose-500/50 hover:fill-rose-500/15';
    }
    if (zone.status === 'warning') {
      return 'fill-amber-500/10 stroke-amber-500/50 hover:fill-amber-500/15';
    }
    return 'fill-emerald-500/5 stroke-emerald-500/40 hover:fill-emerald-500/10';
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      
      {/* Top controls overlay */}
      <div className="absolute top-6 left-6 flex gap-2 z-20 pointer-events-auto">
        <button
          onClick={() => setHeatmapActive(prev => !prev)}
          className={`glass-card px-4 py-2 rounded-full font-label-caps text-label-caps border transition-all ${
            heatmapActive
              ? 'text-primary border-primary/20 bg-white/95 shadow-sm'
              : 'text-on-surface-variant border-outline/10 bg-white/70'
          }`}
        >
          HEATMAP: {heatmapActive ? 'ON' : 'OFF'}
        </button>
        <button
          onClick={() => setTelemetryMode(prev => prev === 'crowd' ? 'wait' : 'crowd')}
          className="glass-card px-4 py-2 rounded-full font-label-caps text-label-caps text-on-surface-variant bg-white/95 border border-outline/10 shadow-sm hover:text-primary transition-colors"
        >
          MODE: {telemetryMode === 'crowd' ? 'CROWD LOAD' : 'WAIT TIME'}
        </button>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20 pointer-events-auto">
        <button
          onClick={handleZoomIn}
          className="glass-card w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary transition-all border border-outline/10 shadow-md bg-white"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
        <button
          onClick={handleZoomOut}
          className="glass-card w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary transition-all border border-outline/10 shadow-md bg-white"
        >
          <span className="material-symbols-outlined">remove</span>
        </button>
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox="0 0 800 600"
        className="w-full max-h-[460px] select-none"
      >
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </radialGradient>
        </defs>
        <rect width="800" height="600" fill="url(#mapGlow)" rx="24" />

        {/* Zoom wrapper group */}
        <g
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: '400px 300px',
            transition: 'transform 0.3s ease-out',
          }}
        >
          {/* Exit Paths */}
          <g stroke="rgba(0,0,0,0.06)" strokeWidth="1.5" strokeDasharray="4 4" fill="none">
            <path id="path1" d="M 130 300 Q 200 300 200 500" />
            <path id="path2" d="M 670 300 Q 600 300 600 500" />
            <path id="path3" d="M 400 60 L 400 490" />
            <path id="path4" d="M 260 300 L 540 300" />
          </g>

          {/* Animated Moving Particles (Crowd flow simulation) along SVG paths */}
          <g fill="#475569" opacity="0.4">
            <circle r="3">
              <animateMotion dur="6s" repeatCount="indefinite" path="M 130 300 Q 200 300 200 500" />
            </circle>
            <circle r="3">
              <animateMotion dur="8s" repeatCount="indefinite" path="M 670 300 Q 600 300 600 500" />
            </circle>
            <circle r="2.5">
              <animateMotion dur="5s" repeatCount="indefinite" path="M 400 60 L 400 490" />
            </circle>
            <circle r="3">
              <animateMotion dur="7s" repeatCount="indefinite" path="M 260 300 L 540 300" />
            </circle>
          </g>

          {/* Pitch Area */}
          <defs>
            <linearGradient id="pitchGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2E7D32" />
              <stop offset="100%" stopColor="#1B5E20" />
            </linearGradient>
            <clipPath id="pitchClip">
              <rect x="340" y="200" width="120" height="200" rx="6" />
            </clipPath>
          </defs>

          {/* Pitch Turf Background with alternating grass mowing stripes */}
          <g clipPath="url(#pitchClip)">
            <rect x="340" y="200" width="120" height="200" fill="url(#pitchGradient)" />
            {/* Alternating stripes using overlay with low opacity */}
            <rect x="340" y="220" width="120" height="20" fill="#FFFFFF" opacity="0.06" />
            <rect x="340" y="260" width="120" height="20" fill="#FFFFFF" opacity="0.06" />
            <rect x="340" y="300" width="120" height="20" fill="#FFFFFF" opacity="0.06" />
            <rect x="340" y="340" width="120" height="20" fill="#FFFFFF" opacity="0.06" />
            <rect x="340" y="380" width="120" height="20" fill="#FFFFFF" opacity="0.06" />
          </g>

          {/* Pitch Markings */}
          <g>
            {/* Boundary */}
            <rect
              x="340"
              y="200"
              width="120"
              height="200"
              rx="6"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              opacity="0.55"
            />

            {/* Halfway line */}
            <line x1="340" y1="300" x2="460" y2="300" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.55" />
            
            {/* Center Circle */}
            <circle cx="400" cy="300" r="22" fill="none" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.55" />
            {/* Center Spot */}
            <circle cx="400" cy="300" r="1.5" fill="#FFFFFF" opacity="0.8" />

            {/* Top Penalty Box & Arc */}
            <rect x="360" y="200" width="80" height="35" fill="none" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.55" />
            <path d="M 382 235 A 22 22 0 0 0 418 235" fill="none" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.55" />
            <circle cx="400" cy="224" r="1" fill="#FFFFFF" opacity="0.8" />
            <rect x="374" y="200" width="52" height="12" fill="none" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.55" />

            {/* Bottom Penalty Box & Arc */}
            <rect x="360" y="365" width="80" height="35" fill="none" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.55" />
            <path d="M 382 365 A 22 22 0 0 1 418 365" fill="none" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.55" />
            <circle cx="400" cy="376" r="1" fill="#FFFFFF" opacity="0.8" />
            <rect x="374" y="388" width="52" height="12" fill="none" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.55" />

            {/* Corner Arcs */}
            <path d="M 340 204 A 4 4 0 0 0 344 200" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.5" />
            <path d="M 456 200 A 4 4 0 0 0 460 204" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.5" />
            <path d="M 340 396 A 4 4 0 0 0 344 400" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.5" />
            <path d="M 456 400 A 4 4 0 0 0 460 396" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.5" />
          </g>

          {/* Map Elements */}
          {zones.map((zone) => {
            const isSelected = selectedZoneId === zone.id;
            const colors = getStatusColors(zone);

            return (
              <g
                key={zone.id}
                className="cursor-pointer font-mono"
                onMouseEnter={() => setHoveredId(zone.id)}
                onMouseLeave={() => setHoveredId(null)}
                onMouseMove={(e) => handleMouseMove(e, zone.id)}
                onClick={() => setSelectedZoneId(zone.id)}
              >
                {/* Highlight selection glow rings */}
                {isSelected && (
                  <g>
                    {zone.shape === 'rect' && zone.w && zone.h ? (
                      <motion.rect
                        layoutId={`select-${zone.id}`}
                        x={zone.x - 4}
                        y={zone.y - 4}
                        width={zone.w + 8}
                        height={zone.h + 8}
                        rx={12}
                        className="fill-none stroke-slate-900 stroke-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    ) : zone.shape === 'circle' && zone.r ? (
                      <motion.circle
                        layoutId={`select-${zone.id}`}
                        cx={zone.x}
                        cy={zone.y}
                        r={zone.r + 5}
                        className="fill-none stroke-slate-900 stroke-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    ) : null}
                  </g>
                )}

                {/* Base shapes */}
                {zone.shape === 'rect' && zone.w && zone.h ? (
                  <>
                    <rect
                      x={zone.x}
                      y={zone.y}
                      width={zone.w}
                      height={zone.h}
                      rx={8}
                      className={`transition-all duration-300 stroke-[1.5] ${colors}`}
                    />
                    <text
                      x={zone.x + zone.w / 2}
                      y={zone.y + zone.h / 2 + 4}
                      textAnchor="middle"
                      className="fill-slate-600 text-[9px] font-bold tracking-wider pointer-events-none"
                    >
                      {zone.name}
                    </text>
                  </>
                ) : zone.shape === 'circle' && zone.r ? (
                  <>
                    {/* Gate pulsing glow if warning/critical */}
                    {zone.status !== 'optimal' && (
                      <circle
                        cx={zone.x}
                        cy={zone.y}
                        r={zone.r + 4}
                        className={`fill-none stroke-2 animate-ping opacity-30 ${
                          zone.status === 'critical' ? 'stroke-rose-500' : 'stroke-amber-500'
                        }`}
                      />
                    )}
                    <circle
                      cx={zone.x}
                      cy={zone.y}
                      r={zone.r}
                      className={`transition-all duration-300 stroke-[1.5] ${colors}`}
                    />
                    <text
                      x={zone.x}
                      y={zone.y + 3}
                      textAnchor="middle"
                      className="fill-slate-600 text-[8px] font-bold pointer-events-none"
                    >
                      {zone.name.split(' ')[1]}
                    </text>
                  </>
                ) : null}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {hoveredZone && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: 'absolute',
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: 'translate(-50%, -100%)',
            }}
            className="z-30 pointer-events-none bg-slate-900 border border-slate-950 px-3.5 py-2.5 rounded-xl shadow-xl flex flex-col text-[10px] space-y-1 text-white"
          >
            <span className="font-bold border-b border-white/10 pb-1">{hoveredZone.name}</span>
            <div className="flex justify-between gap-4">
              <span className="opacity-70">Crowd Load:</span>
              <span className="font-bold">{hoveredZone.crowd} / {hoveredZone.capacity}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="opacity-70">Wait Time:</span>
              <span className="font-bold">{hoveredZone.waitTime} min</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="opacity-70">Risk Level:</span>
              <span className={`font-bold capitalize ${statusText[hoveredZone.status]}`}>
                {hoveredZone.status} ({hoveredZone.risk})
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zone Inspector Panel */}
      <AnimatePresence>
        {selectedZone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-6 left-6 bg-white/95 border border-slate-200 p-5 rounded-2xl backdrop-blur-xl shadow-2xl z-20 flex flex-col w-72"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                Zone Inspector
              </span>
              <button
                onClick={() => setSelectedZoneId(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <h4 className="text-xs font-bold text-slate-955 mb-4">{selectedZone.name}</h4>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col">
                <span className="flex items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1 font-mono">
                  <Users className="h-3 w-3 mr-1 text-slate-400" />
                  Crowd Load
                </span>
                <span className="font-mono text-xs font-bold text-slate-800">
                  {selectedZone.crowd}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col">
                <span className="flex items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1 font-mono">
                  <Shield className="h-3 w-3 mr-1 text-slate-400" />
                  Capacity
                </span>
                <span className="font-mono text-xs font-bold text-slate-800">
                  {selectedZone.capacity}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col">
                <span className="flex items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1 font-mono">
                  <Clock className="h-3 w-3 mr-1 text-slate-400" />
                  Wait Time
                </span>
                <span className="font-mono text-xs font-bold text-slate-800">
                  {selectedZone.waitTime} min
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col">
                <span className="flex items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1 font-mono">
                  <AlertTriangle className="h-3 w-3 mr-1 text-slate-400" />
                  Risk level
                </span>
                <span className={`text-xs font-bold ${statusText[selectedZone.status]}`}>
                  {selectedZone.risk}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
