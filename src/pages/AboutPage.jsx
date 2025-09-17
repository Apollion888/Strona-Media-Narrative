import React, { useEffect, useState, useRef, useCallback } from 'react';

const stats = [
  { value: '10+', label: 'lat doswiadczenia' },
  { value: '200+', label: 'realizacji' },
  { value: '98%', label: 'klientow wraca' },
];

const tools = [
  { name: 'Photoshop', icon: '/assets/icons/tools/Adobe_Photoshop_CC_icon.svg.png' },
  { name: 'Lightroom', icon: '/assets/icons/tools/Adobe_Photoshop_Lightroom_CC_logo.svg.png' },
  { name: 'DaVinci Resolve', icon: '/assets/icons/tools/DaVinci_Resolve_17_logo.svg.png' },
  { name: 'ComfyUI', icon: '/assets/icons/tools/comfy-ui.png' },
];

const experienceTimeline = [
  'Ponad dziesiec lat w branzy kreatywnej i medialnej.',
  'Wspolpraca z markami tech, fashion i lifestyle.',
  'Realizacje projektow o zasiegu miedzynarodowym.',
  'Warsztaty i wsparcie zespolow w obszarze produkcji.',
];

const carouselImages = [
  {
    src: '/assets/images/gallery/akcja-1.png',
    alt: 'Ryszard Mierzejewski prowadzi sesje foto w studio',
    title: 'Rezyseria planu',
    description: 'Plan zdjeciowy z neonowym oswietleniem i zespolowa koordynacja detali.',
  },
  {
    src: '/assets/images/gallery/akcja-2.png',
    alt: 'Ryszard Mierzejewski filmuje ujecia w plenerze',
    title: 'Lokacje plenerowe',
    description: 'Nagrania w ruchu z wykorzystaniem stabilizacji i kontrola swiatla.',
  },
  {
    src: '/assets/images/gallery/akcja-3.png',
    alt: 'Ryszard Mierzejewski przy stanowisku montazowym',
    title: 'Postprodukcja premium',
    description: 'Grading, narracja i dostosowanie formatow do digital rolloutu.',
  },
];

const SLIDE_INTERVAL = 4200;

