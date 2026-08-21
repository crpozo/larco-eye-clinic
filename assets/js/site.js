/* ==========================================================================
   Larco Visión — Inicio
   Behaviour ported from the DCLogic class in _design/inicio.dc.html:
   header scroll state, dropdown menus, dark mode, reader text zoom,
   scroll reveals and the animated stat counters.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Site configuration
     `whatsapp` is the placeholder from the mockup — replace it with the
     clinic's real number and every WhatsApp link on the page follows.
     ------------------------------------------------------------------ */
  var CONFIG = {
    whatsapp: '593 99 999 9999',
    animations: true
  };

  var STORAGE_DARK = 'lv-dark';
  var STORAGE_ZOOM = 'lv-zoom';
  var ZOOM_STEPS = [1, 1.12, 1.25];
  var ZOOM_LABELS = ['A', 'A+', 'A++'];
  var SCROLL_THRESHOLD = 40;
  var MOBILE_NAV_QUERY = '(max-width: 1024px)';

  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* private mode */ }
  }

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  /* ------------------------------------------------------------------
     WhatsApp links
     ------------------------------------------------------------------ */

  function applyWhatsApp() {
    var href = 'https://wa.me/' + String(CONFIG.whatsapp).replace(/[^0-9]/g, '');
    var links = document.querySelectorAll('[data-whatsapp]');
    for (var i = 0; i < links.length; i++) links[i].setAttribute('href', href);
  }

  /* ------------------------------------------------------------------
     Header: solid once the page leaves the hero, and while the mobile
     menu is open.
     ------------------------------------------------------------------ */

  var header = document.querySelector('.site-header');
  var navOpen = false;

  function syncHeader() {
    var solid = window.scrollY > SCROLL_THRESHOLD || navOpen;
    body.classList.toggle('is-solid', solid);
  }

  function measureHeader() {
    if (!header) return;
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }

  /* ------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------ */

  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');

  function setNav(open) {
    navOpen = open;
    body.classList.toggle('nav-open', open);
    if (navToggle) navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    syncHeader();
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      measureHeader();
      setNav(!navOpen);
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setNav(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navOpen) {
        setNav(false);
        navToggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      measureHeader();
      if (navOpen && !window.matchMedia(MOBILE_NAV_QUERY).matches) setNav(false);
    });
  }

  /* ------------------------------------------------------------------
     Dropdown menus
     Hover and keyboard focus are handled in CSS. Touch devices get an
     explicit tap-to-open on the parent link.
     ------------------------------------------------------------------ */

  function wireMenus() {
    if (!window.matchMedia('(hover: none)').matches) return;

    var menus = document.querySelectorAll('.menu');
    for (var i = 0; i < menus.length; i++) {
      (function (menu) {
        var trigger = menu.querySelector('.nav__link');
        if (!trigger) return;
        trigger.addEventListener('click', function (event) {
          if (window.matchMedia(MOBILE_NAV_QUERY).matches) return; // panel is inline
          if (!menu.classList.contains('is-open')) {
            event.preventDefault();
            menu.classList.add('is-open');
          }
        });
      })(menus[i]);
    }
  }

  /* ------------------------------------------------------------------
     Dark mode
     ------------------------------------------------------------------ */

  var darkToggle = document.querySelector('[data-toggle-dark]');
  var isDark = false;

  function applyDark(next) {
    isDark = next;
    body.classList.toggle('lv-dark', next);
    if (darkToggle) {
      darkToggle.setAttribute('aria-pressed', next ? 'true' : 'false');
      var sun = darkToggle.querySelector('[data-icon="sun"]');
      var moon = darkToggle.querySelector('[data-icon="moon"]');
      if (sun) sun.hidden = !next;
      if (moon) moon.hidden = next;
    }
    store(STORAGE_DARK, next ? '1' : '0');
  }

  /* ------------------------------------------------------------------
     Reader text zoom — 100% / 112% / 125%
     ------------------------------------------------------------------ */

  var zoomToggle = document.querySelector('[data-cycle-zoom]');
  var zoomIndex = 0;

  function applyZoom(next) {
    zoomIndex = ((next % ZOOM_STEPS.length) + ZOOM_STEPS.length) % ZOOM_STEPS.length;

    // Writing `zoom` reflows the document and drops the scroll position, which
    // would undo an incoming #anchor. Only write it when the value changes,
    // and restore the offset if the browser moved us.
    var zoom = ZOOM_STEPS[zoomIndex] === 1 ? '' : String(ZOOM_STEPS[zoomIndex]);
    if (body.style.zoom !== zoom) {
      var y = window.scrollY;
      body.style.zoom = zoom;
      if (window.scrollY !== y) window.scrollTo(0, y);
    }

    if (zoomToggle) {
      zoomToggle.textContent = ZOOM_LABELS[zoomIndex];
      zoomToggle.setAttribute(
        'aria-label',
        'Tamaño de texto: ' + Math.round(ZOOM_STEPS[zoomIndex] * 100) + '%. Cambiar.'
      );
    }
    store(STORAGE_ZOOM, String(zoomIndex));
    measureHeader();
  }

  /* ------------------------------------------------------------------
     Scroll reveals
     ------------------------------------------------------------------ */

  /* An IntersectionObserver alone misses anything the viewport jumps past —
     an incoming #anchor, a restored scroll position — because the ratio never
     changes. Sweep the remaining elements geometrically on every scroll. */
  function sweepReveals() {
    var pending = document.querySelectorAll('[data-rev].is-pending');
    for (var i = 0; i < pending.length; i++) {
      if (pending[i].getBoundingClientRect().top < window.innerHeight * .92) {
        pending[i].classList.remove('is-pending');
      }
    }
  }

  function wireReveals() {
    var items = document.querySelectorAll('[data-rev]');
    if (!CONFIG.animations || reduceMotion || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          entry.target.classList.remove('is-pending');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });

    for (var i = 0; i < items.length; i++) {
      if (items[i].getBoundingClientRect().top > window.innerHeight * .92) {
        items[i].classList.add('is-pending');
        observer.observe(items[i]);
      }
    }
  }

  /* ------------------------------------------------------------------
     Stat counters — 1400ms cubic ease-out, starting when scrolled into view
     ------------------------------------------------------------------ */

  function wireCounters() {
    var counters = document.querySelectorAll('[data-count-to]');

    for (var i = 0; i < counters.length; i++) {
      (function (el) {
        var target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
        var started = false;

        function run() {
          if (started) return;
          started = true;

          if (!CONFIG.animations || reduceMotion) {
            el.textContent = String(target);
            return;
          }

          var t0 = performance.now();
          (function step(now) {
            var k = Math.min(1, (now - t0) / 1400);
            el.textContent = String(Math.round(target * (1 - Math.pow(1 - k, 3))));
            if (k < 1) requestAnimationFrame(step);
          })(t0);
        }

        function inView() {
          var r = el.getBoundingClientRect();
          return r.top < window.innerHeight && r.bottom > 0;
        }

        el.textContent = '0';

        if (inView()) { run(); return; }

        if ('IntersectionObserver' in window) {
          var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
              run();
              observer.disconnect();
            }
          }, { threshold: .4 });
          observer.observe(el);
        } else {
          el.textContent = String(target);
        }
      })(counters[i]);
    }
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */

  body.classList.add('js');

  applyWhatsApp();
  applyDark(read(STORAGE_DARK) === '1');
  applyZoom(parseInt(read(STORAGE_ZOOM) || '0', 10) || 0);

  if (darkToggle) {
    darkToggle.addEventListener('click', function () { applyDark(!isDark); });
  }

  if (zoomToggle) {
    zoomToggle.addEventListener('click', function () { applyZoom(zoomIndex + 1); });
  }

  window.addEventListener('scroll', function () {
    syncHeader();
    sweepReveals();
  }, { passive: true });

  window.addEventListener('load', sweepReveals);

  syncHeader();
  measureHeader();
  wireMenus();
  wireReveals();
  wireCounters();
  sweepReveals();
})();
