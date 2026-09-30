/* =================================================================
   Pervez Ali · small enhancements
   -----------------------------------------------------------------
   The page is fully readable without this file. It adds:
     1. a Menu button that folds the navigation on small screens
     2. "Copy" buttons for BibTeX entries and the email address
     3. the "Download CV" button, shown only when the CV file exists
   You should not need to edit this file.
   ================================================================= */
(function () {
  'use strict';

  /* ---------- 1. Navigation menu on small screens ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    document.documentElement.classList.add('js-nav');

    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.classList.toggle('is-open', open);
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close the menu after a link is chosen
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) { setOpen(false); }
    });

    // Close with the Escape key and return focus to the button
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    // Reset when the window becomes wide enough to show all links
    var wide = window.matchMedia('(min-width: 48rem)');
    var onWidthChange = function () { if (wide.matches) { setOpen(false); } };
    if (wide.addEventListener) { wide.addEventListener('change', onWidthChange); }
    else if (wide.addListener) { wide.addListener(onWidthChange); }
  }

  /* ---------- 2. Copy buttons ---------- */
  var statusRegion = document.getElementById('copy-status');

  var announce = function (message) {
    if (!statusRegion) { return; }
    statusRegion.textContent = '';
    window.setTimeout(function () { statusRegion.textContent = message; }, 60);
  };

  var copyText = function (text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.top = '-1000px';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (error) { ok = false; }
      document.body.removeChild(area);
      if (ok) { resolve(); } else { reject(new Error('Copy failed')); }
    });
  };

  var selectContents = function (element) {
    var range = document.createRange();
    range.selectNodeContents(element);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (button) {
    var target = document.getElementById(button.getAttribute('data-copy'));
    if (!target) { return; }
    var label = button.textContent;
    var name = button.getAttribute('data-copy-name') || 'Text';
    var timer = null;

    button.hidden = false;
    button.addEventListener('click', function () {
      var restore = function () {
        window.clearTimeout(timer);
        timer = window.setTimeout(function () { button.textContent = label; }, 2500);
      };
      copyText(target.textContent.trim()).then(function () {
        button.textContent = 'Copied';
        announce(name + ' copied to the clipboard.');
        restore();
      }, function () {
        selectContents(target);
        button.textContent = 'Selected: press Ctrl+C';
        announce(name + ' is selected. Press Control+C, or Command+C on a Mac, to copy it.');
        restore();
      });
    });
  });

  /* ---------- 3. Download CV button ---------- */
  var cvBlock = document.querySelector('[data-cv]');
  var cvFallback = document.querySelector('[data-cv-fallback]');
  var cvLink = cvBlock ? cvBlock.querySelector('a[href]') : null;

  var showCv = function () {
    cvBlock.hidden = false;
    if (cvFallback) { cvFallback.hidden = true; }
  };

  if (cvLink) {
    if (window.location.protocol === 'file:') {
      // Opened by double-clicking index.html: browsers cannot check for the
      // file here, so the button is shown to let you see where it will go.
      showCv();
    } else if (window.fetch) {
      fetch(cvLink.getAttribute('href'), { method: 'HEAD', cache: 'no-store' })
        .then(function (response) {
          var type = (response.headers.get('content-type') || '').toLowerCase();
          if (response.ok && type.indexOf('text/html') === -1) { showCv(); }
        })
        .catch(function () { /* keep the "available on request" message */ });
    }
  }
})();
