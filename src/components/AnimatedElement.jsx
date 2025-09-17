import React, { useState, useEffect, useRef } from 'react';

const AnimatedElement = ({ 
  children, 
  animationType = 'fadeInUp',
  delay = 0,
  duration = 0.8,
  triggerOnScroll = true,
  className = '',
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(!triggerOnScroll);
  const elementRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Respect user reduced motion preference
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const updateReduced = () => setReducedMotion(!!mq?.matches);
    updateReduced();
    mq?.addEventListener?.('change', updateReduced);

    return () => mq?.removeEventListener?.('change', updateReduced);
  }, []);

  useEffect(() => {
    if (!triggerOnScroll) {
      // Start animation immediately with delay
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay, triggerOnScroll]);

  const getAnimationStyles = () => {
    const baseStyles = reducedMotion
      ? { transition: 'none' }
      : {
          transition: `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
          transitionDelay: `${delay}ms`
        };

    if (reducedMotion) {
      // Show final state immediately
      return {
        ...baseStyles,
        opacity: 1,
        transform: 'none',
        filter: 'none'
      };
    }

    if (!isVisible) {
      switch (animationType) {
        case 'fadeIn':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'scale(0.95)'
          };
        case 'fadeInUp':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateY(30px) scale(0.98)'
          };
        case 'fadeInDown':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateY(-30px) scale(0.98)'
          };
        case 'fadeInLeft':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateX(-30px) scale(0.98)'
          };
        case 'fadeInRight':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateX(30px) scale(0.98)'
          };
        case 'slideUp':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateY(50px)'
          };
        case 'scaleIn':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'scale(0.8)'
          };
        case 'rotateIn':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'rotate(-10deg) scale(0.9)'
          };
        case 'glitchIn':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateX(-5px) skew(-2deg)',
            filter: 'hue-rotate(90deg)'
          };
        default:
          return {
            ...baseStyles,
            opacity: 0
          };
      }
    } else {
      return {
        ...baseStyles,
        opacity: 1,
        transform: 'translateY(0) translateX(0) scale(1) rotate(0) skew(0)',
        filter: 'none'
      };
    }
  };

  return (
    <div
      ref={elementRef}
      className={`animated-element ${className}`}
      style={getAnimationStyles()}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedElement;
