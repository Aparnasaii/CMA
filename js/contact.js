/* =============================================
   CONTACT JS — real form submission via FormSubmit.co
   Messages are delivered to: uppala.madhu30@gmail.com
   ============================================= */

(function () {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');
  if (!form) return;

  /* ---- Validation helpers ---- */
  function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.add('error');
    if (error) error.textContent = message;
  }
  function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.remove('error');
    if (error) error.textContent = '';
  }

  function validate() {
    let valid    = true;
    const name   = document.getElementById('name').value.trim();
    const email  = document.getElementById('email').value.trim();
    const msg    = document.getElementById('message').value.trim();
    const re     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    clearError('name',    'nameError');
    clearError('email',   'emailError');
    clearError('message', 'messageError');

    if (!name)           { showError('name',    'nameError',    'Please enter your full name.');         valid = false; }
    if (!email)          { showError('email',   'emailError',   'Please enter your email address.');     valid = false; }
    else if (!re.test(email)) { showError('email', 'emailError','Please enter a valid email address.'); valid = false; }
    if (!msg)            { showError('message', 'messageError', 'Please enter a message.');              valid = false; }

    return valid;
  }

  /* ---- Live clear on typing ---- */
  ['name', 'email', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur',  validate);
    el.addEventListener('input', () => {
      el.classList.remove('error');
      const err = document.getElementById(id + 'Error');
      if (err) err.textContent = '';
    });
  });

  /* ---- Submit ---- */
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) return;

    /* Loading state */
    const btnText   = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    submitBtn.disabled    = true;
    btnText.style.display  = 'none';
    btnLoader.style.display = 'inline-flex';

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    try {
      /* FormSubmit.co AJAX endpoint — delivers to uppala.madhu30@gmail.com
         NOTE: On first submission FormSubmit will send an activation email.
         After you click the activation link, all future messages arrive instantly. */
      const res = await fetch('https://formsubmit.co/ajax/uppala.madhu30@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept':       'application/json'
        },
        body: JSON.stringify({
          'Full Name':        name,
          'Email':            email,
          'Phone':            phone   || 'Not provided',
          'Service Enquiry':  service || 'Not specified',
          'Message':          message,
          '_subject':         'New Enquiry from RS Services Website — ' + name,
          '_captcha':         'false',
          '_template':        'table'
        })
      });

      const data = await res.json();

      if (data.success === 'true' || data.success === true) {
        /* Success */
        form.style.display      = 'none';
        successMsg.style.display = 'block';
      } else {
        throw new Error('FormSubmit returned failure');
      }

    } catch (err) {
      /* Restore button and show inline error */
      submitBtn.disabled      = false;
      btnText.style.display    = 'inline';
      btnLoader.style.display  = 'none';

      let errEl = document.getElementById('submitError');
      if (!errEl) {
        errEl = document.createElement('p');
        errEl.id = 'submitError';
        errEl.style.cssText = 'color:#e53e3e;font-size:.85rem;margin-top:10px;';
        submitBtn.insertAdjacentElement('afterend', errEl);
      }
      errEl.textContent = 'Something went wrong. Please email us directly at uppala.madhu30@gmail.com';
    }
  });
})();
