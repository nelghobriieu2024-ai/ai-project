// Small enhancements only: the page works without JavaScript.
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Highlight buttons: outline claims of one type (fact, interpretation, prediction).
  var chips = document.querySelectorAll('.chip');
  var claims = document.querySelectorAll('.claim');

  function highlight(type) {
    claims.forEach(function (el) {
      el.classList.toggle('is-on', type !== '' && el.getAttribute('data-type') === type);
    });
    chips.forEach(function (chip) {
      var on = type !== '' && chip.getAttribute('data-type') === type;
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    // Open the case studies when highlighting, so matching claims are visible.
    if (type !== '') {
      document.querySelectorAll('details.case').forEach(function (d) { d.open = true; });
    }
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var type = chip.getAttribute('data-type');
      var already = chip.getAttribute('aria-pressed') === 'true';
      highlight(already ? '' : type);
    });
  });

  // 2. Reading progress bar.
  var bar = document.getElementById('bar');
  function updateBar() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var ratio = max > 0 ? h.scrollTop / max : 0;
    if (bar) { bar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')'; }
  }
  window.addEventListener('scroll', updateBar, { passive: true });
  window.addEventListener('resize', updateBar);
  updateBar();

  // 3. Reveal sections as they scroll into view.
  var reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }
})();
