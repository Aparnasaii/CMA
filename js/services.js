/* =============================================
   SERVICES PAGE JS — scroll-triggered animations
   ============================================= */

(function () {
  if (!('IntersectionObserver' in window)) return;

  const items = document.querySelectorAll('.service-item');
  if (!items.length) return;

  // Reset CSS animation state to re-trigger on scroll
  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.animation = 'none';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.style.animation = 'slideUp .6s ease forwards';
        }, Number(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  items.forEach(item => observer.observe(item));
})();
