// PPA Consultancy — Polished, Accessible, and Performant JS
// ----------------------------------------------------------
// Features:
// - Smooth in-page navigation (respects reduced motion)
// - Sticky nav background + active link highlighting
// - IntersectionObserver reveal animations with stagger
// - Counter animations using requestAnimationFrame (easeOutCubic)
// - Carousel: autoplay, dots, arrows, swipe/touch, keyboard, ARIA updates
// - Autoplay pauses on hover, on tab blur, and if reduced motion is set
// - Clean scoping (no globals), light defensive programming

(function () {
  'use strict';

  // Helpers ------------------------------------------------
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  // Search functionality for Services page ----------------
  function setupServiceSearch() {
    const searchBtn = qs('#search-btn');
    const searchInput = qs('#service-search');
    const searchForm = qs('.search-box'); // Get the form element
    
    if (!searchBtn || !searchInput) return;
    
    const performSearch = (e) => {
        e.preventDefault(); // Prevent form submission/page refresh
        
        const query = searchInput.value.toLowerCase().trim();
        
        if (!query) return;
        
        // Look for service cards in the services-detail section
        const services = qsa('#services-detail .service-card');
        let found = false;
        
        services.forEach(service => {
            const titleElement = qs('.service-text h3', service);
            const textContent = qs('.service-text p', service);
            const listItems = qsa('.service-text ul li', service);
            
            if (!titleElement) return;
            
            const title = titleElement.textContent.toLowerCase();
            const text = textContent ? textContent.textContent.toLowerCase() : '';
            const listText = listItems.map(li => li.textContent.toLowerCase()).join(' ');
            
            const searchableContent = title + ' ' + text + ' ' + listText;
            
            if (searchableContent.includes(query)) {
                service.scrollIntoView({ behavior: 'smooth', block: 'center' });
                service.style.background = '#f0f7ff';
                service.style.border = '2px solid #3b82f6';
                service.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    service.style.background = '';
                    service.style.border = '';
                }, 3000);
                
                found = true;
                return;
            }
        });
        
        if (!found) {
            alert('No matching service found. Try terms like "cost", "scheduling", "risk", "feasibility", "change", or "performance".');
        }
    };
    
    // IMPORTANT: Prevent form submission
    if (searchForm) {
        searchForm.addEventListener('submit', performSearch);
    }
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(e);
        }
    });
}

  // Search functionality for Industries page --------------
  function setupIndustrySearch() {
    const searchBtn = qs('#search-btn');
    const searchInput = qs('#industry-search');
    
    if (!searchBtn || !searchInput) return;
    
    const performSearch = (e) => {
        e.preventDefault();
        const query = searchInput.value.toLowerCase().trim();
        
        if (!query) return;
        
        const industries = qsa('.industry-card');
        let found = false;
        
        industries.forEach(industry => {
            const titleElement = qs('.industry-text h3', industry);
            const textContent = qs('.industry-text p', industry);
            const listItems = qsa('.industry-text ul li', industry);
            
            if (!titleElement) return;
            
            const title = titleElement.textContent.toLowerCase();
            const text = textContent ? textContent.textContent.toLowerCase() : '';
            const listText = listItems.map(li => li.textContent.toLowerCase()).join(' ');
            
            const searchableContent = title + ' ' + text + ' ' + listText;
            
            if (searchableContent.includes(query)) {
                industry.scrollIntoView({ behavior: 'smooth', block: 'center' });
                industry.style.background = '#f0f7ff';
                industry.style.border = '2px solid #3b82f6';
                industry.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    industry.style.background = '';
                    industry.style.border = '';
                }, 3000);
                
                found = true;
                return;
            }
        });
        
        if (!found) {
            alert('No matching industry found. Try terms like "oil", "gas", "transportation", "mining", "marine", or "infrastructure".');
        }
    };
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(e);
        }
    });
  }
  // Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
  // Create hamburger menu
  const hamburger = document.createElement('div');
  hamburger.className = 'hamburger';
  hamburger.innerHTML = '<span></span><span></span><span></span>';
  
  const navContainer = document.querySelector('nav .container');
  if (navContainer) {
    navContainer.appendChild(hamburger);
  }
  
  const navLinks = document.querySelector('.nav-links');
  
  // Toggle mobile menu
  hamburger.addEventListener('click', function() {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    if (navLinks.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  });
  
  // Add arrows to dropdown parents and handle clicks
  const servicesLi = document.querySelector('.nav-links > li:nth-child(2)'); // Services
  const industriesLi = document.querySelector('.nav-links > li:nth-child(3)'); // Industries
  
  function setupDropdown(parentLi, linkSelector) {
    if (!parentLi) return;
    
    const link = parentLi.querySelector('a');
    const dropdown = parentLi.querySelector('.dropdown');
    
    if (!dropdown) return;
    
    // Create and add arrow
    const arrow = document.createElement('span');
    arrow.className = 'dropdown-arrow';
    arrow.innerHTML = '▼';
    parentLi.appendChild(arrow);
    
    // Main link - navigate directly
    link.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        // Close menu and navigate
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
    
    // Arrow - toggle dropdown
    arrow.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (window.innerWidth <= 768) {
        // Close other dropdowns
        const otherDropdowns = document.querySelectorAll('.dropdown');
        const otherArrows = document.querySelectorAll('.dropdown-arrow');
        
        otherDropdowns.forEach(dd => {
          if (dd !== dropdown) {
            dd.classList.remove('active');
          }
        });
        
        otherArrows.forEach(arr => {
          if (arr !== arrow) {
            arr.style.transform = 'rotate(0deg)';
          }
        });
        
        // Toggle current dropdown
        if (dropdown.style.display === 'flex' || dropdown.classList.contains('active')) {
          // Close it
          dropdown.style.display = 'none';
          dropdown.classList.remove('active');
          arrow.style.transform = 'rotate(0deg)';
        } else {
          // Open it
          dropdown.style.display = 'flex';
          dropdown.classList.add('active');
          arrow.style.transform = 'rotate(180deg)';
        }
      }
    });
  }
  
  // Setup both dropdowns
  setupDropdown(servicesLi);
  setupDropdown(industriesLi);
  
  // Close menu when clicking dropdown items
  const dropdownLinks = document.querySelectorAll('.dropdown a');
  dropdownLinks.forEach(link => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = 'auto';
      
      // Close all dropdowns
      document.querySelectorAll('.dropdown').forEach(dd => {
        dd.style.display = 'none';
        dd.classList.remove('active');
      });
      document.querySelectorAll('.dropdown-arrow').forEach(arr => {
        arr.style.transform = 'rotate(0deg)';
      });
    });
  });
  
  // Close menu when clicking regular nav items
  const regularLinks = document.querySelectorAll('.nav-links > li:first-child a, .nav-links > li:last-child a, .nav-links > li:nth-last-child(2) a');
  regularLinks.forEach(link => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!navContainer.contains(e.target) && navLinks.classList.contains('active')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = 'auto';
      
      // Close all dropdowns
      document.querySelectorAll('.dropdown').forEach(dd => {
        dd.style.display = 'none';
        dd.classList.remove('active');
      });
      document.querySelectorAll('.dropdown-arrow').forEach(arr => {
        arr.style.transform = 'rotate(0deg)';
      });
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = 'auto';
      
      document.querySelectorAll('.dropdown').forEach(dd => {
        dd.style.display = '';
        dd.classList.remove('active');
      });
      document.querySelectorAll('.dropdown-arrow').forEach(arr => {
        arr.style.transform = 'rotate(0deg)';
      });
    }
  });


  
  // Industries carousel functionality
  const initCarousel = function() {
    const carousel = document.getElementById('carouselContainer');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('prevButton');
    const nextBtn = document.getElementById('nextButton');
    
    if (!carousel || slides.length === 0) return;
    
    let currentIndex = 0;
    const slideCount = slides.length;
    let autoSlideInterval;
    
    function updateCarousel() {
      const translateX = -currentIndex * (100 / slideCount);
      carousel.style.transform = `translateX(${translateX}%)`;
      
      // Update active dot
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
      
      // Update industry tabs
      const industry = slides[currentIndex].dataset.industry;
      const tabs = document.querySelectorAll('.industry-tab');
      tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.industry === industry);
      });
    }
    
    function startAutoSlide() {
      autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % slideCount;
       // updateCarousel();
      }, 5000);
    } //
    
    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        //updateCarousel();
        //startAutoSlide();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        currentIndex = (currentIndex + 1) % slideCount;
        //updateCarousel();
       // startAutoSlide();
      });
    }
    
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        stopAutoSlide();
        currentIndex = index;
        //updateCarousel();
        //startAutoSlide();
      });
    });
    
    // Auto-advance carousel
    //startAutoSlide();
    
    // Pause auto-slide on hover
    //carousel.addEventListener('mouseenter', stopAutoSlide);
    //carousel.addEventListener('mouseleave', startAutoSlide);
  };
  
  initCarousel();
  /*
  // Form submission handling
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simple form validation
      const requiredFields = this.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = 'red';
          isValid = false;
        } else {
          field.style.borderColor = '';
        }
      });
      
      if (isValid) {
        // Form is valid, you would normally submit here
        const formStatus = document.getElementById('form-status');
        if (formStatus) {
          formStatus.innerHTML = '<p class="success-message">Thank you for your message! We will get back to you soon.</p>';
          formStatus.scrollIntoView({ behavior: 'smooth' });
          this.reset();
        }
      }
    });
  }
});
*/
});
  // Smooth scrolling for nav links -------------------------
  function setupSmoothScroll() {
    qsa('a[href*="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');

        // If the link is to a different page, let the browser handle it.
        if (!href.startsWith('#')) {
          return;
        }

        // If the link is on the same page, scroll to the target.
        const target = document.getElementById(href.substring(1));
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  // Nav background + active link ---------------------------
  function setupNavEffects() {
    const nav = qs('nav');
    if (!nav) return;

    const sections = qsa('section[id]');
    const navLinks = qsa('.nav-links a');

    // Background opacity change
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      nav.style.background = y > 100 ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)';
    };

    // Throttle scroll handler using requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    onScroll();

    // Highlight active section in nav using IntersectionObserver
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const active = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', active);
            if (active) {
              link.setAttribute('aria-current', 'page');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });

    sections.forEach(sec => observer.observe(sec));
  }

  // Reveal-on-scroll animations (staggered) ----------------
  function setupRevealOnScroll() {
    const revealTargets = [
      '.industry-card',
      '.stat-card',
      '.about-us-content > *',
      '.motto-content > *',
      '.services-content > *'
    ].join(', ');

    const cards = qsa(revealTargets);
    if (!cards.length) return;

    cards.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = prefersReduced ? 'none' : 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    });

    const io = new IntersectionObserver((entries) => {
      // Group entries by container so we can stagger siblings nicely
      const byParent = new Map();
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const parent = en.target.parentElement;
        if (!byParent.has(parent)) byParent.set(parent, []);
        byParent.get(parent).push(en.target);
      });

      byParent.forEach(list => {
        list.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
        list.forEach((el, i) => {
          if (!prefersReduced) el.style.transitionDelay = `${i * 80}ms`;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          io.unobserve(el);
        });
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    cards.forEach(el => io.observe(el));
  }

  // Stat counters -----------------------------------------
  function setupCounters() {
    const section = qs('.why-choose');
    if (!section) return;

    const startCounters = () => {
      qsa('.stat-number', section).forEach(counter => {
        const raw = counter.textContent.trim();
        const hasPlus = raw.includes('+');
        const hasPct = raw.includes('%');
        const suffix = hasPlus ? '+' : hasPct ? '%' : '';
        const target = parseInt(raw.replace(/[^0-9]/g, ''), 10) || 0;
        const duration = 2000; // ms
        const start = performance.now();

        if (prefersReduced) {
          counter.textContent = `${target}${suffix}`;
          return;
        }

        function tick(now) {
          const t = clamp((now - start) / duration, 0, 1);
          const eased = easeOutCubic(t);
          const val = Math.round(target * eased);
          counter.textContent = `${val}${suffix}`;
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    };

    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          startCounters();
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.5 });

    io.observe(section);
  }

  // Carousel ----------------------------------------------
  function setupCarousel() {
    const carousel = qs('.industries-carousel');
    const container = qs('#carouselContainer');
    if (!carousel || !container) return;

    const slides = qsa('.carousel-slide', container);
    const dots = qsa('.carousel-dot');
    const prevBtn = qs('#prevButton');
    const nextBtn = qs('#nextButton');
    const total = slides.length || 0;
    if (!total) return;

    // Accessibility roles/labels
    carousel.setAttribute('role', 'region');
    carousel.setAttribute('aria-label', 'Industries carousel');
    container.setAttribute('aria-live', 'polite');

    dots.forEach((d, i) => {
      d.setAttribute('role', 'button');
      d.setAttribute('aria-label', `Go to slide ${i + 1}`);
      d.setAttribute('tabindex', '0');
    });

    let index = 0;
    let timer = null;
    const autoplayMs = 8000;

    const updateARIA = () => {
      slides.forEach((s, i) => s.setAttribute('aria-hidden', i === index ? 'false' : 'true'));
      dots.forEach((d, i) => {
        const active = i === index;
        d.classList.toggle('active', active);
        d.setAttribute('aria-current', active ? 'true' : 'false');
      });

      // Sync industry tabs
      const type = slides[index].getAttribute('data-industry');
      qsa('.industry-tab').forEach(tab => {
        const isActive = tab.getAttribute('data-industry') === type;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });
    };

    const updateTransform = () => {
      const pct = 100 / total; // dynamic support
      container.style.transition = prefersReduced ? 'none' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
      container.style.transform = `translateX(-${index * pct}%)`;
      updateARIA();
    };

    const next = () => { index = (index + 1) % total; updateTransform(); };
    const prev = () => { index = (index - 1 + total) % total; updateTransform(); };
    const goTo = i => { index = clamp(i, 0, total - 1); updateTransform(); };

    function startAutoplay() {
      if (prefersReduced) return; // respect user setting
      stopAutoplay();
      timer = setInterval(next, autoplayMs);
    }
    function stopAutoplay() { if (timer) clearInterval(timer); timer = null; }

    // Buttons
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoplay(); next();});
    if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoplay(); prev();});

    // Dots (click + keyboard)
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { stopAutoplay(); goTo(i);});
      dot.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stopAutoplay(); goTo(i); }
      });
    });

    // Swipe support (touch)
    let startX = 0, currentX = 0, isSwiping = false;
    const threshold = 40; // px

    const onTouchStart = e => {
      if (!e.touches || e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      currentX = startX;
      isSwiping = true;
      stopAutoplay();
    };
    const onTouchMove = e => {
      if (!isSwiping) return;
      currentX = e.touches[0].clientX;
    };
    const onTouchEnd = () => {
      if (!isSwiping) return;
      const delta = currentX - startX;
      if (Math.abs(delta) > threshold) {
        if (delta < 0) next(); else prev();
      } else {
        updateTransform();
      }
      isSwiping = false;
      //startAutoplay();
    };

    carousel.addEventListener('touchstart', onTouchStart, { passive: true });
    carousel.addEventListener('touchmove', onTouchMove, { passive: true });
    carousel.addEventListener('touchend', onTouchEnd);

    // Keyboard arrows on carousel region
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { stopAutoplay(); next();}
      if (e.key === 'ArrowLeft')  { stopAutoplay(); prev();}
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoplay);

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay();
    });

    // Init
    index = 0;
    updateTransform();
    //startAutoplay();
  }

  // Boot ---------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    setupSmoothScroll();
    setupNavEffects();
    setupRevealOnScroll();
    setupCounters();
    setupCarousel();
    setupServiceSearch();
    setupIndustrySearch();
  });

})();