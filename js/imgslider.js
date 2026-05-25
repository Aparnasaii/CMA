/* =============================================
   IMAGE SLIDER — Ken Burns + Crossfade + Progress Bar
   Auto-advances every 5s. Pause on hover/touch.
   ============================================= */

(function () {
  const section     = document.getElementById('imgSlider');
  if (!section) return;

  const slides      = section.querySelectorAll('.slide');
  const dots        = section.querySelectorAll('.sdot');
  const prevBtn     = document.getElementById('sliderPrev');
  const nextBtn     = document.getElementById('sliderNext');
  const progressBar = document.getElementById('sliderProgressBar');

  const DURATION    = 5000; // ms between slides
  const TRANSITION  = 1100; // matches CSS transition (1.1s)

  let current     = 0;
  let timer       = null;
  let progTimer   = null;
  let isAnimating = false;

  /* ---- Core: go to slide ---- */
  function goTo(index, direction) {
    if (isAnimating) return;
    if (index === current) return;
    isAnimating = true;

    const prev = current;
    current = ((index % slides.length) + slides.length) % slides.length;

    // Outgoing slide
    slides[prev].classList.add('leaving');
    slides[prev].classList.remove('active');

    // Incoming slide — restart Ken Burns by cloning the img
    const incomingImg = slides[current].querySelector('img');
    restartAnimation(incomingImg);

    slides[current].classList.add('active');

    // Update dots
    dots.forEach((d, i) => d.classList.toggle('active', i === current));

    // After transition, clean up leaving class
    setTimeout(() => {
      slides[prev].classList.remove('leaving');
      isAnimating = false;
    }, TRANSITION);

    resetProgress();
  }

  /* Restart CSS animation by forcing reflow */
  function restartAnimation(el) {
    el.style.animation = 'none';
    void el.offsetWidth; // reflow
    el.style.animation = '';
  }

  /* ---- Progress bar ---- */
  function resetProgress() {
    // Instantly reset to 0
    progressBar.classList.remove('running');
    progressBar.classList.add('reset');
    void progressBar.offsetWidth; // reflow
    progressBar.classList.remove('reset');

    // Animate to 100% over DURATION ms
    progressBar.style.transitionDuration = DURATION + 'ms';
    progressBar.classList.add('running');
  }

  /* ---- Auto-play ---- */
  function startTimer() {
    stopTimer();
    timer = setInterval(() => { goTo(current + 1); }, DURATION);
    resetProgress();
  }

  function stopTimer() {
    clearInterval(timer);
    timer = null;
    // Freeze progress bar in place
    const computed = parseFloat(getComputedStyle(progressBar).width);
    const total    = parseFloat(getComputedStyle(progressBar.parentElement).width);
    progressBar.classList.remove('running');
    progressBar.style.transitionDuration = '0ms';
    progressBar.style.width = (computed / total * 100) + '%';
  }

  function resumeTimer() {
    progressBar.style.transitionDuration = '';
    startTimer();
  }

  /* ---- Arrow buttons ---- */
  if (prevBtn) prevBtn.addEventListener('click', () => { stopTimer(); goTo(current - 1); resumeTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopTimer(); goTo(current + 1); resumeTimer(); });

  /* ---- Dot buttons ---- */
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.slide, 10);
      stopTimer();
      goTo(idx);
      resumeTimer();
    });
  });

  /* ---- Pause on hover ---- */
  section.addEventListener('mouseenter', stopTimer);
  section.addEventListener('mouseleave', resumeTimer);

  /* ---- Touch swipe ---- */
  let touchStartX = 0;
  section.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    stopTimer();
  }, { passive: true });
  section.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    resumeTimer();
  });

  /* ---- Keyboard ---- */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { stopTimer(); goTo(current - 1); resumeTimer(); }
    if (e.key === 'ArrowRight') { stopTimer(); goTo(current + 1); resumeTimer(); }
  });

  /* ---- Init ---- */
  // Ensure first slide is active and Ken Burns starts
  slides[0].classList.add('active');
  const firstImg = slides[0].querySelector('img');
  restartAnimation(firstImg);
  startTimer();

})();
