import React from 'react';
import { motion } from 'framer-motion';

// Enhanced wrapper dla płynnych animacji
const MotionWrapper = ({ 
  children, 
  variant = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  className = '',
  ...props 
}) => {

  const variants = {
    fadeInUp: {
      initial: { opacity: 0, y: 60 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -60 }
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 }
    },
    slideInLeft: {
      initial: { opacity: 0, x: -100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 100 }
    },
    slideInRight: {
      initial: { opacity: 0, x: 100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -100 }
    },
    cyberpunkGlow: {
      initial: { 
        opacity: 0, 
        scale: 0.95,
        filter: 'brightness(0.8) blur(2px)'
      },
      animate: { 
        opacity: 1, 
        scale: 1,
        filter: 'brightness(1) blur(0px)'
      },
      exit: { 
        opacity: 0, 
        scale: 1.05,
        filter: 'brightness(1.2) blur(1px)'
      }
    },
    glitchEffect: {
      initial: { 
        opacity: 0,
        x: 0,
        skewX: 0,
        filter: 'hue-rotate(0deg)'
      },
      animate: { 
        opacity: 1,
        x: [0, -2, 2, 0],
        skewX: [0, 0.5, -0.5, 0],
        filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(0deg)'],
        transition: {
          duration: 0.5,
          x: { repeat: 2, duration: 0.1 },
          skewX: { repeat: 2, duration: 0.1 },
          filter: { repeat: 1, duration: 0.3 }
        }
      }
    }
  };

  const currentVariant = variants[variant] || variants.fadeInUp;

  return (
    <motion.div
      className={className}
      initial={currentVariant.initial}
      animate={currentVariant.animate}
      exit={currentVariant.exit}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1], // Custom cyberpunk easing
        ...currentVariant.transition
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
