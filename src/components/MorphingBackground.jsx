import React, { useEffect, useRef, useState } from 'react';

const MorphingBackground = () => {
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    // Morphing shapes data
    const shapes = [];
    const shapeCount = 8;

    // Initialize morphing shapes
    for (let i = 0; i < shapeCount; i++) {
      shapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseX: Math.random() * canvas.width,
        baseY: Math.random() * canvas.height,
        radius: Math.random() * 80 + 40,
        baseRadius: Math.random() * 80 + 40,
        morphSpeed: Math.random() * 0.012 + 0.004,
        colorPhase: Math.random() * Math.PI * 2,
        vertices: Math.floor(Math.random() * 6) + 3,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.08 + 0.06,
      });
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Generative pattern functions
    const drawMorphingShape = (shape, time) => {
      const centerX = shape.x + Math.sin(time * shape.morphSpeed) * 20;
      const centerY = shape.y + Math.cos(time * shape.morphSpeed * 0.7) * 14;
      const radius = shape.radius + Math.sin(time * shape.morphSpeed * 2) * 12;

      // Dynamic color morphing
      const hue = (Math.sin(shape.colorPhase + time * 0.008) * 18 + 130) % 360;
      const saturation = 60 + Math.sin(time * 0.01 + shape.colorPhase) * 10;
      const lightness = 30 + Math.sin(time * 0.012 + shape.colorPhase) * 8;

      shape.rotation += shape.rotationSpeed;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(shape.rotation);

      // Create morphing polygon
      ctx.beginPath();
      for (let i = 0; i <= shape.vertices; i++) {
        const angle = (i / shape.vertices) * Math.PI * 2;
        const r = radius + Math.sin(angle * 3 + time * 0.02) * 10;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();

      // Gradient fill
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${shape.opacity})`);
      gradient.addColorStop(
        0.7,
        `hsla(${hue + 10}, ${saturation - 8}%, ${lightness - 8}%, ${shape.opacity * 0.45})`,
      );
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.fill();

      // Morphing outline
      ctx.strokeStyle = `hsla(${hue + 30}, 90%, 60%, ${shape.opacity * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    };

    const drawGenerativePatterns = (time) => {
      // Flowing data streams (subtle)
      ctx.strokeStyle = 'rgba(160, 255, 160, 0.06)';
      ctx.lineWidth = 1;

      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        const startX = ((time * 30 + i * 120) % (canvas.width + 240)) - 120;
        const startY = i * (canvas.height / 20);

        for (let x = 0; x < canvas.width; x += 24) {
          const y = startY + Math.sin((startX + x) * 0.008 + time * 0.016) * 18;
          if (x === 0) {
            ctx.moveTo(startX + x, y);
          } else {
            ctx.lineTo(startX + x, y);
          }
        }
        ctx.stroke();
      }

      // Interference patterns (very light)
      ctx.strokeStyle = 'rgba(180, 255, 220, 0.05)';
      const waveCount = 5;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const frequency = 0.004 + w * 0.0015;
        const amplitude = 36 + w * 8;
        const phase = time * 0.008 + (w * Math.PI) / 4;

        for (let x = 0; x < canvas.width; x += 6) {
          const y = canvas.height / 2 + Math.sin(x * frequency + phase) * amplitude;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
    };

    const drawNeuralConnections = (time) => {
      // Dynamic neural network overlay (soft)
      const nodes = [];
      const nodeCount = 10;

      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const radius = 220 + Math.sin(time * 0.008 + i) * 40;
        nodes.push({
          x: canvas.width / 2 + Math.cos(angle + time * 0.004) * radius,
          y: canvas.height / 2 + Math.sin(angle + time * 0.004) * radius,
          energy: Math.sin(time * 0.015 + i) * 0.5 + 0.5,
        });
      }

      // Draw connections
      ctx.strokeStyle = 'rgba(160, 255, 200, 0.08)';
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 280) {
            const opacity = ((280 - distance) / 280) * 0.16;
            ctx.strokeStyle = `rgba(160, 255, 200, ${opacity})`;
            ctx.lineWidth = 0.5 + opacity * 2;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        ctx.fillStyle = `rgba(160, 255, 200, ${node.energy * 0.45})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2.5 + node.energy * 1.4, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const animate = () => {
      time += 0.008;

      // Clear with fade effect
      ctx.fillStyle = 'rgba(10, 10, 10, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw morphing shapes
      shapes.forEach((shape) => {
        // Gentle floating movement
        shape.x = shape.baseX + Math.sin(time * shape.morphSpeed) * 100;
        shape.y = shape.baseY + Math.cos(time * shape.morphSpeed * 0.8) * 80;

        // Pulsing effect
        const pulse = Math.sin(shape.pulsePhase + time * 0.03) * 0.2 + 0.8;
        shape.radius = shape.baseRadius * pulse;

        drawMorphingShape(shape, time);
      });

      // Draw generative patterns
      drawGenerativePatterns(time);

      // Draw neural connections
      drawNeuralConnections(time);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Respect reduced motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsVisible(!mediaQuery.matches);

    const handleChange = () => setIsVisible(!mediaQuery.matches);
    mediaQuery.addListener?.(handleChange);

    return () => mediaQuery.removeListener?.(handleChange);
  }, []);

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
        pointerEvents: 'none',
        background: 'radial-gradient(90% 90% at 50% 50%, #0a0a0a 0%, #000000 100%)',
        mixBlendMode: 'normal',
      }}
    />
  );
};

export default MorphingBackground;
