---
title: 'Style Guide & Brand System'
description: 'Complete visual design system, branding guidelines, and content standards'
version: '3.0.0'
last_updated: '2025-09-17'
tags: ['branding', 'design-system', 'ui-patterns', 'content', 'assets']
---

# Style Guide & Brand System {#style-guide}

> **Complete visual design system and branding guidelines for Media Narrative**

Media Narrative embodies **technological sophistication** with a dark-first, macOS-inspired aesthetic. Our design language combines pure blacks, electric greens, and pristine typography to create interfaces that feel both futuristic and familiar.

## Brand Identity {#brand-identity}

### Design Principles {#design-principles}

1. **Depth through darkness** - Pure blacks create infinite depth
2. **Electric accents** - Neon green energizes key interactions
3. **Pristine typography** - Clean, readable text hierarchy
4. **Subtle motion** - Purposeful, smooth animations
5. **Native feel** - macOS/iOS-inspired interactions

### Navigation System {#navigation-system}

- Apple-style glass navigation bar pozostaje widoczny, gdy sekcja hero jest w kadrze na stronie glownej.
- Po przekroczeniu progu 120 px (lub na podstronach) pasek transformuje sie w ruchome okno menu.
- Trzy punktowy toggle odwzorowuje kontrolki macOS i pozwala szybko wrocic do menu po jego zamknieciu.
- Interakcje respektuja prefers-reduced-motion i zachowuja dostep z klawiatury oraz myszy.

### Surface System {#surface-system}

- Tlo: gradienty night mode z delikatnymi neonowymi poswiatami.
- Karty: szklo z przezroczystoscia 60-80% i cieniem var(--mn-shadow-soft).
- Obramowania: cienkie linie rgba(50, 217, 4, 0.18) z mocniejszym akcentem przy hover.
- Backdrop blur: 28 px dla paneli, 20 px dla headera.

### Component Patterns {#component-patterns}

- Hero: dwu kolumnowy grid, holograficzny tytul i avatar w okraglym kontenerze.
- Portfolio: karty case study oraz siatka slotow na nadchodzace realizacje.
- Oferta: modularne karty z opisem uslugi i spojnosc typograficzna.
- Kontakt: formularz full width z glasowanymi polami i komunikatem o RODO.

### Button Variants {#button-variants}

- Primary: gradient neonowy (var(--mn-green) -> var(--mn-green-bright)) plus cien 0 16px 30px rgba(50, 217, 4, 0.28).
- Outline: szklo z obramowaniem rgba(50, 217, 4, 0.32) i hover przesuwajacy przycisk o 2 px.
- Ghost: tekstowy przycisk dla sekundarnych akcji, bez tla.

### Brand Values {#brand-values}

- **Technical Authority** - Deep understanding of modern web technologies
- **Innovation Focus** - Cutting-edge tools and forward-thinking approach
- **Professional Clarity** - Clear, direct communication and inclusive language
- **Performance Excellence** - Optimized experiences across all devices

## Color System {#color-system}

### Primary Palette {#primary-palette}

```css
:root {
  /* Core Brand Colors */
  --mn-black: #0f0f0f; /* Night mode base */
  --mn-dark: #022601; /* Deep forest */
  --mn-charcoal: #04310f; /* Glass panels */

  /* Green System */
  --mn-green: #32d904; /* Primary accent */
  --mn-green-bright: #43bf30; /* Hover states */
  --mn-green-dim: rgba(67, 191, 48, 0.55); /* Subtle glow */
  --mn-green-glow: #32d90480; /* 50% alpha */
  --mn-green-deep: #067302; /* Depth accent */

  /* Typography */
  --mn-white: #f5fbff; /* Primary text */
  --mn-gray-light: #cfd7df; /* Secondary text */
  --mn-gray: #99a5aa; /* Tertiary text */
  --mn-gray-dark: #4f565c; /* Muted states */
}
```

### Gradient System {#gradient-system}

```css
:root {
  /* Brand Gradients */
  --mn-gradient-primary: linear-gradient(135deg, #32d904, #43bf30);
  --mn-gradient-dark: linear-gradient(180deg, rgba(4, 22, 9, 1), rgba(2, 20, 6, 0.92));
  --mn-gradient-surface: linear-gradient(135deg, rgba(4, 22, 9, 0.9), rgba(7, 32, 12, 0.82));
  --mn-gradient-glow: radial-gradient(circle, rgba(50, 217, 4, 0.25), transparent);

  /* Interactive Gradients */
  --mn-gradient-button: linear-gradient(45deg, #32d904, #43bf30);
  --mn-gradient-button-hover: linear-gradient(45deg, #43bf30, #32d904);
  --mn-gradient-card-hover: linear-gradient(135deg, rgba(50, 217, 4, 0.12), rgba(6, 34, 12, 0.62));
}
```

### Color Usage Guidelines {#color-usage}

**DO:**

