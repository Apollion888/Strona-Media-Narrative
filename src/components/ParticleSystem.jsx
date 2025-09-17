import React, { useRef, useEffect } from 'react';

const ParticleSystem = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Ustawienie rozmiaru canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Dodaj debug info
      console.log('Canvas resized:', canvas.width, 'x', canvas.height);
      
      // Odtwórz cząstki po resize
      createParticles();
    };

    // Tworzenie cząstek
    const createParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      
      console.log('Creating', particleCount, 'particles');
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.6 + 0.2,
          originalSize: 0,
          morphPhase: Math.random() * Math.PI * 2,
          connections: []
        });
      }
      
      // Ustaw originalSize po utworzeniu
      particlesRef.current.forEach(p => {
        p.originalSize = p.size;
      });
    };

    // Obsługa myszy
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    // Animacja
    let time = 0;
    const animate = () => {
      time += 0.016;
      
      // Wyczyść canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Aktualizuj i rysuj cząstki
      particlesRef.current.forEach((particle, index) => {
        // Morfowanie rozmiaru
        particle.morphPhase += 0.02;
        particle.size = particle.originalSize + Math.sin(particle.morphPhase) * 2;
        
        // Ruch cząstek
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Odbicie od ścian
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;
        
        // Utrzymaj w granicach
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        
        // Interakcja z myszą
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          const force = (120 - distance) / 120 * 0.5;
          const angle = Math.atan2(dy, dx);
          particle.x -= Math.cos(angle) * force * 3;
          particle.y -= Math.sin(angle) * force * 3;
        }
        
        // Rysuj poświatę
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 4
        );
        gradient.addColorStop(0, `rgba(0, 255, 0, ${particle.opacity * 0.8})`);
        gradient.addColorStop(0.5, `rgba(128, 255, 128, ${particle.opacity * 0.4})`);
        gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Rysuj główną cząstkę
        ctx.fillStyle = `rgba(0, 255, 0, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Dodatkowy efekt - pulsujące kółko
        ctx.strokeStyle = `rgba(128, 255, 128, ${Math.sin(time * 3 + index) * 0.3 + 0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size + Math.sin(time * 2 + index) * 3, 0, Math.PI * 2);
        ctx.stroke();
      });
      
      // Rysuj połączenia między cząstkami
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < Math.min(i + 5, particlesRef.current.length); j++) { // Ogranicz połączenia dla wydajności
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
          
          if (distance < 150) {
            const opacity = (150 - distance) / 150 * 0.4;
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            gradient.addColorStop(0, `rgba(0, 255, 0, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(128, 255, 128, ${opacity * 1.5})`);
            gradient.addColorStop(1, `rgba(0, 255, 0, ${opacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1 + opacity * 2;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      
      // Dodatkowy efekt - skanujące linie
      ctx.strokeStyle = `rgba(0, 255, 0, ${Math.sin(time) * 0.1 + 0.1})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const y = (time * 100 + i * canvas.height / 3) % canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Inicjalizacja
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
        background: 'transparent'
      }}
    />
  );
};

export default ParticleSystem;
