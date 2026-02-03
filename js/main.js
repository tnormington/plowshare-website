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
    var navToggle = document.querySelector('.nav-toggle');
    var navMenu = document.querySelector('.nav-menu');
    var header = document.querySelector('.site-header');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', function() {
      var isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-open');

      // Prevent body scroll when menu is open
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    // Close menu when clicking on a link
    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (navMenu.classList.contains('is-open') &&
          !navMenu.contains(e.target) &&
          !navToggle.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });

    // Add scroll effect to header
    if (header) {
      var scrollThreshold = 10;
      var ticking = false;

      function updateHeader() {
        if (window.scrollY > scrollThreshold) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
        ticking = false;
      }

      window.addEventListener('scroll', function() {
        if (!ticking) {
          window.requestAnimationFrame(updateHeader);
          ticking = true;
        }
      }, { passive: true });

      // Initial check
      updateHeader();
    }
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

      // Real-time validation for email input
      var emailInput = form.querySelector('input[type="email"]');
      if (emailInput) {
        // Validate on blur
        emailInput.addEventListener('blur', function() {
          if (emailInput.value.trim()) {
            validateEmail(emailInput);
          }
        });

        // Real-time validation while typing (with debounce)
        var inputTimeout;
        emailInput.addEventListener('input', function() {
          clearTimeout(inputTimeout);
          var value = emailInput.value.trim();

          // Clear errors immediately when starting to type
          if (!value) {
            clearError(emailInput);
            return;
          }

          // Show validation feedback after user pauses typing
          inputTimeout = setTimeout(function() {
            validateEmailRealtime(emailInput);
          }, 300);
        });

        // Show valid state when user finishes valid input
        emailInput.addEventListener('change', function() {
          if (emailInput.value.trim()) {
            validateEmail(emailInput);
          }
        });
      }

      // Clear checkbox error on change and validate
      var consentCheckbox = form.querySelector('input[name="consent"]');
      if (consentCheckbox) {
        consentCheckbox.addEventListener('change', function() {
          if (consentCheckbox.checked) {
            clearCheckboxError(consentCheckbox);
            markCheckboxValid(consentCheckbox);
          } else {
            clearCheckboxValid(consentCheckbox);
          }
        });
      }
    });
  }

  /**
   * Real-time email validation (shows valid/invalid state while typing)
   */
  function validateEmailRealtime(input) {
    var value = input.value.trim();
    var errorId = input.getAttribute('aria-describedby');
    var errorElement = errorId ? document.getElementById(errorId) : null;

    if (!value) {
      clearError(input);
      return;
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      clearError(input);
      markInputValid(input);
    } else if (value.includes('@') && value.indexOf('@') < value.length - 1) {
      // Show hint when user has typed '@' but email is incomplete
      clearError(input);
      clearInputValid(input);
    } else {
      clearInputValid(input);
    }
  }

  /**
   * Mark input as valid (visual feedback)
   */
  function markInputValid(input) {
    input.classList.add('is-valid');
  }

  /**
   * Clear valid state from input
   */
  function clearInputValid(input) {
    input.classList.remove('is-valid');
  }

  /**
   * Mark checkbox as valid
   */
  function markCheckboxValid(checkbox) {
    var label = checkbox.closest('.form-checkbox-label');
    if (label) {
      label.classList.add('is-valid');
    }
  }

  /**
   * Clear valid state from checkbox
   */
  function clearCheckboxValid(checkbox) {
    var label = checkbox.closest('.form-checkbox-label');
    if (label) {
      label.classList.remove('is-valid');
    }
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
    markInputValid(input);
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
    input.classList.remove('is-valid');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('is-visible');
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
      errorElement.classList.remove('is-visible');
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
   * App Mockups Carousel
   */
  function initCarousel() {
    var carousel = document.querySelector('.app-carousel');
    if (!carousel) return;

    var track = carousel.querySelector('.carousel-track');
    var slides = carousel.querySelectorAll('.carousel-slide');
    var prevBtn = carousel.querySelector('.carousel-nav-prev');
    var nextBtn = carousel.querySelector('.carousel-nav-next');
    var indicators = carousel.querySelectorAll('.carousel-indicator');

    if (slides.length === 0) return;

    var currentIndex = 0;
    var slidesPerView = 1;
    var totalSlides = slides.length;
    var isDragging = false;
    var startX = 0;
    var currentTranslate = 0;
    var prevTranslate = 0;

    // Calculate slides per view based on viewport
    function updateSlidesPerView() {
      var width = window.innerWidth;
      if (width >= 1024) {
        slidesPerView = 4; // All slides visible on desktop
      } else if (width >= 768) {
        slidesPerView = 2;
      } else if (width >= 480) {
        slidesPerView = 2;
      } else {
        slidesPerView = 1;
      }
    }

    // Get slide width including gap
    function getSlideWidth() {
      if (slides.length === 0) return 0;
      var slideRect = slides[0].getBoundingClientRect();
      var gap = parseInt(getComputedStyle(track).gap) || 24;
      return slideRect.width + gap;
    }

    // Update carousel position
    function updateCarousel(animate) {
      if (animate === undefined) animate = true;

      var slideWidth = getSlideWidth();
      var maxIndex = Math.max(0, totalSlides - slidesPerView);
      currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

      var translateX = -currentIndex * slideWidth;
      currentTranslate = translateX;
      prevTranslate = translateX;

      if (animate) {
        track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      } else {
        track.style.transition = 'none';
      }
      track.style.transform = 'translateX(' + translateX + 'px)';

      updateButtons();
      updateIndicators();
    }

    // Update navigation button states
    function updateButtons() {
      var maxIndex = Math.max(0, totalSlides - slidesPerView);

      if (prevBtn) {
        prevBtn.disabled = currentIndex === 0;
      }
      if (nextBtn) {
        nextBtn.disabled = currentIndex >= maxIndex;
      }
    }

    // Update indicator states
    function updateIndicators() {
      indicators.forEach(function(indicator, index) {
        if (index === currentIndex) {
          indicator.classList.add('is-active');
          indicator.setAttribute('aria-selected', 'true');
        } else {
          indicator.classList.remove('is-active');
          indicator.setAttribute('aria-selected', 'false');
        }
      });
    }

    // Navigate to specific slide
    function goToSlide(index) {
      var maxIndex = Math.max(0, totalSlides - slidesPerView);
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      updateCarousel();
    }

    // Navigate to previous slide
    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    }

    // Navigate to next slide
    function nextSlide() {
      var maxIndex = Math.max(0, totalSlides - slidesPerView);
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    }

    // Touch/Mouse events for swipe support
    function getPositionX(e) {
      return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    function touchStart(e) {
      isDragging = true;
      startX = getPositionX(e);
      track.classList.add('is-dragging');
    }

    function touchMove(e) {
      if (!isDragging) return;

      var currentX = getPositionX(e);
      var diff = currentX - startX;
      currentTranslate = prevTranslate + diff;
      track.style.transform = 'translateX(' + currentTranslate + 'px)';
    }

    function touchEnd() {
      if (!isDragging) return;

      isDragging = false;
      track.classList.remove('is-dragging');

      var diff = currentTranslate - prevTranslate;
      var threshold = getSlideWidth() * 0.2;

      if (diff < -threshold) {
        nextSlide();
      } else if (diff > threshold) {
        prevSlide();
      } else {
        updateCarousel();
      }
    }

    // Event listeners
    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }

    indicators.forEach(function(indicator, index) {
      indicator.addEventListener('click', function() {
        goToSlide(index);
      });
    });

    // Touch events
    track.addEventListener('touchstart', touchStart, { passive: true });
    track.addEventListener('touchmove', touchMove, { passive: true });
    track.addEventListener('touchend', touchEnd);

    // Mouse events for desktop drag
    track.addEventListener('mousedown', touchStart);
    track.addEventListener('mousemove', touchMove);
    track.addEventListener('mouseup', touchEnd);
    track.addEventListener('mouseleave', function() {
      if (isDragging) {
        touchEnd();
      }
    });

    // Prevent link dragging
    track.addEventListener('dragstart', function(e) {
      e.preventDefault();
    });

    // Keyboard navigation
    carousel.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    });

    // Handle resize
    var resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        updateSlidesPerView();
        updateCarousel(false);
      }, 100);
    });

    // Initialize
    updateSlidesPerView();
    updateCarousel(false);
  }

  /**
   * FAQ Accordion
   * Handles expand/collapse functionality with accessibility support
   */
  function initFaqAccordion() {
    var accordion = document.querySelector('.faq-accordion');
    if (!accordion) return;

    var faqItems = accordion.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
      var questionBtn = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');

      if (!questionBtn || !answer) return;

      questionBtn.addEventListener('click', function() {
        var isExpanded = questionBtn.getAttribute('aria-expanded') === 'true';

        // Toggle current item
        toggleFaqItem(item, questionBtn, answer, !isExpanded);
      });

      // Keyboard navigation support
      questionBtn.addEventListener('keydown', function(e) {
        var allQuestions = accordion.querySelectorAll('.faq-question');
        var currentIndex = Array.from(allQuestions).indexOf(questionBtn);

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            if (currentIndex < allQuestions.length - 1) {
              allQuestions[currentIndex + 1].focus();
            }
            break;
          case 'ArrowUp':
            e.preventDefault();
            if (currentIndex > 0) {
              allQuestions[currentIndex - 1].focus();
            }
            break;
          case 'Home':
            e.preventDefault();
            allQuestions[0].focus();
            break;
          case 'End':
            e.preventDefault();
            allQuestions[allQuestions.length - 1].focus();
            break;
        }
      });
    });
  }

  /**
   * Toggle FAQ item open/closed state
   */
  function toggleFaqItem(item, button, answer, shouldOpen) {
    if (shouldOpen) {
      // Open the item
      button.setAttribute('aria-expanded', 'true');
      answer.removeAttribute('hidden');
      item.classList.add('is-open');

      // Animate max-height for smooth opening
      answer.style.maxHeight = answer.scrollHeight + 'px';
    } else {
      // Close the item
      button.setAttribute('aria-expanded', 'false');
      item.classList.remove('is-open');
      answer.style.maxHeight = '0';

      // Set hidden attribute after animation completes
      setTimeout(function() {
        if (button.getAttribute('aria-expanded') === 'false') {
          answer.setAttribute('hidden', '');
        }
      }, 300);
    }
  }

  /**
   * Initialize all functionality when DOM is ready
   */
  function init() {
    initNavigation();
    updateCopyrightYear();
    initSmoothScroll();
    initSignupForms();
    initCarousel();
    initFaqAccordion();
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
