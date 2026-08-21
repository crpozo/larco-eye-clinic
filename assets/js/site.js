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
    // Leave empty until the clinic's real number is known. While it is empty
    // every WhatsApp link keeps its HTML fallback (the contact page) rather
    // than dialling a number that belongs to somebody else.
    whatsapp: '',
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

  /* `hidden` is an HTMLElement IDL attribute: assigning el.hidden on an <svg>
     sets a plain JS property that never reaches the content attribute, so
     `svg[hidden]` in CSS keeps missing it. Drive the attribute directly. */
  function setHidden(el, hidden) {
    if (!el) return;
    if (hidden) el.setAttribute('hidden', '');
    else el.removeAttribute('hidden');
  }

  /* ------------------------------------------------------------------
     WhatsApp links
     ------------------------------------------------------------------ */

  function applyWhatsApp() {
    var digits = String(CONFIG.whatsapp || '').replace(/[^0-9]/g, '');
    if (digits.length < 8) return; // not configured — keep the HTML fallback

    var href = 'https://wa.me/' + digits;
    var links = document.querySelectorAll('[data-whatsapp]');
    for (var i = 0; i < links.length; i++) {
      links[i].setAttribute('href', href);
      links[i].setAttribute('target', '_blank');
    }
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

  var outsideNav = [document.querySelector('main'), document.querySelector('.site-footer')];

  /* The two sections with children collapse behind their own disclosure
     button, so the sheet opens as five rows instead of forty links. */
  function setSection(menu, open) {
    menu.classList.toggle('is-expanded', open);
    var toggle = menu.querySelector('.menu__toggle');
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function collapseSections() {
    var menus = document.querySelectorAll('.menu.is-expanded');
    for (var i = 0; i < menus.length; i++) setSection(menus[i], false);
  }

  function wireSections() {
    var toggles = document.querySelectorAll('.menu__toggle');
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].addEventListener('click', function (event) {
        var menu = event.currentTarget.closest('.menu');
        if (!menu) return;
        setSection(menu, !menu.classList.contains('is-expanded'));
      });
    }
  }

  function setNav(open) {
    navOpen = open;
    body.classList.toggle('nav-open', open);

    if (navToggle) {
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      setHidden(navToggle.querySelector('[data-icon="open"]'), open);
      setHidden(navToggle.querySelector('[data-icon="close"]'), !open);
    }

    // Reopening should start from the collapsed overview, not wherever the
    // visitor left it last time.
    if (!open) collapseSections();

    // Keep Tab inside the panel: it covers the viewport, so anything behind it
    // is focusable but invisible.
    for (var i = 0; i < outsideNav.length; i++) {
      if (outsideNav[i]) outsideNav[i].inert = open;
    }

    // Opening also makes the header solid, which shrinks it. Flip the class
    // first, then measure, or --header-h freezes at the taller value.
    syncHeader();
    measureHeader();
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
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

  function closeMenus(except) {
    var open = document.querySelectorAll('.menu.is-open');
    for (var i = 0; i < open.length; i++) {
      if (open[i] !== except) open[i].classList.remove('is-open');
    }
  }

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
            closeMenus(menu);
            menu.classList.add('is-open');
          }
        });
      })(menus[i]);
    }

    // Without this a tapped panel stays open for the rest of the session.
    document.addEventListener('click', function (event) {
      if (!event.target.closest('.menu')) closeMenus();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenus();
    });
  }

  /* ------------------------------------------------------------------
     Dark mode
     ------------------------------------------------------------------ */

  var darkToggle = document.querySelector('[data-toggle-dark]');
  var themeColor = document.querySelector('meta[name="theme-color"]');
  var isDark = false;

  function applyDark(next, persist) {
    isDark = next;
    body.classList.toggle('lv-dark', next);

    if (darkToggle) {
      darkToggle.setAttribute('aria-pressed', next ? 'true' : 'false');
      setHidden(darkToggle.querySelector('[data-icon="sun"]'), !next);
      setHidden(darkToggle.querySelector('[data-icon="moon"]'), next);
    }

    // Otherwise the mobile address bar stays paper-white around a dark page.
    if (themeColor) themeColor.setAttribute('content', next ? '#18191B' : '#F1EFEC');

    if (persist) store(STORAGE_DARK, next ? '1' : '0');
  }

  /* ------------------------------------------------------------------
     Reader text zoom — 100% / 112% / 125%
     ------------------------------------------------------------------ */

  var zoomToggle = document.querySelector('[data-cycle-zoom]');
  var zoomIndex = 0;

  function applyZoom(next, persist) {
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
    if (persist) store(STORAGE_ZOOM, String(zoomIndex));
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

        if (!CONFIG.animations || reduceMotion || !('IntersectionObserver' in window)) {
          el.textContent = String(target);
          return;
        }

        if (inView()) { el.textContent = '0'; run(); return; }

        // Only blank it once we know an observer will fill it back in.
        el.textContent = '0';

        {
          var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
              run();
              observer.disconnect();
            }
          }, { threshold: .4 });
          observer.observe(el);
        }
      })(counters[i]);
    }
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */

  body.classList.add('js');

  applyWhatsApp();
  applyDark(read(STORAGE_DARK) === '1', false);
  applyZoom(parseInt(read(STORAGE_ZOOM) || '0', 10) || 0, false);

  if (darkToggle) {
    darkToggle.addEventListener('click', function () { applyDark(!isDark, true); });
  }

  if (zoomToggle) {
    zoomToggle.addEventListener('click', function () { applyZoom(zoomIndex + 1, true); });
  }

  window.addEventListener('scroll', function () {
    syncHeader();
    sweepReveals();
  }, { passive: true });

  window.addEventListener('load', sweepReveals);

  syncHeader();
  measureHeader();
  wireMenus();
  wireSections();
  wireReveals();
  wireCounters();
  sweepReveals();
})();
