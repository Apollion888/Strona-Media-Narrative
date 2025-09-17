---
title: "Media Narrative - Documentation Hub"
description: "Comprehensive documentation for the Media Narrative React application with cyberpunk aesthetics"
version: "3.0.0"
last_updated: "2025-09-17"
tags: ["react", "cyberpunk", "documentation", "web-development"]
---

# Media Narrative {#media-narrative}

> **Advanced React application with cyberpunk aesthetics and cutting-edge visual effects**

A modern, high-performance React application featuring dark-first design, neon green accents, and sophisticated motion design. Built with a focus on accessibility, performance, and developer experience.

## 🚀 Quick Start {#quick-start}

```bash
npm install       # Install dependencies
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

## ⚡ Tech Stack {#tech-stack}

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI Framework |
| **Vite** | 5.x | Build Tool & Dev Server |
| **Framer Motion** | 11.x | Advanced Animations |
| **Three.js** | Latest | 3D Graphics & WebGL |
| **D3.js** | 7.x | Data Visualizations |
| **React Router** | 6.x | Client-Side Routing |

## 🎨 Design System {#design-system}

### Brand Identity {#brand-identity}
- **Primary Color**: `#00FF00` (Neon Green)
- **Secondary Color**: `#00FFFF` (Cyan)
- **Background**: `#0A0A0A` (Deep Black)
- **Typography**: SF Pro Display/Text with system fallbacks
- **Motion**: Apple-inspired easing curves

### Key Features {#key-features}
- **Apple-inspired surfaces** - Glass panels z neonowym akcentem Media Narrative.
- **Dark-first performance** - Szybki load (<2 s) i stabilne 60 fps dla animacji.
- **AAA accessibility** - Nawigacja z klawiatury, wysoki kontrast i wsparcie prefers-reduced-motion.
- **Mobile-first** - Layouty projektowane pod ekrany Retina od 320 px wzwyz.
- **Modular storytelling** - Sekcje portfolio i oferty oparte na danych, latwe do rozbudowy.

## 📁 Project Structure {#project-structure}

```
├── src/
│   ├── components/
│   │   ├── animations/         # Reusable animation components
│   │   ├── three/             # 3D graphics components
│   │   ├── visualizations/    # Data visualization components
│   │   └── [22 components]    # UI components
│   ├── pages/
│   │   ├── HomePage.jsx       # Landing page
│   │   ├── AboutPage.jsx      # About section
│   │   ├── BlogPage.jsx       # Blog/articles
│   │   └── EnhancedBlogPage.jsx # Advanced blog with 3D effects
│   ├── assets/
│   │   ├── css/               # Component-specific styles
│   │   └── images/            # Optimized images (WebP/AVIF)
│   └── App.jsx                # Main application component
├── docs/                      # Comprehensive documentation
├── assets/                    # Static assets
└── dist/                      # Production build
```

## 📚 Documentation Navigation {#documentation-navigation}

### Core Documentation {#core-documentation}
- **[Architecture](./ARCHITECTURE/README.md)** - System design and component structure
- **[Style Guide](./STYLE_GUIDE/README.md)** - Complete visual design system
- **[Motion Guide](./MOTION_GUIDE/README.md)** - Animation principles and implementation
- **[Effects](./EFFECTS/README.md)** - Visual effects and implementation guides
- **[Accessibility](./ACCESSIBILITY/README.md)** - A11y standards and quality assurance
- **[Operations](./OPERATIONS/README.md)** - Deployment, workflows, and templates
- **[Reports](./REPORTS/README.md)** - Implementation reports and analysis

### Quick References {#quick-references}
- **[Component Architecture](./ARCHITECTURE/README.md#component-architecture)** - How components are organized
- **[Color System](./STYLE_GUIDE/README.md#color-system)** - Brand colors and CSS tokens
- **[Animation Patterns](./MOTION_GUIDE/README.md#animation-patterns)** - Motion design principles
- **[Particle Systems](./EFFECTS/README.md#particle-systems)** - Advanced visual effects
- **[Quality Checklists](./ACCESSIBILITY/README.md#quality-checklists)** - QA processes
- **[Deployment Guide](./OPERATIONS/README.md#deployment-workflow)** - Production deployment

## 🛠️ Development Workflow {#development-workflow}

### Environment Setup {#environment-setup}
```bash
# Clone repository
git clone [repository-url]
cd media-narrative

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
open http://localhost:5173
```

### Available Scripts {#available-scripts}
```bash
npm run dev          # Development server with HMR
npm run build        # Production build with optimization
npm run preview      # Preview production build locally
npm run lint         # ESLint code quality check
npm run lint:fix     # Auto-fix linting issues
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
```

## 🎯 Performance Targets {#performance-targets}

| Metric | Target | Current |
|--------|--------|---------|
| **First Contentful Paint** | <1.5s | ~0.8s |
| **Largest Contentful Paint** | <2.5s | ~1.2s |
| **Cumulative Layout Shift** | <0.1 | ~0.05 |
| **Bundle Size** | <200KB | ~150KB |
| **Lighthouse Score** | >90 | 95+ |

## ♿ Accessibility Standards {#accessibility-standards}

- **WCAG 2.1 AAA** - Highest accessibility standard
- **Color Contrast** - 7:1 ratio for all text
- **Keyboard Navigation** - Full functionality without mouse
- **Screen Readers** - Comprehensive ARIA implementation
- **Motion Respect** - Honors `prefers-reduced-motion`

## 🛠️ Browser Support {#browser-support}

| Browser | Minimum Version |
|---------|----------------|
| **Chrome** | 90+ |
| **Firefox** | 88+ |
| **Safari** | 14+ |
| **Edge** | 90+ |

## 🤝 Contributing {#contributing}

### Development Standards {#development-standards}
- **React Patterns** - Functional components with hooks
- **TypeScript** - Type safety for complex components
- **Testing** - Unit tests for all components
- **Documentation** - JSDoc for complex functions
- **Performance** - Bundle size impact consideration

### Quality Assurance {#quality-assurance}
1. **Code Review** - Follow [PR Review Checklist](./ACCESSIBILITY/README.md#pr-review-checklist)
2. **Visual QC** - Use [Visual QC Checklist](./ACCESSIBILITY/README.md#visual-qc-checklist)
3. **Content Standards** - Apply [Authoring Checklist](./ACCESSIBILITY/README.md#authoring-checklist)
4. **Performance Testing** - Verify against [Performance Targets](#performance-targets)
5. **Accessibility Testing** - Ensure [Accessibility Standards](#accessibility-standards)

## 📊 Monitoring & Analytics {#monitoring-analytics}

- **Core Web Vitals** - Real user metrics
- **Error Tracking** - Sentry integration
- **User Analytics** - Privacy-focused analytics
- **Performance Budgets** - Automated regression detection

## 📞 Support & Maintenance {#support-maintenance}

### Getting Help {#getting-help}
- **Documentation** - Comprehensive guides in each section
- **Issues** - GitHub issue tracker for bugs
- **Discussions** - GitHub discussions for questions
- **Email** - Direct support for urgent issues

### Regular Maintenance {#regular-maintenance}
- **Updates** - Monthly dependency updates
- **Security** - Immediate vulnerability fixes
- **Performance** - Quarterly performance audits
- **Documentation** - Continuous improvements

---

**Media Narrative** © 2024 - Built with ❤️ and ⚡ for the future of web development

**Version**: 3.0.0  
**Last Updated**: December 12, 2024  
**License**: MIT

