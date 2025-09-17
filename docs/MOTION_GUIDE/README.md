---
title: "Motion Design Guide"
description: "Animation principles, timing systems, and implementation guidelines"
version: "3.0.0"
last_updated: "2024-12-12"
tags: ["animation", "framer-motion", "performance", "accessibility"]
---

# Motion Design Guide {#motion-guide}

> **Purposeful animation system for Media Narrative's cyberpunk aesthetic**

Media Narrative motion design embodies **purposeful fluidity** - every animation serves a functional purpose while enhancing the technological aesthetic. Our animations feel native to macOS/iOS, with smooth physics-based transitions that respect user preferences.

## Animation Philosophy {#animation-philosophy}

### Core Principles {#core-principles}

1. **Purposeful Motion** - Animations guide attention and provide feedback
2. **Performance First** - 60fps target, hardware acceleration
3. **Respectful Defaults** - Honor `prefers-reduced-motion`
4. **Physics-Based** - Natural easing curves, realistic timing
5. **Layered Complexity** - Simple base, enhanced on capable devices

### Design Values {#design-values}
- **Smooth Transitions** - Eliminate jarring movements
- **Contextual Feedback** - Visual response to user actions
- **Spatial Awareness** - Maintain sense of place and direction
- **Performance Optimized** - Never sacrifice UX for visual flair

## Timing System {#timing-system}

### Duration Scale {#duration-scale}
```css
:root {
  /* Base Durations */
  --mn-duration-instant: 100ms;    /* Micro-feedback */
  --mn-duration-fast: 150ms;       /* Hover states */
  --mn-duration-normal: 300ms;     /* Standard transitions */
  --mn-duration-slow: 500ms;       /* Page transitions */
  --mn-duration-slower: 800ms;     /* Complex animations */
}
```

### Usage Guidelines {#usage-guidelines}

**DO:**
- Use `--mn-duration-fast` for hover states, button feedback
- Use `--mn-duration-normal` for modal open/close, card flips
- Use `--mn-duration-slow` for page transitions, large UI changes
- Use `--mn-duration-slower` for complex multi-step animations

**DON'T:**
- Exceed 1000ms for any single animation
- Use different timings for similar interactions
- Animate layout properties without hardware acceleration

## Easing Functions {#easing-functions}

### Apple-Inspired Curves {#apple-curves}
```css
:root {
  /* Timing Functions */
  --mn-ease-standard: cubic-bezier(0.4, 0, 0.2, 1);      /* Material standard */
  --mn-ease-decelerate: cubic-bezier(0, 0, 0.2, 1);      /* Enter animations */
  --mn-ease-accelerate: cubic-bezier(0.4, 0, 1, 1);      /* Exit animations */
  --mn-ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);         /* Quick transitions */
  --mn-ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Playful bounce */
}
```

### Framer Motion Easing {#framer-easing}
```javascript
// Framer Motion equivalents
export const motionEasing = {
  standard: [0.4, 0, 0.2, 1],
  decelerate: [0, 0, 0.2, 1],
  accelerate: [0.4, 0, 1, 1],
  sharp: [0.4, 0, 0.6, 1],
  bounce: [0.68, -0.55, 0.265, 1.55]
};
```

## Animation Patterns {#animation-patterns}

### Entrance Animations {#entrance-animations}

#### Fade In Up {#fade-in-up}
```javascript
const fadeInUpVariants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.2, 1]
    }
  }
};
```

#### Scale In {#scale-in}
```javascript
const scaleInVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.9 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};
```

#### Slide In {#slide-in}
```javascript
const slideInVariants = {
  left: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 }
  },
  right: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 }
  },
  transition: {
    duration: 0.4,
    ease: [0, 0, 0.2, 1]
  }
};
```

### Interactive Animations {#interactive-animations}

#### Hover Effects {#hover-effects}
```javascript
const hoverVariants = {
  initial: { 
    scale: 1,
    boxShadow: '0 0 0 rgba(0, 255, 0, 0)'
  },
  hover: { 
    scale: 1.02,
    y: -2,
    boxShadow: '0 10px 25px rgba(0, 255, 0, 0.3)',
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};
```

#### Magnetic Effect {#magnetic-effect}
```javascript
const MagneticCard = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 10;
    const y = (e.clientY - rect.top - rect.height / 2) / 10;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      animate={{
        x: isHovered ? mousePosition.x : 0,
        y: isHovered ? mousePosition.y : 0,
        rotateX: isHovered ? mousePosition.y * 0.1 : 0,
        rotateY: isHovered ? mousePosition.x * 0.1 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15
      }}
    >
      {children}
    </motion.div>
  );
};
```

### Cyberpunk Effects {#cyberpunk-effects}

