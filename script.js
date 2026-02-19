/**
 * DONKEY Website - Professional JavaScript
 * Smooth interactions, animations, and UX enhancements
 */

// ===== GLOBAL ERROR HANDLERS =====
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  event.preventDefault();
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// ===== SMOOTH SCROLL NAVIGATION =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Skip if href is just "#"
    if (href === '#') return;
    
    const target = document.querySelector(href);
    
    if (target) {
      e.preventDefault();
      
      // Close mobile menu if open
      const nav = document.querySelector('.nav');
      if (nav && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      }
      
      // Smooth scroll with offset for sticky header
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== ACTIVE NAVIGATION HIGHLIGHTING =====
const navLinks = document.querySelectorAll('.nav__link');
const sections = Array.from(navLinks)
  .map(link => {
    const href = link.getAttribute('href');
    return document.querySelector(href);
  })
  .filter(Boolean);

const observerOptions = {
  root: null,
  rootMargin: '-20% 0px -70% 0px',
  threshold: 0
};

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Remove active class from all links
      navLinks.forEach(link => link.classList.remove('is-active'));
      
      // Add active class to current section's link
      const activeLink = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
      if (activeLink) {
        activeLink.classList.add('is-active');
      }
    }
  });
}, observerOptions);

// Observe all sections
sections.forEach(section => {
  if (section) navObserver.observe(section);
});

// ===== SCROLL ANIMATIONS =====
const animateElements = document.querySelectorAll('[data-animate]');

const animationObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Unobserve after animation to improve performance
        animationObserver.unobserve(entry.target);
      }
    });
  },
  {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  }
);

animateElements.forEach(el => {
  animationObserver.observe(el);
});

// ===== HEADER SCROLL BEHAVIOR (OPTIMIZED) =====
let lastScroll = 0;
let scrollTimeout = null;
const header = document.querySelector('.topbar');

window.addEventListener('scroll', () => {
  if (scrollTimeout) return;
  
  scrollTimeout = setTimeout(() => {
    try {
      const currentScroll = Math.max(0, Math.min(window.pageYOffset, 999999));
      
      if (currentScroll > 50) {
        header.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.4)';
      } else {
        header.style.boxShadow = 'none';
      }
      
      lastScroll = currentScroll;
      scrollTimeout = null;
    } catch (error) {
      console.error('Scroll handler error:', error);
      scrollTimeout = null;
    }
  }, 16); // ~60fps
}, { passive: true });

// ===== MOBILE MENU TOGGLE =====
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
    document.body.classList.toggle('menu-open');
    menuToggle.classList.toggle('is-active');
    
    // Animate menu toggle icon
    const spans = menuToggle.querySelectorAll('span');
    if (menuToggle.classList.contains('is-active')) {
      spans[0].style.transform = 'rotate(45deg) translateY(8px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
}

// ===== BUTTON RIPPLE EFFECT (SECURE) =====
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function(e) {
    try {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      
      // Validate and sanitize inputs
      const size = Math.max(0, Math.min(rect.width, rect.height, 1000));
      const x = Math.max(-2000, Math.min(e.clientX - rect.left - size / 2, 2000));
      const y = Math.max(-2000, Math.min(e.clientY - rect.top - size / 2, 2000));
      
      // Use individual properties instead of cssText for security
      ripple.style.position = 'absolute';
      ripple.style.width = size + 'px';
      ripple.style.height = size + 'px';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.3)';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.style.pointerEvents = 'none';
      ripple.style.animation = 'ripple 0.6s ease-out';
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    } catch (error) {
      console.error('Ripple effect error:', error);
    }
  });
});

