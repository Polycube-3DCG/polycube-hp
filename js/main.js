// ナビ アクティブ状態
(function() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
})();

// ハンバーガーメニュー
(function() {
  const btn   = document.getElementById('nav-hamburger');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    });
  });
})();

// スクロールフェードイン
(function() {
  const SELECTOR = '.card, .subsection-title';

  function inViewport(el) {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  const els = Array.from(document.querySelectorAll(SELECTOR));
  const targets = els.filter(el => !inViewport(el));

  targets.forEach((el, i) => {
    el.style.setProperty('--scroll-delay', (i % 4) * 0.07 + 's');
    el.classList.add('scroll-fade');
  });

  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('in-view');
      el.addEventListener('transitionend', () => {
        el.classList.remove('scroll-fade', 'in-view');
        el.style.removeProperty('--scroll-delay');
      }, { once: true });
      observer.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  targets.forEach(el => observer.observe(el));
})();
