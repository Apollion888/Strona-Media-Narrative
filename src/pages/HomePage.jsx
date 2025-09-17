import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HolographicText from '../components/HolographicText';
import GlitchEffect from '../components/GlitchEffect';
import AnimatedElement from '../components/AnimatedElement';

const marqueeItems = [
  'Fotografia premium',
  'Video storytelling',
  'Postprodukcja AI',
  'Strategia social',
  'Brand design',
  'Doznania eventowe'
];

const portfolioHighlights = [
  {
    tag: 'Case study',
    title: 'Aurora Atelier',
    description: 'Film wizerunkowy i cykl zdjec lookbookowych dla marki modowej.',
    meta: 'Rezyseria, zdjecia, grading'
  },
  {
    tag: 'Digital launch',
    title: 'Neon District',
    description: 'Pakiet krotkich formatow video i grafik do premiery aplikacji.',
    meta: 'Content plan, motion, social rollout'
  },
  {
    tag: 'Editorial',
    title: 'Urban portraits',
    description: 'Seria portretow lifestyle dla magazynu online w klimacie night mode.',
    meta: 'Art direction, retusz, publikacja'
  }
];

const services = [
  {
    title: 'Sesje foto i video',
    description: 'Planowanie, realizacja i postprodukcja materialow promocyjnych oraz personalnych.'
  },
  {
    title: 'Montaz i kolor',
    description: 'Narracja montazowa, korekcja barwna i master audio gotowy do publikacji.'
  },
  {
    title: 'Retusz i grafika',
    description: 'Precyzyjny retusz, layouty i grafiki spojne ze stylem marki.'
  },
  {
    title: 'Content do social media',
    description: 'Zestawy postow, rolek i miniatur zaprojektowanych pod rytm platform.'
  },
  {
    title: 'Narracja wydarzen',
    description: 'Reportaze i aftermovies z eventow firmowych, konferencji i premier.'
  },
  {
    title: 'Asysta AI',
    description: 'Wykorzystanie AI do prewizu, researchu i przyspieszenia procesu kreatywnego.'
  }
];

