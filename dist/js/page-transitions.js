// Uproszczone i oczyszczone z artefaktĂłw kodowanie PL
// Barba + GSAP + obsĹ‚uga menu w stylu macOS i czÄ…steczek

let particleSystemInstance = null;

function initMenu() {
  const windowMenu = document.getElementById('windowMenu');
  if (!windowMenu || windowMenu.dataset.initialized === 'true') return;

  const windowMenuBtn = document.getElementById('windowMenuBtn');
  const windowClose = windowMenu.querySelector('.window-close');
  const windowTitleBar = windowMenu.querySelector('.window-titlebar');

  let lastFocusedElement = null;
  const getFocusable = () =>
    windowMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
  const isVisible = () => windowMenu.classList.contains('visible');

  const onKeyDown = (e) => {
    if (!isVisible() || e.key !== 'Tab') return;
    const focusable = Array.from(getFocusable());
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const current = document.activeElement;
    if (e.shiftKey) {
      if (current === first || !windowMenu.contains(current)) {
        e.preventDefault();
        last.focus();
      }
    } else if (current === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const closeMenu = () => {
    windowMenu.classList.add('closing');
    windowMenu.classList.remove('visible');
    windowMenuBtn.setAttribute('aria-expanded', 'false');
    windowMenu.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKeyDown, true);
    if (lastFocusedElement) {
      try {
        lastFocusedElement.focus();
      } catch (_) {}
      lastFocusedElement = null;
    }
    setTimeout(() => windowMenu.classList.remove('closing'), 400);
  };

  const openMenu = () => {
    windowMenu.classList.add('visible');
    windowMenuBtn.setAttribute('aria-expanded', 'true');
    windowMenu.setAttribute('aria-hidden', 'false');
    if (!windowMenu.style.top && !windowMenu.style.left) {
      windowMenu.style.top = '100px';
      windowMenu.style.right = '20px';
      windowMenu.style.left = 'auto';
    }
    lastFocusedElement = document.activeElement;
    const focusable = getFocusable();
    if (focusable.length) focusable[0].focus();
    document.addEventListener('keydown', onKeyDown, true);
  };

  // Drag & drop okna (po pasku tytuĹ‚u)
  let isDragging = false,
    startX = 0,
    startY = 0,
    startLeft = 0,
    startTop = 0;
  const startDrag = (e) => {
    if (e.target === windowClose || windowClose.contains(e.target)) return;
    isDragging = true;
    const rect = windowMenu.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startLeft = rect.left;
    startTop = rect.top;
    windowMenu.classList.add('dragging');
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  };
  const drag = (e) => {
    if (!isDragging) return;
    let newLeft = startLeft + (e.clientX - startX);
    let newTop = startTop + (e.clientY - startY);
    const { innerWidth, innerHeight } = window;
    const menuRect = windowMenu.getBoundingClientRect();
    newLeft = Math.max(0, Math.min(newLeft, innerWidth - menuRect.width));
    newTop = Math.max(0, Math.min(newTop, innerHeight - menuRect.height));
    windowMenu.style.left = `${newLeft}px`;
    windowMenu.style.top = `${newTop}px`;
    windowMenu.style.right = 'auto';
    windowMenu.style.transform = 'none';
  };
  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    windowMenu.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };
  windowTitleBar.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);

  // Toggle
  windowMenuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Tylko X zamyka â€” przycisk otwiera i ponownie wyĹ›wietla
    if (!windowMenu.classList.contains('visible')) openMenu();
  });
  windowClose.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMenu();
  });

  windowMenu.dataset.initialized = 'true';
}

function initParticles() {
  const isTargetPage = document.querySelector(
    '[data-barba-namespace="home"], [data-barba-namespace="about"]',
  );
  if (!isTargetPage || particleSystemInstance || typeof ParticleSystem === 'undefined') return;
  const container = document.getElementById('particles-js');
  if (!container) return;
  particleSystemInstance = new ParticleSystem('particles-js', {
    particleCount: 80,
    particleColor: '#00ff00',
    lineColor: '#80ff80',
    lineWidth: 1,
    lineDistance: 150,
    particleSize: { min: 1, max: 3 },
    speed: 1,
    interactivity: { grabDistance: 140, pushParticles: 4 },
  });
}

function main() {
  const showMenuOnLoad = () => {
    const windowMenu = document.getElementById('windowMenu');
    const windowMenuBtn = document.getElementById('windowMenuBtn');
    if (windowMenu && windowMenuBtn) {
      windowMenu.classList.add('visible');
      windowMenuBtn.setAttribute('aria-expanded', 'true');
      if (!windowMenu.style.top && !windowMenu.style.left) {
        windowMenu.style.top = '100px';
        windowMenu.style.right = '20px';
        windowMenu.style.left = 'auto';
      }
    }
  };

  initMenu();

  if (typeof barba !== 'undefined' && typeof gsap !== 'undefined') {
    barba.init({
      transitions: [
        {
          name: 'slide-transition',
          leave(data) {
            return gsap
              .timeline()
              .to(data.current.container, {
                opacity: 0,
                y: -50,
                scale: 0.95,
                duration: 0.5,
                ease: 'power2.inOut',
              })
              .to(data.current.container, { display: 'none', duration: 0 });
          },
          enter(data) {
            gsap.set(data.next.container, { opacity: 0, y: 50, scale: 0.95, display: 'block' });
            const ns = data.next.namespace;
            const elements =
              ns === 'about'
                ? data.next.container.querySelectorAll(
                    '.section-title, .about-intro > *, .about-details > p, .experience h3, .experience-list li, .cta-buttons .btn',
                  )
                : data.next.container.querySelectorAll(
                    '.avatar-container, h1, h2, p, .btn, .card, .social-link',
                  );
            return gsap
              .timeline()
              .to(data.next.container, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: 'power2.out',
              })
              .from(
                elements,
                { opacity: 0, y: 30, duration: 0.4, stagger: 0.08, ease: 'back.out(1.7)' },
                '-=0.3',
              );
          },
        },
      ],
      debug: false,
      preventRunning: false,
    });

    barba.hooks.after(() => {
      window.scrollTo(0, 0);
      initParticles();
      showMenuOnLoad();
      initScrollAnimations();
      initReliableCarousel();
    });

    requestAnimationFrame(() => {
      initParticles();
      showMenuOnLoad();
      initScrollAnimations();
      initReliableCarousel();
      gsap.from('main', { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out' });
    });
  } else {
    console.warn('Barba.js lub GSAP nie sÄ… dostÄ™pne');
    initParticles();
    showMenuOnLoad();
    initScrollAnimations();
    initReliableCarousel();
  }
}

document.addEventListener('DOMContentLoaded', main);
