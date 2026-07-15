import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen overflow-hidden bg-titanium-white pitch-pattern flex items-center select-none"
    >
      {/* Stadium arc decorations */}
      <div className="stadium-arc" />
      <div className="stadium-arc" style={{ width: '1200px', height: '1200px' }} />

      {/* Ambient bloom */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[70vh] h-[70vh] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,107,63,0.08) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 w-full h-full px-container-padding mx-auto max-w-7xl flex items-center">
        {/* Hero Card */}
        <div
          className="glass-card rounded-[32px] p-12 w-full md:w-3/5 lg:w-1/2 flex flex-col items-start gap-8 relative z-20"
          style={{
            transform: `translateX(${-mousePos.x * 0.15}px) translateY(${-mousePos.y * 0.15}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          {/* Brand mark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>stadium</span>
            </div>
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              ArenaFlow Stadium OS
            </span>
          </div>

          <div>
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight leading-none mb-4">
              ArenaFlow
            </h1>
            <p className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-2">
              Stadium Command Center
            </p>
            <p className="font-body-lg text-on-surface-variant">
              AI-Powered Operations for FIFA World Cup 2026. Predict. Prevent. Protect.
            </p>
          </div>

          {/* Live stats preview */}
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="bg-surface-container-low rounded-2xl p-4 text-center border border-outline/10">
              <p className="font-stats-numeric text-stats-numeric text-primary">82k</p>
              <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">Peak Capacity</p>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-4 text-center border border-outline/10">
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <p className="font-stats-numeric text-stats-numeric text-on-surface">Live</p>
              </div>
              <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">Operations</p>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-4 text-center border border-outline/10">
              <p className="font-stats-numeric text-stats-numeric text-warning-amber">01</p>
              <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">Active Incidents</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-md active:scale-95 group"
            >
              <span className="font-body-md text-body-md">Launch ArenaFlow</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <button
              onClick={() => navigate('/twin')}
              className="flex-1 bg-pearl border border-outline/20 text-on-surface px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white transition-all shadow-sm active:scale-95 group"
            >
              <span className="material-symbols-outlined text-primary">play_circle</span>
              <span className="font-body-md text-body-md">Explore Live Simulation</span>
            </button>
          </div>
        </div>

        {/* Trophy parallax */}
        <div
          className="absolute right-12 top-1/2 h-[80vh] w-auto pointer-events-none z-0 hidden lg:block"
          style={{
            transform: `translateY(calc(-50% + ${mousePos.y}px)) translateX(${mousePos.x * 1.2}px)`,
            transition: 'transform 0.1s ease-out',
            opacity: 0.35,
            mixBlendMode: 'multiply',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)',
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)',
          }}
        >
          <img
            alt="FIFA World Cup Trophy"
            className="h-full w-auto object-contain filter contrast-125"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcI6OtLBbXSKUow24SVSWafY6o7FfZA20rtjIQ0amge_k_nAa6-TkndqVmFb6P6c8tC2nld2TMAQcRFY1TibDiyhi0jssobMe_Y5cwRoI3bEDzRRmJdpwfbbyyqUbEO78b3huYlp93TDW6sG10z8EKQ4QbeYH0WaKMBg2pMzNGp8cB11bwjWhNK0oSAv537o-QdVGDtZgMo6qe6FQ0xfk-gPZJT02voAL2O0Gf55PX0NIOhO2b2IdDw_LDfX8AC-t8jeU"
          />
        </div>
      </div>
    </div>
  );
}
