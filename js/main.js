// main.js — Jack's Kitchen UX enhancements (nav toggle, reveal, lightbox, smooth scroll)
document.addEventListener('DOMContentLoaded', () => {
  /* --------------------------------
   * Mobile nav toggle (supports #menuBtn or .menu-btn)
   * -------------------------------- */
  const htmlEl = document.documentElement;
  const navBtn = document.getElementById('menuBtn') || document.querySelector('.menu-btn');
  if (navBtn) {
    navBtn.setAttribute('aria-expanded', 'false');
    navBtn.addEventListener('click', () => {
      const open = htmlEl.classList.toggle('nav-open');
      navBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* --------------------------------
   * Scroll reveal animation (.hidden -> .show)
   * -------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          entry.target.classList.remove('hidden');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.hidden').forEach((el) => revealObserver.observe(el));

  /* --------------------------------
   * Lightbox for gallery images
   * -------------------------------- */
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  document.body.appendChild(lightbox);

  // Close handlers (click backdrop or press Esc)
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.innerHTML = '';
    document.body.style.removeProperty('overflow');
  };

  lightbox.addEventListener('click', (e) => {
    // If clicking directly on the backdrop (not the image), close
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Delegate clicks to any image inside a .grid list (gallery)
  document.addEventListener('click', (e) => {
    const img = e.target.closest('ul.grid img, .gallery-grid img');
    if (!img) return;

    // Determine full-size source
    const dataFull = img.getAttribute('data-full');
    let fullSrc = dataFull || img.src;

    // If your convention uses -400.webp / -800.webp, upgrade when possible
    if (!dataFull && /-400\.webp$/i.test(fullSrc)) {
      fullSrc = fullSrc.replace(/-400\.webp$/i, '-800.webp');
    }

    const full = document.createElement('img');
    full.src = fullSrc;
    full.alt = img.alt || '';
    full.style.maxWidth = '90%';
    full.style.maxHeight = '90%';

    lightbox.innerHTML = '';
    lightbox.appendChild(full);
    lightbox.classList.add('active');

    // Prevent body scroll while lightbox is open
    document.body.style.overflow = 'hidden';
  });

  /* --------------------------------
   * Smooth in-page scrolling (accounts for sticky header)
   * -------------------------------- */
  const header = document.querySelector('header');
  const getHeaderOffset = () => (header ? header.getBoundingClientRect().height : 0);

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href').slice(1);
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();

    const headerOffset = getHeaderOffset();
    const rect = target.getBoundingClientRect();
    const offsetTop = window.pageYOffset + rect.top - headerOffset - 8; // small padding

    window.scrollTo({ top: Math.max(offsetTop, 0), behavior: 'smooth' });
    // If mobile nav is open, close it after navigating
    if (htmlEl.classList.contains('nav-open')) {
      htmlEl.classList.remove('nav-open');
      if (navBtn) navBtn.setAttribute('aria-expanded', 'false');
    }
  });
});