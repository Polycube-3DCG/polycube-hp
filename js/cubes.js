(function() {
  const container = document.getElementById('wireframe-bg');
  if (!container) return;

  const colors  = ['#00c5ff', '#a855f7', '#ff6bae'];
  const count   = 22;
  const cols    = 5;
  const rows    = Math.ceil(count / cols);
  const cellW   = 100 / cols;
  const cellH   = 100 / rows;

  const indices = Array.from({length: count}, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const cubeSVG = (color, stroke) =>
    `<g stroke="${color}" fill="none" stroke-width="${stroke}">
      <polygon points="50,5 90,28 50,51 10,28"/>
      <polygon points="90,28 90,74 50,97 50,51"/>
      <polygon points="10,28 50,51 50,97 10,74"/>
    </g>`;

  for (let i = 0; i < count; i++) {
    const col     = indices[i] % cols;
    const row     = Math.floor(indices[i] / cols);
    const size    = 24 + Math.random() * 52;
    const x       = col * cellW + cellW * 0.15 + Math.random() * cellW * 0.7;
    const y       = row * cellH + cellH * 0.15 + Math.random() * cellH * 0.7;
    const rot     = Math.random() * 360;
    const spin    = 15 + Math.random() * 30;
    const drift   = -(8 + Math.random() * 16) + 'px';
    const dur     = 7 + Math.random() * 14;
    const delay   = -(Math.random() * dur);
    const opacity = 0.06 + Math.random() * 0.13;
    const color   = colors[Math.floor(Math.random() * colors.length)];
    const stroke  = size > 50 ? 2.5 : 3.5;

    const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    el.setAttribute('width', size);
    el.setAttribute('height', size);
    el.setAttribute('viewBox', '0 0 100 100');
    el.classList.add('wire-cube');
    el.style.cssText = [
      `left:${x}%`,
      `top:${y}%`,
      `opacity:${opacity}`,
      `--rot:${rot}deg`,
      `--spin:${spin}deg`,
      `--drift:${drift}`,
      `animation:cube-float ${dur}s ease-in-out ${delay}s infinite`,
    ].join(';');
    el.innerHTML = cubeSVG(color, stroke);
    container.appendChild(el);
  }
})();

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
