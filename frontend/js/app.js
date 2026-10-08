function goTo(page){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');
  document.querySelectorAll('.tab, .bottom-nav button').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page === 'profile') renderProfile();
  if (page === 'rfq') renderRFQ();
  if (page === 'community') renderCommunity();
  if (page === 'weather') renderWeather();
  if (page === 'virus') renderOutbreaks();
  if (page === 'water') calcWater();
  if (page === 'ussd') ussdBoot();
}

document.querySelectorAll('.tab, .bottom-nav button').forEach(btn => {
  btn.addEventListener('click', () => goTo(btn.dataset.page));
});

function openModal(id){ document.getElementById(id)?.classList.add('show'); }
function closeModal(id){ document.getElementById(id)?.classList.remove('show'); }
document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m) m.classList.remove('show'); }));

let toastTimer;
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

// Theme
(function initTheme(){
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      btn.textContent = next === 'dark' ? '☀️' : '🌙';
    });
  }
})();

// Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').catch(() => {});
}

window.goTo = goTo;
window.openModal = openModal;
window.closeModal = closeModal;
window.toast = toast;