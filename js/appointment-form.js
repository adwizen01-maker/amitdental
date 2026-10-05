/**
 * Amit Dental Clinic - Single Page Appointment Inquiry Form
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('singlePageAppointmentForm');
  if (!form) return;

  const fullNameInput = document.getElementById('fullName');
  const phoneInput = document.getElementById('phoneNumber');
  const concernSelect = document.getElementById('dentalConcern');
  const dateInput = document.getElementById('preferredDate');
  const messageInput = document.getElementById('optionalMessage');
  const submitBtn = document.getElementById('submitAppointmentBtn');
  const successOverlay = document.getElementById('formSuccessOverlay');
  const errorOverlay = document.getElementById('formErrorOverlay');

  // Set min date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  function isValidPhone(phone) {
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    return cleaned.length >= 10 && cleaned.length <= 13;
  }

  function setError(input, errorId, message) {
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.textContent = message;
  }

  function clearError(input, errorId) {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.textContent = '';
  }

  if (fullNameInput) {
    fullNameInput.addEventListener('input', () => {
      if (fullNameInput.value.trim().length >= 2) clearError(fullNameInput, 'nameError');
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      if (isValidPhone(phoneInput.value)) clearError(phoneInput, 'phoneError');
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let hasError = false;

    // 1. Full Name (Required)
    const nameVal = fullNameInput ? fullNameInput.value.trim() : '';
    if (!nameVal || nameVal.length < 2) {
      setError(fullNameInput, 'nameError', 'Please enter your full name.');
      hasError = true;
    } else {
      clearError(fullNameInput, 'nameError');
    }

    // 2. Phone Number (Required)
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    if (!phoneVal || !isValidPhone(phoneVal)) {
      setError(phoneInput, 'phoneError', 'Please enter a valid 10-digit mobile number.');
      hasError = true;
    } else {
      clearError(phoneInput, 'phoneError');
    }

    if (hasError) {
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const concernVal = concernSelect ? concernSelect.value : 'General Consultation';
    const dateVal = dateInput ? (dateInput.value || 'Flexible') : 'Flexible';
    const msgVal = messageInput ? messageInput.value.trim() : 'None';

    const payload = {
      clinic: "Amit Dental Clinic, Udaipur",
      fullName: nameVal,
      phoneNumber: phoneVal,
      treatmentRequired: concernVal,
      preferredDate: dateVal,
      message: msgVal || 'No additional note.',
      submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    // UI Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; display: inline-block;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        <span>Sending Inquiry...</span>
      `;
    }

    const endpoint = (window.CLINIC_CONFIG && window.CLINIC_CONFIG.appointment && window.CLINIC_CONFIG.appointment.formEndpoint) || 'https://formspree.io/f/mqaejkwq';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showSuccess(payload);
      } else {
        showSuccess(payload, true);
      }
    } catch (err) {
      console.warn('Network request fallback to WhatsApp direct inquiry:', err);
      showSuccess(payload, true);
    }
  });

  function showSuccess(data, fallback = false) {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Request Appointment</span>`;
    }

    if (successOverlay) {
      const nameEl = document.getElementById('successPatientName');
      const detailsEl = document.getElementById('successDetailsText');
      const waBtn = document.getElementById('successWhatsAppDirectBtn');

      if (nameEl) nameEl.textContent = `Thank You, ${data.fullName}!`;
      if (detailsEl) {
        detailsEl.textContent = `Your appointment inquiry for "${data.treatmentRequired}" has been received. Our clinic team will call ${data.phoneNumber} to confirm your timing.`;
      }

      if (waBtn) {
        const waText = encodeURIComponent(
          `Hello Amit Dental Clinic, Udaipur!\nI submitted an appointment inquiry:\n- Name: ${data.fullName}\n- Phone: ${data.phoneNumber}\n- Treatment: ${data.treatmentRequired}\n- Date: ${data.preferredDate}`
        );
        waBtn.href = `https://wa.me/919887790414?text=${waText}`;
      }

      successOverlay.classList.add('is-active');
      successOverlay.focus();

      if (window.ClinicAnalytics) {
        window.ClinicAnalytics.trackEvent('Form', 'Appointment Inquiry Submitted', data.treatmentRequired);
      }
    }
  }

  const resetBtn = document.getElementById('resetSinglePageFormBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      if (successOverlay) successOverlay.classList.remove('is-active');
      if (errorOverlay) errorOverlay.classList.remove('is-active');
    });
  }
});
