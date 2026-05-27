/**
 * Navneet Kesarwani — Portfolio JavaScript (Dion Pieters style)
 * Core interactions, dark theme toggle, premium transitions, magnetic hover
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 0. IMMERSIVE PRELOADER COUNTDOWN (Synapser-inspired)
  // ==========================================================================
  const preloader = document.getElementById('preloader');
  const percentEl = document.getElementById('preloader-percent');

  if (preloader && percentEl) {
    const duration = 1200; // 1.2s smooth loader counting
    const startTime = performance.now();

    const updateCounter = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Decelerate the count organically
      const easeProgress = progress * (2 - progress);
      const currentVal = Math.floor(easeProgress * 100);
      
      // leading zero formatting
      percentEl.textContent = currentVal < 10 ? '0' + currentVal : currentVal;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        percentEl.textContent = '100';
        setTimeout(() => {
          preloader.classList.add('preloader-hidden');
          document.body.style.overflow = 'auto'; // unlock scroll
        }, 250);
      }
    };

    // Temporarily lock body scroll during loading intro
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(updateCounter);
  }

  // ==========================================================================
  // 0.5. SYNAPSER-INSPIRED INTERACTIVE CANVAS & FLOATING WORDS
  // ==========================================================================
  const canvas = document.getElementById('synapse-canvas');
  const words = document.querySelectorAll('.floating-word');
  const heroSection = document.getElementById('hero');

  if (canvas && words.length > 0 && heroSection) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = heroSection.clientWidth;
    let height = canvas.height = heroSection.clientHeight;

    let mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };
    let activeWord = null;

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouse.tx = e.clientX - rect.left;
      mouse.ty = e.clientY - rect.top;
    });

    // Resize canvas responsively
    let scale = window.innerWidth < 768 ? 0.45 : (window.innerWidth < 1024 ? 0.75 : 1);
    
    window.addEventListener('resize', () => {
      width = canvas.width = heroSection.clientWidth;
      height = canvas.height = heroSection.clientHeight;
      scale = window.innerWidth < 768 ? 0.45 : (window.innerWidth < 1024 ? 0.75 : 1);
      
      // Recalculate word dimension bounding boxes on resize to avoid thrashing
      items.forEach(item => {
        const angle = item.angle;
        const radius = item.baseRadius * scale;
        item.baseX = width / 2 + Math.cos(angle) * radius;
        item.baseY = height / 2 + Math.sin(angle) * radius;
        const rect = item.el.getBoundingClientRect();
        item.w = rect.width || 80;
        item.h = rect.height || 20;
      });
    });

    // Map floating elements metadata and event listeners
    const items = [];
    words.forEach((wordEl) => {
      const baseRadius = parseFloat(wordEl.getAttribute('data-radius')) || 200;
      const angle = (parseFloat(wordEl.getAttribute('data-angle')) || 0) * (Math.PI / 180);
      const radius = baseRadius * scale;
      
      const item = {
        el: wordEl,
        baseRadius: baseRadius,
        angle: angle,
        baseX: width / 2 + Math.cos(angle) * radius,
        baseY: height / 2 + Math.sin(angle) * radius,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0012 + Math.random() * 0.0008,
        amplitude: 22 + Math.random() * 18,
        hovered: false,
        w: 80,
        h: 20
      };

      // Measure layout geometry once to avoid layout thrashing in the 60fps loop
      requestAnimationFrame(() => {
        const rect = wordEl.getBoundingClientRect();
        item.w = rect.width || 80;
        item.h = rect.height || 20;
      });

      wordEl.addEventListener('mouseenter', () => {
        item.hovered = true;
        activeWord = item;
      });

      wordEl.addEventListener('mouseleave', () => {
        item.hovered = false;
        if (activeWord === item) activeWord = null;
      });

      items.push(item);
    });

    // Interactive Animation Loop
    const animateSynapses = (time) => {
      // Smooth mouse coordinate ease
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw synapse connector hairlines
      items.forEach(item => {
        // Calculate organic wave wave-drift offsets
        const waveX = Math.cos(time * item.speed + item.phase) * item.amplitude;
        const waveY = Math.sin(time * time * 0.00001 + item.phase) * item.amplitude; // slow drift variation

        // Mouse cursor pull parallax offsets
        const dx = mouse.x - centerX;
        const dy = mouse.y - centerY;
        const parallaxFactor = Math.max(0, 1 - (item.baseRadius * scale) / 550) * 0.07;

        const tx = item.baseX + waveX + dx * parallaxFactor;
        const ty = item.baseY + waveY + dy * parallaxFactor;

        // Smooth translate updates
        item.x += (tx - item.x) * 0.08;
        item.y += (ty - item.y) * 0.08;

        // Apply hardware accelerated 3D translations
        const translateX = item.x - item.w / 2;
        const translateY = item.y - item.h / 2;
        item.el.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;

        // Draw the visual connecting line in canvas
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(item.x, item.y);

        // Styling based on current active theme
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        let strokeColor = 'rgba(224, 221, 217, 0.45)'; // light mode border line
        if (theme === 'dark') strokeColor = 'rgba(51, 49, 46, 0.5)'; // dark mode border line

        if (item.hovered) {
          ctx.strokeStyle = theme === 'dark' ? 'rgba(245, 242, 238, 0.65)' : 'rgba(17, 17, 17, 0.55)';
          ctx.lineWidth = 1.0;
        } else {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 0.5;
        }
        ctx.stroke();

        // Draw glowing circular end-node when hovered
        if (item.hovered) {
          ctx.beginPath();
          ctx.arc(item.x, item.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = theme === 'dark' ? '#F5F2EE' : '#111111';
          ctx.fill();
        }
      });

      requestAnimationFrame(() => animateSynapses(performance.now()));
    };

    // Delay start slightly to let FOUC theme block and preloader settle
    setTimeout(() => {
      requestAnimationFrame(() => animateSynapses(performance.now()));
    }, 100);
  }

  // ==========================================================================
  // 1. STICKY NAV ON SCROLL
  // ==========================================================================
  const header = document.getElementById('main-header');
  
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('header-sticky');
      header.classList.remove('header-transparent');
    } else {
      header.classList.add('header-transparent');
      header.classList.remove('header-sticky');
    }
  };

  handleScroll();
  window.addEventListener('scroll', handleScroll);


  // ==========================================================================
  // 2. MOBILE OVERLAY MENU (HAMBURGER)
  // ==========================================================================
  const hamburger = document.getElementById('hamburger-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = () => {
    const isActive = hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    
    // Toggle body scroll locking
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  hamburger.addEventListener('click', toggleMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });


  // ==========================================================================
  // 3. WORKS ROW LIST INTERACTIVE EXPANSION (ACCORDION)
  // ==========================================================================
  const workItems = document.querySelectorAll('.work-item');

  // Inject stagger delay indices dynamically to Works list rows
  workItems.forEach((item, index) => {
    item.style.setProperty('--item-index', index);
  });

  // Inject stagger delay indices dynamically to Skill Tags within each category
  document.querySelectorAll('.skills-category').forEach(cat => {
    cat.querySelectorAll('.skill-tag').forEach((tag, idx) => {
      tag.style.setProperty('--tag-index', idx);
    });
  });

  // Inject stagger delay indices dynamically to Experience timeline items
  document.querySelectorAll('.experience-item').forEach((item, idx) => {
    item.style.setProperty('--item-index', idx);
  });

  // Inject stagger delay indices dynamically to Contact social link rows
  document.querySelectorAll('.contact-link-row').forEach((row, idx) => {
    row.style.setProperty('--social-index', idx);
  });

  // Inject stagger delay indices dynamically to Contact form input groups
  document.querySelectorAll('.contact-form .form-group').forEach((group, idx) => {
    group.style.setProperty('--input-index', idx);
  });

  workItems.forEach(item => {
    const headerBtn = item.querySelector('.work-row-header');
    const details = item.querySelector('.work-details');

    headerBtn.addEventListener('click', () => {
      const isExpanded = headerBtn.getAttribute('aria-expanded') === 'true';

      // Close other open project items
      workItems.forEach(otherItem => {
        if (otherItem !== item) {
          const otherHeader = otherItem.querySelector('.work-row-header');
          const otherDetails = otherItem.querySelector('.work-details');
          
          otherHeader.setAttribute('aria-expanded', 'false');
          otherDetails.style.maxHeight = null;
          otherDetails.classList.remove('open');
        }
      });

      // Toggle current item
      if (isExpanded) {
        headerBtn.setAttribute('aria-expanded', 'false');
        details.style.maxHeight = null;
        details.classList.remove('open');
      } else {
        headerBtn.setAttribute('aria-expanded', 'true');
        details.style.maxHeight = details.scrollHeight + 'px';
        details.classList.add('open');
        
        // Resize Observer to dynamically recalculate heights if children morph
        const resizeObserver = new ResizeObserver(() => {
          if (details.classList.contains('open')) {
            details.style.maxHeight = details.scrollHeight + 'px';
          }
        });
        resizeObserver.observe(details);
      }
    });
  });


  // ==========================================================================
  // 4. DARK THEME TOGGLE LOGIC
  // ==========================================================================
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const mobileThemeIcon = document.getElementById('mobile-theme-icon');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('nk-theme', theme);

    // Swap icons (☀ for Light, ☾ for Dark)
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☾' : '☀';
    if (mobileThemeIcon) mobileThemeIcon.textContent = theme === 'dark' ? '☾' : '☀';

    // Trigger premium 360-degree spin animation
    if (themeIcon) {
      themeIcon.style.animation = 'none';
      requestAnimationFrame(() => {
        themeIcon.style.animation = 'iconSpin 0.4s cubic-bezier(0.16,1,0.3,1) forwards';
      });
    }
    if (mobileThemeIcon) {
      mobileThemeIcon.style.animation = 'none';
      requestAnimationFrame(() => {
        mobileThemeIcon.style.animation = 'iconSpin 0.4s cubic-bezier(0.16,1,0.3,1) forwards';
      });
    }
  }

  // Restore saved theme on load (Fallback to system prefers-color-scheme)
  const savedTheme = localStorage.getItem('nk-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'));

  // Click handler desktop
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme') || 'light';
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  // Click handler mobile
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme') || 'light';
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }


  // ==========================================================================
  // 5. SCROLL REVEAL (SUBTLE INTERSECTION OBSERVER FOR .REVEAL & DIVIDERS)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Trigger exactly once
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });


  // ==========================================================================
  // 6. MAGNETIC CTA BUTTONS HOVER PULL EFFECT
  // ==========================================================================
  const magneticButtons = document.querySelectorAll('.nav-btn, .theme-toggle-btn, .cta-link-btn, .project-btn, .submit-btn');

  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      // Respect user's accessibility reduced motion preferences
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.18;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.18;
      
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });


  // ==========================================================================
  // 7. SMOOTH SCROLL FOR LINK ANCHORS & MOBILE COMPATIBILITY
  // ==========================================================================
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia('(pointer: coarse)').matches;
  
  // Disable native scroll-behavior smooth only on non-touch desktop devices to prevent lerp conflicts
  if (!isTouchDevice) {
    document.documentElement.style.scrollBehavior = 'auto';
  }

  let targetY = window.scrollY;
  let currentY = window.scrollY;
  let isSmoothScrolling = false;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;

      e.preventDefault();
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        if (window.matchMedia('(hover: hover)').matches && !isTouchDevice) {
          targetY = offsetPosition;
          if (!isSmoothScrolling) {
            isSmoothScrolling = true;
            smoothScroll();
          }
        } else {
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ==========================================================================
  // 8. CODEDGAR STYLE DESKTOP LERP SMOOTH SCROLL (NON-TOUCH ONLY)
  // ==========================================================================
  if (window.matchMedia('(hover: hover)').matches && !isTouchDevice) {
    window.addEventListener('wheel', (e) => {
      // Respect prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      e.preventDefault();
      targetY += e.deltaY * 0.9;
      const maxScroll = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
      targetY  = Math.max(0, Math.min(targetY, maxScroll));
      
      if (!isSmoothScrolling) {
        isSmoothScrolling = true;
        smoothScroll();
      }
    }, { passive: false });

    // Sync scroll target coordinates if scrolled by other means
    window.addEventListener('scroll', () => {
      if (!isSmoothScrolling) {
        targetY = window.scrollY;
        currentY = window.scrollY;
      }
    });
  }

  function smoothScroll() {
    currentY += (targetY - currentY) * 0.1;
    window.scrollTo(0, currentY);

    if (Math.abs(targetY - currentY) > 0.5) {
      requestAnimationFrame(smoothScroll);
    } else {
      isSmoothScrolling = false;
    }
  }

  // ==========================================================================
  // 9. NEW PREMIUM CYAN CUSTOM CURSOR & TRAILING RING (Codedgar Upgrade)
  // ==========================================================================
  const cursor = document.querySelector('.custom-cursor');
  const ring = document.querySelector('.custom-cursor-ring');

  if (cursor && ring) {
    // Hide default cursor in CSS and track mouse movement
    document.addEventListener('mousemove', (e) => {
      // Direct positioning for inner dot
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      
      // Smooth delayed animation for outer ring
      ring.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
      }, { duration: 100, fill: 'forwards' });
    });

    // Toggle expand state class on the body when hovering clickable elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"], .work-item');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovered');
      });
    });

    // Hide custom cursor nodes when mouse leaves window and show when it enters
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      ring.style.opacity = '1';
    });
  }

  // ==========================================================================
  // 10. WORKS LIST STAGGER ON FIRST VIEW
  // ==========================================================================
  const workItemsStagger = document.querySelectorAll('.work-item');
  const worksObserver = new IntersectionObserver((entries, observer) => {
    // Filter to only items that are intersecting
    const intersecting = entries.filter(entry => entry.isIntersecting);
    if (intersecting.length > 0) {
      intersecting.forEach((entry, i) => {
        const item = entry.target;
        item.style.transitionDelay = `${i * 70}ms`;
        item.classList.add('visible');
        observer.unobserve(item);
      });
    }
  }, {
    root: null,
    threshold: 0.1
  });

  workItemsStagger.forEach(item => {
    worksObserver.observe(item);
  });

  // ==========================================================================
  // 11. NAV ACTIVE HIGHLIGHT (SCROLL SPY)
  // ==========================================================================
  const spySections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('nav-active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('nav-active');
      }
    });
  }, { 
    root: null,
    threshold: 0.35,
    rootMargin: '-10% 0px -40% 0px'
  });

  spySections.forEach(s => spyObserver.observe(s));

});
