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
  entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('in'); });
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