#### Glitch Animation {#glitch-animation}
```javascript
const glitchVariants = {
  initial: { 
    opacity: 1,
    x: 0
  },
  glitch: {
    opacity: [1, 0.8, 1, 0.6, 1],
    x: [0, -2, 2, -1, 0],
    textShadow: [
      '0 0 0 transparent',
      '2px 0 0 #ff0000, -2px 0 0 #00ffff',
      '0 0 0 transparent',
      '1px 0 0 #ff0000, -1px 0 0 #00ffff',
      '0 0 0 transparent'
    ],
    transition: {
      duration: 0.6,
      times: [0, 0.2, 0.4, 0.6, 1],
      repeat: Infinity,
      repeatDelay: 3
    }
  }
};
```

#### Neon Glow Pulse {#neon-glow}
```javascript
const neonGlowVariants = {
  initial: {
    boxShadow: '0 0 5px rgba(0, 255, 0, 0.5)'
  },
  pulse: {
    boxShadow: [
      '0 0 5px rgba(0, 255, 0, 0.5)',
      '0 0 25px rgba(0, 255, 0, 0.8)',
      '0 0 5px rgba(0, 255, 0, 0.5)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
```

## Framer Motion Integration {#framer-motion}

### Motion Wrapper Component {#motion-wrapper}
```javascript
import { motion } from 'framer-motion';

const MotionWrapper = ({ 
  children, 
  variant = 'fadeInUp', 
  delay = 0, 
  duration = 0.5,
  ...props 
}) => {
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

  return (
    <motion.div
      variants={variants[variant]}
      initial="initial"
      animate="animate"
      transition={{
        duration,
        delay,
        ease: [0, 0, 0.2, 1]
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
```

### Page Transitions {#page-transitions}
```javascript
const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

// Usage in pages
const PageComponent = () => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageTransitionVariants}
    transition={pageTransition}
  >
    {/* Page content */}
  </motion.div>
);
```

## Accessibility Considerations {#accessibility}

### Reduced Motion Support {#reduced-motion}
```javascript
import { useReducedMotion } from 'framer-motion';

const AccessibleMotion = ({ children }) => {
  const shouldReduceMotion = useReducedMotion();

  const variants = shouldReduceMotion ? {
    // Reduced motion variants
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  } : {
    // Full motion variants
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      transition={{
        duration: shouldReduceMotion ? 0.15 : 0.5
      }}
    >
      {children}
    </motion.div>
  );
};
```

### CSS Fallbacks {#css-fallbacks}
```css
/* Ensure animations work without JavaScript */
@media (prefers-reduced-motion: no-preference) {
  .fade-in {
    animation: fadeIn 0.5s cubic-bezier(0, 0, 0.2, 1);
  }
  
  .slide-up {
    animation: slideUp 0.5s cubic-bezier(0, 0, 0.2, 1);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}
```

## Performance Optimization {#performance}

### Hardware Acceleration {#hardware-acceleration}
```css
/* Force GPU acceleration for smooth animations */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform, opacity;
}

/* Use transform and opacity for smooth animations */
.optimized-animation {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Avoid animating layout properties */
.avoid-layout-thrash {
  /* DON'T animate these properties */
  /* width, height, padding, margin, border */
  
  /* DO animate these properties */
  transform: scale(1.1);
  opacity: 0.8;
}
```

### Animation Performance Tips {#performance-tips}

1. **Use transform and opacity** - These properties don't trigger layout
2. **Enable GPU acceleration** - Add `transform: translateZ(0)` or `will-change`
3. **Limit concurrent animations** - Too many simultaneous animations hurt performance
4. **Use requestAnimationFrame** - For custom JavaScript animations
5. **Batch DOM updates** - Group DOM manipulations together

### Performance Monitoring {#performance-monitoring}
```javascript
// Performance monitoring for animations
const AnimationPerformanceMonitor = () => {
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = (currentTime) => {
      frameCount++;
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        console.log(`Animation FPS: ${fps}`);
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }, []);

  return null;
};
```

## Animation Best Practices {#best-practices}

### Do's and Don'ts {#dos-donts}

**DO:**
- Use consistent timing across similar interactions
- Provide visual feedback for user actions
- Test animations on lower-end devices
- Respect user motion preferences
- Use semantic animation names

**DON'T:**
- Animate for the sake of animation
- Use different easing curves for similar actions
- Create animations longer than 1 second
- Ignore accessibility preferences
- Animate layout-triggering properties

### Common Patterns {#common-patterns}

#### Loading States {#loading-states}
```javascript
const LoadingSpinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }}
    className="w-6 h-6 border-2 border-mn-green border-t-transparent rounded-full"
  />
);
```

#### Staggered Animations {#staggered-animations}
```javascript
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const StaggeredList = ({ items }) => (
  <motion.div
    variants={staggerContainer}
    initial="initial"
    animate="animate"
  >
    {items.map((item, i) => (
      <motion.div key={i} variants={staggerItem}>
        {item}
      </motion.div>
    ))}
  </motion.div>
);
```

---

**Last Updated**: December 12, 2024  
**Version**: 3.0.0
