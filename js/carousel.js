/* =============================================
   CAROUSEL JS — auto-play, prev/next, dots
   ============================================= */

(function () {
  const track      = document.getElementById('carouselTrack');
  const prevBtn    = document.getElementById('prevBtn');
  const nextBtn    = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');

  if (!track) return;

  const slides      = track.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;
  let perView       = getPerView();
  let current       = 0;
  let autoPlayTimer = null;

  // Build dots
  function buildDots() {
    dotsContainer.innerHTML = '';
    const total = Math.ceil(totalSlides / perView);
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function getPerView() {
    if (window.innerWidth <= 640)  return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, totalSlides - perView);
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, getMaxIndex()));
    const slideWidth = slides[0].offsetWidth + 24; // gap = 24px
    track.style.transform = `translateX(-${current * slideWidth}px)`;
    updateDots();
    updateButtons();
  }

  function updateDots() {
    const dotIndex = Math.floor(current / perView);
    dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === dotIndex);
    });
  }

  function updateButtons() {
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current >= getMaxIndex();
  }

  function next() {
    if (current >= getMaxIndex()) goTo(0); // loop back
    else goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function startAutoPlay() {
    autoPlayTimer = setInterval(next, 3500);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayTimer);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoPlay(); prev(); startAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoPlay(); next(); startAutoPlay(); });

  // Pause on hover
  track.addEventListener('mouseenter', stopAutoPlay);
  track.addEventListener('mouseleave', startAutoPlay);

  // Touch swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; stopAutoPlay(); }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    startAutoPlay();
  });

  // Recalculate on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newPerView = getPerView();
      if (newPerView !== perView) {
        perView = newPerView;
        current = 0;
        buildDots();
        goTo(0);
      }
    }, 200);
  });

  // Init
  buildDots();
  goTo(0);
  startAutoPlay();
})();
