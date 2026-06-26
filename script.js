document.addEventListener('DOMContentLoaded', () => {

  const navbar = document.querySelector('.navbar');
  const navScrollThreshold = 50;

  function handleNavScroll() {
    if (window.scrollY > navScrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav .nav-link');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  const counters = document.querySelectorAll('[data-count]');
  let countersAnimated = new Set();

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const startTime = performance.now();
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated.has(entry.target)) {
        countersAnimated.add(entry.target);
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  const progressBar = document.querySelector('.progress-bar-fill');
  if (progressBar) {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = progressBar.getAttribute('data-progress') || '65';
          progressBar.style.width = target + '%';
          progressObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });

    progressObserver.observe(progressBar);
  }

  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = anchor.getAttribute('href');
      if (target === '#') return;
      
      e.preventDefault();
      const element = document.querySelector(target);
      if (element) {
        const offset = navbar ? navbar.offsetHeight : 0;
        const elementPos = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: elementPos, behavior: 'smooth' });
      }
    });
  });

  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
      }
    }, { passive: true });
  }

  const rotateElement = document.querySelector('.word-rotate');
  if (rotateElement) {
    const words = JSON.parse(rotateElement.getAttribute('data-words'));
    let currentIndex = 0;
    let currentChar = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeWord() {
      const currentWord = words[currentIndex];
      
      if (isDeleting) {
        rotateElement.textContent = currentWord.substring(0, currentChar - 1);
        currentChar--;
        typingSpeed = 50;
      } else {
        rotateElement.textContent = currentWord.substring(0, currentChar + 1);
        currentChar++;
        typingSpeed = 100;
      }

      if (!isDeleting && currentChar === currentWord.length) {
        isDeleting = true;
        typingSpeed = 2000;
      } else if (isDeleting && currentChar === 0) {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % words.length;
        typingSpeed = 500;
      }

      setTimeout(typeWord, typingSpeed);
    }

    typeWord();
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || 
        (currentPage === '' && href === 'index.html') ||
        (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 600);
      }, 3000);
    });
  }

});
