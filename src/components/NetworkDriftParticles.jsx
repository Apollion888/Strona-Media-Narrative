import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * NetworkDriftParticles - Spokojny, elegancki system cząsteczek
 * Implementuje delikatne dryfowanie z subtelnymi połączeniami sieciowymi
 */
const NetworkDriftParticles = ({
  mode = 'normal', // 'normal' | 'eco' | 'reduced'
  density = 1.0,
  interactive = true,
  connectThreshold = 180, // Jeszcze większy zasięg
  maxConnectionsPerParticle = 6, // Więcej połączeń dla gęstszej siatki
  colorScheme = 'default',
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const gridRef = useRef(null);
  const documentHiddenRef = useRef(false);

  // Performance monitoring
  const fpsRef = useRef(60);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  // Color schemes from tokens - zwiększone kontrasty
  const colors = {
    default: {
      particle: 'rgba(255, 255, 255, 0.9)', // Jaśniejsze białe punkty
      particleAccent: 'rgba(0, 255, 0, 1.0)', // Pełna jasność zielonych
      connection: 'rgba(0, 255, 0, 0.3)', // Bardziej widoczne linie
      glow: 'rgba(0, 255, 0, 0.4)', // Mocniejszy glow
    },
  };

  const scheme = colors[colorScheme] || colors.default;

  // Settings per mode - Optimized performance
  const settings = {
    normal: {
      particleCount: Math.floor(Math.min(150, 150 * density)), // Capped for performance
      speed: 0.12,
      connectionEnabled: true,
      targetFPS: 60,
      glowEnabled: true,
    },
    eco: {
      particleCount: Math.floor(Math.min(80, 80 * density)), // Reduced for better performance
      speed: 0.1,
      connectionEnabled: true,
      targetFPS: 30,
      glowEnabled: false,
    },
    reduced: {
      particleCount: Math.floor(Math.min(40, 40 * density)), // Minimal for accessibility
      speed: 0,
      connectionEnabled: false,
      targetFPS: 1,
      glowEnabled: false,
      twinkle: true,
    },
  };

  const config = settings[mode] || settings.normal;

  // Simplex noise for smooth movement
  class SimplexNoise {
    constructor() {
      this.grad3 = [
        [1, 1, 0],
        [-1, 1, 0],
        [1, -1, 0],
        [-1, -1, 0],
        [1, 0, 1],
        [-1, 0, 1],
        [1, 0, -1],
        [-1, 0, -1],
        [0, 1, 1],
        [0, -1, 1],
        [0, 1, -1],
        [0, -1, -1],
      ];
      this.p = [];
      for (let i = 0; i < 256; i++) {
        this.p[i] = Math.floor(Math.random() * 256);
      }
      this.perm = [];
      for (let i = 0; i < 512; i++) {
        this.perm[i] = this.p[i & 255];
      }
    }

    dot(g, x, y) {
      return g[0] * x + g[1] * y;
    }

    noise2D(xin, yin) {
      const F2 = 0.5 * (Math.sqrt(3) - 1);
      const G2 = (3 - Math.sqrt(3)) / 6;

      const s = (xin + yin) * F2;
      const i = Math.floor(xin + s);
      const j = Math.floor(yin + s);

      const t = (i + j) * G2;
      const X0 = i - t;
      const Y0 = j - t;
      const x0 = xin - X0;
      const y0 = yin - Y0;

      let i1, j1;
      if (x0 > y0) {
        i1 = 1;
        j1 = 0;
      } else {
        i1 = 0;
        j1 = 1;
      }

      const x1 = x0 - i1 + G2;
      const y1 = y0 - j1 + G2;
      const x2 = x0 - 1 + 2 * G2;
      const y2 = y0 - 1 + 2 * G2;

      const ii = i & 255;
      const jj = j & 255;

      const gi0 = this.perm[ii + this.perm[jj]] % 12;
      const gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
      const gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;

      let t0 = 0.5 - x0 * x0 - y0 * y0;
      let n0 = 0;
      if (t0 >= 0) {
        t0 *= t0;
        n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);
      }

      let t1 = 0.5 - x1 * x1 - y1 * y1;
      let n1 = 0;
      if (t1 >= 0) {
        t1 *= t1;
        n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
      }

      let t2 = 0.5 - x2 * x2 - y2 * y2;
      let n2 = 0;
      if (t2 >= 0) {
        t2 *= t2;
        n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
      }

      return 70 * (n0 + n1 + n2);
    }
  }

  const noiseGenerator = useRef(new SimplexNoise());

  // Drift Particle class - spokojne, eleganckie cząsteczki
  class DriftParticle {
    constructor(x, y, canvas) {
      this.x = x;
      this.y = y;
      this.canvas = canvas;
      this.radius = Math.random() * 1.5 + 1.5; // Jaśniejsze, większe punkty (1.5-3px)
      this.noiseOffsetX = Math.random() * 1000;
      this.noiseOffsetY = Math.random() * 1000;
      this.connections = [];
      this.isAccent = Math.random() < 0.12; // 12% zielonych akcentów
      this.brightness = Math.random() * 0.3 + 0.7; // Różna jasność (0.7-1.0)

      // For reduced mode twinkle
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.twinkleSpeed = Math.random() * 0.02 + 0.01;
      this.baseOpacity = this.isAccent ? 0.8 : 0.7;
      this.opacity = this.baseOpacity;
    }

    update(time, mouseX, mouseY, noise) {
      if (config.speed === 0) {
        // Reduced mode - only twinkle
        if (config.twinkle) {
          this.twinklePhase += this.twinkleSpeed;
          this.opacity = this.baseOpacity * (0.7 + Math.sin(this.twinklePhase) * 0.3);
        }
        return;
      }

      // Smooth drift using Simplex noise - wolniejszy dla lepszej czytelności
      const noiseX = noise.noise2D(this.noiseOffsetX, time * 0.00008);
      const noiseY = noise.noise2D(this.noiseOffsetY, time * 0.00008);

      // Base drift velocity
      let vx = noiseX * config.speed;
      let vy = noiseY * config.speed;

      // Subtle mouse interaction
      if (interactive && mouseX && mouseY) {
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 100;

        if (distance < repelRadius && distance > 0) {
          const force = (repelRadius - distance) / repelRadius;
          const angle = Math.atan2(dy, dx);
          vx += Math.cos(angle) * force * 0.5;
          vy += Math.sin(angle) * force * 0.5;
        }
      }

      // Update position
      this.x += vx;
      this.y += vy;

      // Wrap around edges
      if (this.x < -10) this.x = this.canvas.width + 10;
      if (this.x > this.canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = this.canvas.height + 10;
      if (this.y > this.canvas.height + 10) this.y = -10;
    }

    draw(ctx) {
      const baseColor = this.isAccent ? scheme.particleAccent : scheme.particle;
      const finalOpacity = this.opacity * this.brightness;

      if (config.glowEnabled) {
        ctx.shadowBlur = this.isAccent ? 15 : 10; // Mocniejszy glow
        ctx.shadowColor = this.isAccent ? scheme.glow : 'rgba(255, 255, 255, 0.4)';
      }

      // Podstawowy punkt
      ctx.fillStyle = baseColor.replace(/[\d.]+\)$/, `${finalOpacity})`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();

      // Dodatkowy zewnętrzny pierścień dla większej widoczności
      if (this.isAccent) {
        ctx.strokeStyle = `rgba(0, 255, 0, ${finalOpacity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
    }
  }

  // Spatial grid for efficient neighbor finding
  class SpatialGrid {
    constructor(width, height, cellSize) {
      this.cellSize = cellSize;
      this.cols = Math.ceil(width / cellSize);
      this.rows = Math.ceil(height / cellSize);
      this.grid = [];
      this.clear();
    }

    clear() {
      this.grid = Array(this.cols * this.rows)
        .fill(null)
        .map(() => []);
    }

    add(particle) {
      const cellX = Math.floor(particle.x / this.cellSize);
      const cellY = Math.floor(particle.y / this.cellSize);
      const index = cellY * this.cols + cellX;

      if (index >= 0 && index < this.grid.length) {
        this.grid[index].push(particle);
      }
    }

    getNeighbors(particle, radius) {
      const neighbors = [];
      const cellX = Math.floor(particle.x / this.cellSize);
      const cellY = Math.floor(particle.y / this.cellSize);
      const cellRadius = Math.ceil(radius / this.cellSize);

      for (let i = -cellRadius; i <= cellRadius; i++) {
        for (let j = -cellRadius; j <= cellRadius; j++) {
          const x = cellX + i;
          const y = cellY + j;

          if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
            const index = y * this.cols + x;
            neighbors.push(...this.grid[index]);
          }
        }
      }

      return neighbors;
    }
  }

  // Initialize particles
  const initializeSystem = useCallback(
    (canvas) => {
      particlesRef.current = [];

      for (let i = 0; i < config.particleCount; i++) {
        particlesRef.current.push(
          new DriftParticle(Math.random() * canvas.width, Math.random() * canvas.height, canvas),
        );
      }

      // Initialize spatial grid
      gridRef.current = new SpatialGrid(canvas.width, canvas.height, connectThreshold);
    },
    [config.particleCount, connectThreshold],
  );

  // Update connections using spatial grid
  const updateConnections = useCallback(() => {
    if (!config.connectionEnabled || !gridRef.current) return;

    // Clear grid and re-add particles
    gridRef.current.clear();
    particlesRef.current.forEach((p) => gridRef.current.add(p));

    // Clear existing connections
    particlesRef.current.forEach((p) => (p.connections = []));

    // Find connections
    particlesRef.current.forEach((particle) => {
      if (particle.connections.length >= maxConnectionsPerParticle) return;

      const neighbors = gridRef.current.getNeighbors(particle, connectThreshold);

      for (const neighbor of neighbors) {
        if (neighbor === particle) continue;
        if (particle.connections.length >= maxConnectionsPerParticle) break;
        if (neighbor.connections.length >= maxConnectionsPerParticle) continue;

        const dx = particle.x - neighbor.x;
        const dy = particle.y - neighbor.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectThreshold) {
          particle.connections.push({ particle: neighbor, distance });
        }
      }
    });
  }, [config.connectionEnabled, connectThreshold, maxConnectionsPerParticle]);

  // Draw connections - wyraźniejsze linie
  const drawConnections = useCallback(
    (ctx) => {
      if (!config.connectionEnabled) return;

      const drawn = new Set();

      particlesRef.current.forEach((particle) => {
        particle.connections.forEach((conn) => {
          const key =
            particle.x < conn.particle.x
              ? `${particle.x},${particle.y}-${conn.particle.x},${conn.particle.y}`
              : `${conn.particle.x},${conn.particle.y}-${particle.x},${particle.y}`;

          if (drawn.has(key)) return;
          drawn.add(key);

          // Jeszcze mocniejszy gradient dla wyraźnej siatki
          const alpha = Math.pow(1 - conn.distance / connectThreshold, 1.2);

          // Kolor linii zależy od tego czy łączy się z akcentem
          const isAccentConnection = particle.isAccent || conn.particle.isAccent;
          ctx.strokeStyle = isAccentConnection
            ? `rgba(0, 255, 0, ${alpha * 0.7})`
            : `rgba(255, 255, 255, ${alpha * 0.4})`;
          ctx.lineWidth = isAccentConnection ? 1.2 : 0.9;

          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(conn.particle.x, conn.particle.y);
          ctx.stroke();
        });
      });

      ctx.globalAlpha = 1;
    },
    [config.connectionEnabled, connectThreshold],
  );

  // Animation loop
  const animate = useCallback(() => {
    if (documentHiddenRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const currentTime = performance.now();

    // FPS monitoring
    frameCountRef.current++;
    if (currentTime - lastTimeRef.current > 1000) {
      fpsRef.current = frameCountRef.current;
      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;

      // Adaptive quality
      if (fpsRef.current < config.targetFPS * 0.8 && particlesRef.current.length > 20) {
        particlesRef.current = particlesRef.current.slice(
          0,
          Math.floor(particlesRef.current.length * 0.9),
        );
      }
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw
    const noise = noiseGenerator.current;

    particlesRef.current.forEach((particle) => {
      particle.update(currentTime, mouseRef.current.x, mouseRef.current.y, noise);
    });

    updateConnections();
    drawConnections(ctx);

    particlesRef.current.forEach((particle) => {
      particle.draw(ctx);
    });

    // Continue animation
    if (mode !== 'reduced' || config.twinkle) {
      const frameDelay = Math.max(0, 1000 / config.targetFPS - (performance.now() - currentTime));
      setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate);
      }, frameDelay);
    }
  }, [mode, config.targetFPS, config.twinkle, updateConnections, drawConnections]);

  // Setup and cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // DPI handling
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      // Reinitialize on resize
      initializeSystem({ width: rect.width, height: rect.height });

      // Update grid
      gridRef.current = new SpatialGrid(rect.width, rect.height, connectThreshold);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleVisibilityChange = () => {
      documentHiddenRef.current = document.hidden;
      if (!document.hidden && !animationRef.current) {
        animate();
      }
    };

    // Check for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches && mode === 'normal') {
      // Auto-switch to reduced mode
      return;
    }

    // Initialize
    handleResize();

    // Event listeners
    window.addEventListener('resize', handleResize);
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start animation
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [mode, interactive, initializeSystem, animate, connectThreshold]);

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
      }}
      aria-hidden="true"
    />
  );
};

export default NetworkDriftParticles;
