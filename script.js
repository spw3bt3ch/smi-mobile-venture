/**
 * SMI Ventures – Main JavaScript
 * Features:
 *  - Sticky navbar with scroll detection
 *  - Mobile menu toggle
 *  - Active nav link highlighting (Intersection Observer)
 *  - Product filter tabs
 *  - Testimonial slider (auto + manual)
 *  - Scroll-reveal animations
 *  - Contact form validation & submission
 *  - Back-to-top button
 *  - Dynamic footer year
 */

/* ──────────────────────────────────────────
   1. DOM References
────────────────────────────────────────── */
const navbar       = document.getElementById('navbar');
const hamburger    = document.getElementById('hamburger');
const navLinks     = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');
const filterTabs   = document.querySelectorAll('.filter-tab');
const productCards = document.querySelectorAll('.product-card');
const prevBtn      = document.getElementById('prevBtn');
const nextBtn      = document.getElementById('nextBtn');
const sliderDots   = document.querySelectorAll('.dot');
const testimonials = document.querySelectorAll('.testimonial-card');
const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');
const backToTop    = document.getElementById('backToTop');
const yearSpan     = document.getElementById('year');
const buyButtons   = document.querySelectorAll('.buy-btn');

/* ──────────────────────────────────────────
   2. Dynamic Footer Year
────────────────────────────────────────── */
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

/* ──────────────────────────────────────────
   3. Sticky Navbar – scroll-based styling
────────────────────────────────────────── */
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const currentY = window.scrollY;

  // Add 'scrolled' class after 60px
  if (currentY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back-to-top visibility
  if (currentY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  lastScrollY = currentY;
}, { passive: true });

/* ──────────────────────────────────────────
   4. Smooth Scroll for all anchor links
────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    // Close mobile menu if open
    closeMobileMenu();

    const navH = navbar.offsetHeight;
    const targetY = target.getBoundingClientRect().top + window.scrollY - navH;

    window.scrollTo({ top: targetY, behavior: 'smooth' });
  });
});

/* ──────────────────────────────────────────
   5. Back-to-Top Button
────────────────────────────────────────── */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ──────────────────────────────────────────
   6. Mobile Menu Toggle
────────────────────────────────────────── */
function closeMobileMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    closeMobileMenu();
  }
});

/* ──────────────────────────────────────────
   7. Active Nav Link (Intersection Observer)
────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkItems.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.35, rootMargin: '-70px 0px 0px 0px' }
);

sections.forEach(sec => sectionObserver.observe(sec));

/* ──────────────────────────────────────────
   8. Product Filter Tabs
────────────────────────────────────────── */
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Update active tab
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;

    productCards.forEach(card => {
      const category = card.dataset.category;
      const show = filter === 'all' || category === filter;

      if (show) {
        card.classList.remove('hidden');
        // Trigger fade-in animation
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'fadeInCard 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ──────────────────────────────────────────
   9. Testimonial Slider
────────────────────────────────────────── */
let currentSlide = 0;
let sliderTimer  = null;
const totalSlides = testimonials.length;

/**
 * Show a specific slide by index.
 * @param {number} index
 */
function showSlide(index) {
  // Clamp index
  currentSlide = (index + totalSlides) % totalSlides;

  testimonials.forEach((card, i) => {
    card.classList.toggle('active', i === currentSlide);
  });

  sliderDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }

function startAutoSlide() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(nextSlide, 5000);
}

// Button controls
nextBtn.addEventListener('click', () => { nextSlide(); startAutoSlide(); });
prevBtn.addEventListener('click', () => { prevSlide(); startAutoSlide(); });

// Dot controls
sliderDots.forEach(dot => {
  dot.addEventListener('click', () => {
    showSlide(parseInt(dot.dataset.index, 10));
    startAutoSlide();
  });
});

// Touch / swipe support for the slider
(function () {
  const wrapper = document.querySelector('.testimonial-slider-wrapper');
  if (!wrapper) return;

  let touchStartX = 0;
  let touchEndX   = 0;

  wrapper.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  wrapper.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) { nextSlide(); } else { prevSlide(); }
      startAutoSlide();
    }
  }, { passive: true });
})();

