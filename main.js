/* ================================================
   De Carli PetShop — Main JavaScript
   Handles: Scroll animations, header, mobile menu,
   scroll-to-top, and intersection observer
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Header scroll effect ───────────────────
  const header = document.getElementById('header');

  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      // Only remove 'scrolled' on index page (hero has transparent header)
      if (header.dataset.keepScrolled !== 'true') {
        header.classList.remove('scrolled');
      }
    }
  }

  // Check if this is an internal page (header starts scrolled)
  if (header && header.classList.contains('scrolled')) {
    header.dataset.keepScrolled = 'true';
  }

  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll();

  // ── Mobile menu toggle ─────────────────────
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('open');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close menu when clicking a nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Scroll to top button ───────────────────
  const scrollTopBtn = document.getElementById('scrollTop');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Intersection Observer for scroll animations ─
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animation slightly
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all elements
    animatedElements.forEach(el => el.classList.add('visible'));
  }

  // ── Smooth counter animation for hero stats ─
  const statNumbers = document.querySelectorAll('.stat-number');

  statNumbers.forEach(stat => {
    const text = stat.textContent;
    const hasPlus = text.includes('+');
    const hasH = text.includes('h');
    const numericValue = parseInt(text.replace(/[^0-9]/g, ''));

    if (isNaN(numericValue)) return;

    const suffix = hasPlus ? '+' : hasH ? 'h' : '';

    // Start from 0
    stat.textContent = '0' + suffix;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(stat, numericValue, suffix);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(stat);
  });

  function animateCounter(element, target, suffix) {
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(easeOut * target);

      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ── Parallax-like effect on hero decorations ─
  const heroDecorations = document.querySelectorAll('.hero-decoration');
  
  if (heroDecorations.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroDecorations.forEach((deco, i) => {
        const speed = (i + 1) * 0.15;
        deco.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }

});