// ===== CURSOR FOLLOW EFFECT (Desktop only) =====
if (window.innerWidth > 768) {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.style.cssText = `
    width: 20px;
    height: 20px;
    border: 2px solid var(--donkey-gold);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 10000;
    transition: all 0.15s ease;
    opacity: 0;
  `;
  document.body.appendChild(cursor);
  
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.opacity = '0.5';
  });
  
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
  
  // Smooth cursor follow
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX - 10 + 'px';
    cursor.style.top = cursorY - 10 + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  
  // Scale cursor on hover
  document.querySelectorAll('a, button, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(1.5)';
      cursor.style.borderColor = 'var(--donkey-orange)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.borderColor = 'var(--donkey-gold)';
    });
  });
}

// ===== PARALLAX EFFECT ON SCROLL =====
const parallaxElements = document.querySelectorAll('.hero__copy, .artcard, .epic-visual');

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  
  parallaxElements.forEach(el => {
    const speed = 0.5;
    const yPos = -(scrolled * speed);
    
    if (scrolled < window.innerHeight) {
      el.style.transform = `translateY(${yPos}px)`;
    }
  });
});

// ===== IMAGE LAZY LOADING ENHANCEMENT =====
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.dataset.src;
  });
} else {
  // Fallback for browsers that don't support lazy loading
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}

// ===== PERFORMANCE: REDUCE MOTION FOR USERS WHO PREFER IT =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('*').forEach(el => {
    el.style.animationDuration = '0.01ms !important';
    el.style.animationIterationCount = '1 !important';
    el.style.transitionDuration = '0.01ms !important';
  });
}

// ===== EASTER EGG: KONAMI CODE =====
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join(',') === konamiPattern.join(',')) {
    // Activate easter egg
    const donkeyEmoji = document.createElement('div');
    donkeyEmoji.textContent = '🫏';
    donkeyEmoji.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      font-size: 200px;
      z-index: 10001;
      animation: easterEgg 2s ease-in-out;
    `;
    document.body.appendChild(donkeyEmoji);
    
    const easterStyle = document.createElement('style');
    easterStyle.textContent = `
      @keyframes easterEgg {
        0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); }
        50% { transform: translate(-50%, -50%) scale(1.5) rotate(360deg); }
        100% { transform: translate(-50%, -50%) scale(0) rotate(720deg); }
      }
    `;
    document.head.appendChild(easterStyle);
    
    setTimeout(() => {
      donkeyEmoji.remove();
      easterStyle.remove();
    }, 2000);
    
    konamiCode = [];
  }
});

// ===== ACCESSIBILITY: SKIP TO CONTENT =====
const skipLink = document.createElement('a');
skipLink.href = '#home';
skipLink.textContent = 'Skip to content';
skipLink.className = 'skip-link';
skipLink.style.cssText = `
  position: absolute;
  top: -100px;
  left: 20px;
  padding: 10px 20px;
  background: var(--donkey-gold);
  color: var(--donkey-dark);
  z-index: 10001;
  border-radius: 8px;
  font-weight: 700;
  transition: top 0.3s;
`;
skipLink.addEventListener('focus', () => {
  skipLink.style.top = '20px';
});
skipLink.addEventListener('blur', () => {
  skipLink.style.top = '-100px';
});
document.body.insertBefore(skipLink, document.body.firstChild);

// ===== CONSOLE MESSAGE (DEVELOPMENT ONLY) =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log(
    '%c🫏 DONKEY %c- Too Stubborn to Fail',
    'font-size: 24px; font-weight: bold; color: #FFB627;',
    'font-size: 16px; color: #D4A574;'
  );
  console.log(
    '%cWebsite built with ❤️ by a stubborn developer',
    'font-size: 12px; font-style: italic; color: #8A8A8A;'
  );
}

// ===== READY STATE =====
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('✅ DONKEY website fully loaded and interactive');
  }
  
  // Add loaded class to body for any CSS transitions
  document.body.classList.add('is-loaded');
});

// ===== WINDOW LOAD =====
window.addEventListener('load', () => {
  // Trigger initial animation for hero section
  const heroElements = document.querySelectorAll('.hero [data-animate]');
  setTimeout(() => {
    heroElements.forEach(el => {
      el.classList.add('is-visible');
    });
  }, 100);
});
