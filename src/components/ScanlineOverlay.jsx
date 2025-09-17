import React from 'react';

const ScanlineOverlay = ({ intensity = 0.1, speed = 1, enabled = true }) => {
  if (!enabled) return null;

  return (
    <div 
      className="scanline-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
        opacity: intensity,
        background: `
          linear-gradient(90deg, transparent 98%, rgba(0, 255, 0, 0.3) 100%),
          linear-gradient(0deg, transparent 98%, rgba(0, 255, 0, 0.1) 100%)
        `,
        backgroundSize: '3px 3px',
        animation: `scanlines ${1 / speed}s linear infinite`
      }}
    />
  );
};

export default ScanlineOverlay;
