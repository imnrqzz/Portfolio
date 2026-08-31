document.querySelectorAll('.work').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
  // Make entire project card clickable — opens in a NEW TAB
  document.querySelectorAll('.work[data-url]').forEach(card => {
    const url = card.getAttribute('data-url');
    if (!url) return; // no URL (e.g. "Coming soon") stays non-clickable
    card.addEventListener('click', () => {
      // Use a real <a target="_blank"> so browsers never treat it as a popup
      // (window.open on a div gets blocked, then falls back to same-tab nav).
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
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('in'); });
  }, { threshold: 0.12 });
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

  // contact form -> Vercel serverless function -> Gmail
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const status = document.getElementById('form-status');
      const btn = form.querySelector('button[type="submit"]');
      const data = {
        name: form.name.value,
        email: form.email.value,
        message: form.message.value,
      };
      btn.disabled = true;
      btn.textContent = 'Sending...';
      status.textContent = '';
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          status.textContent = 'Message sent! I will reply soon.';
          form.reset();
        } else {
          status.textContent = 'Something went wrong. Try emailing me directly.';
        }
      } catch (err) {
        status.textContent = 'Something went wrong. Try emailing me directly.';
      }
      btn.disabled = false;
      btn.textContent = 'Send message';
    });
  }
