import { motion, useReducedMotion } from 'framer-motion';

const MotionWrapper = ({ 
  children, 
  variant = 'fadeInUp', 
  delay = 0, 
  duration = 0.5,
  className = '',
  ...props 
}) => {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 }
    },
    slideInLeft: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 }
    },
    slideInRight: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 }
    },
    cyberpunkGlow: {
      initial: { opacity: 0, boxShadow: '0 0 0 transparent' },
      animate: { 
        opacity: 1, 
        boxShadow: '0 0 20px rgba(0, 255, 0, 0.6)' 
      }
    }
  };

  const reducedVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  };

  const selectedVariants = shouldReduceMotion ? reducedVariants : variants[variant];

  return (
    <motion.div
      className={className}
      variants={selectedVariants}
      initial="initial"
      animate="animate"
      transition={{
        duration: shouldReduceMotion ? 0.01 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0, 0, 0.2, 1]
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
