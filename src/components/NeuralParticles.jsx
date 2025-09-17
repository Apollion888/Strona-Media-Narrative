import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * NeuralParticles - Advanced particle system with neural network visualization
 * Implements adaptive performance modes and accessibility support
 */
const NeuralParticles = ({
  mode = 'normal', // 'normal' | 'eco' | 'reduced'
  density = 0.8,
  interactive = true,
  pulseIntensity = 0.6,
  colorScheme = 'default',
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const pulsesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const fpsRef = useRef(60);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  // Respect reduced motion preference
  const [reducedMotion, setReducedMotion] = useState(false);

  // Color schemes based on docs
  const colors = {
    default: {
      neuron: 'rgba(0, 255, 0, 0.6)',
      synapse: 'rgba(0, 255, 0, 0.2)',
      pulse: 'rgba(0, 255, 255, 0.8)',
      glow: 'rgba(0, 255, 0, 0.4)',
    },
    monochrome: {
      neuron: 'rgba(255, 255, 255, 0.5)',
      synapse: 'rgba(255, 255, 255, 0.15)',
      pulse: 'rgba(255, 255, 255, 0.7)',
      glow: 'rgba(255, 255, 255, 0.3)',
    },
  };

  const scheme = colors[colorScheme] || colors.default;

  // Performance settings based on mode
  const settings = {
    normal: {
      particleCount: Math.floor(50 * density),
      connectionDistance: 150,
      pulseEnabled: true,
      targetFPS: 60,
      shadowBlur: 10,
    },
    eco: {
      particleCount: Math.floor(25 * density),
      connectionDistance: 100,
      pulseEnabled: false,
      targetFPS: 30,
      shadowBlur: 0,
    },
    reduced: {
      particleCount: 0,
      connectionDistance: 0,
      pulseEnabled: false,
      targetFPS: 1,
      shadowBlur: 0,
    },
  };

  const config = settings[mode] || settings.normal;

  // Neuron particle class
  class Neuron {
    constructor(x, y, canvas) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 3 + 2;
      this.energy = Math.random();
      this.connections = [];
      this.canvas = canvas;
      this.pulseCharge = 0;
      this.lastPulseTime = 0;
    }

    update(deltaTime, mouseX, mouseY) {
      // Organic movement with Perlin-like noise
      const time = Date.now() * 0.001;
      this.vx += Math.sin(time + this.x * 0.01) * 0.02;
      this.vy += Math.cos(time + this.y * 0.01) * 0.02;

      // Mouse interaction
      if (interactive) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
          const force = (200 - distance) / 200;
          this.vx += (dx / distance) * force * 0.2;
          this.vy += (dy / distance) * force * 0.2;

          // Trigger pulse on close proximity
          if (distance < 50 && Date.now() - this.lastPulseTime > 1000) {
            this.triggerPulse();
          }
        }
      }

      // Apply velocity with damping
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.x += this.vx;
      this.y += this.vy;

      // Boundary wrapping
      if (this.x < 0) this.x = this.canvas.width;
      if (this.x > this.canvas.width) this.x = 0;
      if (this.y < 0) this.y = this.canvas.height;
      if (this.y > this.canvas.height) this.y = 0;

      // Update pulse charge decay
      this.pulseCharge *= 0.95;
    }

    triggerPulse() {
      if (!config.pulseEnabled) return;

      this.pulseCharge = 1;
      this.lastPulseTime = Date.now();

      // Create pulse for each connection
      this.connections.forEach((connection) => {
        pulsesRef.current.push(
          new Pulse(this.x, this.y, connection.x, connection.y, pulseIntensity),
        );
      });
    }

    draw(ctx) {
      // Neuron body
      const glowIntensity = 0.5 + this.pulseCharge * 0.5;

      if (config.shadowBlur > 0) {
        ctx.shadowBlur = config.shadowBlur * glowIntensity;
        ctx.shadowColor = scheme.glow;
      }

      ctx.fillStyle = scheme.neuron;
      ctx.globalAlpha = 0.6 + this.pulseCharge * 0.4;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + this.pulseCharge * 2, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = scheme.pulse;
      ctx.globalAlpha = 0.8 + this.pulseCharge * 0.2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }
  }

  // Pulse class for synaptic transmission
  class Pulse {
    constructor(x1, y1, x2, y2, intensity) {
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = x2;
      this.y2 = y2;
      this.progress = 0;
      this.speed = 0.02 + intensity * 0.02;
      this.intensity = intensity;
      this.alive = true;
    }

    update() {
      this.progress += this.speed;
      if (this.progress >= 1) {
        this.alive = false;
      }
    }

    draw(ctx) {
      const x = this.x1 + (this.x2 - this.x1) * this.progress;
      const y = this.y1 + (this.y2 - this.y1) * this.progress;

      ctx.fillStyle = scheme.pulse;
      ctx.globalAlpha = (1 - this.progress) * this.intensity;

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();

      // Trail effect
      for (let i = 1; i <= 3; i++) {
        const trailProgress = Math.max(0, this.progress - i * 0.05);
        const tx = this.x1 + (this.x2 - this.x1) * trailProgress;
        const ty = this.y1 + (this.y2 - this.y1) * trailProgress;

        ctx.globalAlpha = (1 - this.progress) * this.intensity * (0.3 / i);
        ctx.beginPath();
        ctx.arc(tx, ty, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    }
  }

  // Initialize particle system
  const initializeSystem = useCallback(
    (canvas) => {
      particlesRef.current = [];
      pulsesRef.current = [];

      if (mode === 'reduced') return;

      for (let i = 0; i < config.particleCount; i++) {
        particlesRef.current.push(
          new Neuron(Math.random() * canvas.width, Math.random() * canvas.height, canvas),
        );
      }
    },
    [mode, config.particleCount],
  );

  // Update connections between neurons
  const updateConnections = useCallback(() => {
    particlesRef.current.forEach((neuron) => {
      neuron.connections = [];
    });

    for (let i = 0; i < particlesRef.current.length; i++) {
      const n1 = particlesRef.current[i];
      let connectionCount = 0;

      for (let j = i + 1; j < particlesRef.current.length; j++) {
        if (connectionCount >= 3) break; // Limit connections per neuron

        const n2 = particlesRef.current[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.connectionDistance) {
          n1.connections.push(n2);
          n2.connections.push(n1);
          connectionCount++;
        }
      }
    }
  }, [config.connectionDistance]);

  // Draw synaptic connections
  const drawConnections = useCallback(
    (ctx) => {
      ctx.strokeStyle = scheme.synapse;
      ctx.lineWidth = 1;

      const drawn = new Set();

      particlesRef.current.forEach((neuron) => {
        neuron.connections.forEach((connected) => {
          const key = `${Math.min(neuron.x, connected.x)}-${Math.min(neuron.y, connected.y)}`;
          if (drawn.has(key)) return;
          drawn.add(key);

          const dx = connected.x - neuron.x;
          const dy = connected.y - neuron.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const opacity = 1 - distance / config.connectionDistance;

          ctx.globalAlpha = opacity * 0.3;
          ctx.beginPath();
          ctx.moveTo(neuron.x, neuron.y);
          ctx.lineTo(connected.x, connected.y);
          ctx.stroke();
        });
      });

      ctx.globalAlpha = 1;
    },
    [scheme.synapse, config.connectionDistance],
  );

  // Main animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;

    // FPS monitoring
    frameCountRef.current++;
    if (currentTime - lastTimeRef.current > 1000) {
      fpsRef.current = frameCountRef.current;
      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;

      // Adaptive quality
      if (fpsRef.current < config.targetFPS * 0.8 && particlesRef.current.length > 10) {
        particlesRef.current = particlesRef.current.slice(
          0,
          Math.floor(particlesRef.current.length * 0.9),
        );
      }
    }

    // Clear canvas
    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw connections
    updateConnections();
    drawConnections(ctx);

    // Update and draw particles
    particlesRef.current.forEach((particle) => {
      particle.update(deltaTime, mouseRef.current.x, mouseRef.current.y);
      particle.draw(ctx);
    });

    // Update and draw pulses
    pulsesRef.current = pulsesRef.current.filter((pulse) => pulse.alive);
    pulsesRef.current.forEach((pulse) => {
      pulse.update();
      pulse.draw(ctx);
    });

    // Continue animation based on target FPS
    if (mode !== 'reduced') {
      const frameDelay = 1000 / config.targetFPS;
      setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate);
      }, frameDelay - deltaTime);
    }
  }, [mode, config.targetFPS, updateConnections, drawConnections]);

  // Setup and cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeSystem(canvas);
    };

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouch = (e) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        // Trigger pulse at touch point
        const nearest = particlesRef.current.reduce((closest, particle) => {
          const dx = particle.x - mouseRef.current.x;
          const dy = particle.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (!closest || distance < closest.distance) {
            return { particle, distance };
          }
          return closest;
        }, null);

        if (nearest && nearest.distance < 100) {
          nearest.particle.triggerPulse();
        }
      }
    };

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handleMotionPrefChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionPrefChange);

    // Initialize
    handleResize();
    window.addEventListener('resize', handleResize);

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouch);
      window.addEventListener('touchstart', handleTouch);
    }

    // Start animation
    if (!reducedMotion && mode !== 'reduced') {
      animate();
    } else if (mode === 'reduced') {
      // Draw static snapshot for reduced mode
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw static pattern
      const gridSize = 100;
      ctx.strokeStyle = scheme.synapse;
      ctx.lineWidth = 0.5;

      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchstart', handleTouch);
      mediaQuery.removeEventListener('change', handleMotionPrefChange);
    };
  }, [mode, interactive, reducedMotion, initializeSystem, animate, scheme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: interactive ? 'auto' : 'none',
        opacity: reducedMotion || mode === 'reduced' ? 0.3 : 1,
      }}
      aria-hidden="true"
    />
  );
};

export default NeuralParticles;