const upcomingSlots = ['02', '03', '04', '05', '06'];

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.state?.scrollTo) return;

    const timer = setTimeout(() => {
      const target = document.getElementById(location.state.scrollTo);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [location.state]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    const animated = document.querySelectorAll('.anim-on-scroll');
    animated.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">
      <a className="skip-link" href="#main">Pomin do tresci</a>

      <main id="main">
        <section id="home" className="section hero">
          <div className="container hero-grid">
            <AnimatedElement animationType="fadeInRight" delay={160} className="hero-copy">
              <span className="hero-chip">Studio Media Narrative</span>
              <HolographicText className="hero-title">
                <h1>Media Narrative</h1>
              </HolographicText>
              <GlitchEffect intensity={0.05} active>
                <h2 className="hero-subtitle">Ryszard Mierzejewski</h2>
              </GlitchEffect>
              <p className="hero-description">
                Fotograf, filmowiec i projektant tresci. Buduje spojne narracje wizualne dla marek i tworczow
                - od konceptu, przez plan zdjeciowy, po finalny drop online.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#kontakt">Zapytaj o wycene</a>
                <a className="btn btn-outline" href="#portfolio">Zobacz portfolio</a>
              </div>
              <div className="social-links">
                <a
                  href="https://www.instagram.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Instagram"
                >
                  <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="TikTok"
                >
                  <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.34 1.73-.37 1.18.06 2.49 1.05 3.22.95.75 2.41.78 3.38.07.52-.37.88-.94 1.05-1.55.08-.3.08-.62.08-.93.01-4.52-.01-9.05.01-13.58z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.behance.net/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Behance"
                >
                  <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9.393 10.383c.673-.32 1.1-.92 1.1-1.81 0-1.62-1.2-2.574-3.21-2.574H0v11.968h7.483c2.15 0 3.564-1.002 3.564-2.793 0-1.185-.56-1.982-1.654-2.43zm-5.55-2.98h2.598c.905 0 1.395.373 1.395 1.037 0 .73-.52 1.073-1.616 1.073H3.84zm2.707 7.324H3.84v-2.38h2.85c1.07 0 1.64.427 1.64 1.163 0 .78-.58 1.217-1.783 1.217zm12.79-7.84c-2.902 0-4.886 2.02-4.886 4.96 0 3.08 2.068 5.038 5.165 5.038 1.71 0 3.013-.63 3.97-1.878l-1.97-1.15c-.524.68-1.2 1.012-2.05 1.012-1.2 0-2.02-.58-2.33-1.68h6.51c.05-.3.08-.64.08-1.02 0-2.95-1.75-4.282-4.49-4.282zm-2.03 3.82c.22-1.05.95-1.65 2.04-1.65 1.1 0 1.85.62 1.94 1.65zm6.74-4.82h-5.56v1.53h5.56z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </div>
            </AnimatedElement>

            <AnimatedElement animationType="scaleIn" delay={200} className="avatar-container">
              <div className="avatar">
                <div className="avatar-ring" />
                <div className="avatar-inner" aria-hidden="true">
                  <img
                    src="/assets/images/avatar/avatar.png"
                    alt="Ryszard Mierzejewski"
                    className="avatar-img"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
              <button className="know-me-btn" onClick={() => window.location.href = '/o-mnie'}>
                Poznajmy sie
              </button>
            </AnimatedElement>
          </div>

          <div className="container" aria-hidden="true">
            <div className="marquee">
              <div className="marquee-track">
                {marqueeItems.concat(marqueeItems).map((item, index) => (
                  <span className="marquee-item" key={`${item}-${index}`}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <AnimatedElement animationType="fadeInUp" delay={140}>
          <section id="portfolio" className="section">
            <div className="container">
              <div className="section-intro">
                <span className="section-eyebrow">Portfolio</span>
                <h2 className="section-title">Apple vibe dla marek, ktore lubia neonowy akcent</h2>
                <p className="section-description">
                  Kazdy projekt prowadze jak launch nowego produktu: klarowna narracja, miekkie przejscia i
                  dopracowany retusz, ktory swieci na ekranach Retina.
                </p>
              </div>

              <div className="portfolio-preview">
                <header>
                  <h3>Wybrane wdrozenia</h3>
                  <p>
                    Historie projektowane w duetach foto i video, wsparte przez szybkie prototypowanie i
                    inteligentna postprodukcje.
                  </p>
                </header>

                <div className="portfolio-grid">
                  {portfolioHighlights.map((item) => (
                    <article className="card" key={item.title}>
                      <span className="section-eyebrow">{item.tag}</span>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                      <span className="admin-status">{item.meta}</span>
                    </article>
                  ))}
                </div>

                <div className="portfolio-gallery">
                  <div className="card" key="01">
                    <span className="portfolio-number">01</span>
                    <p>Blackout Studio - immersive video experience</p>
                    <span className="admin-status">Publikacja live</span>
                  </div>
                  {upcomingSlots.map((slot) => (
                    <div className="card" key={slot}>
                      <span className="portfolio-number">{slot}</span>
                      <span className="portfolio-soon">Wkrotce</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </AnimatedElement>

        <AnimatedElement animationType="fadeInUp" delay={160}>
          <section id="oferta" className="section">
            <div className="container">
              <div className="section-intro">
                <span className="section-eyebrow">Oferta</span>
                <h2 className="section-title">Uslugi zaprojektowane w duchu Apple i Media Narrative</h2>
                <p className="section-description">
                  Lacze elegancki minimalizm z energia neonowych akcentow. Realizacje sa modularne, latwe do
                  skalowania i gotowe do adaptacji na kazdy kanal.
                </p>
              </div>

              <div className="cards-offer">
                {services.map((service) => (
                  <div className="card" key={service.title}>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedElement>

        <AnimatedElement animationType="fadeInUp" delay={200}>
          <section id="kontakt" className="section">
            <div className="container">
              <div className="section-intro">
                <span className="section-eyebrow">Kontakt</span>
                <h2 className="section-title">Zaprojektujmy wspolnie kolejny drop</h2>
                <p className="section-description">
                  Opisz krotko swoj projekt lub wyzwanie. Wracam z odpowiedzia i pomyslami w ciagu jednego
                  dnia roboczego.
                </p>
              </div>

              <form
                className="contact"
                method="POST"
                action="#"
                onSubmit={(event) => {
                  event.preventDefault();
                  alert('Formularz zostanie wkrotce podlaczony do automatycznej wysylki. Dzieki!');
                }}
              >
                <div className="row">
                  <label>
                    <span>Imie i nazwisko</span>
                    <input name="name" type="text" placeholder="Jan Kowalski" required minLength={2} />
                  </label>
                  <label>
                    <span>Email</span>
                    <input name="email" type="email" placeholder="jan@firma.pl" required />
                  </label>
                </div>
                <label>
                  <span>Wiadomosc</span>
                  <textarea
                    name="message"
                    rows={6}
                    placeholder="Napisz, czego potrzebujesz i na kiedy"
                    required
                    minLength={10}
                    maxLength={2000}
                  />
                </label>
                <div className="form-actions">
                  <button className="btn btn-primary" type="submit">Wyslij</button>
                  <small>Twoje dane sluza wylacznie do kontaktu zwrotnego.</small>
                </div>
              </form>
            </div>
          </section>
        </AnimatedElement>
      </main>
    </div>
  );
};

export default HomePage;
