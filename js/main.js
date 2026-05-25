/* =============================================
   MAIN JS — navbar scroll, hamburger, smooth scroll, theme toggle
   ============================================= */

const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

/* ---- Navbar scroll ---- */
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});
if (window.scrollY > 40) navbar.classList.add('scrolled');

/* ---- Hamburger ---- */
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* ---- Smooth scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ================================================
   DARK / LIGHT THEME TOGGLE
   ================================================ */
(function () {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const html   = document.documentElement;
  const icon   = toggle.querySelector('i');

  /* Apply saved preference (or system default) */
  const saved  = localStorage.getItem('rs-theme');
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const initial = saved || system;
  applyTheme(initial, false);

  /* Toggle on click */
  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark', true);
  });

  function applyTheme(theme, animate) {
    if (animate) {
      /* Brief transition class for smooth colour switch */
      document.body.classList.add('theme-switching');
      setTimeout(() => document.body.classList.remove('theme-switching'), 400);
    }

    html.setAttribute('data-theme', theme);
    localStorage.setItem('rs-theme', theme);

    /* Swap icon */
    if (theme === 'dark') {
      icon.className = 'fa-solid fa-sun';
      toggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      icon.className = 'fa-solid fa-moon';
      toggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }
})();
