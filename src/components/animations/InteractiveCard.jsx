import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const InteractiveCard = ({
  children,
  className = '',
  glowEffect = true,
  tiltEffect = true,
  magneticEffect = false,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Motion values dla mouse tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transforms dla 3D effects
  const rotateX = useTransform(y, [-300, 300], [10, -10]);
  const rotateY = useTransform(x, [-300, 300], [-10, 10]);
  const scale = useTransform(x, [-300, 300], [0.98, 1.02]);

  const handleMouseMove = (event) => {
    if (!tiltEffect && !magneticEffect) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={`interactive-card ${className}`}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: magneticEffect ? 1.05 : 1.02,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 },
      }}
      {...props}
    >
      <motion.div
        style={{
          rotateX: tiltEffect ? rotateX : 0,
          rotateY: tiltEffect ? rotateY : 0,
          scale: tiltEffect ? scale : 1,
          transformStyle: 'preserve-3d',
        }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 300,
        }}
      >
        {/* Glow effect layer */}
        {glowEffect && isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              background: 'linear-gradient(45deg, #00ff0020, #00ffff20, #00ff0020)',
              borderRadius: 'inherit',
              zIndex: -1,
              filter: 'blur(8px)',
            }}
          />
        )}

        {/* Card content */}
        <motion.div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: 'inherit',
            overflow: 'hidden',
          }}
          animate={{
            boxShadow: isHovered
              ? '0 20px 40px rgba(0, 255, 0, 0.1), 0 0 20px rgba(0, 255, 255, 0.1)'
              : '0 8px 16px rgba(0, 0, 0, 0.2)',
          }}
          transition={{ duration: 0.3 }}
        >
          {children}

          {/* Shine effect overlay */}
          {isHovered && (
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '100%', opacity: [0, 1, 0] }}
              transition={{
                duration: 0.8,
                ease: 'easeInOut',
                delay: 0.2,
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                pointerEvents: 'none',
                transform: 'skewX(-15deg)',
              }}
            />
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default InteractiveCard;
