// ── Loading screen ──

(() => {

  const loader = document.getElementById('loader');

  const counter = document.getElementById('loader-counter');

  if (!loader || !counter) return;



  const start = performance.now();

  const minDuration = 900; // don't rush the animation

  const tick = (now) => {

    const elapsed = now - start;

    const progress = Math.min(elapsed / minDuration, 1);

    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

    const pct = Math.floor(eased * 100);

    counter.textContent = pct + '%';

    if (progress < 1) {

      requestAnimationFrame(tick);

    } else {

      counter.textContent = '100%';

      loader.classList.add('done');

      loader.addEventListener('transitionend', () => loader.remove(), { once: true });

    }

  };

  requestAnimationFrame(tick);

})();



// Make entire project card clickable — opens in a NEW TAB, but skip if clicking a link/button

document.querySelectorAll('.work[data-url]').forEach(card => {

  const url = card.getAttribute('data-url');

  if (!url) return;

  card.addEventListener('click', e => {

    if (e.target.closest('a') || e.target.closest('button')) return; // let the link handle it

    const a = document.createElement('a');

    a.href = url;

    a.target = '_blank';

    a.rel = 'noopener noreferrer';

    document.body.appendChild(a);

    a.click();

    a.remove();

  });

});

const io = new IntersectionObserver(entries => {

  entries.forEach(en => {

    if (en.isIntersecting) {

      en.target.classList.add('in');

      en.target.style.transition = 'opacity .6s cubic-bezier(.25,.1,.15,1), transform .6s cubic-bezier(.25,.1,.15,1)';

    } else {

      en.target.classList.remove('in');

      en.target.style.transition = 'opacity .25s ease-in, transform .25s ease-in';

    }

  });

}, { threshold: 0, rootMargin: '0px 0px -8% 0px' });

// close mobile menu after tapping a link

document.querySelectorAll('.nav-center a, .nav-links-mobile a').forEach(a => a.addEventListener('click', () => {

  const t = document.getElementById('nav-toggle'); if (t) t.checked = false;

}));



// dark / light theme toggle (persists in localStorage)

(() => {

  const btn = document.getElementById('theme-toggle');

  const root = document.documentElement;

  const saved = localStorage.getItem('theme');

  if (saved === 'light') root.setAttribute('data-theme', 'light');

  const sync = () => { btn.innerHTML = root.getAttribute('data-theme') === 'light' ? '&#9728;' : '&#9790;'; };

  sync();

  btn.addEventListener('click', () => {

    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';

    if (next === 'light') root.setAttribute('data-theme', 'light'); else root.removeAttribute('data-theme');

    localStorage.setItem('theme', next);

    sync();

  });

})();



document.querySelectorAll('.reveal').forEach(el => io.observe(el));



// auto-update footer year

const y = document.getElementById('year');

if (y) y.textContent = new Date().getFullYear();



// live PHT clock

(() => {

  const el = document.getElementById('live-time');

  if (!el) return;

  const fmt = new Intl.DateTimeFormat('en-PH', {

    timeZone: 'Asia/Manila',

    hour: '2-digit',

    minute: '2-digit',

    hour12: true

  });

  const tick = () => { el.textContent = fmt.format(new Date()) + ' PHT'; };

  tick();

  setInterval(tick, 1000);

})();



// hide contribution graph placeholder when image loads

(() => {

  const img = document.querySelector('.contrib-graph img');

  const placeholder = document.getElementById('contrib-loading');

  if (!img || !placeholder) return;

  const hide = () => { placeholder.style.display = 'none'; };

  img.addEventListener('load', hide, { once: true });

  img.addEventListener('error', hide, { once: true });

  setTimeout(hide, 4000);

})();



