import React, { useEffect, useRef, useState } from 'react';

const QuantumParticleField = () => {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let connections = [];

    // Performance monitoring
    let frameCount = 0;
    let lastTime = performance.now();

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse tracking with smooth interpolation
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Site DNA Particle class - subtle and elegant
    class SiteParticle {
      constructor(x, y, type = 'primary') {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.type = type;
        this.size = type === 'primary' ? Math.random() * 1.5 + 1 : Math.random() * 1 + 0.5;
        this.energy = Math.random() * 100;
        this.phase = Math.random() * Math.PI * 2;
        this.frequency = Math.random() * 0.01 + 0.005;
        this.mouseInfluence = Math.random() * 0.15 + 0.05;
        this.baseOpacity = Math.random() * 0.4 + 0.2;
        this.opacity = this.baseOpacity;

        // Site DNA colors - neon green palette, subtle
        if (type === 'primary') {
          this.color = `rgba(0, 255, 0, ${this.baseOpacity})`;
          this.glowColor = `rgba(0, 255, 0, ${this.baseOpacity * 0.3})`;
        } else if (type === 'secondary') {
          this.color = `rgba(128, 255, 128, ${this.baseOpacity * 0.6})`;
          this.glowColor = `rgba(128, 255, 128, ${this.baseOpacity * 0.2})`;
        } else {
          this.color = `rgba(15, 47, 15, ${this.baseOpacity * 0.8})`;
          this.glowColor = `rgba(15, 47, 15, ${this.baseOpacity * 0.4})`;
        }
      }

      update(time, mouseX, mouseY) {
        // Gentle oscillation
        this.energy += this.frequency;

        // Subtle mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 120;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          this.vx += Math.cos(angle) * force * this.mouseInfluence * 0.015;
          this.vy += Math.sin(angle) * force * this.mouseInfluence * 0.015;

          // Enhanced opacity on mouse proximity
          this.opacity = Math.min(1, this.baseOpacity + force * 0.3);
        } else {
          this.opacity = this.baseOpacity;
        }

        // Return to base with spring force
        const returnForceX = (this.baseX - this.x) * 0.0008;
        const returnForceY = (this.baseY - this.y) * 0.0008;
        this.vx += returnForceX;
        this.vy += returnForceY;

        // Apply velocity with damping
        this.vx *= 0.99;
        this.vy *= 0.99;
        this.x += this.vx;
        this.y += this.vy;

        // Update phase for pulsing
        this.phase += this.frequency;
      }

      draw(ctx) {
        const pulse = Math.sin(this.phase) * 0.2 + 0.8;
        const currentSize = this.size * pulse;

        // Subtle glow effect
        ctx.shadowColor = this.glowColor;
        ctx.shadowBlur = 8;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
        ctx.fill();

        // Reset effects
        ctx.shadowBlur = 0;
      }
    }

    // Initialize subtle particle system
    const initializeSystem = () => {
      particles = [];

      // Primary particles - main layer (reduced count)
      for (let i = 0; i < 25; i++) {
        particles.push(
          new SiteParticle(Math.random() * canvas.width, Math.random() * canvas.height, 'primary'),
        );
      }

      // Secondary particles - ambient layer
      for (let i = 0; i < 15; i++) {
        particles.push(
          new SiteParticle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            'secondary',
          ),
        );
      }

      // Tertiary particles - background subtlety
      for (let i = 0; i < 10; i++) {
        particles.push(
          new SiteParticle(Math.random() * canvas.width, Math.random() * canvas.height, 'tertiary'),
        );
      }
    };

    // Connection system - minimal and elegant
    const updateConnections = () => {
      connections = [];

      // Only connect primary particles, and sparingly
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (p1.type !== 'primary') continue;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p2.type !== 'primary') continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Reduced connection distance for subtlety
          if (distance < 80) {
            connections.push({
              p1,
              p2,
              distance,
              strength: (80 - distance) / 80,
            });
          }
        }
      }
    };

    // Render connections with site DNA styling
    const drawConnections = (ctx) => {
      connections.forEach((conn) => {
        const avgOpacity = (conn.p1.opacity + conn.p2.opacity) / 2;
        ctx.strokeStyle = `rgba(0, 255, 0, ${conn.strength * avgOpacity * 0.15})`;
        ctx.lineWidth = conn.strength * 0.8;

        ctx.beginPath();
        ctx.moveTo(conn.p1.x, conn.p1.y);
        ctx.lineTo(conn.p2.x, conn.p2.y);
        ctx.stroke();
      });
    };

    // Background cursor reaction
    const drawBackgroundReaction = (ctx, mouseX, mouseY) => {
      const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 150);
      gradient.addColorStop(0, 'rgba(0, 255, 0, 0.03)');
      gradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.01)');
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Main animation loop
    const animate = (currentTime) => {
      frameCount++;

      // Performance monitoring
      if (currentTime - lastTime > 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;

        // Adaptive quality for performance
        if (fps < 50 && particles.length > 30) {
          particles = particles.slice(0, Math.floor(particles.length * 0.9));
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background cursor reaction
      if (mousePos.x > 0 && mousePos.y > 0) {
        drawBackgroundReaction(ctx, mousePos.x, mousePos.y);
      }

      // Update particles
      particles.forEach((particle) => {
        particle.update(currentTime, mousePos.x, mousePos.y);
      });

      // Update and draw connections
      updateConnections();
      drawConnections(ctx);

      // Draw particles
      particles.forEach((particle) => {
        particle.draw(ctx);
      });

      animationId = requestAnimationFrame(animate);
    };

    // Initialize and start
    initializeSystem();
    animate(performance.now());

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mousePos.x, mousePos.y]);

  // Accessibility: respect user preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsVisible(!mediaQuery.matches);

    const handleChange = () => setIsVisible(!mediaQuery.matches);
    mediaQuery.addListener?.(handleChange);

    return () => mediaQuery.removeListener?.(handleChange);
  }, []);

  if (!isVisible) {
    return null; // Respect accessibility preferences
  }

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
        pointerEvents: 'none',
        background: 'transparent',
      }}
    />
  );
};

export default QuantumParticleField;
