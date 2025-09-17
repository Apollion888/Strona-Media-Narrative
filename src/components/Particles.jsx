import React from 'react';

const Particles = () => {
  const keyframes = `
    @keyframes float1 {
      0%, 100% { transform: translate(0px, 0px) scale(1); opacity: 0.7; }
      25% { transform: translate(10px, -15px) scale(1.2); opacity: 1; }
      50% { transform: translate(-5px, -25px) scale(0.8); opacity: 0.5; }
      75% { transform: translate(-10px, -10px) scale(1.1); opacity: 0.8; }
    }
    @keyframes float2 {
      0%, 100% { transform: translate(0px, 0px) rotate(0deg); opacity: 0.6; }
      33% { transform: translate(-20px, 10px) rotate(120deg); opacity: 0.9; }
      66% { transform: translate(15px, -20px) rotate(240deg); opacity: 0.4; }
    }
    @keyframes float3 {
      0%, 100% { transform: translateY(0px) scale(1); opacity: 0.8; }
      50% { transform: translateY(-30px) scale(1.3); opacity: 0.3; }
    }
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 8px rgba(0, 255, 150, 0.3); }
      50% { box-shadow: 0 0 25px rgba(0, 255, 150, 0.8), 0 0 35px rgba(0, 255, 150, 0.4); }
    }
  `;

  const createParticle = (size, color, top, left, animationType, duration, delay) => ({
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color,
    borderRadius: '50%',
    top: top,
    left: left,
    animation: `${animationType} ${duration}s ease-in-out infinite`,
    animationDelay: `${delay}s`,
    boxShadow: `0 0 ${size * 2}px ${color}`,
  });

  const particles = [
    // Duże cząstki główne
    createParticle(6, '#00ff96', '15%', '20%', 'float1', 8, 0),
    createParticle(4, '#00d4ff', '25%', '75%', 'float2', 10, 1),
    createParticle(5, '#ff6b00', '45%', '10%', 'float3', 6, 2),
    createParticle(7, '#ff0080', '65%', '85%', 'float1', 12, 3),
    createParticle(3, '#80ff00', '75%', '30%', 'float2', 9, 4),

    // Średnie cząstki
    createParticle(3, '#00ffff', '10%', '60%', 'float3', 7, 1.5),
    createParticle(4, '#ff4000', '30%', '40%', 'float1', 11, 2.5),
    createParticle(2, '#8000ff', '50%', '70%', 'float2', 8, 3.5),
    createParticle(5, '#ffff00', '70%', '15%', 'float3', 9, 0.5),
    createParticle(3, '#ff0040', '85%', '60%', 'float1', 10, 4.5),

    // Małe cząstki wypełniające
    createParticle(2, 'rgba(0, 255, 150, 0.6)', '8%', '45%', 'float2', 6, 0),
    createParticle(1, 'rgba(255, 100, 0, 0.7)', '22%', '90%', 'float3', 8, 1),
    createParticle(2, 'rgba(0, 200, 255, 0.5)', '38%', '25%', 'float1', 7, 2),
    createParticle(1, 'rgba(255, 0, 128, 0.6)', '55%', '80%', 'float2', 9, 3),
    createParticle(2, 'rgba(128, 255, 0, 0.7)', '68%', '5%', 'float3', 6, 4),
    createParticle(1, 'rgba(255, 255, 0, 0.5)', '82%', '45%', 'float1', 8, 0.8),
    createParticle(2, 'rgba(128, 0, 255, 0.6)', '92%', '75%', 'float2', 7, 1.8),
    createParticle(1, 'rgba(255, 64, 0, 0.7)', '18%', '15%', 'float3', 9, 2.8),

    // Mikro cząstki atmosferyczne
    createParticle(1, 'rgba(255, 255, 255, 0.3)', '12%', '35%', 'float1', 12, 0.3),
    createParticle(1, 'rgba(0, 255, 200, 0.4)', '28%', '65%', 'float2', 15, 1.3),
    createParticle(1, 'rgba(255, 150, 0, 0.3)', '42%', '50%', 'float3', 11, 2.3),
    createParticle(1, 'rgba(200, 0, 255, 0.4)', '58%', '95%', 'float1', 13, 3.3),
    createParticle(1, 'rgba(0, 255, 100, 0.3)', '72%', '40%', 'float2', 14, 4.3),
  ];

  return (
    <>
      <style>{keyframes}</style>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {particles.map((style, index) => (
          <div key={index} style={style} />
        ))}
      </div>
    </>
  );
};

export default Particles;
