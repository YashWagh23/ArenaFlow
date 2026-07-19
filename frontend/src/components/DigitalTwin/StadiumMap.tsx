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

// ─── Dark editorial status color resolver ────────────────────────────────────
function getDarkStatusColors(zone: {
  status: string;
  waitTime: number;
}, heatmapActive: boolean, telemetryMode: 'crowd' | 'wait') {
  if (!heatmapActive) {
    return {
      fill: 'rgba(0,0,0,0.04)',
      stroke: 'rgba(0,0,0,0.10)',
      hoverFill: 'rgba(0,0,0,0.07)',
    };
  }
  if (telemetryMode === 'wait') {
    if (zone.waitTime > 25)
      return { fill: 'rgba(200,74,74,0.07)', stroke: 'rgba(200,74,74,0.32)', hoverFill: 'rgba(200,74,74,0.13)' };
    if (zone.waitTime > 8)
      return { fill: 'rgba(196,138,0,0.07)', stroke: 'rgba(196,138,0,0.32)', hoverFill: 'rgba(196,138,0,0.13)' };
    return { fill: 'rgba(46,125,50,0.06)', stroke: 'rgba(46,125,50,0.22)', hoverFill: 'rgba(46,125,50,0.11)' };
  }
  if (zone.status === 'critical')
    return { fill: 'rgba(200,74,74,0.07)', stroke: 'rgba(200,74,74,0.32)', hoverFill: 'rgba(200,74,74,0.13)' };
  if (zone.status === 'warning')
    return { fill: 'rgba(196,138,0,0.07)', stroke: 'rgba(196,138,0,0.32)', hoverFill: 'rgba(196,138,0,0.13)' };
  return { fill: 'rgba(46,125,50,0.06)', stroke: 'rgba(46,125,50,0.22)', hoverFill: 'rgba(46,125,50,0.11)' };
}

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '9px',
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  pointerEvents: 'none',
};

const ZOOM_BTN: React.CSSProperties = {
  width: '48px',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '12px',
  border: '1px solid rgba(0,0,0,0.08)',
  background: 'rgba(0,0,0,0.05)',
  backdropFilter: 'blur(20px)',
  color: 'rgba(0,0,0,0.70)',
  cursor: 'pointer',
  transition: 'border-color 150ms, color 150ms, box-shadow 150ms',
};

const SEG_BTN = (active: boolean): React.CSSProperties => ({
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '9px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  padding: '5px 10px',
  borderRadius: '7px',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 150ms',
  background: active ? 'rgba(46,125,50,0.15)' : 'transparent',
  color: active ? '#2E7D32' : 'rgba(0,0,0,0.35)',
  boxShadow: active ? '0 0 12px rgba(46,125,50,0.18)' : 'none',
});

const SEG_WRAP: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  background: 'rgba(0,0,0,0.04)',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: '10px',
  padding: '3px',
  backdropFilter: 'blur(20px)',
  gap: '2px',
};

const STAT_TILE: React.CSSProperties = {
  background: 'rgba(0,0,0,0.03)',
  border: '1px solid rgba(0,0,0,0.06)',
  borderRadius: '10px',
  padding: '10px 12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const STAT_LABEL: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '8px',
  fontWeight: 700,
  letterSpacing: '0.14em',
  color: 'rgba(0,0,0,0.35)',
  textTransform: 'uppercase',
};

const STAT_VALUE: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '13px',
  fontWeight: 700,
  color: '#1C1C1C',
};

