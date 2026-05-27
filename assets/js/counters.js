/**
 * Navneet Kesarwani — Portfolio JavaScript (Dion Pieters style)
 * Numeric stats progressive count-up animations using requestAnimationFrame
 */

document.addEventListener('DOMContentLoaded', () => {
  const statNumbers = document.querySelectorAll('.stat-num');
  
  if (statNumbers.length === 0) return;

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800; // Animation duration in milliseconds (easeOutQuad over 1.8s)
    let startTime = null;

    const countStep = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressPercent = Math.min(progress / duration, 1);
      
      // Easing function: Ease Out Quad for a smoother deceleration
      const easeProgress = progressPercent * (2 - progressPercent);
      const currentVal = Math.floor(easeProgress * target);

      el.textContent = currentVal + suffix;

      if (progress < duration) {
        window.requestAnimationFrame(countStep);
      } else {
        el.textContent = target + suffix; // Ensure target is exact at the end
        el.classList.add('pulse');
        el.addEventListener('animationend', () => {
          el.classList.remove('pulse');
        }, { once: true });
      }
    };

    window.requestAnimationFrame(countStep);
  };

  // Intersection Observer to start counters only when section enters screen
  const observerOptions = {
    root: null,
    threshold: 0.2, // Trigger when 20% of the numbers block is visible
    rootMargin: '0px'
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        // Stop observing this element once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statNumbers.forEach(num => {
    counterObserver.observe(num);
  });
});
