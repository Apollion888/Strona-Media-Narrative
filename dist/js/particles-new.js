class ParticleSystem {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    // Domyślne ustawienia
    this.defaults = {
      particleCount: 80,
      particleColor: '#00ff00',
      lineColor: '#80ff80',
      lineWidth: 1,
      lineDistance: 150,
      particleSize: { min: 1, max: 4 },
      speed: 1,
      interactivity: {
        grabDistance: 140,
        pushParticles: 4,
      },
    };

    // Połącz domyślne ustawienia z opcjami użytkownika
    this.settings = { ...this.defaults, ...options };

    // Inicjalizacja
    this.init();
  }

  init() {
    // Utwórz canvas
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);

    // Ustaw styl canvas, aby był na całej szerokości i wysokości kontenera
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none'; // Interakcje myszy będą na window

    // Inicjalizacja cząsteczek
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 100 };

    // Natychmiastowe zwymiarowanie, stworzenie i narysowanie cząsteczek
    // aby uniknąć opóźnienia i efektu "gniazda"
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.particles = this.createParticles();
    this.drawParticles();

    // Obsługa zdarzeń
    this.setupEventListeners();

    // Rozpocznie animacji
    this.animate();
  }

  setupEventListeners() {
    // Obsługa zmiany rozmiaru okna
    window.addEventListener('resize', () => this.handleResize());

    // Obsługa ruchu myszy
    window.addEventListener('mousemove', (e) => {
      // Nasłuchuj na całym oknie dla lepszej interakcji
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Reset pozycji myszy przy opuszczeniu canvas
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // Obsługa kliknięcia
    window.addEventListener('click', () => this.pushParticles());
  }

  handleResize() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    // Stwórz cząsteczki na nowo, aby pasowały do nowego rozmiaru i były rozproszone w klastrach
    this.particles = this.createParticles();
  }

  createParticles() {
    const particles = [];
    const { particleCount } = this.settings;
    const numClusters = 5;
    const clusterRadius = Math.min(this.canvas.width, this.canvas.height) / 5; // Promień klastra zależny od rozmiaru ekranu
    const clusters = [];

    // Stwórz losowe centra klastrów
    for (let i = 0; i < numClusters; i++) {
      clusters.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
      });
    }

    for (let i = 0; i < particleCount; i++) {
      // Wybierz losowy klaster dla tej cząsteczki
      const cluster = clusters[i % numClusters];

      // Generuj pozycję wokół centrum klastra
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * clusterRadius;

      particles.push({
        x: cluster.x + Math.cos(angle) * radius,
        y: cluster.y + Math.sin(angle) * radius,
        size:
          Math.random() * (this.settings.particleSize.max - this.settings.particleSize.min) +
          this.settings.particleSize.min,
        speedX: (Math.random() - 0.5) * this.settings.speed,
        speedY: (Math.random() - 0.5) * this.settings.speed,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    return particles;
  }

  pushParticles() {
    const { pushParticles } = this.settings.interactivity;

    for (let i = 0; i < pushParticles; i++) {
      const particle = this.particles[Math.floor(Math.random() * this.particles.length)];
      if (particle) {
        particle.speedX = (Math.random() - 0.5) * this.settings.speed * 5;
        particle.speedY = (Math.random() - 0.5) * this.settings.speed * 5;
      }
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      // Aktualizuj pozycję
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Odbijanie od krawędzi
      if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

      // Interakcja z myszą
      if (this.mouse.x && this.mouse.y) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouse.radius) {
          // Przyciąganie cząsteczek do kursora
          const angle = Math.atan2(dy, dx);
          const force = (this.mouse.radius - distance) / this.mouse.radius;

          particle.x -= Math.cos(angle) * force * 2;
          particle.y -= Math.sin(angle) * force * 2;
        }
      }
    });
  }

  drawParticles() {
    // Wyczyść canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Narysuj linie między cząsteczkami
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.settings.lineDistance) {
          const opacity = 1 - distance / this.settings.lineDistance; // opacity is 0 to 1
          this.ctx.strokeStyle = `${this.settings.lineColor}${Math.floor(opacity * 80)
            .toString(16)
            .padStart(2, '0')}`; // Use up to 80/255 alpha for more visibility
          this.ctx.lineWidth = this.settings.lineWidth;

          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }

    // Narysuj cząsteczki
    this.particles.forEach((particle) => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `${this.settings.particleColor}${Math.floor(particle.opacity * 255)
        .toString(16)
        .padStart(2, '0')}`;
      this.ctx.fill();
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.updateParticles();
    this.drawParticles();
  }
}
