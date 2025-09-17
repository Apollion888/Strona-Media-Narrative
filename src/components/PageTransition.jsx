import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut');
    }
  }, [location, displayLocation]);

  return (
    <div 
      className={`page-transition ${transitionStage}`}
      onTransitionEnd={() => {
        if (transitionStage === 'fadeOut') {
          setDisplayLocation(location);
          setTransitionStage('fadeIn');
        }
      }}
      style={{
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: transitionStage === 'fadeOut' ? 0 : 1,
        transform: transitionStage === 'fadeOut' 
          ? 'translateY(20px) scale(0.98)' 
          : 'translateY(0) scale(1)',
        filter: transitionStage === 'fadeOut' 
          ? 'blur(2px)' 
          : 'blur(0px)'
      }}
    >
      {children}
    </div>
  );
};

// Advanced quantum-style page transition component
export const QuantumPageTransition = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('enter');
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('exit');
      
      // Create transition particles
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1.0,
        decay: Math.random() * 0.02 + 0.01
      }));
      
      setParticles(newParticles);
      
      setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('enter');
        setParticles([]);
      }, 400);
    }
  }, [location, displayLocation]);

  return (
    <>
      {/* Transition Particles Overlay */}
      {particles.length > 0 && (
        <div 
          className="quantum-transition-particles"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 9999,
            pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(0,20,0,0.1) 0%, rgba(0,0,0,0.3) 100%)'
          }}
        >
          {particles.map(particle => (
            <div
              key={particle.id}
              style={{
                position: 'absolute',
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                width: '4px',
                height: '4px',
                backgroundColor: `rgba(0, 255, 0, ${particle.life})`,
                borderRadius: '50%',
                boxShadow: `0 0 10px rgba(0, 255, 0, ${particle.life * 0.8})`,
                animation: 'quantum-pulse 0.4s ease-out'
              }}
            />
          ))}
        </div>
      )}
      
      {/* Page Content */}
      <div 
        className={`quantum-page-transition ${transitionStage}`}
        style={{
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          opacity: transitionStage === 'exit' ? 0 : 1,
          transform: transitionStage === 'exit' 
            ? 'translateX(-30px) rotateY(5deg) scale(0.95)' 
            : 'translateX(0) rotateY(0) scale(1)',
          filter: transitionStage === 'exit' 
            ? 'hue-rotate(15deg) blur(1px)' 
            : 'hue-rotate(0deg) blur(0px)',
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        {children}
      </div>
      
      {/* CSS for particle animation */}
      <style>{`
        @keyframes quantum-pulse {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: scale(0.8) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default PageTransition;
