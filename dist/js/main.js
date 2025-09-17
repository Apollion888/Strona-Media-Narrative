function initScrollAnimations() {
  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          scrollObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  document.querySelectorAll('.anim-on-scroll').forEach((el) => {
    scrollObserver.observe(el);
  });
}

function initReliableCarousel() {
  const carousel = document.querySelector('.image-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(track.querySelectorAll('.carousel-slide'));
  const slideCount = slides.length;
  if (slideCount <= 1) return;

  // Prevent re-initialization
  if (carousel.dataset.initialized) return;
  carousel.dataset.initialized = 'true';

  let currentIndex = 0;
  let autoplayInterval;

  const getCenterPosition = (index) => {
    if (!slides[index]) return 0;
    const containerWidth = carousel.offsetWidth;
    const slideWidth = slides[index].offsetWidth;
    const slideOffsetLeft = slides[index].offsetLeft;
    return containerWidth / 2 - slideOffsetLeft - slideWidth / 2;
  };

  const goToSlide = (index, animated = true) => {
    if (!slides[index]) return;
    currentIndex = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
    });

    gsap.to(track, {
      x: getCenterPosition(index),
      duration: animated ? 1.2 : 0,
      ease: 'power3.inOut',
    });
  };

  const playNextSlide = () => {
    const nextIndex = (currentIndex + 1) % slideCount;
    goToSlide(nextIndex);
  };

  const startAutoplay = () => {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(playNextSlide, 2700);
  };

  const stopAutoplay = () => {
    clearInterval(autoplayInterval);
  };

  const initialize = () => {
    goToSlide(0, false);
    startAutoplay();

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Use a resize observer for better performance
    const resizeObserver = new ResizeObserver(() => goToSlide(currentIndex, false));
    resizeObserver.observe(carousel);
  };

  const images = carousel.querySelectorAll('img');
  if (images.length === 0) {
    initialize();
    return;
  }

  let loadedImages = 0;
  images.forEach((image) => {
    if (image.complete) {
      loadedImages++;
    } else {
      image.onload = image.onerror = () => {
        loadedImages++;
        if (loadedImages === images.length) {
          initialize();
        }
      };
    }
  });

  if (loadedImages === images.length) {
    initialize();
  }
}
