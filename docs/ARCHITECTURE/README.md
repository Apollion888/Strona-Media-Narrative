---
title: "Architecture Documentation"
description: "System architecture, component structure, and AI development guidelines"
version: "3.0.0"
last_updated: "2025-09-17"
tags: ["architecture", "components", "ai-guidelines", "integration"]
---

# Architecture Documentation {#architecture}

> **Complete system architecture and development guidelines for Media Narrative**

## System Overview {#system-overview}

### Application Structure {#application-structure}

```
src/
├── main.jsx                    # Application entry point
├── App.jsx                     # Main component with routing
├── components/
│   ├── animations/             # Framer Motion components
│   │   ├── MotionWrapper.jsx   # Reusable motion wrapper
│   │   └── InteractiveCard.jsx # Interactive card with tilt effects
│   ├── three/                  # Three.js 3D components
│   │   └── Scene3D.jsx         # WebGL particle system
│   ├── visualizations/         # D3.js data visualizations
│   │   └── DataVisualization.jsx
│   ├── Navbar.jsx              # Navigation with navigateToSection
│   ├── Footer.jsx              # Site footer
│   └── Particles.jsx           # Canvas particle animation
├── pages/
│   ├── HomePage.jsx            # Landing page with sections
│   ├── AboutPage.jsx           # Author information
│   ├── BlogPage.jsx            # Standard blog layout
│   ├── EnhancedBlogPage.jsx    # Advanced blog with 3D effects
│   └── NotFoundPage.jsx        # 404 error page
└── assets/
    ├── css/                    # Component-specific styles
    │   ├── style.css           # Main application styles
    │   └── enhanced-blog.css   # Enhanced blog page styles
    └── images/                 # Optimized image assets
```

### Technology Stack {#technology-stack}

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Core** | React | 18.x | UI Framework |
| **Routing** | React Router DOM | 6.x | Client-side navigation |
| **Build** | Vite | 5.x | Development & build tool |
| **Animation** | Framer Motion | 11.x | Advanced animations |
| **3D Graphics** | Three.js | Latest | WebGL rendering |
| **Visualization** | D3.js | 7.x | Data visualizations |
| **Styling** | Pure CSS | - | No external frameworks |

## Component Architecture {#component-architecture}

### Core Components {#core-components}

#### Navbar.jsx {#navbar-component}
- **Purpose**: Route-aware navigation with Apple-inspired hero bar and floating menu
- **Features**:
  - Glassmorphism top bar on the home route that mirrors macOS menu styling
  - Automatic morph into the draggable window menu after passing the scroll threshold or on non-home routes
  - `navigateToSection()` guard against rapid clicks plus smooth in-app scrolling
  - Compact menu toggle keeps the floating window reachable when closed

```javascript
// Key navigation function
const navigateToSection = (sectionId) => {
  if (location.pathname === '/') {
    // Smooth scroll to section on homepage
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth'
    });
  } else {
    // Navigate to homepage with section parameter
    navigate('/', { state: { scrollTo: sectionId } });
  }
};
```

#### Page Layout Refresh (2025) {#page-layout-refresh}
- **HomePage.jsx**: hero w stylu Apple, listy danych dla portfolio i uslug oraz marquee z haslami.
- **AboutPage.jsx**: sticky carousel, modularne karty umiejetnosci i timeline doswiadczenia.
- **BlogPage.jsx**: panel Netlify CMS w stylu glass, bez inline styles i z nowym guidance.



#### Particles.jsx {#particles-component}
- **Purpose**: Canvas-based particle animation background
- **Features**:
  - Mouse interaction with particle movement
  - Proper resource cleanup on unmount
  - Performance-optimized animation loop
  - Responsive canvas sizing

```javascript
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
  }

  cleanup() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
```

### Advanced Components {#advanced-components}

#### MotionWrapper.jsx {#motion-wrapper}
- **Purpose**: Reusable Framer Motion animation wrapper
- **Variants**: fadeInUp, scaleIn, slideInLeft, slideInRight, cyberpunkGlow, glitchEffect
- **Usage**: Consistent animations across the application

