import React, { useEffect, useRef, useState } from 'react';

const NeuralTimeline = ({ posts = [] }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [activeNode, setActiveNode] = useState(-1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Sample blog posts data
  const samplePosts = [
    {
      id: 1,
      title: 'AI w Fotografii: Rewolucja czy Ewolucja?',
      date: '2024-09-10',
      category: 'AI & Tech',
      preview:
        'Jak sztuczna inteligencja zmienia sposób, w jaki tworzymy i postrzegamy fotografię...',
      readTime: '5 min',
      status: 'published',
    },
    {
      id: 2,
      title: 'Neural Networks w Post-produkcji',
      date: '2024-09-08',
      category: 'Tutorial',
      preview: 'Praktyczne zastosowanie sieci neuronowych w obróbce zdjęć i wideo...',
      readTime: '8 min',
      status: 'published',
    },
    {
      id: 3,
      title: 'Quantum Computing dla Kreatywnych',
      date: '2024-09-05',
      category: 'Future Tech',
      preview: 'Jak obliczenia kwantowe mogą wpłynąć na przyszłość branży kreatywnej...',
      readTime: '12 min',
      status: 'draft',
    },
    {
      id: 4,
      title: 'Holographic Displays - Media 3.0',
      date: '2024-09-01',
      category: 'Innovation',
      preview: 'Przyszłość wyświetlaczy holograficznych w mediach i reklamie...',
      readTime: '6 min',
      status: 'coming-soon',
    },
  ];

  const blogPosts = posts.length > 0 ? posts : samplePosts;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    // Neural network nodes
    const nodes = [];
    const connections = [];

    // Create nodes for each blog post
    blogPosts.forEach((post, index) => {
      const angle = (index / blogPosts.length) * Math.PI * 2;
      const radius = 150;
      nodes.push({
        id: post.id,
        x: canvas.width / 2 + Math.cos(angle) * radius,
        y: canvas.height / 2 + Math.sin(angle) * radius,
        baseX: canvas.width / 2 + Math.cos(angle) * radius,
        baseY: canvas.height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        size: 8,
        energy: Math.random(),
        pulsePhase: Math.random() * Math.PI * 2,
        connections: [],
        post,
        active: false,
      });
    });

    // Create additional floating nodes
    for (let i = 0; i < 8; i++) {
      nodes.push({
        id: `float-${i}`,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseX: Math.random() * canvas.width,
        baseY: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 2 + 1,
        energy: Math.random(),
        pulsePhase: Math.random() * Math.PI * 2,
        connections: [],
        type: 'floating',
        active: false,
      });
    }

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Recalculate positions
      blogPosts.forEach((post, index) => {
        const angle = (index / blogPosts.length) * Math.PI * 2;
        const radius = 150;
        const node = nodes.find((n) => n.id === post.id);
        if (node) {
          node.baseX = canvas.width / 2 + Math.cos(angle) * radius;
          node.baseY = canvas.height / 2 + Math.sin(angle) * radius;
        }
      });
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    container.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      time += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update nodes
      nodes.forEach((node, index) => {
        // Mouse interaction
        const dx = mousePos.x - node.x;
        const dy = mousePos.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const force = (100 - distance) / 100;
          node.vx += (dx / distance) * force * 0.02;
          node.vy += (dy / distance) * force * 0.02;
          node.active = true;

          if (distance < 50 && node.post) {
            setActiveNode(index);
          }
        } else {
          node.active = false;
          if (node.post && activeNode === index && distance > 60) {
            setActiveNode(-1);
          }
        }

        // Return to base position
        const returnForceX = (node.baseX - node.x) * 0.01;
        const returnForceY = (node.baseY - node.y) * 0.01;
        node.vx += returnForceX;
        node.vy += returnForceY;

        // Update position
        node.vx *= 0.95;
        node.vy *= 0.95;
        node.x += node.vx;
        node.y += node.vy;

        // Update energy and pulse
        node.energy += 0.02;
        node.pulsePhase += 0.05;
      });

      // Calculate connections
      connections.length = 0;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            connections.push({
              n1,
              n2,
              distance,
              strength: (120 - distance) / 120,
              active: n1.active || n2.active,
            });
          }
        }
      }

      // Draw connections (subtle)
      connections.forEach((conn) => {
        const alpha = conn.strength * 0.15 * (conn.active ? 1.6 : 1);
        const width = 0.5 + conn.strength * (conn.active ? 1.2 : 0.8);

        ctx.strokeStyle = `rgba(160, 255, 160, ${alpha})`;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(conn.n1.x, conn.n1.y);
        ctx.lineTo(conn.n2.x, conn.n2.y);
        ctx.stroke();

        // Data flow animation
        if (conn.active) {
          const flowPos = (time * 2) % 1;
          const flowX = conn.n1.x + (conn.n2.x - conn.n1.x) * flowPos;
          const flowY = conn.n1.y + (conn.n2.y - conn.n1.y) * flowPos;

          ctx.fillStyle = `rgba(160, 255, 200, 0.6)`;
          ctx.beginPath();
          ctx.arc(flowX, flowY, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw nodes
      nodes.forEach((node, index) => {
        const pulse = Math.sin(node.pulsePhase) * 0.3 + 0.7;
        const size = node.size * pulse * (node.active ? 1.5 : 1);
        const energy = Math.sin(node.energy) * 0.5 + 0.5;

        // Node glow (soft)
        ctx.shadowColor = node.post ? 'rgba(160, 255, 160, 0.9)' : 'rgba(160, 255, 200, 0.8)';
        ctx.shadowBlur = node.active ? 12 : 6;

        // Outer ring for blog posts
        if (node.post) {
          ctx.strokeStyle = `rgba(160, 255, 160, ${0.5 + energy * 0.2})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, size + 8, 0, Math.PI * 2);
          ctx.stroke();

          // Status indicator
          const statusColor =
            {
              published: '#a0ffa0',
              draft: '#fff1a6',
              'coming-soon': '#ffd699',
            }[node.post.status] || '#a0ffa0';

          ctx.fillStyle = statusColor;
          ctx.beginPath();
          ctx.arc(node.x + size + 5, node.y - size - 5, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Main node
        ctx.fillStyle = node.post
          ? `rgba(160, 255, 160, ${0.6 + energy * 0.2})`
          : `rgba(160, 255, 200, ${0.5 + energy * 0.3})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Inner core
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, size * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
      });

      // Central hub (soft)
      const hubPulse = Math.sin(time * 1.2) * 0.1 + 0.9;
      ctx.shadowColor = 'rgba(160, 255, 200, 0.6)';
      ctx.shadowBlur = 10;
      ctx.fillStyle = `rgba(160, 255, 200, ${0.25 * hubPulse})`;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 8 * hubPulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mousePos.x, mousePos.y, activeNode, blogPosts]);

  return (
    <div className="neural-timeline" style={{ position: 'relative', padding: '4rem 0' }}>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          height: '600px',
          background: 'linear-gradient(180deg, rgba(0, 24, 8, 0.22) 0%, rgba(0, 0, 0, 0.35) 100%)',
          borderRadius: '18px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'saturate(120%) blur(10px)',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            cursor: 'default',
          }}
        />

        {/* Active Post Preview */}
        {activeNode >= 0 && blogPosts[activeNode] && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '300px',
              background: 'rgba(16, 22, 18, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '1rem',
              color: '#e6ffe6',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
              backdropFilter: 'saturate(120%) blur(12px)',
              animation: 'nodePreviewFade 0.4s ease-out',
              zIndex: 10,
            }}
          >
            <div
              style={{
                color: 'rgba(160, 255, 160, 0.9)',
                fontSize: '0.8rem',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {blogPosts[activeNode].category} • {blogPosts[activeNode].readTime}
            </div>
            <h3
              style={{
                color: '#d6ffd6',
                fontSize: '1.1rem',
                marginBottom: '0.5rem',
                lineHeight: '1.3',
              }}
            >
              {blogPosts[activeNode].title}
            </h3>
            <p
              style={{
                color: 'rgba(235, 245, 235, 0.8)',
                fontSize: '0.9rem',
                lineHeight: '1.4',
                marginBottom: '0.5rem',
              }}
            >
              {blogPosts[activeNode].preview}
            </p>
            <div
              style={{
                color: 'rgba(160, 255, 160, 0.9)',
                fontSize: '0.8rem',
              }}
            >
              {new Date(blogPosts[activeNode].date).toLocaleDateString('pl-PL')}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            color: 'rgba(255, 255, 255, 0.45)',
            fontSize: '0.85rem',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          Hover nodes to preview
        </div>
      </div>

      <style>{`
        @keyframes nodePreviewFade {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default NeuralTimeline;
