/* script.js - minimal interactivity */

/* DOM ready helper */
(function(){
  // Nav toggle
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  navToggle && navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    if(!primaryNav.classList.contains('open')){
      primaryNav.classList.add('open');
      primaryNav.setAttribute('aria-hidden','false');
    } else {
      primaryNav.classList.remove('open');
      primaryNav.setAttribute('aria-hidden','true');
    }
  });

  // Close nav when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (!primaryNav || !navToggle) return;
    if (primaryNav.classList.contains('open') && !primaryNav.contains(e.target) && !navToggle.contains(e.target)){
      primaryNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded','false');
    }
  });

  // Smooth scroll for internal links
  document.querySelectorAll('a.nav-link[href^="#"], a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(!href.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if(target){
        target.scrollIntoView({behavior:'smooth', block:'start'});
        // close nav on mobile after click
        if(primaryNav.classList.contains('open')){
          primaryNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded','false');
        }
      }
    });
  });

  // Contact form lightweight validation + fake send
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#name')?.value.trim();
      const email = form.querySelector('#email')?.value.trim();
      const message = form.querySelector('#message')?.value.trim();
      if(!name || !email || !message){
        alert('Please fill all required fields.');
        return;
      }
      // For now: simulate a send and clear
      alert('Thanks! Your message has been queued. We will contact you shortly.');
      form.reset();
    });
  }

  // Footer year
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();
})();