#### Scene3D.jsx {#scene3d-component}
- **Purpose**: Three.js WebGL particle system
- **Features**: 
  - WebGL support detection
  - Mouse interaction physics
  - Performance monitoring
  - Proper cleanup and disposal

#### DataVisualization.jsx {#data-visualization}
- **Purpose**: D3.js powered interactive charts
- **Supported Types**: Timeline, bar charts, network graphs
- **Features**: Responsive design, cyberpunk styling

## AI Development Guidelines {#ai-guidelines}

### Autonomy Principles {#autonomy-principles}

#### Technical Decision Authority {#technical-authority}
- **Full Autonomy**: Make independent technical decisions
- **Technology Choices**: WebGL, Canvas, CSS animations, shaders
- **Architecture Patterns**: Component design, state management, hooks
- **Performance Optimization**: Memory management, lazy loading, rendering

#### Innovation Requirements {#innovation-requirements}
- **Ambitious Effects**: Create spectacular visual experiences
- **Cutting-Edge Techniques**: Use latest Canvas API, modern CSS
- **Creative Solutions**: Unique interactive elements
- **Performance Innovation**: Efficient algorithms, optimized rendering

#### Prohibited Behaviors {#prohibited-behaviors}
- ❌ Asking permission for standard implementations
- ❌ Limiting to "simple" solutions when advanced possible
- ❌ Avoiding experiments due to "safety" concerns
- ❌ Waiting for specifications - create ambitious specifications

### Quality Standards {#quality-standards}

#### Performance Requirements {#performance-requirements}
- **Frame Rate**: 60+ FPS on mid-range devices (target 120 FPS)
- **Responsiveness**: Smooth across all screen sizes
- **Graceful Degradation**: Fallbacks for older browsers
- **Error Handling**: Robust error boundaries and recovery
- **Accessibility**: Respect `prefers-reduced-motion`

#### Development Standards {#development-standards}
1. **Minimal Dependencies**: Avoid unnecessary external libraries
2. **Pure CSS**: Use CSS instead of styling libraries
3. **Component Simplicity**: Keep components focused and functional
4. **Code Deduplication**: Eliminate duplicate code
5. **UTF-8 Encoding**: Ensure proper file encoding

## Integration Guidelines {#integration-guidelines}

### Framer Motion Integration {#framer-motion-integration}

#### Component Enhancement {#component-enhancement}
```javascript
// Before - Standard React component
const BlogCard = ({ children, ...props }) => {
  return <div className="blog-card" {...props}>{children}</div>;
};

// After - Framer Motion enhanced
import { motion } from 'framer-motion';

const BlogCard = ({ children, ...props }) => {
  return (
    <motion.div 
      className="blog-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -4 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
```

### Three.js Integration {#threejs-integration}

#### WebGL Detection Pattern {#webgl-detection}
```javascript
const WebGLScene = () => {
  const [webGLSupported, setWebGLSupported] = useState(false);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    setWebGLSupported(!!gl);
  }, []);

  if (!webGLSupported) {
    return <CanvasFallback />; // Fallback to Canvas 2D
  }

  return <ThreeJSScene />;
};
```

### D3.js Integration {#d3-integration}

#### React-D3 Hybrid Approach {#react-d3-hybrid}
```javascript
const D3Visualization = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    
    // D3 handles data binding and animation
    svg.selectAll('.data-point')
      .data(data)
      .join('circle')
      .attr('class', 'data-point')
      .transition()
      .duration(750)
      .attr('r', d => d.value);
  }, [data]);

  return <svg ref={svgRef} />;
};
```

## Error Handling {#error-handling}

### Error Boundaries {#error-boundaries}
```javascript
class ComponentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component Error:', error, errorInfo);
    // Log to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### Graceful Degradation {#graceful-degradation}
- **WebGL Fallback**: Canvas 2D for unsupported browsers
- **Animation Fallback**: CSS transitions when JS disabled
- **Font Fallback**: System fonts when web fonts fail
- **Image Fallback**: JPEG when WebP/AVIF unsupported

---

**Last Updated**: September 17, 2025  
**Version**: 3.0.0


