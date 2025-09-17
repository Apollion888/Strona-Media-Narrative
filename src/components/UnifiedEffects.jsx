import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Unified Effects System - Media Narrative
// Implements particle systems, glitch text, holographic text, and morphing effects
// with performance optimizations and accessibility considerations

// Performance monitoring hook
const usePerformanceMonitor = () => {
  const [performance, setPerformance] = useState({ fps: 60, quality: 'high' });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = Date.now();

    const measurePerformance = () => {
      frameCount++;
      const currentTime = Date.now();

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const quality = fps > 45 ? 'high' : fps > 25 ? 'medium' : 'low';

        setPerformance({ fps, quality });
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measurePerformance);
    };

    measurePerformance();
  }, []);

  return performance;
};

// Enhanced Holographic Text with performance optimization
export const HolographicText = ({ children, className = '', intensity = 1, disabled = false }) => {
  const textRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { quality } = usePerformanceMonitor();

  const effectIntensity = useMemo(() => {
    if (disabled || shouldReduceMotion) return 0;
    return intensity * (quality === 'high' ? 1 : quality === 'medium' ? 0.7 : 0.4);
  }, [intensity, quality, disabled, shouldReduceMotion]);

  useEffect(() => {
    if (!textRef.current || effectIntensity === 0) return;

    const element = textRef.current;
    let animationId;

    const animate = () => {
      const time = Date.now() * 0.001;
      const hueShift = Math.sin(time * 0.5) * (15 * effectIntensity);
      const glowIntensity = 0.6 * effectIntensity;

      element.style.filter = `
        hue-rotate(${hueShift}deg)
        drop-shadow(0 0 ${10 * effectIntensity}px rgba(0, 255, 0, ${glowIntensity}))
        drop-shadow(0 0 ${20 * effectIntensity}px rgba(0, 255, 0, ${glowIntensity * 0.5}))
      `;

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [effectIntensity]);

  if (effectIntensity === 0) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span
      ref={textRef}
      className={`holographic-text ${className}`}
      style={{
        background: `linear-gradient(45deg, #00ff00, #80ff80, #00ff00, #40ff40)`,
        backgroundSize: '400% 400%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: `holographic-shimmer ${3 / effectIntensity}s ease-in-out infinite`,
      }}
    >
      {children}
    </span>
  );
};

// Enhanced Glitch Effect with performance controls
export const GlitchText = ({
  children,
  intensity = 0.1,
  active = true,
  trigger = 'auto', // 'auto', 'hover', 'manual'
  disabled = false,
}) => {
  const containerRef = useRef(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { quality } = usePerformanceMonitor();

  const effectConfig = useMemo(() => {
    if (disabled || shouldReduceMotion) return { active: false, intensity: 0 };

    const qualityMultiplier = quality === 'high' ? 1 : quality === 'medium' ? 0.7 : 0.4;
    return {
      active: active,
      intensity: intensity * qualityMultiplier,
      frequency: quality === 'low' ? 8000 : quality === 'medium' ? 4000 : 2000,
    };
  }, [intensity, active, quality, disabled, shouldReduceMotion]);

  useEffect(() => {
    if (!effectConfig.active || !containerRef.current || trigger !== 'auto') return;

    const container = containerRef.current;
    let glitchTimeout;

    const createGlitch = () => {
      if (!container) return;

      setIsGlitching(true);
      const glitchDuration = 50 + Math.random() * 150;
      const skew = (Math.random() - 0.5) * effectConfig.intensity * 5;
      const scale = 1 + (Math.random() - 0.5) * effectConfig.intensity * 0.05;

      container.style.transform = `scaleX(${scale}) skewX(${skew}deg)`;
      container.style.filter = `
        hue-rotate(${Math.random() * 30}deg) 
        saturate(${1 + Math.random() * effectConfig.intensity})
      `;

      setTimeout(() => {
        if (container) {
          container.style.transform = '';
          container.style.filter = '';
          setIsGlitching(false);
        }
      }, glitchDuration);

      // Schedule next glitch
      const nextGlitch = effectConfig.frequency + Math.random() * effectConfig.frequency;
      glitchTimeout = setTimeout(createGlitch, nextGlitch);
    };

    createGlitch();

    return () => {
      if (glitchTimeout) clearTimeout(glitchTimeout);
    };
  }, [effectConfig, trigger]);

  const handleMouseEnter = () => {
    if (trigger === 'hover' && effectConfig.active && containerRef.current) {
      const container = containerRef.current;
      container.style.transform = `scaleX(1.02) skewX(1deg)`;
      container.style.filter = 'hue-rotate(10deg) saturate(1.2)';
      setIsGlitching(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover' && containerRef.current) {
      const container = containerRef.current;
      container.style.transform = '';
      container.style.filter = '';
      setIsGlitching(false);
    }
  };

  if (!effectConfig.active) {
    return <span>{children}</span>;
  }

  return (
    <span
      ref={containerRef}
      className={`glitch-text ${isGlitching ? 'glitching' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: 'all 0.1s ease',
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  );
};

// Unified Particle System with adaptive performance
export const ParticleField = ({
  density = 50,
  connectionDistance = 100,
  particleColor = 'rgba(0, 255, 0, 0.6)',
  connectionColor = 'rgba(0, 255, 0, 0.2)',
  interactive = true,
  disabled = false,
  className = '',
}) => {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();
  const { quality, fps } = usePerformanceMonitor();

  const config = useMemo(() => {
    if (disabled || shouldReduceMotion) {
      return { particleCount: 0, animate: false };
    }

    const qualityMap = {
      high: { multiplier: 1, maxParticles: density },
      medium: { multiplier: 0.7, maxParticles: Math.floor(density * 0.7) },
      low: { multiplier: 0.4, maxParticles: Math.floor(density * 0.4) },
    };

    const settings = qualityMap[quality] || qualityMap.low;

    return {
      particleCount: Math.min(settings.maxParticles, fps < 30 ? 20 : settings.maxParticles),
      connectionDistance: connectionDistance * settings.multiplier,
      animate: fps > 20,
      interactive: interactive && fps > 25,
    };
  }, [density, connectionDistance, interactive, quality, fps, disabled, shouldReduceMotion]);

  useEffect(() => {
    if (!config.animate) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    const particles = [];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    for (let i = 0; i < config.particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary bounce
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Mouse interaction
        if (config.interactive) {
          const dx = mousePos.x - particle.x;
          const dy = mousePos.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            particle.vx += dx * 0.0001;
            particle.vy += dy * 0.0001;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      });

      // Draw connections (limited for performance)
      if (quality !== 'low') {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.connectionDistance) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = connectionColor;
              ctx.lineWidth = 1 - distance / config.connectionDistance;
              ctx.stroke();
            }
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e) => {
      if (!config.interactive) return;
      const rect = canvas.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [config, mousePos, particleColor, connectionColor]);

  if (!config.animate) {
    return <div className={`particle-field-fallback ${className}`}></div>;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`particle-field ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    />
  );
};

// Morphing Background Effect
export const MorphingBackground = ({
  colors = ['#00FF00', '#0080FF', '#8000FF'],
  speed = 1,
  disabled = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (disabled || shouldReduceMotion) {
    return (
      <div
        className="morphing-background-fallback"
        style={{
          background: colors[0] || '#00FF00',
          opacity: 0.1,
        }}
      />
    );
  }

  return (
    <motion.div
      className="morphing-background"
      animate={{
        background: colors,
      }}
      transition={{
        duration: 10 / speed,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.1,
        zIndex: -1,
        filter: 'blur(20px)',
      }}
    />
  );
};

export default {
  HolographicText,
  GlitchText,
  ParticleField,
  MorphingBackground,
};