export default function StadiumMap() {
  const { state, selectedZoneId, setSelectedZoneId } = useTelemetry();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Functional Map States (preserved exactly)
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

  const handleMouseMove = (e: React.MouseEvent, _id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (parentRect) {
      setTooltipPos({
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top - 10,
      });
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(2.5, prev + 0.25));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(1.0, prev - 0.25));

  const riskColor = (status: string) =>
    status === 'critical' ? '#C84A4A' : status === 'warning' ? '#C48A00' : '#2E7D32';

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center"
      style={{ background: 'transparent' }}
    >
      {/* ── Tactical Grid ────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '120px 120px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Ambient Pitch Glow ────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200px',
          height: '280px',
          background: 'radial-gradient(ellipse at center, rgba(46,125,50,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Animated Scan Noise ───────────────────────────── */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 2,
          opacity: 0.018,
        }}
      >
        <filter id="dtScanNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch">
            <animate attributeName="baseFrequency" dur="8s" values="0.65;0.68;0.65" repeatCount="indefinite" />
          </feTurbulence>
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#dtScanNoise)" />
      </svg>

      {/* ── Radar Sweep ───────────────────────────────────── */}
      <svg
        aria-hidden="true"
        viewBox="0 0 800 600"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 3,
          overflow: 'hidden',
        }}
      >
        <defs>
          <radialGradient id="dtRadarGrad" cx="400" cy="300" r="350" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(46,125,50,0.05)" />
            <stop offset="100%" stopColor="rgba(46,125,50,0)" />
          </radialGradient>
          <style>{`
            @keyframes dtRadarSweep {
              from { transform: rotate(0deg); transform-box: fill-box; transform-origin: 400px 300px; }
              to   { transform: rotate(360deg); transform-box: fill-box; transform-origin: 400px 300px; }
            }
            .dt-radar-arm { animation: dtRadarSweep 8s linear infinite; }
          `}</style>
        </defs>
        <g className="dt-radar-arm">
          <path d="M 400 300 L 400 0 A 350 350 0 0 1 750 300 Z" fill="url(#dtRadarGrad)" opacity="0.06" />
        </g>
      </svg>

      {/* ── Top Controls — Segmented Controls ────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          display: 'flex',
          gap: '8px',
          zIndex: 20,
          pointerEvents: 'auto',
        }}
      >
        {/* Heatmap toggle */}
        <div style={SEG_WRAP}>
          <button onClick={() => setHeatmapActive(true)} style={SEG_BTN(heatmapActive)}>Heatmap</button>
          <button onClick={() => setHeatmapActive(false)} style={SEG_BTN(!heatmapActive)}>Off</button>
        </div>
        {/* Mode toggle */}
        <div style={SEG_WRAP}>
          <button onClick={() => setTelemetryMode('crowd')} style={SEG_BTN(telemetryMode === 'crowd')}>Crowd</button>
          <button onClick={() => setTelemetryMode('wait')} style={SEG_BTN(telemetryMode === 'wait')}>Wait</button>
        </div>
      </div>

      {/* ── Zoom Controls — Dark Glass ───────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 20,
          pointerEvents: 'auto',
        }}
      >
        {([
          { action: handleZoomIn, icon: 'add' },
          { action: handleZoomOut, icon: 'remove' },
        ] as const).map(({ action, icon }) => (
          <button
            key={icon}
            onClick={action}
            style={ZOOM_BTN}
            onMouseEnter={e => {
              const b = e.currentTarget;
              b.style.borderColor = 'rgba(46,125,50,0.40)';
              b.style.color = '#2E7D32';
              b.style.boxShadow = '0 0 16px rgba(46,125,50,0.20)';
            }}
            onMouseLeave={e => {
              const b = e.currentTarget;
              b.style.borderColor = 'rgba(0,0,0,0.08)';
              b.style.color = 'rgba(0,0,0,0.70)';
              b.style.boxShadow = 'none';
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{icon}</span>
          </button>
        ))}
      </div>

      {/* ── SVG Map Canvas ───────────────────────────────── */}
      <svg
        viewBox="0 0 800 600"
        className="w-full max-h-[460px] select-none"
        style={{ position: 'relative', zIndex: 4 }}
      >
        <defs>
          {/* Dark map radial background */}
          <radialGradient id="dtMapBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#111814" />
            <stop offset="70%"  stopColor="#0B0F0D" />
            <stop offset="100%" stopColor="#F7F6F1" />
          </radialGradient>

          {/* Subtle vignette */}
          <radialGradient id="dtVignette" cx="50%" cy="50%" r="70%">
            <stop offset="60%"  stopColor="transparent" stopOpacity="0" />
            <stop offset="100%" stopColor="#050805"    stopOpacity="0.65" />
          </radialGradient>

          {/* Pitch — darker green */}
          <linearGradient id="dtPitchGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#1E6B35" />
            <stop offset="100%" stopColor="#195A2E" />
          </linearGradient>

          {/* Pitch ambient glow */}
          <radialGradient id="dtPitchGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#2E7D32" stopOpacity="0.06" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          <clipPath id="dtPitchClip">
            <rect x="340" y="200" width="120" height="200" rx="6" />
          </clipPath>

          {/* Selection glow */}
          <filter id="dtSelectGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background */}
        <rect width="800" height="600" fill="url(#dtMapBg)" rx="20" />

        {/* Stadium bowl outline geometry — 5% opacity structural rings */}
        <ellipse cx="400" cy="300" rx="340" ry="260" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
        <ellipse cx="400" cy="300" rx="290" ry="215" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.8" strokeDasharray="6 6" />

        {/* Vignette */}
        <rect width="800" height="600" fill="url(#dtVignette)" rx="20" />

        {/* ── Zoom wrapper ── */}
        <g
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: '400px 300px',
            transition: 'transform 0.3s ease-out',
          }}
        >
          {/* Exit paths — tactical green dashes */}
          <g stroke="rgba(46,125,50,0.12)" strokeWidth="1" strokeDasharray="4 4" fill="none">
            <path id="dtPath1" d="M 130 300 Q 200 300 200 500" />
            <path id="dtPath2" d="M 670 300 Q 600 300 600 500" />
            <path id="dtPath3" d="M 400 60 L 400 490" />
            <path id="dtPath4" d="M 260 300 L 540 300" />
          </g>

          {/* Crowd flow particles — green */}
          <g fill="#2E7D32" opacity="0.45">
            <circle r="2"><animateMotion dur="6s" repeatCount="indefinite" path="M 130 300 Q 200 300 200 500" /></circle>
            <circle r="2"><animateMotion dur="8s" repeatCount="indefinite" path="M 670 300 Q 600 300 600 500" /></circle>
            <circle r="1.5"><animateMotion dur="5s" repeatCount="indefinite" path="M 400 60 L 400 490" /></circle>
            <circle r="2"><animateMotion dur="7s" repeatCount="indefinite" path="M 260 300 L 540 300" /></circle>
          </g>

          {/* Pitch turf */}
          <g clipPath="url(#dtPitchClip)">
            <rect x="340" y="200" width="120" height="200" fill="url(#dtPitchGrad)" />
            <rect x="340" y="220" width="120" height="20" fill="#FFFFFF" opacity="0.04" />
            <rect x="340" y="260" width="120" height="20" fill="#FFFFFF" opacity="0.04" />
            <rect x="340" y="300" width="120" height="20" fill="#FFFFFF" opacity="0.04" />
            <rect x="340" y="340" width="120" height="20" fill="#FFFFFF" opacity="0.04" />
            <rect x="340" y="380" width="120" height="20" fill="#FFFFFF" opacity="0.04" />
            <rect x="340" y="200" width="120" height="200" fill="url(#dtPitchGlow)" />
          </g>

          {/* Pitch markings — rgba(0,0,0,.18) */}
          <g fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1.2">
            <rect x="340" y="200" width="120" height="200" rx="6" />
            <line x1="340" y1="300" x2="460" y2="300" />
            <circle cx="400" cy="300" r="22" />
            <rect x="360" y="200" width="80" height="35" />
            <path d="M 382 235 A 22 22 0 0 0 418 235" />
            <rect x="374" y="200" width="52" height="12" />
            <rect x="360" y="365" width="80" height="35" />
            <path d="M 382 365 A 22 22 0 0 1 418 365" />
            <rect x="374" y="388" width="52" height="12" />
            {/* Corner arcs */}
            <path d="M 340 204 A 4 4 0 0 0 344 200" strokeWidth="1" />
            <path d="M 456 200 A 4 4 0 0 0 460 204" strokeWidth="1" />
            <path d="M 340 396 A 4 4 0 0 0 344 400" strokeWidth="1" />
            <path d="M 456 400 A 4 4 0 0 0 460 396" strokeWidth="1" />
          </g>
          {/* Center spot + penalty spots */}
          <circle cx="400" cy="300" r="1.5" fill="rgba(0,0,0,0.60)" />
          <circle cx="400" cy="224"  r="1"   fill="rgba(0,0,0,0.60)" />
          <circle cx="400" cy="376"  r="1"   fill="rgba(0,0,0,0.60)" />

          {/* ── Zone shapes ── */}
          {zones.map((zone) => {
            const isSelected = selectedZoneId === zone.id;
            const isHovered = hoveredId === zone.id;
            const c = getDarkStatusColors(zone, heatmapActive, telemetryMode);

            return (
              <g
                key={zone.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredId(zone.id)}
                onMouseLeave={() => setHoveredId(null)}
                onMouseMove={(e) => handleMouseMove(e, zone.id)}
                onClick={() => setSelectedZoneId(zone.id)}
              >
                {/* Selection ring */}
                {isSelected && zone.shape === 'rect' && zone.w && zone.h && (
                  <motion.rect
                    layoutId={`select-${zone.id}`}
                    x={zone.x - 5} y={zone.y - 5}
                    width={zone.w + 10} height={zone.h + 10}
                    rx={13}
                    fill="none"
                    stroke="#2E7D32"
                    strokeWidth="1.5"
                    opacity={0.6}
                    filter="url(#dtSelectGlow)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                {isSelected && zone.shape === 'circle' && zone.r && (
                  <motion.circle
                    layoutId={`select-${zone.id}`}
                    cx={zone.x} cy={zone.y} r={zone.r + 6}
                    fill="none"
                    stroke="#2E7D32"
                    strokeWidth="1.5"
                    opacity={0.6}
                    filter="url(#dtSelectGlow)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ duration: 0.2 }}
                  />
                )}

                {/* Rect zones */}
                {zone.shape === 'rect' && zone.w && zone.h && (
                  <>
                    <rect
                      x={zone.x} y={zone.y}
                      width={zone.w} height={zone.h}
                      rx={8}
                      fill={isHovered ? c.hoverFill : c.fill}
                      stroke={c.stroke}
                      strokeWidth={1}
                      style={{ transition: 'fill 200ms, stroke 200ms' }}
                    />
                    <text
                      x={zone.x + zone.w / 2}
                      y={zone.y + zone.h / 2 + 4}
                      textAnchor="middle"
                      fill="#D8D8D8"
                      style={{ ...LABEL_STYLE, opacity: 0.75 }}
                    >
                      {zone.name}
                    </text>
                  </>
                )}

                {/* Circle zones (gates) */}
                {zone.shape === 'circle' && zone.r && (
                  <>
                    {zone.status !== 'optimal' && (
                      <circle
                        cx={zone.x} cy={zone.y} r={zone.r + 6}
                        fill="none"
                        stroke={zone.status === 'critical' ? 'rgba(200,74,74,0.50)' : 'rgba(196,138,0,0.50)'}
                        strokeWidth={1.5}
                        className="animate-ping"
                        opacity={0.35}
                      />
                    )}
                    <circle
                      cx={zone.x} cy={zone.y} r={zone.r}
                      fill={isHovered ? c.hoverFill : c.fill}
                      stroke={c.stroke}
                      strokeWidth={1}
                      style={{ transition: 'fill 200ms, stroke 200ms' }}
                    />
                    <text
                      x={zone.x} y={zone.y + 3}
                      textAnchor="middle"
                      fill="#D8D8D8"
                      style={{ ...LABEL_STYLE, fontSize: '8px', opacity: 0.80 }}
                    >
                      {zone.name.split(' ')[1]}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* ── Hover Tooltip — dark glass ───────────────────── */}
      <AnimatePresence>
        {hoveredZone && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            style={{
              position: 'absolute',
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: 'translate(-50%, -100%)',
              background: 'rgba(13,20,16,0.96)',
              border: '1px solid rgba(0,0,0,0.10)',
              borderRadius: '12px',
              padding: '10px 14px',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.60), inset 0 0 0 1px rgba(46,125,50,0.08)',
              zIndex: 30,
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              minWidth: '160px',
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#2E7D32',
                paddingBottom: '6px',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              {hoveredZone.name}
            </span>
            {[
              { label: 'CROWD', value: `${hoveredZone.crowd} / ${hoveredZone.capacity}` },
              { label: 'WAIT',  value: `${hoveredZone.waitTime} min` },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'rgba(0,0,0,0.40)', letterSpacing: '0.08em' }}>{r.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#1C1C1C', fontWeight: 700 }}>{r.value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'rgba(0,0,0,0.40)', letterSpacing: '0.08em' }}>RISK</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: riskColor(hoveredZone.status) }}>
                {hoveredZone.status.toUpperCase()} · {hoveredZone.risk}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Zone Inspector — dark glass panel ────────────── */}
      <AnimatePresence>
        {selectedZone && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              width: '272px',
              background: 'rgba(13,20,16,0.96)',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '16px',
              padding: '16px',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.70), inset 0 0 0 1px rgba(46,125,50,0.06)',
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: '#2E7D32', textTransform: 'uppercase' }}>
                Zone Inspector
              </span>
              <button
                onClick={() => setSelectedZoneId(null)}
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.10em', color: 'rgba(0,0,0,0.30)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', transition: 'color 150ms' }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(0,0,0,0.65)')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(0,0,0,0.30)')}
              >
                Close
              </button>
            </div>

            <h4 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#1C1C1C', letterSpacing: '0.05em', marginBottom: '14px' }}>
              {selectedZone.name}
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <div style={STAT_TILE}>
                <span style={STAT_LABEL}><Users style={{ width: 10, height: 10 }} />Crowd</span>
                <span style={STAT_VALUE}>{selectedZone.crowd}</span>
              </div>
              <div style={STAT_TILE}>
                <span style={STAT_LABEL}><Shield style={{ width: 10, height: 10 }} />Cap.</span>
                <span style={STAT_VALUE}>{selectedZone.capacity}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={STAT_TILE}>
                <span style={STAT_LABEL}><Clock style={{ width: 10, height: 10 }} />Wait</span>
                <span style={STAT_VALUE}>
                  {selectedZone.waitTime}
                  <span style={{ fontSize: '9px', fontWeight: 500, color: 'rgba(0,0,0,0.35)', marginLeft: '2px' }}>min</span>
                </span>
              </div>
              <div style={STAT_TILE}>
                <span style={STAT_LABEL}><AlertTriangle style={{ width: 10, height: 10 }} />Risk</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: riskColor(selectedZone.status) }}>
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
