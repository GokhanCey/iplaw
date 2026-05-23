/**
 * IP Law: US vs EU
 * Panel switching + Donation popup
 */

(function () {
  'use strict';

  /* -------------------------------------------------------
     Panel Switch
  ------------------------------------------------------- */
  const panels = {
    us: {
      panel: document.getElementById('panel-us'),
      btn:   document.getElementById('btn-us'),
    },
    eu: {
      panel: document.getElementById('panel-eu'),
      btn:   document.getElementById('btn-eu'),
    },
  };

  let current = 'us';

  function switchPanel(id) {
    if (id === current) return;

    const prev = panels[current];
    const next = panels[id];

    prev.btn.classList.remove('active');
    prev.btn.setAttribute('aria-selected', 'false');
    prev.panel.classList.remove('active');
    prev.panel.setAttribute('hidden', '');

    next.panel.removeAttribute('hidden');
    void next.panel.offsetWidth; // force reflow for animation
    next.panel.classList.add('active');
    next.btn.classList.add('active');
    next.btn.setAttribute('aria-selected', 'true');

    document.body.classList.toggle('eu-active', id === 'eu');
    current = id;
  }

  // Expose for inline onclick in HTML
  window.switchPanel = switchPanel;

  // Keyboard navigation (Left / Right arrows on the toggle group)
  document.querySelector('.toggle-wrapper').addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = current === 'us' ? 'eu' : 'us';
      switchPanel(next);
      panels[next].btn.focus();
    }
  });

  /* -------------------------------------------------------
     Donation Popup
  ------------------------------------------------------- */

  // Build popup markup and inject into body
  const overlayEl = document.createElement('div');
  overlayEl.className = 'popup-overlay';
  overlayEl.id = 'donate-popup';
  overlayEl.setAttribute('role', 'dialog');
  overlayEl.setAttribute('aria-modal', 'true');
  overlayEl.setAttribute('aria-labelledby', 'popup-title');

  overlayEl.innerHTML = `
    <div class="popup-box" id="popup-box">
      <button class="popup-close" id="popup-close-x" aria-label="Close popup">&#x2715;</button>
      <span class="popup-emoji" aria-hidden="true">&#128079;</span>
      <h2 class="popup-title" id="popup-title">Wanna donate?</h2>
      <p class="popup-subtitle">This website runs purely on claps and good intentions.</p>
      <div class="popup-equation">1 Applause = 1 Donate</div>
      <p class="popup-subtitle">Save your applause for the end of the presentation. But we need your commitment now.</p>
      <div class="popup-btn-row">
        <button class="popup-btn popup-btn-donate" id="popup-clap-btn">
          &#128079; I promise to clap
        </button>
        <button class="popup-btn popup-btn-close" id="popup-decline-btn">
          Never ever
        </button>
      </div>
      <p class="popup-disclaimer">* No actual transaction involved. Side effects may include involuntary applause.</p>
    </div>
  `;

  document.body.appendChild(overlayEl);

  function openPopup() {
    overlayEl.classList.add('visible');
    document.getElementById('popup-close-x').focus();
  }

  function closePopup() {
    overlayEl.classList.remove('visible');
  }

  function handleClap() {
    const btn = document.getElementById('popup-clap-btn');
    btn.textContent = '&#128079; Thank you!!';
    btn.innerHTML = '&#128079; Received! Thank you!!';
    btn.style.background = '#2d7a3a';
    btn.style.borderColor = '#2d7a3a';
    setTimeout(closePopup, 1400);
  }

  // Event listeners
  document.getElementById('popup-close-x').addEventListener('click', closePopup);
  document.getElementById('popup-decline-btn').addEventListener('click', closePopup);
  document.getElementById('popup-clap-btn').addEventListener('click', handleClap);

  // Click outside popup box to close
  overlayEl.addEventListener('click', function (e) {
    if (e.target === overlayEl) closePopup();
  });

  // Escape key closes popup
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePopup();
  });

  // Show popup when scrolling to the footer (end of the presentation)
  let popupShown = false;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !popupShown) {
        popupShown = true;
        // Small delay to make it feel natural
        setTimeout(openPopup, 500);
      }
    });
  }, {
    root: null,
    threshold: 0.1 // Trigger when 10% of the footer is visible
  });

  const footer = document.querySelector('.site-footer');
  if (footer) {
    observer.observe(footer);
  }

})();
