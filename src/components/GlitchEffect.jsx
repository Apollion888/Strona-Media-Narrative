import React, { useEffect, useRef } from 'react';

const GlitchEffect = ({ children, intensity = 0.1, active = false }) => {
  const containerRef = useRef(null);
  const glitchIntervalRef = useRef(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;

    const createGlitch = () => {
      // Random glitch parameters
      const glitchDuration = 50 + Math.random() * 200;
      const skew = (Math.random() - 0.5) * intensity * 5;
      const scale = 1 + (Math.random() - 0.5) * intensity * 0.05;

      // Apply glitch effect
      container.style.transform = `scaleX(${scale}) skewX(${skew}deg)`;
      container.style.filter = `
        hue-rotate(${Math.random() * 30}deg) 
        saturate(${1 + Math.random() * intensity})
      `;

      setTimeout(() => {
        container.style.transform = '';
        container.style.filter = '';
      }, glitchDuration);
    };

    const scheduleNextGlitch = () => {
      const nextGlitch = 2000 + Math.random() * 4000; // 2-6 seconds
      glitchIntervalRef.current = setTimeout(() => {
        createGlitch();
        scheduleNextGlitch();
      }, nextGlitch);
    };

    scheduleNextGlitch();

    return () => {
      if (glitchIntervalRef.current) {
        clearTimeout(glitchIntervalRef.current);
      }
    };
  }, [active, intensity]);

  return (
    <div
      ref={containerRef}
      style={{
        transition: 'all 0.1s ease',
        position: 'relative',
      }}
    >
      {children}
    </div>
  );
};

export default GlitchEffect;
