/**
 * Navneet Kesarwani — Portfolio JavaScript (Dion Pieters style)
 * Asynchronous Formspree Contact Form Handler with custom UI responses
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnArrow = submitBtn.querySelector('.btn-arrow');
  const formStatus = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Intercept page reload/redirect
    
    const actionUrl = form.getAttribute('action');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // 1. UI Loading State Transition
    submitBtn.disabled = true;
    const originalText = btnText.textContent;
    btnText.textContent = 'Sending...';
    btnArrow.style.display = 'none';

    // Clear previous status messages
    formStatus.className = 'form-status-msg';
    formStatus.textContent = '';

    // Helper to reset button to normal
    const resetButton = () => {
      submitBtn.disabled = false;
      btnText.textContent = originalText;
      btnArrow.style.display = 'inline-block';
    };

    // Helper to display status message beautifully
    const showStatus = (msg, type) => {
      formStatus.textContent = msg;
      formStatus.className = `form-status-msg ${type}`;
      
      // Auto-fade status message after 6 seconds
      setTimeout(() => {
        formStatus.style.opacity = '0';
        formStatus.style.transition = 'opacity 1s ease';
        setTimeout(() => {
          formStatus.className = 'form-status-msg';
          formStatus.style.opacity = null;
          formStatus.style.transition = null;
        }, 1000);
      }, 5000);
    };

    // 2. Placeholder Check (Emulate success for local testing before setup)
    if (actionUrl.includes('YOUR_ACTUAL_FORM_ID')) {
      setTimeout(() => {
        resetButton();
        form.reset();
        showStatus('✓ Message sent successfully! (Formspree Placeholder Mode: Make sure to replace YOUR_ACTUAL_FORM_ID in index.html with your actual Form ID when deploying!)', 'success');
      }, 1000);
      return;
    }

    // 3. Perform Actual Fetch API Submission to Formspree
    try {
      const response = await fetch(actionUrl, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        resetButton();
        form.reset();
        showStatus('✓ Message sent successfully! Thank you, I will get back to you soon.', 'success');
      } else {
        const responseData = await response.json();
        resetButton();
        if (responseData.errors && responseData.errors.length > 0) {
          showStatus(`✗ Error: ${responseData.errors.map(err => err.message).join(', ')}`, 'error');
        } else {
          showStatus('✗ Failed to send message. Please try again later.', 'error');
        }
      }
    } catch (error) {
      resetButton();
      showStatus('✗ Network error occurred. Please check your connection and try again.', 'error');
    }
  });
});
