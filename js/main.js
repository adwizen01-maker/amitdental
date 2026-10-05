/**
 * Amit Dental Clinic - Interactive Single Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileToggle && mainNav) {
    const toggleMenu = (open) => {
      const shouldOpen = open !== undefined ? open : !mainNav.classList.contains('is-open');
      mobileToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      mobileToggle.classList.toggle('is-active', shouldOpen);
      mainNav.classList.toggle('is-open', shouldOpen);
      document.body.style.overflow = shouldOpen ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking any nav link
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close menu on click outside
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('is-open') && !mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        toggleMenu(false);
      }
    });
  }

  // 2. Smooth Scrolling to Sections
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // 3. Treatment Pre-Selection in Appointment Form
  document.querySelectorAll('[data-treatment-select]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const treatmentName = this.getAttribute('data-treatment-select');
      const dropdown = document.getElementById('dentalConcern');
      if (dropdown && treatmentName) {
        for (let i = 0; i < dropdown.options.length; i++) {
          if (dropdown.options[i].value.toLowerCase().includes(treatmentName.toLowerCase()) || 
              treatmentName.toLowerCase().includes(dropdown.options[i].value.toLowerCase())) {
            dropdown.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  // 4. Gallery Lightbox Viewer
  const galleryItems = document.querySelectorAll('[data-lightbox-src]');
  const lightboxModal = document.getElementById('clinicLightboxModal');
  const lightboxImg = document.getElementById('lightboxMainImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxCloseBtn');

  if (galleryItems.length && lightboxModal && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const src = item.getAttribute('data-lightbox-src');
        const caption = item.getAttribute('data-lightbox-caption') || '';
        lightboxImg.src = src;
        lightboxImg.alt = caption;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightboxModal.classList.add('is-active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('is-active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lightboxImg) lightboxImg.src = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('is-active')) {
        closeLightbox();
      }
    });
  }

  // 5. FAQ Accordion
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.accordion-item');
      const panel = item.querySelector('.accordion-panel');
      const isCurrentlyOpen = item.classList.contains('is-open');

      // Close other items
      const parentAccordion = button.closest('.accordion');
      if (parentAccordion) {
        parentAccordion.querySelectorAll('.accordion-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('is-open');
            const otherBtn = otherItem.querySelector('.accordion-header');
            const otherPanel = otherItem.querySelector('.accordion-panel');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherPanel) {
              otherPanel.style.maxHeight = null;
              otherPanel.setAttribute('hidden', '');
            }
          }
        });
      }

      // Toggle current
      if (isCurrentlyOpen) {
        item.classList.remove('is-open');
        button.setAttribute('aria-expanded', 'false');
        if (panel) {
          panel.style.maxHeight = null;
          panel.setAttribute('hidden', '');
        }
      } else {
        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
        if (panel) {
          panel.removeAttribute('hidden');
          panel.style.maxHeight = panel.scrollHeight + 30 + 'px';
        }
      }
    });
  });

  // Open first FAQ by default
  const firstFaq = document.querySelector('.accordion-item');
  if (firstFaq) {
    const firstHeader = firstFaq.querySelector('.accordion-header');
    const firstPanel = firstFaq.querySelector('.accordion-panel');
    if (firstHeader && firstPanel) {
      firstFaq.classList.add('is-open');
      firstHeader.setAttribute('aria-expanded', 'true');
      firstPanel.removeAttribute('hidden');
      firstPanel.style.maxHeight = firstPanel.scrollHeight + 30 + 'px';
    }
  }

  // 6. Subtle Scroll Reveal
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('is-visible'));
  }
});
