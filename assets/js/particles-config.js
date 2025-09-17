// Nowa implementacja cząsteczek została przeniesiona do pliku particles-new.js
// Ten plik jest zachowany dla kompatybilności wstecznej

// Jeśli starszy kod próbuje załadować particles.js, przekierowujemy do nowej implementacji
if (typeof particlesJS === 'function') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('particles-js')) {
      const script = document.createElement('script');
      script.src = 'assets/js/particles-new.js';
      document.body.appendChild(script);
    }
  });
}
