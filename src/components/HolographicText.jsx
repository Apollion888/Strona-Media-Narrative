import React, { useEffect, useRef } from 'react';

const HolographicText = ({ children, className = '' }) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const element = textRef.current;
    let animationId;

    const animate = () => {
      const time = Date.now() * 0.001;
      const hueShift = Math.sin(time * 0.5) * 15;
      
      element.style.filter = `
        hue-rotate(${hueShift}deg)
        drop-shadow(0 0 10px rgba(50, 217, 4, 0.65))
        drop-shadow(0 0 20px rgba(67, 191, 48, 0.38))
      `;

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      ref={textRef}
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        background: 'linear-gradient(45deg, #32d904, #43bf30, #067302, #43bf30)',
        backgroundSize: '400% 400%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'holographic-shimmer 3s ease-in-out infinite'
      }}
    >
      {children}
    </div>
  );
};

export default HolographicText;
