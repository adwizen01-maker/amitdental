/**
 * Amit Dental Clinic - Analytics & Conversion Tracking
 * Tracks high-intent interactions: Call clicks, WhatsApp triggers, Directions, and Form Submissions.
 */

(function () {
  'use strict';

  function trackEvent(category, action, label, value) {
    // Dispatch standard custom DOM event for any analytics provider (GTM, GA4, Meta Pixel)
    const event = new CustomEvent('clinic_conversion', {
      detail: { category, action, label, value, timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(event);

    // If Google Analytics (gtag) is present
    if (typeof window.gtag === 'function') {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }

    // If Google Tag Manager dataLayer is present
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'clinic_interaction',
        eventCategory: category,
        eventAction: action,
        eventLabel: label
      });
    }

    // Console logging in dev mode
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log(`[Analytics Event] ${category} -> ${action} (${label || 'n/a'})`);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Track Phone Link Clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.addEventListener('click', () => {
        const phone = link.getAttribute('href').replace('tel:', '');
        const placement = link.dataset.trackingPlacement || link.closest('header, footer, nav, section')?.tagName || 'page';
        trackEvent('Contact', 'Phone Call Click', `Placement: ${placement} - ${phone}`);
      });
    });

    // Track WhatsApp Link Clicks
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(link => {
      link.addEventListener('click', () => {
        const placement = link.dataset.trackingPlacement || link.closest('header, footer, nav, section')?.tagName || 'page';
        trackEvent('Contact', 'WhatsApp Click', `Placement: ${placement}`);
      });
    });

    // Track Google Maps / Directions Clicks
    document.querySelectorAll('a[href*="maps.google"], a[href*="google.com/maps"]').forEach(link => {
      link.addEventListener('click', () => {
        trackEvent('Navigation', 'Get Directions Click', 'Google Maps Link');
      });
    });

    // Track Appointment CTA button clicks
    document.querySelectorAll('[data-action="book-appointment"], a[href="#appointment"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const source = btn.dataset.ctaSource || 'General CTA';
        trackEvent('Engagement', 'Book Appointment CTA Click', source);
      });
    });
  });

  window.ClinicAnalytics = {
    trackEvent: trackEvent
  };
})();
