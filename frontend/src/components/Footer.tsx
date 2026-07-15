import React from 'react';

// Mobile-only bottom navigation bar — matches Stitch design (md:hidden)
export default function Footer() {
  return (
    <footer className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 bg-surface-container-lowest/40 backdrop-blur-md border-t border-pearl/20 shadow-2xl px-gutter rounded-t-xl">
      <button className="flex flex-col items-center gap-1 text-primary font-bold">
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>groups</span>
        <span className="font-label-caps text-[10px]">Crowd</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-on-surface-variant">
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>train</span>
        <span className="font-label-caps text-[10px]">Transport</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-on-surface-variant">
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>security</span>
        <span className="font-label-caps text-[10px]">Security</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-on-surface-variant">
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>cloud</span>
        <span className="font-label-caps text-[10px]">Weather</span>
      </button>
    </footer>
  );
}
