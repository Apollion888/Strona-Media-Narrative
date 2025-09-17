import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const notFoundRef = useRef(null);

  useEffect(() => {
    // Simple CSS animations instead of GSAP
    if (notFoundRef.current) {
      const elements = notFoundRef.current.querySelectorAll('.error-code, .error-title, .error-description, .home-button');
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * 200);
      });
    }
  }, []);

  return (
    <div className="not-found-page min-vh-100 d-flex align-items-center" ref={notFoundRef}>
      <div className="container text-center">
        <div className="error-code neon-text mb-4" style={{ fontSize: '8rem', fontWeight: 'bold' }}>
          404
        </div>
        <h1 className="error-title neon-text mb-4">Strona nie znaleziona</h1>
        <p className="error-description lead mb-5">
          Przepraszamy, ale strona której szukasz nie istnieje.<br />
          Może została przeniesiona, usunięta lub nigdy nie istniała.
        </p>
        <div className="home-button">
          <Link to="/" className="btn-cyberpunk">
            Wróć do strony głównej
          </Link>
        </div>
        
        <div className="mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="text-center">
                <p className="mb-3">Może Cię zainteresuje:</p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to="/" className="btn btn-outline-light btn-sm">
                    Home
                  </Link>
                  <Link to="/o-mnie" className="btn btn-outline-light btn-sm">
                    O Mnie
                  </Link>
                  <Link to="/blog" className="btn btn-outline-light btn-sm">
                    Blog
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;