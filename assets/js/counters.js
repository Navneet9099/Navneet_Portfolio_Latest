/**
 * Navneet Kesarwani — Portfolio JavaScript (Dion Pieters style)
 * Numeric stats progressive count-up animations using requestAnimationFrame (easeOutCubic)
 */

document.addEventListener('DOMContentLoaded', () => {
  const statNumbers = document.querySelectorAll('.stat-num');
  
  if (statNumbers.length === 0) return;

  function animateCount(el, target, suffix = '', duration = 1800) {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix; // Ensure target is exact at the end
        el.classList.add('pulse');
        el.addEventListener('animationend', () => {
          el.classList.remove('pulse');
        }, { once: true });
      }
    };
    requestAnimationFrame(step);
  }

  // Intersection Observer to start counters only when section enters screen
  const observerOptions = {
    root: null,
    threshold: 0.2, // Trigger when 20% of the numbers block is visible
    rootMargin: '0px'
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        animateCount(el, target, suffix);
        // Stop observing this element once animated
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  statNumbers.forEach(num => {
    counterObserver.observe(num);
  });
});
