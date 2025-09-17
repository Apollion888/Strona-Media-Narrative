import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenu } from '../contexts/MenuContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isNavigating = useRef(false);
  const {
    isMenuOpen,
    setMenuOpen,
    setMenuOpenFromScroll,
    toggleMenu,
    isHomeRoute,
    homeScrollThreshold,
  } = useMenu();

  const [isPinned, setIsPinned] = useState(() => {
    if (typeof window === 'undefined') {
      return !isHomeRoute;
    }
    return !isHomeRoute || window.scrollY > homeScrollThreshold;
  });

  const navItems = useMemo(
    () => [
      { id: 'home', label: 'Start' },
      { id: 'portfolio', label: 'Portfolio' },
      { id: 'oferta', label: 'Oferta' },
      { id: 'kontakt', label: 'Kontakt' },
    ],
    [],
  );

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToSection = async (sectionId) => {
    if (isNavigating.current) return;
    isNavigating.current = true;

    try {
      if (location.pathname === '/') {
        await new Promise((resolve) => setTimeout(resolve, 50));
        scrollToSection(sectionId);
        if (!isPinned) {
          setMenuOpen(false);
        }
      } else {
        navigate('/', { state: { scrollTo: sectionId } });
      }
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setTimeout(() => {
        isNavigating.current = false;
      }, 400);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    if (!isHomeRoute) {
      setIsPinned(true);
      setMenuOpen(true, 'scroll');
      return undefined;
    }

    const handleScroll = () => {
      const hasPassedThreshold = window.scrollY > homeScrollThreshold;
      setIsPinned(hasPassedThreshold);
      setMenuOpenFromScroll(hasPassedThreshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomeRoute, homeScrollThreshold, setMenuOpen, setMenuOpenFromScroll]);

  const showAppleLayout = isHomeRoute && !isPinned;

  return (
    <header
      className={`site-header ${isPinned ? 'site-header--compact' : 'site-header--expanded'} ${isMenuOpen ? 'site-header--menu-open' : ''}`}
      id="top"
    >
      <div className={`container nav ${showAppleLayout ? 'nav--apple' : 'nav--compact'}`}>
        <a
          href="#"
          className="brand"
          aria-label="Media Narrative - strona glowna"
          onClick={(event) => {
            event.preventDefault();
            navigateToSection('home');
          }}
        >
          <img
            src="/assets/svg/icons/logo/MEDIA NARRATIVE LOGO.svg"
            alt="Media Narrative"
            className="logo-img"
            width="180"
            height="40"
          />
        </a>

        {showAppleLayout ? (
          <nav className="apple-menu" aria-label="Glowne sekcje">
            <ul className="apple-menu__list">
              {navItems.map((item) => (
                <li key={item.id} className="apple-menu__item">
                  <button
                    type="button"
                    className="apple-menu__link"
                    onClick={() => navigateToSection(item.id)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        ) : (
          <div className="nav-compact__actions">
            <button
              type="button"
              className="nav-compact__menu-toggle"
              onClick={toggleMenu}
              aria-pressed={isMenuOpen}
              aria-label={isMenuOpen ? 'Zamknij menu' : 'Otworz menu'}
            >
              <span className="nav-compact__dot" aria-hidden="true" />
              <span className="nav-compact__dot" aria-hidden="true" />
              <span className="nav-compact__dot" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