// Kick off auto-slide
startAutoSlide();

/* ──────────────────────────────────────────
   10. Scroll-Reveal Animations
────────────────────────────────────────── */
const animateObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        animateObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
);

document.querySelectorAll('[data-animate]').forEach((el, index) => {
  // Stagger delay for grid children
  const parent = el.closest('.products-grid, .accessories-grid, .why-grid');
  if (parent) {
    const siblings = Array.from(parent.querySelectorAll('[data-animate]'));
    const delay = siblings.indexOf(el) * 80;
    el.style.transitionDelay = `${delay}ms`;
  }
  animateObserver.observe(el);
});

/* ──────────────────────────────────────────
   11. Contact Form – Validation & Submit
────────────────────────────────────────── */
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('name');
    const email   = document.getElementById('email');
    const message = document.getElementById('message');

    let valid = true;

    // Simple validation
    [name, email, message].forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--danger)';
        valid = false;
      }
    });

    // Email format
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.style.borderColor = 'var(--danger)';
      valid = false;
    }

    if (!valid) return;

    // Simulate form submission (no backend)
    const submitBtn  = document.getElementById('submitBtn');
    const btnText    = submitBtn.querySelector('.btn-text');

    submitBtn.disabled = true;
    btnText.textContent = 'Sending…';

    setTimeout(() => {
      submitBtn.disabled  = false;
      btnText.textContent = 'Send Message';
      formSuccess.classList.add('visible');
      contactForm.reset();

      // Hide success message after 6 seconds
      setTimeout(() => formSuccess.classList.remove('visible'), 6000);
    }, 1400);
  });

  // Remove error styling on input
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });
}

/* ──────────────────────────────────────────
   12. Product hover – Buy button ripple effect
────────────────────────────────────────── */
buyButtons.forEach(btn => {
  btn.addEventListener('click', function (e) {
    // Create ripple element
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;

    Object.assign(ripple.style, {
      position:     'absolute',
      width:        `${size}px`,
      height:       `${size}px`,
      left:         `${x}px`,
      top:          `${y}px`,
      background:   'rgba(255,255,255,0.3)',
      borderRadius: '50%',
      transform:    'scale(0)',
      animation:    'ripple-effect 0.6s linear',
      pointerEvents:'none',
    });

    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);

    ripple.addEventListener('animationend', () => ripple.remove());

    // Feedback toast
    showToast('Added to inquiry! 🛒');
  });
});

/* ──────────────────────────────────────────
   13. Toast Notification
────────────────────────────────────────── */
function showToast(message) {
  // Remove existing toast
  const existing = document.querySelector('.mt-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'mt-toast';
  toast.textContent = message;

  Object.assign(toast.style, {
    position:     'fixed',
    bottom:       '80px',
    left:         '50%',
    transform:    'translateX(-50%) translateY(20px)',
    background:   'linear-gradient(135deg,#2563eb,#06b6d4)',
    color:        '#fff',
    padding:      '12px 24px',
    borderRadius: '100px',
    fontFamily:   'Inter, sans-serif',
    fontWeight:   '600',
    fontSize:     '0.88rem',
    boxShadow:    '0 4px 24px rgba(37,99,235,0.5)',
    zIndex:       '9999',
    opacity:      '0',
    transition:   'all 0.3s ease',
    whiteSpace:   'nowrap',
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity    = '1';
    toast.style.transform  = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity    = '0';
    toast.style.transform  = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/* ──────────────────────────────────────────
   14. Inject CSS keyframes for ripple & card fade
────────────────────────────────────────── */
(function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-effect {
      to { transform: scale(4); opacity: 0; }
    }
    @keyframes fadeInCard {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();

/* ──────────────────────────────────────────
   15. Preloader (simple fade-out on load)
────────────────────────────────────────── */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
