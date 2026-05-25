/* =============================================
   LAZY LOAD JS — IntersectionObserver for sections
   ============================================= */

(function () {
  const lazySections = document.querySelectorAll('.lazy-section');
  if (!lazySections.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback: just show all
    lazySections.forEach(s => s.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  lazySections.forEach(section => observer.observe(section));
})();
