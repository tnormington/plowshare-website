/**
 * Reusable Header Navigation Component
 * Injects the site header navigation into pages that include this script.
 *
 * Usage: Add <script src="js/header-nav.js"></script> to your HTML
 * The script will automatically insert the navigation at the beginning of <body>
 */
(function() {
  'use strict';

  // Header navigation HTML template - matches index.html structure
  const headerNavHTML = `
  <!-- Skip to main content link for accessibility -->
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- Site Header -->
  <header class="site-header" role="banner">
    <nav class="nav-container" aria-label="Main navigation">
      <a href="./" class="logo" aria-label="Plowshare - Home">
        <span class="logo-text">Plowshare</span>
      </a>

      <button class="nav-toggle" aria-expanded="false" aria-controls="nav-menu" aria-label="Toggle navigation menu">
        <span class="nav-toggle-icon"></span>
      </button>

      <ul id="nav-menu" class="nav-menu" role="menubar">
        <li role="none"><a href="./#features" role="menuitem">Features</a></li>
        <li role="none"><a href="./#how-it-works" role="menuitem">How It Works</a></li>
        <li role="none"><a href="./#how-it-works-drivers" role="menuitem">For Drivers</a></li>
        <li role="none"><a href="./#pricing" role="menuitem">Pricing</a></li>
        <li role="none"><a href="./#faq" role="menuitem">FAQ</a></li>
        <li role="none"><a href="./#signup" role="menuitem" class="nav-cta">Join Waitlist</a></li>
      </ul>
    </nav>
  </header>`;

  // Insert navigation at the beginning of body when DOM is ready
  function insertNavigation() {
    document.body.insertAdjacentHTML('afterbegin', headerNavHTML);

    // Initialize mobile menu toggle functionality
    initMobileMenu();
  }

  // Mobile menu toggle functionality
  function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', function() {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('is-open');
      });
    }
  }

  // Execute when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertNavigation);
  } else {
    insertNavigation();
  }
})();
