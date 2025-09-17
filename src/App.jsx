import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import NotFoundPage from './pages/NotFoundPage';
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
                  <Route path="/" element={<HomePage />} />
                  <Route path="/o-mnie" element={<AboutPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="*" element={<NotFoundPage />} />
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