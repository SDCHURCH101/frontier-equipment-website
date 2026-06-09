/* Frontier Equipment Company — site interactions */
(function () {
  'use strict';

  /* ---- Sticky header state ---- */
  var header = document.getElementById('header');
  function onScroll() {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav ---- */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  function closeNav() {
    nav.classList.remove('open');
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
  document.body.addEventListener('click', function (e) {
    if (document.body.classList.contains('nav-open') && !nav.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) closeNav();
  });

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Count-up stats ---- */
  function fmt(val, dec, comma) {
    var n = dec ? val.toFixed(dec) : Math.round(val).toString();
    if (comma) {
      var parts = n.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      n = parts.join('.');
    }
    return n;
  }
  function runCount(el) {
    var to = parseFloat(el.getAttribute('data-to'));
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var comma = el.getAttribute('data-format') === 'comma';
    var dur = 1500, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * eased, dec, comma);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fmt(to, dec, comma);
    }
    requestAnimationFrame(step);
  }
  var counts = document.querySelectorAll('.count');
  if ('IntersectionObserver' in window && counts.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCount(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counts.forEach(function (el) { co.observe(el); });
  } else {
    counts.forEach(function (el) { el.textContent = el.getAttribute('data-to'); });
  }

  /* ---- Lightbox ---- */
  var gallery = document.getElementById('gallery');
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var items = gallery ? Array.prototype.slice.call(gallery.querySelectorAll('.gitem')) : [];
  var idx = 0;

  function show(i) {
    idx = (i + items.length) % items.length;
    var node = items[idx];
    var img = node.querySelector('img');
    var cap = node.querySelector('span');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = cap ? cap.textContent : '';
  }
  function openLb(i) { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }

  items.forEach(function (node, i) {
    node.addEventListener('click', function () { openLb(i); });
  });
  document.getElementById('lbClose').addEventListener('click', closeLb);
  document.getElementById('lbPrev').addEventListener('click', function () { show(idx - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });

  /* ---- Contact form -> mailto ---- */
  var form = document.getElementById('leaseForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form;
      var subject = 'Frontier Pad leasing inquiry' + (f.company.value ? ': ' + f.company.value : '');
      var lines = [
        'Name: ' + f.name.value,
        'Company: ' + f.company.value,
        'Email: ' + f.email.value,
        'Phone: ' + f.phone.value,
        'Interested in: ' + f.interest.value,
        '',
        f.message.value
      ];
      var href = 'mailto:seth@akfec.com?subject=' + encodeURIComponent(subject) +
                 '&body=' + encodeURIComponent(lines.join('\n'));
      window.location.href = href;
    });
  }

  /* ---- Current year ---- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
