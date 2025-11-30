// script.js
// Controls: side drawer, show-more (progressive disclosure), lightbox, smooth scroll,
// simple form handling, footer year, and keyboard/overlay close behaviors.

(function () {
  "use strict";

  /* ---------- helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------- DRAWER (side menu) ---------- */
  const drawerToggle = $("#drawerToggle");
  const sideDrawer = $("#sideDrawer");
  const drawerClose = $("#drawerClose");
  const drawerOverlay = $(".drawer-overlay");

  function openDrawer() {
    if (!sideDrawer) return;
    sideDrawer.classList.add("open");
    if (drawerOverlay) drawerOverlay.classList.add("visible");
    drawerToggle && drawerToggle.setAttribute("aria-expanded", "true");
    sideDrawer.setAttribute("aria-hidden", "false");
    // focus first interactive element inside drawer for accessibility
    const first = sideDrawer.querySelector("a, button, [tabindex]");
    first && first.focus();
    document.documentElement.style.overflow = "hidden"; // avoid background scroll on small screens
  }

  function closeDrawer() {
    if (!sideDrawer) return;
    sideDrawer.classList.remove("open");
    if (drawerOverlay) drawerOverlay.classList.remove("visible");
    drawerToggle && drawerToggle.setAttribute("aria-expanded", "false");
    sideDrawer.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = ""; // restore scroll
    drawerToggle && drawerToggle.focus();
  }

  if (drawerToggle) {
    drawerToggle.addEventListener("click", (e) => {
      const isOpen = sideDrawer && sideDrawer.classList.contains("open");
      if (isOpen) closeDrawer();
      else openDrawer();
    });
  }
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
  if (drawerOverlay) {
    drawerOverlay.addEventListener("click", (e) => {
      // clicking the overlay should close the drawer
      closeDrawer();
    });
  }

  // Close drawer on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (sideDrawer && sideDrawer.classList.contains("open")) closeDrawer();
      // also close lightbox if open (handled further down)
    }
  });

  // Close drawer when a drawer link is clicked (so user lands on section)
  $$(".drawer-link").forEach((link) => {
    link.addEventListener("click", () => {
      closeDrawer();
    });
  });

  /* ---------- PROGRESSIVE DISCLOSURE: show-more behavior ---------- */
  // Button has class .show-more and data-target which is selector for hidden items (.more-hide)
  $$(".show-more").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSelector = btn.dataset.target || ".more-hide";
      const items = $$(targetSelector);
      if (!items || items.length === 0) return;

      // Decide current state by checking first item's inline display
      const first = items[0];
      const currentlyShownInline = first.style.display === "block" || first.style.display === "flex";

      if (currentlyShownInline) {
        // hide them (mobile): set inline display none so CSS mobile rule applies
        items.forEach((it) => (it.style.display = "none"));
        btn.textContent = "Show all services";
      } else {
        // show them: override mobile CSS by forcing display:block (or flex if card)
        items.forEach((it) => (it.style.display = "block"));
        btn.textContent = "Show less";
        // If on very small screen, scroll a little to show revealed content (nicety)
        setTimeout(() => {
          first.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 120);
      }
    });
  });

  /* ---------- SMOOTH SCROLL for same-page anchors ---------- */
  $$('a[href^="#"]').forEach((link) => {
    // ignore links that are just "#"
    const href = link.getAttribute("href");
    if (!href || href === "#") return;
    link.addEventListener("click", (ev) => {
      // only handle same-page anchors
      if (href.startsWith("#")) {
        const target = document.querySelector(href);
        if (target) {
          ev.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          // close drawer if it's open
          if (sideDrawer && sideDrawer.classList.contains("open")) closeDrawer();
        }
      }
    });
  });

  /* ---------- LIGHTBOX for portfolio images ---------- */
  const lightbox = $("#lightbox");
  const portfolioImgs = $$('img[data-full]');

  function openLightbox(src, alt) {
    if (!lightbox) return;
    lightbox.innerHTML = `
      <button class="close-btn" aria-label="Close preview">&times;</button>
      <img src="${src}" alt="${alt || ""}">
    `;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    // focus close button
    const closeBtn = $(".close-btn", lightbox);
    closeBtn && closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML = "";
  }

  portfolioImgs.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", (e) => {
      const src = img.dataset.full || img.src;
      const alt = img.getAttribute("alt") || "";
      openLightbox(src, alt);
    });
  });

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      // close when clicking outside the image (i.e., on overlay)
      if (e.target === lightbox) closeLightbox();
      // close when clicking the close btn
      if (e.target.matches(".close-btn")) closeLightbox();
    });

    // Escape closes lightbox too
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
    });
  }

  /* ---------- CONTACT & NEWSLETTER forms (lightweight handling) ---------- */
  const contactForm = $("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = contactForm.querySelector("#name")?.value.trim();
      const email = contactForm.querySelector("#email")?.value.trim();
      const task = contactForm.querySelector("#task")?.value.trim();
      if (!name || !email || !task) {
        alert("Please fill name, email and project details before sending.");
        return;
      }
      // TODO: Integrate with backend (Formspree / Netlify / Vercel function / email)
      alert("Thanks — your message is received. We'll reply within 24 hours.");
      contactForm.reset();
      // optionally scroll to top of contact card or show a success message UI
    });
  }

  const newsletterForm = $("#newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector("#newsletterEmail")?.value.trim();
      if (!email) {
        alert("Please enter a valid email.");
        return;
      }
      alert("Subscribed — thanks! We'll send occasional tips and offers.");
      newsletterForm.reset();
    });
  }

  /* ---------- SET CURRENT YEAR in footer ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- SMALL NAV TOGGLE (if present) ---------- */
  const navToggle = $("#navToggle");
  const primaryNav = $("#primaryNav");
  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      primaryNav.classList.toggle("open");
    });
    // close nav if click outside
    document.addEventListener("click", (e) => {
      if (!primaryNav.classList.contains("open")) return;
      if (!primaryNav.contains(e.target) && !navToggle.contains(e.target)) {
        primaryNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- defensive: ensure mobile preview elements hidden/shown correctly on resize ---------- */
  function applyPreviewDefaults() {
    // On small screens, ensure .more-hide are hidden (unless user already expanded)
    const isMobile = window.matchMedia && window.matchMedia("(max-width:520px)").matches;
    $$(".more-hide").forEach((el) => {
      // if element has inline display set (user toggled), do nothing
      if (el.dataset.userToggled === "true") return;
      if (isMobile) el.style.display = "none";
      else el.style.display = ""; // let CSS handle desktop
    });

    // Ensure drawer is closed when resizing to desktop
    if (!isMobile && sideDrawer && sideDrawer.classList.contains("open")) {
      closeDrawer();
    }
  }

  window.addEventListener("resize", applyPreviewDefaults);
  // run once at start
  applyPreviewDefaults();

  /* ---------- accessibility: focus trap inside drawer (simple) ---------- */
  // keep tab focus inside drawer while open (basic implementation)
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    if (!sideDrawer || !sideDrawer.classList.contains("open")) return;

    const focusable = sideDrawer.querySelectorAll('a,button,input,textarea,[tabindex]:not([tabindex="-1"])');
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      // shift + tab
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // tab
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ---------- small enhancement: hide URL bar / ensure scroll restoration friendliness ---------- */
  window.history.replaceState && window.history.replaceState({}, document.title);

  /* ---------- done ---------- */
})();
