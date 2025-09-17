import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));
import NetworkDriftParticles from './components/NetworkDriftParticles';
import { QuantumPageTransition } from './components/PageTransition';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { MenuProvider } from './contexts/MenuContext';
import DraggableMenu from './components/DraggableMenu';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    const initTimer = setTimeout(() => {
      setIsAppReady(true);
    }, 500);

    return () => clearTimeout(initTimer);
  }, []);

  useEffect(() => {
    const warmup = () => {
      import('./pages/BlogPage');
      import('./pages/BlogPostPage');
    };
    // po bezczynności, żeby nie blokować TTI
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(warmup);
    } else {
      setTimeout(warmup, 1200);
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <Router>
      <MenuProvider>
        <div className="app">
          {/* Skip to content link for accessibility */}
          <a href="#main-content" className="skip-link">
            Przejdź do głównej treści
          </a>

          <NetworkDriftParticles mode="normal" density={0.8} interactive={true} />
          <Navbar />
          <DraggableMenu />

          <main id="main-content" className="main-content" role="main">
            <ErrorBoundary>
              <QuantumPageTransition>
                <Routes>
                  {/* Eager = brak drugiego loadingu */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/o-mnie" element={<AboutPage />} />
                  {/* Lazy bez widocznego fallbacku */}
                  <Route
                    path="/blog"
                    element={
                      <Suspense fallback={null}>
                        <BlogPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/blog/:slug"
                    element={
                      <Suspense fallback={null}>
                        <BlogPostPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <Suspense fallback={null}>
                        <NotFoundPage />
                      </Suspense>
                    }
                  />
                </Routes>
              </QuantumPageTransition>
            </ErrorBoundary>
          </main>

          <Footer />
        </div>
      </MenuProvider>
    </Router>
  );
}

export default App;
