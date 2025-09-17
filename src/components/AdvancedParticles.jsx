import React, { useRef, useEffect, useState } from 'react';

class AdvancedParticleSystem {
  constructor(container, options = {}) {
    this.container = container;
    if (!this.container) return;

    this.defaults = {
      // Basic settings
      particleCount: 100,
      particleColor: '#00FF00', // Neon green from style guide
      lineColor: '#80FF80',     // Light green from style guide
      lineWidth: 1,
      lineDistance: 120,
      particleSize: { min: 2, max: 5 },
      speed: 0.8,
      
      // Advanced settings
      useWebGL: true,
      enableGlow: true,
      enableTrails: false, // Disable by default for better performance
      enableMorphing: true,
      enableGravity: false,
      enableAttraction: true,
      enableRepulsion: true,
      
      // WebGL settings
      glowIntensity: 0.6,
      trailLength: 15,
      morphSpeed: 0.015,
      gravityStrength: 0.05,
      attractionStrength: 0.08,
      repulsionStrength: 0.12,
      
      // Performance settings
      enableCulling: true,
      cullDistance: 300,
      maxParticles: 300,
      
      // Interactivity
      interactivity: {
        grabDistance: 100,
        pushParticles: 3,
        attractMode: false,
        repelMode: false,
        connectMode: true
      }
    };

    this.settings = { ...this.defaults, ...options };
    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.container.appendChild(this.canvas);
    
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '-1';
    
    this.particles = [];
    this.particleTrails = [];
    this.mouse = { x: null, y: null, radius: 100 };
    this.time = 0;
    
    if (this.container) {
      this.container.style.position = 'relative';
      this.container.style.overflow = 'hidden';
    }
    
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    
    // Always initialize 2D context for fallback rendering
    this.ctx = this.canvas.getContext('2d');
    
    // Initialize WebGL if supported and enabled
    if (this.settings.useWebGL && this.initWebGL()) {
      this.useWebGL = true;
      this.initWebGLParticles();
    } else {
      this.useWebGL = false;
      this.particles = this.createParticles();
    }
    
    this.setupEventListeners();
    this.animate();
  }

  initWebGL() {
    try {
      this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
      if (!this.gl) return false;

      // Vertex shader
      const vertexShaderSource = `
        attribute vec2 a_position;
        attribute float a_size;
        attribute vec3 a_color;
        attribute float a_opacity;
        
        uniform vec2 u_resolution;
        uniform float u_time;
        
        varying vec3 v_color;
        varying float v_opacity;
        
        void main() {
          vec2 position = (a_position / u_resolution) * 2.0 - 1.0;
          gl_Position = vec4(position * vec2(1, -1), 0, 1);
          gl_PointSize = a_size;
          
          v_color = a_color;
          v_opacity = a_opacity;
        }
      `;

      // Fragment shader with glow effect
      const fragmentShaderSource = `
        precision mediump float;
        
        varying vec3 v_color;
        varying float v_opacity;
        
        uniform float u_glowIntensity;
        uniform float u_time;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float distance = length(center);
          
          if (distance > 0.5) discard;
          
          float alpha = (1.0 - distance * 2.0) * v_opacity;
          float glow = exp(-distance * 8.0) * u_glowIntensity;
          
          gl_FragColor = vec4(v_color * (1.0 + glow), alpha + glow * 0.3);
        }
      `;

      // Compile shaders
      this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
      this.fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
      
      // Create program
      this.program = this.createProgram(this.vertexShader, this.fragmentShader);
      
      // Get attribute and uniform locations
      this.positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
      this.sizeLocation = this.gl.getAttribLocation(this.program, 'a_size');
      this.colorLocation = this.gl.getAttribLocation(this.program, 'a_color');
      this.opacityLocation = this.gl.getAttribLocation(this.program, 'a_opacity');
      
      this.resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
      this.timeLocation = this.gl.getUniformLocation(this.program, 'u_time');
      this.glowLocation = this.gl.getUniformLocation(this.program, 'u_glowIntensity');
      
      // Create buffers
      this.positionBuffer = this.gl.createBuffer();
      this.sizeBuffer = this.gl.createBuffer();
      this.colorBuffer = this.gl.createBuffer();
      this.opacityBuffer = this.gl.createBuffer();
      
      return true;
    } catch (error) {
      console.warn('WebGL initialization failed, falling back to Canvas 2D:', error);
      return false;
    }
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }

  createProgram(vertexShader, fragmentShader) {
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Program linking error:', this.gl.getProgramInfoLog(program));
      this.gl.deleteProgram(program);
      return null;
    }
    
