/**
 * Plowshare Landing Page Main JavaScript
 * Handles navigation toggle, form submission, and basic interactivity
 */

(function() {
  'use strict';

  /**
   * Form Service Configuration
   * Configure your form submission endpoint here.
   * Supports Formspree, Getform, or custom endpoints.
   */
  var FORM_CONFIG = {
    // Formspree endpoint - replace with your form ID
    // Get your form ID at https://formspree.io
    endpoint: 'https://formspree.io/f/YOUR_FORM_ID',

    // Set to true when you have configured your endpoint
    enabled: false,

    // Success redirect URL (optional - leave null to show inline message)
    successRedirect: null
  };

  /**
   * Mobile Navigation Toggle
   */
  function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', function() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-open');
    });

    // Close menu when clicking on a link
    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      });
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
        navToggle.focus();
      }
    });
  }

  /**
   * Update copyright year
   */
  function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  /**
   * Smooth scroll for anchor links (fallback for browsers without CSS scroll-behavior)
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update URL without scrolling
          history.pushState(null, '', targetId);
        }
      });
    });
  }

  /**
   * Email Signup Form Handling
   */
  function initSignupForms() {
    var forms = document.querySelectorAll('.signup-form');

    forms.forEach(function(form) {
      form.addEventListener('submit', handleFormSubmit);

      // Real-time validation on blur for email input
      var emailInput = form.querySelector('input[type="email"]');
      if (emailInput) {
        emailInput.addEventListener('blur', function() {
          validateEmail(emailInput);
        });
        emailInput.addEventListener('input', function() {
          clearError(emailInput);
        });
      }

      // Clear checkbox error on change
      var consentCheckbox = form.querySelector('input[name="consent"]');
      if (consentCheckbox) {
        consentCheckbox.addEventListener('change', function() {
          clearCheckboxError(consentCheckbox);
        });
      }
    });
  }

  /**
   * Handle form submission
   */
  function handleFormSubmit(e) {
    e.preventDefault();

    var form = e.target;
    var isValid = validateForm(form);

    if (!isValid) {
      return;
    }

    // Get form data
    var emailInput = form.querySelector('input[type="email"]');
    var userTypeInput = form.querySelector('input[name="user_type"]:checked');
    var consentCheckbox = form.querySelector('input[name="consent"]');

    var formData = {
      email: emailInput.value.trim(),
      user_type: userTypeInput ? userTypeInput.value : 'property_owner',
      consent: consentCheckbox.checked ? 'yes' : 'no',
      timestamp: new Date().toISOString(),
      source: window.location.href,
      form_location: form.getAttribute('data-form-location') || 'unknown',
      _subject: 'New Plowshare Waitlist Signup'
    };

    // Set loading state
    setLoadingState(form, true);

    // Submit to form service if enabled, otherwise use local storage demo
    if (FORM_CONFIG.enabled) {
      submitToFormService(form, formData);
    } else {
      // Demo mode: simulate submission
      setTimeout(function() {
        setLoadingState(form, false);
        showSuccessMessage(form, formData.email);
        storeSubmission(formData);
      }, 1000);
    }
  }

  /**
   * Submit form data to external form service (Formspree, etc.)
   */
  function submitToFormService(form, formData) {
    fetch(FORM_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(function(response) {
      setLoadingState(form, false);

      if (response.ok) {
        // Handle success redirect if configured
        if (FORM_CONFIG.successRedirect) {
          window.location.href = FORM_CONFIG.successRedirect;
          return;
        }

        showSuccessMessage(form, formData.email);
        storeSubmission(formData);
      } else {
        // Parse error response
        return response.json().then(function(data) {
          throw new Error(data.error || 'Submission failed');
        });
      }
    })
    .catch(function(error) {
      setLoadingState(form, false);
      showErrorMessage(form, error.message || 'Something went wrong. Please try again.');
      console.error('Form submission error:', error);
    });
  }

  /**
   * Validate the entire form
   */
  function validateForm(form) {
    var isValid = true;

    // Validate email
    var emailInput = form.querySelector('input[type="email"]');
    if (!validateEmail(emailInput)) {
      isValid = false;
    }

    // Validate consent checkbox
    var consentCheckbox = form.querySelector('input[name="consent"]');
    if (!validateConsent(consentCheckbox)) {
      isValid = false;
    }

    return isValid;
  }

  /**
   * Validate email input
   */
  function validateEmail(input) {
    var value = input.value.trim();
    var errorId = input.getAttribute('aria-describedby');
    var errorElement = errorId ? document.getElementById(errorId) : null;

    // Check if empty
    if (!value) {
      showError(input, errorElement, 'Please enter your email address');
      return false;
    }

    // Check email format
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showError(input, errorElement, 'Please enter a valid email address');
      return false;
    }

    clearError(input);
    return true;
  }

  /**
   * Validate consent checkbox
   */
  function validateConsent(checkbox) {
    var errorId = checkbox.getAttribute('aria-describedby');
    var errorElement = errorId ? document.getElementById(errorId) : null;
    var label = checkbox.closest('.form-checkbox-label');

    if (!checkbox.checked) {
      if (label) {
        label.classList.add('is-invalid');
      }
      if (errorElement) {
        errorElement.textContent = 'You must agree to receive updates';
      }
      return false;
    }

    clearCheckboxError(checkbox);
    return true;
  }

  /**
   * Show error message for input
   */
  function showError(input, errorElement, message) {
    input.classList.add('is-invalid');
    if (errorElement) {
      errorElement.textContent = message;
    }
    input.setAttribute('aria-invalid', 'true');
  }

  /**
   * Clear error message for input
   */
  function clearError(input) {
    var errorId = input.getAttribute('aria-describedby');
    var errorElement = errorId ? document.getElementById(errorId) : null;

    input.classList.remove('is-invalid');
    if (errorElement) {
      errorElement.textContent = '';
    }
    input.removeAttribute('aria-invalid');
  }

  /**
   * Clear checkbox error
   */
  function clearCheckboxError(checkbox) {
    var errorId = checkbox.getAttribute('aria-describedby');
    var errorElement = errorId ? document.getElementById(errorId) : null;
    var label = checkbox.closest('.form-checkbox-label');

    if (label) {
      label.classList.remove('is-invalid');
    }
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  /**
   * Set loading state on form
   */
  function setLoadingState(form, isLoading) {
    var submitBtn = form.querySelector('button[type="submit"]');
    var inputs = form.querySelectorAll('input');

    if (isLoading) {
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
      inputs.forEach(function(input) {
        input.disabled = true;
      });
    } else {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-busy');
      inputs.forEach(function(input) {
        input.disabled = false;
      });
    }
  }

  /**
   * Show success message after submission
   */
  function showSuccessMessage(form, email) {
    form.innerHTML = '<div class="form-success" role="status" aria-live="polite">' +
      '<h3>You\'re on the list!</h3>' +
      '<p>We\'ll send updates to <strong>' + escapeHtml(email) + '</strong> when Plowshare launches in your area.</p>' +
      '</div>';
    form.classList.add('is-success');
  }

  /**
   * Show error message after failed submission
   */
  function showErrorMessage(form, message) {
    // Remove any existing error message
    var existingError = form.querySelector('.form-submit-error');
    if (existingError) {
      existingError.remove();
    }

    // Create and insert error message
    var errorDiv = document.createElement('div');
    errorDiv.className = 'form-submit-error';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.setAttribute('aria-live', 'assertive');
    errorDiv.innerHTML = '<p>' + escapeHtml(message) + '</p>';

    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.parentNode.insertBefore(errorDiv, submitBtn);
    } else {
      form.appendChild(errorDiv);
    }

    // Auto-remove error after 5 seconds
    setTimeout(function() {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }

  /**
   * Store submission in localStorage (for demo)
   */
  function storeSubmission(formData) {
    try {
      var submissions = JSON.parse(localStorage.getItem('plowshare_submissions') || '[]');
      submissions.push(formData);
      localStorage.setItem('plowshare_submissions', JSON.stringify(submissions));
    } catch (e) {
      // localStorage might not be available
      console.log('Could not store submission:', e);
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Initialize all functionality when DOM is ready
   */
  function init() {
    initNavigation();
    updateCopyrightYear();
    initSmoothScroll();
    initSignupForms();
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
