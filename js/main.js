/* ===================== main.js (SIMPLIFICADO E ORGANIZADO) ===================== */

// Configuration
const CONFIG = {
  whatsappNumber: '5518991657604',
  headerHideThreshold: 120,
  revealThreshold: 0.12
};

// DOM Utilities
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// Debounce utility
const debounce = (fn, wait = 100) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
};

/* ---------- Header Auto-hide ---------- */
function initHeaderHide() {
  const header = $('.header');
  let lastScroll = 0;
  
  if (!header) return;
  
  window.addEventListener('scroll', debounce(() => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class for background
    if (currentScroll > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Show/hide header
    if (currentScroll > lastScroll && currentScroll > CONFIG.headerHideThreshold) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
  }, 50));
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const navMenu = $('#nav-menu');
  const navToggle = $('#nav-toggle');
  const navClose = $('#nav-close');
  
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.add('show-menu');
      document.body.style.overflow = 'hidden';
    });
  }
  
  if (navClose) {
    navClose.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
      document.body.style.overflow = '';
    });
  }
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('show-menu') && 
        !navMenu.contains(e.target) && 
        e.target !== navToggle) {
      navMenu.classList.remove('show-menu');
      document.body.style.overflow = '';
    }
  });
  
  // Handle dropdowns on mobile
  $$('.nav__item--has-dropdown .nav__link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parent = link.parentElement;
        parent.classList.toggle('open');
      }
    });
  });
}

/* ---------- Scroll Reveal Animation ---------- */
function initScrollReveal() {
  const revealElements = [
    ...$$('.services__card'),
    ...$$('.plan__card'),
    ...$$('.before-after-wrapper'),
    ...$$('.hero__data')
  ];
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: CONFIG.revealThreshold,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => {
    if (el) observer.observe(el);
  });
}

/* ---------- Before/After Comparator ---------- */
function initComparator() {
  const comparator = document.getElementById('baComparator');
  if (!comparator) return;
  
  const afterWrap = document.getElementById('baAfterWrap');
  const slider = document.getElementById('baSlider');
  const beforeImg = document.querySelector('.ba-image-before');
  const afterImg = document.querySelector('.ba-image-after');
  const thumbs = document.querySelectorAll('.ba-thumb');
  
  // Set initial position to center
  afterWrap.style.width = '50%';
  slider.style.left = '50%';
  
  // Adjust images size
  function adjustImages() {
    if (beforeImg.complete && beforeImg.naturalHeight) {
      const aspectRatio = beforeImg.naturalHeight / beforeImg.naturalWidth;
      const calculatedHeight = comparator.clientWidth * aspectRatio;
      comparator.style.height = Math.min(calculatedHeight, 600) + 'px';
    }
  }
  
  // Slider functionality
  let isDragging = false;
  
  function startDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    isDragging = true;
    comparator.classList.add('dragging');
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ew-resize';
    updateDrag(e);
  }
  
  function updateDrag(e) {
    if (!isDragging) return;
    
    const rect = comparator.getBoundingClientRect();
    let clientX;
    
    if (e.type.includes('touch')) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    
    const percent = (x / rect.width) * 100;
    
    afterWrap.style.width = percent + '%';
    slider.style.left = percent + '%';
  }
  
  function stopDrag() {
    isDragging = false;
    comparator.classList.remove('dragging');
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }
  
  // Event listeners for slider
  slider.addEventListener('mousedown', startDrag);
  slider.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startDrag(e);
  }, { passive: false });
  
  document.addEventListener('mousemove', updateDrag);
  document.addEventListener('touchmove', updateDrag, { passive: true });
  
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);
  
  // Keyboard navigation
  slider.addEventListener('keydown', (e) => {
    const currentPercent = parseFloat(afterWrap.style.width) || 50;
    
    if (e.key === 'ArrowLeft') {
      const newPercent = Math.max(0, currentPercent - 5);
      afterWrap.style.width = newPercent + '%';
      slider.style.left = newPercent + '%';
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      const newPercent = Math.min(100, currentPercent + 5);
      afterWrap.style.width = newPercent + '%';
      slider.style.left = newPercent + '%';
      e.preventDefault();
    }
  });
  
  // Thumbnail switching - FIXED
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', function() {
      const beforeSrc = this.getAttribute('data-before');
      const afterSrc = this.getAttribute('data-after');
      
      console.log('Changing images to:', beforeSrc, afterSrc);
      
      // Update active state
      thumbs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Change images
      let imagesLoaded = 0;
      
      function onImageLoad() {
        imagesLoaded++;
        if (imagesLoaded === 2) {
          adjustImages();
          // Reset slider to center
          afterWrap.style.width = '50%';
          slider.style.left = '50%';
          console.log('Images loaded successfully');
        }
      }
      
      // Load before image
      if (beforeSrc && beforeImg) {
        const beforeLoader = new Image();
        beforeLoader.onload = () => {
          beforeImg.src = beforeSrc;
          onImageLoad();
        };
        beforeLoader.onerror = () => {
          console.error('Failed to load before image:', beforeSrc);
          onImageLoad();
        };
        beforeLoader.src = beforeSrc;
      }
      
      // Load after image
      if (afterSrc && afterImg) {
        const afterLoader = new Image();
        afterLoader.onload = () => {
          afterImg.src = afterSrc;
          onImageLoad();
        };
        afterLoader.onerror = () => {
          console.error('Failed to load after image:', afterSrc);
          onImageLoad();
        };
        afterLoader.src = afterSrc;
      }
    });
  });
  
  // Initialize
  window.addEventListener('load', () => {
    adjustImages();
    setTimeout(adjustImages, 100);
  });
  
  window.addEventListener('resize', () => {
    adjustImages();
  });
  
  // Prevent image dragging
  document.querySelectorAll('.ba-image-before, .ba-image-after').forEach(img => {
    img.setAttribute('draggable', 'false');
    img.addEventListener('dragstart', (e) => e.preventDefault());
  });
}

/* ---------- Scroll to Top ---------- */
function initScrollToTop() {
  const scrollUp = $('#scroll-up');
  
  if (!scrollUp) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollUp.classList.add('show-scroll');
    } else {
      scrollUp.classList.remove('show-scroll');
    }
  });
}

/* ---------- Initialize Everything ---------- */
document.addEventListener('DOMContentLoaded', function() {
  console.log('S&R Consultoria - Site carregado!');
  
  // Initialize all components
  initHeaderHide();
  initMobileMenu();
  initScrollReveal();
  initComparator();
  initScrollToTop();
  
  // Add revealed class to elements for initial animation
  setTimeout(() => {
    $$('.services__card, .plan__card, .before-after-wrapper, .hero__data').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('revealed');
      }
    });
  }, 300);
});
