/**
 * Reusable Header Navigation Component
 * Injects the site header navigation into pages that include this script.
 *
 * Usage: Add <script src="js/header-nav.js"></script> to your HTML
 * The script will automatically insert the navigation at the beginning of <body>
 */
(function() {
  'use strict';

  // Header navigation HTML template
  const headerNavHTML = `
  <nav class="navbar">
    <div class="container navbar-container">
      <a href="./" class="logo" aria-label="Plowshare - Home">
        <span class="logo-text">Plowshare</span>
      </a>
      <div class="nav-links">
        <a href="./#features">Features</a>
        <a href="./#how-it-works">How It Works</a>
        <a href="./#pricing">Pricing</a>
        <a href="./#faq">FAQ</a>
        <a href="./#signup" class="btn btn-primary">Get Started</a>
      </div>
    </div>
  </nav>`;

  // Insert navigation at the beginning of body when DOM is ready
  function insertNavigation() {
    document.body.insertAdjacentHTML('afterbegin', headerNavHTML);
  }

  // Execute when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertNavigation);
  } else {
    insertNavigation();
  }
})();