- Use `--mn-black` for main backgrounds
- Reserve `--mn-green` for primary actions, success states
- Use `--mn-white` for body text, `--mn-gray-light` for secondary
- Apply `--mn-charcoal` for card/surface backgrounds

**DON'T:**

- Mix warm colors with the cool palette
- Use green for large background areas
- Create low-contrast combinations
- Use colors outside the defined palette

## Typography System {#typography-system}

### Font Families {#font-families}

```css
:root {
  /* Font Stacks */
  --mn-font-display: 'SF Pro Display', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --mn-font-text: 'SF Pro Text', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --mn-font-mono: 'SF Mono', 'Monaco', 'Cascadia Code', 'Consolas', monospace;
  --mn-font-ui: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
}
```

### Type Scale {#type-scale}

```css
:root {
  /* Font Sizes */
  --mn-text-xs: 0.75rem; /* 12px */
  --mn-text-sm: 0.875rem; /* 14px */
  --mn-text-base: 1rem; /* 16px */
  --mn-text-lg: 1.125rem; /* 18px */
  --mn-text-xl: 1.25rem; /* 20px */
  --mn-text-2xl: 1.5rem; /* 24px */
  --mn-text-3xl: 1.875rem; /* 30px */
  --mn-text-4xl: 2.25rem; /* 36px */
  --mn-text-5xl: 3rem; /* 48px */
  --mn-text-6xl: 3.75rem; /* 60px */

  /* Line Heights */
  --mn-leading-tight: 1.25;
  --mn-leading-snug: 1.375;
  --mn-leading-normal: 1.5;
  --mn-leading-relaxed: 1.625;
  --mn-leading-loose: 2;

  /* Font Weights */
  --mn-weight-light: 300;
  --mn-weight-normal: 400;
  --mn-weight-medium: 500;
  --mn-weight-semibold: 600;
  --mn-weight-bold: 700;
}
```

## UI Component Patterns {#ui-patterns}

### Button Components {#button-components}

#### Primary Button {#primary-button}

```jsx
const PrimaryButton = ({ children, ...props }) => (
  <button
    className="
      bg-gradient-to-r from-mn-green to-mn-cyan
      text-black font-semibold
      px-6 py-3 rounded-lg
      hover:shadow-glow hover:-translate-y-1
      active:translate-y-0
      transition-all duration-300
      focus:outline-none focus:ring-2 focus:ring-mn-green
    "
    {...props}
  >
    {children}
  </button>
);
```

#### Interactive Card {#interactive-card}

```jsx
const InteractiveCard = ({ children, className = '', ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        bg-mn-charcoal rounded-xl p-6
        border border-white/10
        transition-all duration-300
        hover:border-mn-green/30 hover:shadow-glow
        cursor-pointer
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </div>
  );
};
```

## Content Guidelines {#content-guidelines}

### Brand Voice {#brand-voice}

Media Narrative speaks with **technical sophistication** - confident, precise, and forward-thinking.

#### Voice Attributes {#voice-attributes}

**Technical Authority**

- Deep understanding of modern web technologies
- Precise terminology without unnecessary jargon
- Evidence-based claims and concrete examples
- Focus on practical implementation

**Professional Clarity**

- Clear, direct communication
- Structured information hierarchy
- Actionable insights and recommendations
- Respectful, inclusive language

### Writing Standards {#writing-standards}

#### Technical Communication {#technical-communication}

- **Be specific**: Use exact version numbers, metrics, and technical details
- **Show examples**: Include working code snippets and live demos
- **Explain benefits**: Connect technical features to user value
- **Provide context**: Explain when and why to use specific approaches

## Asset Management {#asset-management}

### Image Standards {#image-standards}

#### Format Priorities {#format-priorities}

1. **AVIF** - Next-gen format for modern browsers
2. **WebP** - Widely supported, excellent compression
3. **JPEG/PNG** - Universal fallback formats

#### Responsive Implementation {#responsive-implementation}

```html
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Descriptive text" loading="lazy" />
</picture>
```

### Naming Conventions {#naming-conventions}

- **Images**: `component-variant-size.format` (e.g., `hero-blog-1200.webp`)
- **Icons**: `icon-name-size.svg` (e.g., `arrow-right-24.svg`)
- **Components**: `ComponentName` (PascalCase for React components)

## Standardized Terminology {#terminology}

### Effect Components {#effect-components}

- **Particles** - Canvas-based particle systems and animations
- **Glitch** - Digital distortion and cyberpunk text effects
- **HolographicText** - Futuristic text rendering with depth and glow
- **CyberpunkGrid** - Matrix-style grid backgrounds
- **NeonGlow** - Electric glow effects and borders

### Animation Terms {#animation-terms}

- **MotionWrapper** - Framer Motion container component
- **Scene3D** - Three.js 3D scene container
- **DataVisualization** - D3.js chart components
- **InteractiveCard** - Hover-reactive card component

---

**Last Updated**: September 17, 2025  
**Version**: 3.0.0