const AboutPage = () => {
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
      { threshold: 0.1, rootMargin: '0px 0px -15% 0px' },
    );

    const targets = document.querySelectorAll('.anim-on-scroll');
    targets.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);
  const autoplayRef = useRef(null);
  const totalSlides = carouselImages.length;

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    if (totalSlides <= 1) {
      return;
    }

    autoplayRef.current = window.setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % totalSlides);
    }, SLIDE_INTERVAL);
  }, [stopAutoplay, totalSlides]);

  useEffect(() => {
    if (totalSlides <= 1) {
      return undefined;
    }

    startAutoplay();
    return () => {
      stopAutoplay();
    };
  }, [startAutoplay, stopAutoplay, totalSlides]);

  const handleSelectSlide = useCallback(
    (index) => {
      setCurrentSlide(index);
      if (totalSlides <= 1) {
        return;
      }

      startAutoplay();
    },
    [startAutoplay, totalSlides],
  );

  const previousSlide = totalSlides > 0 ? (currentSlide - 1 + totalSlides) % totalSlides : 0;
  const nextSlide = totalSlides > 0 ? (currentSlide + 1) % totalSlides : 0;
  const carouselEventHandlers =
    totalSlides > 1
      ? {
          onMouseEnter: stopAutoplay,
          onMouseLeave: startAutoplay,
        }
      : {};

  return (
    <div className="about-page">
      <a className="skip-link" href="#main">
        Pomin do tresci
      </a>

      <main id="main" className="about-page">
        <section className="section about-hero">
          <div className="container">
            <div className="section-intro anim-on-scroll">
              <span className="section-eyebrow">O mnie</span>
              <h1 className="section-title">Ryszard Mierzejewski</h1>
              <p className="section-description">
                Fotograf, operator i storyteller. Tworze kompletne systemy wizualne dla marek, w
                ktorych kazdy format ma ten sam rytm i wysoka jakosc.
              </p>
            </div>

            <div className="about-layout">
              <div className="about-content">
                <div className="about-intro anim-on-scroll">
                  <h2>Czesc, jestem Ryszard</h2>
                  <p className="tagline">
                    Skupiam sie na scenach, ktore wygladaja jak premium product launch.
                  </p>
                  <div className="about-details">
                    <p>
                      Lacze prace na planie z zaawansowana postprodukcja. Dzieki temu kontroluje
                      kazdy etap - od planowania storytellingu, przez nagrania, po gotowe formaty
                      dla serwisow streaming i social.
                    </p>
                  </div>
                </div>

                <div className="stats anim-on-scroll">
                  {stats.map((item) => (
                    <div className="stat" key={item.label}>
                      <span className="stat-value">{item.value}</span>
                      <span className="stat-label">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="about-cards">
                  <div className="skills card anim-on-scroll">
                    <h3>Narzedzia</h3>
                    <div className="skills-grid">
                      {tools.map((tool) => (
                        <div className="skill" key={tool.name}>
                          <img src={tool.icon} alt={tool.name} />
                          <span>{tool.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="experience card anim-on-scroll">
                    <h3>Doserwisowane obszary</h3>
                    <ul className="experience-list">
                      {experienceTimeline.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="cta-buttons anim-on-scroll">
                  <button
                    onClick={() => (window.location.href = '/#kontakt')}
                    className="btn btn-primary"
                  >
                    Skontaktuj sie ze mna
                  </button>
                  <button
                    onClick={() => (window.location.href = '/#portfolio')}
                    className="btn btn-outline"
                  >
                    Zobacz moje portfolio
                  </button>
                </div>
              </div>
              <div className="image-carousel anim-on-scroll">
                <div className="carousel-shell" {...carouselEventHandlers}>
                  <span className="carousel-atmosphere" aria-hidden="true" />
                  <div className="carousel-stage" role="group" aria-label="Kulisy pracy w studio">
                    {carouselImages.map((image, index) => {
                      const isActive = index === currentSlide;
                      const isPrevious = index === previousSlide;
                      const isNext = index === nextSlide;

                      const itemClasses = [
                        'carousel-item',
                        isActive ? 'is-active' : '',
                        isPrevious ? 'is-previous' : '',
                        isNext ? 'is-next' : '',
                      ]
                        .filter(Boolean)
                        .join(' ');

                      return (
                        <figure
                          key={image.src}
                          id={`carousel-panel-${index}`}
                          className={itemClasses}
                          role="tabpanel"
                          aria-hidden={!isActive}
                          tabIndex={isActive ? 0 : -1}
                        >
                          <div className="carousel-media">
                            <img src={image.src} alt={image.alt} />
                            <span className="carousel-glare" aria-hidden="true" />
                          </div>
                          <figcaption className="carousel-caption">
                            <span className="carousel-tag">{image.title}</span>
                            <p>{image.description}</p>
                          </figcaption>
                        </figure>
                      );
                    })}
                  </div>
                  <div className="carousel-controls" role="tablist" aria-label="Wybierz ujecie">
                    {carouselImages.map((image, index) => {
                      const isActive = index === currentSlide;

                      return (
                        <button
                          key={`control-${image.src}`}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          aria-controls={`carousel-panel-${index}`}
                          className={`carousel-pill${isActive ? ' is-active' : ''}`}
                          onClick={() => handleSelectSlide(index)}
                        >
                          <span className="pill-index">{String(index + 1).padStart(2, '0')}</span>
                          <span className="pill-label">{image.title}</span>
                          {isActive && (
                            <span
                              key={`progress-${index}-${currentSlide}`}
                              className="pill-progress"
                              aria-hidden="true"
                              style={{ '--carousel-duration': `${SLIDE_INTERVAL}ms` }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
