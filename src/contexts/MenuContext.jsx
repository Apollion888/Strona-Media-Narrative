import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const HOME_SCROLL_THRESHOLD = 120;

const MenuContext = createContext();

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within MenuProvider');
  }
  return context;
};

const createMenuState = (isOpen, source = 'scroll') => ({ isOpen, source });

export const MenuProvider = ({ children }) => {
  const location = useLocation();
  const isHomeRoute = location.pathname === '/';

  const [menuState, setMenuState] = useState(() => {
    if (typeof window === 'undefined') {
      return createMenuState(true);
    }
    return createMenuState(!isHomeRoute);
  });

  const [menuPosition, setMenuPosition] = useState(() => {
    if (typeof window === 'undefined') {
      return { x: 100, y: 100 };
    }

    sessionStorage.removeItem('menuPosition');

    const menuWidth = 280;
    const padding = 40;
    const maxX = window.innerWidth - menuWidth - padding;
    const safeX = Math.max(padding, Math.min(maxX, window.innerWidth * 0.7));

    return { x: safeX, y: 100 };
  });

  const setMenuOpen = (isOpen, source = 'user') => {
    setMenuState({ isOpen, source });
  };

  const setMenuOpenFromScroll = (isOpen) => {
    setMenuState((prev) => {
      if (prev.source === 'user' && !isOpen) {
        return prev;
      }
      return createMenuState(isOpen, 'scroll');
    });
  };

  useEffect(() => {
    if (menuPosition && menuPosition.x !== undefined && menuPosition.y !== undefined) {
      sessionStorage.setItem('menuPosition', JSON.stringify(menuPosition));
    }
  }, [menuPosition]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    if (!isHomeRoute) {
      setMenuState(createMenuState(true, 'scroll'));
      return undefined;
    }

    const handleScroll = () => {
      const hasPassedThreshold = window.scrollY > HOME_SCROLL_THRESHOLD;
      setMenuState((prev) => {
        if (!hasPassedThreshold && prev.source === 'user') {
          return prev;
        }
        return createMenuState(hasPassedThreshold, 'scroll');
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomeRoute]);

  const value = {
    isMenuOpen: menuState.isOpen,
    setMenuOpen,
    setMenuOpenFromScroll,
    menuPosition,
    setMenuPosition,
    openMenu: () => setMenuOpen(true, 'user'),
    closeMenu: () => setMenuOpen(false, 'user'),
    toggleMenu: () => setMenuState((prev) => createMenuState(!prev.isOpen, 'user')),
    isHomeRoute,
    homeScrollThreshold: HOME_SCROLL_THRESHOLD,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};
