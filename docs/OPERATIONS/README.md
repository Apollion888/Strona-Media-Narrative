---
title: "Operations & Deployment"
description: "Deployment workflows, development procedures, and operational guidelines"
version: "3.0.0"
last_updated: "2024-12-12"
tags: ["deployment", "workflows", "operations", "ci/cd", "hosting"]
---

# Operations & Deployment {#operations}

> **Complete guide to deployment workflows and operational procedures for Media Narrative**

This section covers all deployment processes, development workflows, and operational guidelines for maintaining and deploying the Media Narrative website.

## Deployment Workflow {#deployment-workflow}

### Production Build {#production-build}
```bash
# Create production build
npm run build

# Test build locally
npm run preview

# Analyze bundle size
npm run build -- --analyze
```

### Build Output Structure {#build-structure}
```
dist/
├── index.html              # Main HTML file
├── assets/
│   ├── index-[hash].js     # Main JavaScript bundle
│   ├── index-[hash].css    # Compiled CSS
│   └── [assets]            # Static assets (images, fonts)
└── [copied files]          # Public directory contents
```

## Hosting Platforms {#hosting-platforms}

### Netlify (Recommended) {#netlify}

#### Automatic Deployment {#netlify-auto}
**Configuration**:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `18.x` (specified in `.nvmrc`)
- **Auto-deploy**: Enabled for `main` branch

**Setup Steps**:
1. Connect GitHub/GitLab repository
2. Configure build settings
3. Set environment variables if needed
4. Enable auto-deploy on git push

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--prefix=/dev/null"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.processing]
  skip_processing = false

[build.processing.css]
  bundle = true
  minify = true

[build.processing.js]
  bundle = true
  minify = true

[build.processing.html]
  pretty_urls = true

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### Manual Deployment {#netlify-manual}
```bash
# Build locally
npm run build

# Deploy via drag & drop
# Visit netlify.com/drop and drag the dist/ folder

# Or use Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Vercel {#vercel}

#### Setup {#vercel-setup}
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod

# Deploy preview
vercel
```

**Vercel Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "env": {
    "NODE_VERSION": "18"
  },
  "functions": {
    "app/api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### GitHub Pages {#github-pages}

#### Setup {#github-pages-setup}
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts
{
  "scripts": {
    "deploy": "gh-pages -d dist",
    "predeploy": "npm run build"
  }
}

# Deploy
npm run deploy
```

**GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm run test
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## Development Workflows {#development-workflows}

### Avatar Management {#avatar-management}

**Location**: `/assets/images/avatar/avatar.png`  
**Component**: `HomePage.jsx` (hero section)

```jsx
// Avatar implementation
<img 
  src="/assets/images/avatar/avatar.png" 
  alt="Portrait of Ryszard Mierzejewski" 
  className="avatar-image"
/>
```

**Update Process**:
1. Replace file at `/assets/images/avatar/avatar.png`
2. Maintain filename or update path in code
3. Optimize size (max 500x500px)
4. Test responsive behavior
5. Verify accessibility (alt text)

### Icon Management {#icon-management}

**Approach**: Inline SVG (no icon files)

**Implementation**:
```jsx
// Icon component pattern
const Icon = ({ name, className = "", ...props }) => {
  const icons = {
    github: (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    linkedin: (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  };

  return (
    <span className={`icon ${className}`}>
      {icons[name]}
    </span>
  );
};

// Usage
<Icon name="github" className="w-6 h-6 text-green-400" />
```

### Navigation Management {#navigation-management}

**File**: `src/components/Navbar.jsx`  
**Function**: `navigateToSection()`

**Adding New Section**:
```jsx
// 1. Add navigation button
<button 
  onClick={() => navigateToSection('new-section')}
  className="nav-button"
>
  New Section
</button>

// 2. Add section with matching ID
<section id="new-section" className="page-section">
  <h2>New Section Content</h2>
</section>

// 3. Update navigation function if needed
const navigateToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
};
```

### Content Updates {#content-updates}

#### Blog Post Workflow {#blog-workflow}
```jsx
// 1. Create blog post component
const BlogPost = ({ slug, title, content, date, tags }) => (
  <article className="blog-post">
    <header>
      <h1>{title}</h1>
      <time dateTime={date}>{formatDate(date)}</time>
      <div className="tags">
        {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
      </div>
    </header>
    <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
  </article>
);

// 2. Add to blog index
const blogPosts = [
  {
    slug: 'new-post',
    title: 'New Blog Post',
    date: '2024-12-12',
    tags: ['React', 'WebGL', 'Performance'],
    content: '...'
  }
];

// 3. Update routing if needed
```

## Environment Configuration {#environment-configuration}

### Development Environment {#dev-environment}
```bash
# .env.development
VITE_NODE_ENV=development
VITE_API_URL=http://localhost:3001
VITE_DEBUG=true
VITE_HOT_RELOAD=true
```

### Production Environment {#prod-environment}
```bash
# .env.production
VITE_NODE_ENV=production
VITE_API_URL=https://api.medianarrative.com
VITE_DEBUG=false
VITE_ANALYTICS_ID=your-analytics-id
```

### Environment Variables Usage {#env-usage}
```javascript
// Access environment variables
const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  debug: import.meta.env.VITE_DEBUG === 'true',
  nodeEnv: import.meta.env.VITE_NODE_ENV
};

// Conditional features
if (config.debug) {
  console.log('Debug mode enabled');
}
```

## CI/CD Pipeline {#ci-cd}

### GitHub Actions Workflow {#github-actions}
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm run test:ci
    
    - name: Run accessibility tests
      run: npm run test:a11y
    
    - name: Build
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: dist/

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-files
        path: dist/
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './dist'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Performance Monitoring {#performance-monitoring}

### Build Analysis {#build-analysis}
```bash
# Analyze bundle size
npm run build -- --analyze

# Generate bundle report
npm run build:analyze

# Check dependencies
npm run deps:check

# Performance audit
npm run lighthouse
```

### Monitoring Configuration {#monitoring-config}
```javascript
// Performance monitoring
const performanceMonitor = {
  // Core Web Vitals tracking
  trackCoreWebVitals: true,
  
  // Custom metrics
  customMetrics: [
    'particleSystemFPS',
    'canvasRenderTime',
    'threejsSceneComplexity'
  ],
  
  // Thresholds
  thresholds: {
    FCP: 1800,  // First Contentful Paint
    LCP: 2500,  // Largest Contentful Paint
    FID: 100,   // First Input Delay
    CLS: 0.1    // Cumulative Layout Shift
  }
};
```

## Security Guidelines {#security}

### Content Security Policy {#csp}
```html
<!-- CSP Header -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               font-src 'self' data:;">
```

### Security Headers {#security-headers}
```javascript
// Security headers for hosting platforms
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};
```

## Troubleshooting {#troubleshooting}

### Common Issues {#common-issues}

#### Build Failures {#build-failures}
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18.x

# Verbose build for debugging
npm run build -- --verbose
```

#### Deployment Issues {#deployment-issues}
```bash
# Test build locally
npm run preview

# Check environment variables
echo $VITE_NODE_ENV

# Verify file permissions
ls -la dist/

# Check hosting platform logs
netlify logs  # or vercel logs
```

#### Performance Issues {#performance-issues}
```bash
# Profile build time
npm run build -- --profile

# Check bundle size
npm run analyzer

# Test with production build
npm run preview
```

---

**Last Updated**: December 12, 2024  
**Version**: 3.0.0
