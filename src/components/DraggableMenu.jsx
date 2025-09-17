import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenu } from '../contexts/MenuContext';
import '../assets/css/DraggableMenu.css';

const DraggableMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMenuOpen, closeMenu, menuPosition, setMenuPosition } = useMenu();

  const menuRef = useRef(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleClose = () => {
    if (prefersReducedMotion) {
      closeMenu();
    } else {
      setIsVisible(false);
    }
  };

  const navigateToSection = async (sectionId) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  const handlePointerDown = (e) => {
    if (e.target.closest('[data-no-drag]')) return;

    const menu = menuRef.current;
    if (!menu) return;

    isDragging.current = true;
    menu.style.cursor = 'grabbing';

    const rect = menu.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    e.preventDefault();
    menu.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;

    const menu = menuRef.current;
    if (!menu) return;

    let newX = e.clientX - dragOffset.current.x;
    let newY = e.clientY - dragOffset.current.y;

    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;
    const maxX = window.innerWidth - menuWidth;
    const maxY = window.innerHeight - menuHeight;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    setMenuPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current) return;

    isDragging.current = false;
    const menu = menuRef.current;
    if (menu) {
      menu.style.cursor = 'move';
      menu.releasePointerCapture(e.pointerId);
    }
  };

  useEffect(() => {
    const validatePosition = () => {
      setMenuPosition((prev) => {
        const menuWidth = 280;
        const menuHeight = 300;
        const maxX = window.innerWidth - menuWidth - 20;
        const maxY = window.innerHeight - menuHeight - 20;

        if (prev.x > maxX || prev.x < 0 || prev.y > maxY || prev.y < 0) {
          return {
            x: Math.min(window.innerWidth - menuWidth - 40, window.innerWidth * 0.6),
            y: 100,
          };
        }

        return {
          x: Math.max(20, Math.min(prev.x, maxX)),
          y: Math.max(20, Math.min(prev.y, maxY)),
        };
      });
    };

    validatePosition();

    window.addEventListener('resize', validatePosition);
    return () => window.removeEventListener('resize', validatePosition);
  }, [setMenuPosition]);

  useEffect(() => {
    const handleKeyboard = (e) => {
      if (!isMenuOpen) return;

      if (e.key === 'Escape') {
        handleClose();
        return;
      }

      if (e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        const sections = ['home', 'portfolio', 'oferta', 'kontakt'];
        const sectionIndex = parseInt(e.key) - 1;
        if (sections[sectionIndex]) {
          navigateToSection(sections[sectionIndex]);
        }
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const focusableElements = menuRef.current?.querySelectorAll('button[data-no-drag]');
        if (!focusableElements || focusableElements.length === 0) return;

        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        let nextIndex;

        if (e.key === 'ArrowDown') {
          nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
        }

        focusableElements[nextIndex].focus();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [isMenuOpen, closeMenu, navigateToSection]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const menu = menuRef.current;
    if (!menu) return;

    const focusableElements = menu.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    menu.addEventListener('keydown', handleTab);
    return () => menu.removeEventListener('keydown', handleTab);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      setIsMounted(true);
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isMenuOpen]);

  const onTransitionEnd = () => {
    if (!isVisible) {
      setIsMounted(false);
      closeMenu();
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div className="menu-backdrop" onClick={handleClose} aria-hidden="true" />

      <div
        ref={menuRef}
        role="dialog"
        aria-label="Menu nawigacyjne"
        aria-modal="true"
        className={`window-menu-container ${isVisible && !prefersReducedMotion ? 'visible' : ''}`}
        style={{
          left: `${menuPosition.x}px`,
          top: `${menuPosition.y}px`,
          width: window.innerWidth < 768 ? '260px' : '280px',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTransitionEnd={onTransitionEnd}
      >
        <div className="window-titlebar">
          <span className="window-title">Menu</span>
          <button
            className="window-close"
            onClick={handleClose}
            aria-label="Zamknij menu"
            data-no-drag
          >
            ×
          </button>
        </div>

        <nav className="window-content" aria-label="Główne menu">
          <button onClick={() => navigateToSection('home')} data-no-drag>
            Strona główna
          </button>

          <button onClick={() => navigateToSection('portfolio')} data-no-drag>
            Portfolio
          </button>

          <button onClick={() => navigateToSection('oferta')} data-no-drag>
            Oferta
          </button>

          <button onClick={() => navigateToSection('kontakt')} data-no-drag>
            Kontakt
          </button>
        </nav>
      </div>
    </>
  );
};

export default DraggableMenu;
