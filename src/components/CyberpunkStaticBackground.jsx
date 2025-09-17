import React, { useEffect, useRef, useState } from 'react';

const CyberpunkStaticBackground = () => {
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    // Minimal grid lines
    const gridLines = [];
    const scanLines = [];

    const initializePatterns = () => {
      gridLines.length = 0;
      scanLines.length = 0;

      // Horizontal grid lines (very subtle)
      for (let i = 0; i < 8; i++) {
        gridLines.push({
          type: 'horizontal',
          y: (canvas.height / 8) * i,
          opacity: 0.02 + Math.random() * 0.03,
          pulse: Math.random() * Math.PI * 2
        });
      }

      // Vertical grid lines (very subtle)
      for (let i = 0; i < 12; i++) {
        gridLines.push({
          type: 'vertical',
          x: (canvas.width / 12) * i,
          opacity: 0.02 + Math.random() * 0.03,
          pulse: Math.random() * Math.PI * 2
        });
      }

      // Scanning lines (minimal)
      for (let i = 0; i < 3; i++) {
        scanLines.push({
          y: Math.random() * canvas.height,
          speed: 0.3 + Math.random() * 0.2,
          opacity: 0.06 + Math.random() * 0.04,
          width: 1 + Math.random() * 2
        });
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializePatterns();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawStaticGrid = (time) => {
      // Draw subtle grid lines
      gridLines.forEach(line => {
        const pulseOpacity = line.opacity + Math.sin(time * 0.002 + line.pulse) * 0.01;
        
        if (line.type === 'horizontal') {
          ctx.strokeStyle = `rgba(0, 255, 0, ${pulseOpacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(0, line.y);
          ctx.lineTo(canvas.width, line.y);
          ctx.stroke();
        } else {
          ctx.strokeStyle = `rgba(0, 255, 0, ${pulseOpacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(line.x, 0);
          ctx.lineTo(line.x, canvas.height);
          ctx.stroke();
        }
      });
    };

    const drawScanLines = (time) => {
      scanLines.forEach(line => {
        // Move scan line
        line.y += line.speed;
        if (line.y > canvas.height + 50) {
          line.y = -50;
        }

        // Draw scan line with gradient
        const gradient = ctx.createLinearGradient(0, line.y - 10, 0, line.y + 10);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, `rgba(0, 255, 0, ${line.opacity})`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, line.y - line.width/2, canvas.width, line.width);
      });
    };

    const drawAmbientGlow = (time) => {
      // Subtle corner glows
      const corners = [
        { x: 0, y: 0 },
        { x: canvas.width, y: 0 },
        { x: 0, y: canvas.height },
        { x: canvas.width, y: canvas.height }
      ];

      corners.forEach((corner, index) => {
        const pulse = Math.sin(time * 0.001 + index * Math.PI / 2) * 0.02 + 0.03;
        const gradient = ctx.createRadialGradient(
          corner.x, corner.y, 0,
          corner.x, corner.y, 200
        );
        gradient.addColorStop(0, `rgba(0, 255, 0, ${pulse})`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(
          corner.x - 200, corner.y - 200,
          400, 400
        );
      });
    };

    const drawDataNodes = (time) => {
      // Static data points (very minimal)
      const nodePositions = [
        { x: canvas.width * 0.15, y: canvas.height * 0.25 },
        { x: canvas.width * 0.85, y: canvas.height * 0.15 },
        { x: canvas.width * 0.25, y: canvas.height * 0.75 },
        { x: canvas.width * 0.75, y: canvas.height * 0.85 },
      ];

      nodePositions.forEach((pos, index) => {
        const pulse = Math.sin(time * 0.003 + index) * 0.3 + 0.7;
        const size = 2 * pulse;
        
        ctx.fillStyle = `rgba(0, 255, 0, ${0.4 * pulse})`;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow
        ctx.shadowColor = 'rgba(0, 255, 0, 0.3)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };

    const animate = () => {
      time += 1;
      
      // Clear with very subtle fade
      ctx.fillStyle = 'rgba(17, 17, 17, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw minimal background elements
      drawStaticGrid(time);
      drawScanLines(time);
      drawAmbientGlow(time);
      drawDataNodes(time);

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

  if (!isVisible) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -2,
          background: 'radial-gradient(ellipse at center, #0f2f0f 0%, #111111 100%)',
        }}
      />
    );
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
        zIndex: -2,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, #0f2f0f 0%, #111111 100%)',
      }}
    />
  );
};

export default CyberpunkStaticBackground;
