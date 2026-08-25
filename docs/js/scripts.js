/*!
 * Rafael C - Portafolio de apps Android
 * Sin dependencias.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'rc-theme';

  /* ---------- Tema ---------- */
  function currentTheme() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* modo privado */ }
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b0d12' : '#fbfbfd');
    var btn = document.querySelector('.theme-toggle');
    if (btn) btn.setAttribute('aria-pressed', String(theme === 'dark'));
  }

  function initTheme() {
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    applyTheme(currentTheme());
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* modo privado */ }
      applyTheme(next);
    });
  }

  /* ---------- Menu movil ---------- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.nav');
    if (!toggle || !nav) return;

    function close() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('.nav__link')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) close();
    });
  }

  /* ---------- Sombra de la cabecera ---------- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var update = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------- Animacion de entrada ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    var reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(items, function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 60 + 'ms';
      io.observe(el);
    });
  }

  /* ---------- Seccion activa en el menu ---------- */
  function initScrollSpy() {
    var links = document.querySelectorAll('.nav__link[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    var sections = [];
    Array.prototype.forEach.call(links, function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = id && document.getElementById(id);
      if (!section) return;
      map[id] = link;
      sections.push(section);
    });
    if (!sections.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Array.prototype.forEach.call(links, function (l) { l.removeAttribute('aria-current'); });
        var link = map[entry.target.id];
        if (link) link.setAttribute('aria-current', 'page');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Idioma en paginas legales ---------- */
  function initLangTabs() {
    var tabs = document.querySelector('.lang-tabs');
    if (!tabs) return;
    var buttons = tabs.querySelectorAll('button[data-lang]');

    function show(lang) {
      Array.prototype.forEach.call(buttons, function (b) {
        var active = b.getAttribute('data-lang') === lang;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });
      Array.prototype.forEach.call(document.querySelectorAll('[data-lang-panel]'), function (p) {
        p.classList.toggle('is-hidden', p.getAttribute('data-lang-panel') !== lang);
      });
    }

    Array.prototype.forEach.call(buttons, function (b) {
      b.addEventListener('click', function () { show(b.getAttribute('data-lang')); });
    });

    var initial = (document.documentElement.lang || 'es').slice(0, 2);
    show(tabs.querySelector('button[data-lang="' + initial + '"]') ? initial : 'es');
  }

  /* ---------- Ano en el pie ---------- */
  function initYear() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function init() {
    initTheme();
    initNav();
    initHeader();
    initReveal();
    initScrollSpy();
    initLangTabs();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
