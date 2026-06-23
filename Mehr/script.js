/* ===== MEHRAFRID — script.js ===== */

document.addEventListener('DOMContentLoaded', () => {

  // ==================== PRELOADER ====================
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2200);
  });
  document.body.style.overflow = 'hidden';

  // ==================== CUSTOM CURSOR ====================
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Cursor grow on interactive elements
  const interactives = document.querySelectorAll('a, button, .product-card, .gallery-item, .social-link, input, select, textarea');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2.5)';
      follower.style.transform = 'scale(1.5)';
      follower.style.opacity = '0.2';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      follower.style.transform = 'scale(1)';
      follower.style.opacity = '0.5';
    });
  });

  // ==================== NAVBAR ====================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu if open
        mobileMenu.classList.remove('open');
        burger.classList.remove('open');
      }
    });
  });

  // ==================== MOBILE MENU ====================
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  // Close mobile menu on outside click
  document.addEventListener('click', e => {
    if (!mobileMenu.contains(e.target) && !burger.contains(e.target)) {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
    }
  });

  // ==================== SCROLL REVEAL ====================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => {
    revealObserver.observe(el);
  });

  // ==================== PARALLAX HERO ====================
  const heroContent = document.querySelector('.hero-content');
  const heroBg = document.querySelector('.hero-bg');
  const decoCircles = document.querySelectorAll('.deco-circle');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      if (heroBg) heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
      if (heroContent) heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
      decoCircles.forEach((c, i) => {
        c.style.transform = `translateY(${scrollY * (0.1 + i * 0.05)}px) rotate(${scrollY * 0.05}deg)`;
      });
    }
  });

  // ==================== COUNTER ANIMATION ====================
  function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const isFloat = target.toString().includes('.');
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = isFloat
        ? start.toFixed(1)
        : Math.floor(start).toLocaleString('fa-IR') + '+';
    }, 16);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.dataset.count;
        animateCounter(el, parseFloat(raw));
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  // ==================== TESTIMONIALS SLIDER ====================
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('tDots');
  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let current = 0;
    let perView = 3;
    let maxSlide = 0;
    let autoTimer;

    function getPerView() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1100) return 2;
      return 3;
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      maxSlide = Math.max(0, cards.length - perView);
      for (let i = 0; i <= maxSlide; i++) {
        const dot = document.createElement('button');
        dot.className = 't-dot' + (i === current ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, maxSlide));
      const cardWidth = track.querySelector('.testimonial-card').offsetWidth + 24; // gap
      track.style.transform = `translateX(${current * cardWidth}px)`;
      document.querySelectorAll('.t-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function startAuto() {
      autoTimer = setInterval(() => {
        goTo(current < maxSlide ? current + 1 : 0);
      }, 4000);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    function init() {
      perView = getPerView();
      buildDots();
      goTo(current);
    }

    init();
    startAuto();
    window.addEventListener('resize', () => { init(); resetAuto(); });

    // Touch/swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goTo(diff > 0 ? current + 1 : current - 1);
        resetAuto();
      }
    });
  }

  // ==================== CONTACT FORM ====================
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'در حال ارسال...';
      btn.disabled = true;
      setTimeout(() => {
        form.style.display = 'none';
        formSuccess.classList.add('show');
      }, 1500);
    });
  }

  // ==================== PRODUCT CARD HOVER TILT ====================
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ==================== GALLERY LIGHTBOX ====================
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:fixed;inset:0;background:rgba(12,8,3,0.95);
        z-index:10000;display:flex;align-items:center;justify-content:center;
        cursor:pointer;backdrop-filter:blur(10px);
        animation:fadeInOverlay 0.3s ease;
      `;
      const style = document.createElement('style');
      style.textContent = `@keyframes fadeInOverlay { from { opacity:0; } to { opacity:1; } }`;
      document.head.appendChild(style);

      const inner = document.createElement('div');
      inner.style.cssText = `
        max-width:80vw;max-height:80vh;border-radius:12px;overflow:hidden;
        border:1px solid rgba(201,168,76,0.3);position:relative;
      `;
      const placeholder = item.querySelector('.gallery-placeholder').cloneNode(true);
      placeholder.style.cssText = 'width:600px;height:400px;max-width:80vw;max-height:70vh;';

      const caption = document.createElement('div');
      caption.style.cssText = `
        position:absolute;bottom:0;left:0;right:0;
        padding:1rem 1.5rem;background:rgba(18,13,7,0.9);
        color:#F5EDD7;font-size:0.9rem;text-align:center;
      `;
      caption.textContent = item.querySelector('.gallery-overlay span').textContent;

      inner.appendChild(placeholder);
      inner.appendChild(caption);
      overlay.appendChild(inner);
      document.body.appendChild(overlay);

      overlay.addEventListener('click', () => {
        overlay.style.animation = 'fadeInOverlay 0.3s ease reverse';
        setTimeout(() => overlay.remove(), 300);
      });
    });
  });

  // ==================== ACTIVE NAV HIGHLIGHT ====================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === '#' + id
            ? 'var(--gold)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  // ==================== NAV CTA SCROLL TO CONTACT ====================
  document.querySelector('.nav-cta').addEventListener('click', () => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  });

  // ==================== SMOOTH MARQUEE PAUSE ON HOVER ====================
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  // ==================== SCROLL PROGRESS BAR ====================
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position:fixed;top:0;left:0;height:2px;
    background:linear-gradient(to right,var(--gold-dk),var(--gold),var(--gold-lt));
    z-index:9999;transition:width 0.1s;width:0%;pointer-events:none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollPct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrollPct + '%';
  });

  // ==================== NEWSLETTER FORM ====================
  const nlBtn = document.querySelector('.newsletter-form button');
  const nlInput = document.querySelector('.newsletter-form input');
  if (nlBtn && nlInput) {
    nlBtn.addEventListener('click', () => {
      if (nlInput.value && nlInput.value.includes('@')) {
        nlBtn.textContent = '✓';
        nlInput.value = '';
        nlInput.placeholder = 'عضو شدید!';
        setTimeout(() => {
          nlBtn.textContent = 'عضویت';
          nlInput.placeholder = 'ایمیل شما';
        }, 3000);
      }
    });
  }

  // ==================== BTN ADD TO ORDER ====================
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', function() {
      const original = this.textContent;
      this.textContent = '✓ افزوده شد';
      this.style.background = 'var(--gold)';
      this.style.color = 'var(--bg)';
      setTimeout(() => {
        this.textContent = original;
        this.style.background = '';
        this.style.color = '';
      }, 2000);
    });
  });

});