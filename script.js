// script.js
// Minimal, accessible interactivity for Angel DTP site
// - Nav toggle (mobile)
// - Smooth internal scrolling
// - Portfolio lightbox (click images to view larger)
// - Contact + newsletter lightweight handling
// - Close behaviors (esc / click outside)
// - Footer year

(function () {
  "use strict";

  /* ---------- helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- NAV TOGGLE (mobile) ---------- */
  const navToggle = $("#navToggle");
  const primaryNav = $("#primaryNav");

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", (e) => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      if (!primaryNav.classList.contains("open")) {
        primaryNav.classList.add("open");
        primaryNav.setAttribute("aria-hidden", "false");
      } else {
        primaryNav.classList.remove("open");
        primaryNav.setAttribute("aria-hidden", "true");
      }
    });

    // Close nav when clicking outside (mobile)
    document.addEventListener("click", (e) => {
      if (!primaryNav.classList.contains("open")) return;
      if (
        !primaryNav.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        primaryNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        primaryNav.setAttribute("aria-hidden", "true");
      }
    });
  }

  /* ---------- SMOOTH SCROLL for internal links ---------- */
  const smoothLinks = $$('a[href^="#"]');
  smoothLinks.forEach((link) => {
    // allow external anchors (# with no target) to be ignored if needed
    link.addEventListener("click", (ev) => {
      const href = link.getAttribute("href");
      if (!href || href.length === 0 || href === "#") return;
      // only handle same-page anchors
      if (href.startsWith("#")) {
        const target = document.querySelector(href);
        if (target) {
          ev.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          // close nav on mobile if open
          if (primaryNav && primaryNav.classList.contains("open")) {
            primaryNav.classList.remove("open");
            navToggle && navToggle.setAttribute("aria-expanded", "false");
            primaryNav.setAttribute("aria-hidden", "true");
          }
        }
      }
    });
  });

  /* ---------- LIGHTBOX (portfolio) ---------- */
  const lightbox = $("#lightbox");
  const portfolioImgs = $$(".portfolio-item img[data-full]");

  function openLightbox(src, alt = "") {
    if (!lightbox) return;
    lightbox.innerHTML = `
      <button class="close-btn" aria-label="Close preview">&times;</button>
      <img src="${src}" alt="${alt}">
    `;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    // focus first interactive (close button)
    const closeBtn = $(".close-btn", lightbox);
    closeBtn && closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML = "";
  }

  if (portfolioImgs && portfolioImgs.length && lightbox) {
    portfolioImgs.forEach((img) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", (e) => {
        const src = img.dataset.full || img.getAttribute("src");
        const alt = img.getAttribute("alt") || "";
        openLightbox(src, alt);
      });
    });

    // close when clicking overlay background (but not the image)
    lightbox.addEventListener("click", (e) => {
      // if click target is the overlay (not the img)
      if (e.target === lightbox) closeLightbox();
    });

    // close on close button (delegated)
    lightbox.addEventListener("click", (e) => {
      if (e.target.matches(".close-btn")) closeLightbox();
    });

    // ESC to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (lightbox.classList.contains("open")) closeLightbox();
        // also close nav if open
        if (primaryNav && primaryNav.classList.contains("open")) {
          primaryNav.classList.remove("open");
          navToggle && navToggle.setAttribute("aria-expanded", "false");
          primaryNav.setAttribute("aria-hidden", "true");
        }
      }
    });
  }

  /* ---------- CONTACT FORM (lightweight) ---------- */
  const contactForm = $("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // basic validation
      const name = contactForm.querySelector("#name")?.value.trim();
      const email = contactForm.querySelector("#email")?.value.trim();
      const task = contactForm.querySelector("#task")?.value.trim();

      if (!name || !email || !task) {
        alert("Please fill all required fields (name, email, project details).");
        return;
      }

      // Replace this with real backend or service (Formspree / Netlify / Vercel function)
      // For now, simulate success and reset form
      alert("Thanks! Your message has been received. We'll reply within 24 hours.");
      contactForm.reset();
    });
  }

  /* ---------- NEWSLETTER FORM ---------- */
  const newsletterForm = $("#newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector("#newsletterEmail")?.value.trim();
      if (!email) {
        alert("Please enter a valid email.");
        return;
      }
      // Simulate subscribe
      alert("Subscribed! We'll send useful tips & offers occasionally.");
      newsletterForm.reset();
    });
  }

  /* ---------- SET YEAR in footer ---------- */
  const yearEl = $("#year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Minor enhancement: lazy add focus-visible class for keyboard users ---------- */
  (function () {
    let keyboardMode = false;
    function handleFirstTab(e) {
      if (e.key === "Tab") {
        document.documentElement.classList.add("using-keyboard");
        keyboardMode = true;
        window.removeEventListener("keydown", handleFirstTab);
      }
    }
    window.addEventListener("keydown", handleFirstTab);
  })();

  /* ---------- Done ---------- */
})();