    return program;
  }

  initWebGLParticles() {
    this.particles = [];
    for (let i = 0; i < this.settings.particleCount; i++) {
      this.particles.push(this.createWebGLParticle());
    }
  }

  createWebGLParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * (this.settings.particleSize.max - this.settings.particleSize.min) + this.settings.particleSize.min,
      speedX: (Math.random() - 0.5) * this.settings.speed,
      speedY: (Math.random() - 0.5) * this.settings.speed,
      color: this.hexToRgb(this.settings.particleColor),
      opacity: Math.random() * 0.5 + 0.1,
      originalSize: 0,
      morphPhase: Math.random() * Math.PI * 2,
      trail: []
    };
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 1, b: 0 };
  }

  createParticles() {
    const particles = [];
    const { particleCount } = this.settings;
    const numClusters = 5;
    const clusterRadius = Math.min(this.canvas.width, this.canvas.height) / 5;
    const clusters = [];

    for (let i = 0; i < numClusters; i++) {
      clusters.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height
      });
    }
    
    for (let i = 0; i < particleCount; i++) {
      const cluster = clusters[i % numClusters];
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * clusterRadius;

      particles.push({
        x: cluster.x + Math.cos(angle) * radius,
        y: cluster.y + Math.sin(angle) * radius,
        size: Math.random() * (this.settings.particleSize.max - this.settings.particleSize.min) + this.settings.particleSize.min,
        speedX: (Math.random() - 0.5) * this.settings.speed,
        speedY: (Math.random() - 0.5) * this.settings.speed,
        opacity: Math.random() * 0.5 + 0.1,
        originalSize: 0,
        morphPhase: Math.random() * Math.PI * 2,
        trail: []
      });
    }
    
    return particles;
  }

  setupEventListeners() {
    this.handleResizeHandler = () => this.handleResize();
    this.mouseMoveHandler = (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    };
    this.mouseLeaveHandler = () => {
      this.mouse.x = null;
      this.mouse.y = null;
    };
    this.clickHandler = () => this.pushParticles();
    
    // Keyboard controls for different modes
    this.keyDownHandler = (e) => {
      switch(e.key) {
        case 'g':
          this.settings.enableGravity = !this.settings.enableGravity;
          break;
        case 'a':
          this.settings.interactivity.attractMode = !this.settings.interactivity.attractMode;
          this.settings.interactivity.repelMode = false;
          break;
        case 'r':
          this.settings.interactivity.repelMode = !this.settings.interactivity.repelMode;
          this.settings.interactivity.attractMode = false;
          break;
        case 't':
          this.settings.enableTrails = !this.settings.enableTrails;
          break;
      }
    };
    
    window.addEventListener('resize', this.handleResizeHandler);
    window.addEventListener('mousemove', this.mouseMoveHandler);
    window.addEventListener('mouseleave', this.mouseLeaveHandler);
    window.addEventListener('click', this.clickHandler);
    window.addEventListener('keydown', this.keyDownHandler);
  }

  handleResize() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    
    if (this.useWebGL) {
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      this.initWebGLParticles();
    } else {
      this.particles = this.createParticles();
    }
  }

  pushParticles() {
    const { pushParticles } = this.settings.interactivity;
    
    for (let i = 0; i < pushParticles; i++) {
      const particle = this.particles[Math.floor(Math.random() * this.particles.length)];
      if (particle) {
        particle.speedX = (Math.random() - 0.5) * this.settings.speed * 5;
        particle.speedY = (Math.random() - 0.5) * this.settings.speed * 5;
      }
    }
  }

  updateParticles() {
    this.time += 0.016; // ~60fps
    
    // Adjust particle count based on container size for better performance
    const rect = this.container.getBoundingClientRect();
    const desiredParticleCount = Math.min(
      this.settings.maxParticles,
      Math.max(50, Math.floor((rect.width * rect.height) / 8000))
    );
    
    // Add particles if needed
    while (this.particles.length < desiredParticleCount) {
      if (this.useWebGL) {
        this.particles.push(this.createWebGLParticle());
      } else {
        const newParticles = this.createParticles();
        this.particles.push(newParticles[0]);
      }
    }
    
    // Remove particles if over limit
    if (this.particles.length > desiredParticleCount) {
      this.particles.splice(desiredParticleCount);
    }
    
    this.particles.forEach(particle => {
      // Store original size for morphing
      if (!particle.originalSize) {
        particle.originalSize = particle.size;
      }
      
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Boundary collision
      if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
      
      // Keep particles in bounds
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
      
      // Gravity effect
      if (this.settings.enableGravity) {
        particle.speedY += this.settings.gravityStrength;
      }
      
      // Mouse interactions
      if (this.mouse.x && this.mouse.y) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          
          if (this.settings.interactivity.attractMode) {
            particle.x += Math.cos(angle) * force * this.settings.attractionStrength * 10;
            particle.y += Math.sin(angle) * force * this.settings.attractionStrength * 10;
          } else if (this.settings.interactivity.repelMode) {
            particle.x -= Math.cos(angle) * force * this.settings.repulsionStrength * 10;
            particle.y -= Math.sin(angle) * force * this.settings.repulsionStrength * 10;
          } else {
            // Default repulsion
            particle.x -= Math.cos(angle) * force * 2;
            particle.y -= Math.sin(angle) * force * 2;
          }
        }
      }
      
      // Morphing effect
      if (this.settings.enableMorphing) {
        particle.morphPhase += this.settings.morphSpeed;
        particle.size = particle.originalSize + Math.sin(particle.morphPhase) * particle.originalSize * 0.3;
      }
      
      // Update trails
      if (this.settings.enableTrails) {
        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > this.settings.trailLength) {
          particle.trail.shift();
        }
      } else {
        particle.trail = [];
      }
    });
    
    // Particle culling for performance
    if (this.settings.enableCulling && this.particles.length > this.settings.maxParticles) {
      this.cullParticles();
    }
  }

  cullParticles() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    this.particles = this.particles.filter(particle => {
      const dx = particle.x - centerX;
      const dy = particle.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      return distance < this.settings.cullDistance;
    });
  }

  renderWebGL() {
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    
    this.gl.useProgram(this.program);
    
    // Set uniforms
    this.gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
    this.gl.uniform1f(this.timeLocation, this.time);
    this.gl.uniform1f(this.glowLocation, this.settings.glowIntensity);
    
    // Prepare data arrays
    const positions = [];
    const sizes = [];
    const colors = [];
    const opacities = [];
    
    this.particles.forEach(particle => {
      positions.push(particle.x, particle.y);
      sizes.push(particle.size);
      colors.push(particle.color.r, particle.color.g, particle.color.b);
      opacities.push(particle.opacity);
    });
    
    // Update buffers
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.DYNAMIC_DRAW);
    this.gl.enableVertexAttribArray(this.positionLocation);
    this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sizeBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(sizes), this.gl.DYNAMIC_DRAW);
    this.gl.enableVertexAttribArray(this.sizeLocation);
    this.gl.vertexAttribPointer(this.sizeLocation, 1, this.gl.FLOAT, false, 0, 0);
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.DYNAMIC_DRAW);
    this.gl.enableVertexAttribArray(this.colorLocation);
    this.gl.vertexAttribPointer(this.colorLocation, 3, this.gl.FLOAT, false, 0, 0);
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.opacityBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(opacities), this.gl.DYNAMIC_DRAW);
    this.gl.enableVertexAttribArray(this.opacityLocation);
    this.gl.vertexAttribPointer(this.opacityLocation, 1, this.gl.FLOAT, false, 0, 0);
    
    // Enable blending for transparency
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    
    // Draw particles
    this.gl.drawArrays(this.gl.POINTS, 0, this.particles.length);
    
    // Draw connections if enabled
    if (this.settings.interactivity.connectMode) {
      this.drawConnectionsWebGL();
    }
  }

  drawConnectionsWebGL() {
    // This would require a more complex WebGL setup for line drawing
    // For now, we'll fall back to Canvas 2D for connections
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    this.drawConnections2D(tempCtx);
    
    // Note: WebGL connections would need separate implementation
    // For now, connections are disabled in WebGL mode for performance
  }

  drawConnections2D(ctx) {
    // Optimization: Only check nearby particles for connections
    const gridSize = 100;
    const grid = {};
    
    // Group particles into grid cells for faster lookup
    this.particles.forEach((particle, index) => {
      const gridX = Math.floor(particle.x / gridSize);
      const gridY = Math.floor(particle.y / gridSize);
      const key = `${gridX},${gridY}`;
      
      if (!grid[key]) grid[key] = [];
      grid[key].push({ particle, index });
    });
    
    // Check connections within and adjacent grid cells
    this.particles.forEach((particle, i) => {
      const gridX = Math.floor(particle.x / gridSize);
      const gridY = Math.floor(particle.y / gridSize);
      
      // Check current and adjacent cells
      for (let x = gridX - 1; x <= gridX + 1; x++) {
        for (let y = gridY - 1; y <= gridY + 1; y++) {
          const key = `${x},${y}`;
          const cell = grid[key];
          
          if (cell) {
            cell.forEach(({ particle: otherParticle, index: j }) => {
              if (i < j) { // Avoid duplicate connections
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.settings.lineDistance) {
                  const opacity = 1 - (distance / this.settings.lineDistance);
                  ctx.strokeStyle = `${this.settings.lineColor}${Math.floor(opacity * 60).toString(16).padStart(2, '0')}`;
                  ctx.lineWidth = this.settings.lineWidth * (0.5 + opacity * 0.5);
                  
                  ctx.beginPath();
                  ctx.moveTo(particle.x, particle.y);
                  ctx.lineTo(otherParticle.x, otherParticle.y);
                  ctx.stroke();
                }
              }
            });
          }
        }
      }
    });
  }

  renderCanvas2D() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw trails if enabled
    if (this.settings.enableTrails) {
      this.particles.forEach(particle => {
        if (particle.trail.length > 1) {
          this.ctx.strokeStyle = `${this.settings.particleColor}40`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
          
          for (let i = 1; i < particle.trail.length; i++) {
            this.ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
          }
          this.ctx.stroke();
        }
      });
    }
    
    // Draw connections
    if (this.settings.interactivity.connectMode) {
      this.drawConnections2D(this.ctx);
    }
    
    // Draw particles with glow effect
    this.particles.forEach(particle => {
      if (this.settings.enableGlow) {
        // Glow effect
        const gradient = this.ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, `${this.settings.particleColor}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${this.settings.particleColor}00`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      // Main particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `${this.settings.particleColor}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
      this.ctx.fill();
    });
  }

  drawParticles() {
    if (this.useWebGL) {
      this.renderWebGL();
    } else {
      this.renderCanvas2D();
    }
  }

  animate() {
    if (!this.canvas || !this.container.contains(this.canvas)) return;
    
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    this.updateParticles();
    this.drawParticles();
  }

  destroy() {
    cancelAnimationFrame(this.animationFrameId);
    if (this.canvas && this.container.contains(this.canvas)) {
      this.container.removeChild(this.canvas);
    }
    
    // Clean up WebGL resources
    if (this.gl) {
      this.gl.deleteProgram(this.program);
      this.gl.deleteShader(this.vertexShader);
      this.gl.deleteShader(this.fragmentShader);
      this.gl.deleteBuffer(this.positionBuffer);
      this.gl.deleteBuffer(this.sizeBuffer);
      this.gl.deleteBuffer(this.colorBuffer);
      this.gl.deleteBuffer(this.opacityBuffer);
    }
    
    // Remove event listeners
    window.removeEventListener('resize', this.handleResizeHandler);
    window.removeEventListener('mousemove', this.mouseMoveHandler);
    window.removeEventListener('mouseleave', this.mouseLeaveHandler);
    window.removeEventListener('click', this.clickHandler);
    window.removeEventListener('keydown', this.keyDownHandler);
  }

  // Public API for configuration
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
  }

  addParticles(count) {
    for (let i = 0; i < count; i++) {
      if (this.useWebGL) {
        this.particles.push(this.createWebGLParticle());
      } else {
        this.particles.push(this.createParticles()[0]);
      }
    }
  }

  removeParticles(count) {
    this.particles.splice(0, Math.min(count, this.particles.length));
  }

  setMode(mode) {
    switch(mode) {
      case 'attract':
        this.settings.interactivity.attractMode = true;
        this.settings.interactivity.repelMode = false;
        break;
      case 'repel':
        this.settings.interactivity.attractMode = false;
        this.settings.interactivity.repelMode = true;
        break;
      case 'normal':
        this.settings.interactivity.attractMode = false;
        this.settings.interactivity.repelMode = false;
        break;
    }
  }
}

const AdvancedParticles = ({ config = {} }) => {
  const particleRef = useRef(null);
  const [particleSystem, setParticleSystem] = useState(null);

  useEffect(() => {
    let system;
    const timer = setTimeout(() => {
      if (particleRef.current) {
        try {
          system = new AdvancedParticleSystem(particleRef.current, config);
          setParticleSystem(system);
        } catch (error) {
          console.warn('AdvancedParticles initialization failed:', error);
        }
      }
    }, 100);
    
    return () => {
      clearTimeout(timer);
      if (system && typeof system.destroy === 'function') {
        system.destroy();
      }
    };
  }, [config]);

  // Expose particle system controls
  React.useImperativeHandle(particleRef, () => ({
    updateSettings: (newSettings) => particleSystem?.updateSettings(newSettings),
    addParticles: (count) => particleSystem?.addParticles(count),
    removeParticles: (count) => particleSystem?.removeParticles(count),
    setMode: (mode) => particleSystem?.setMode(mode),
    getSystem: () => particleSystem
  }));

  return (
    <div 
      id="advanced-particles-js" 
      ref={particleRef} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1 
      }} 
    />
  );
};

export default AdvancedParticles;
