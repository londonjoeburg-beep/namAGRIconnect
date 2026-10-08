let currentUser = null;
let authMode = 'login';

async function loadSession() {
  const token = localStorage.getItem('token');
  if (!token) { updateAuthUI(); return; }
  try {
    currentUser = await api.get('/auth/me');
    window.currentUser = currentUser;
  } catch {
    localStorage.removeItem('token');
    currentUser = null;
  }
  updateAuthUI();
}

function updateAuthUI() {
  const btn = document.getElementById('authBtn');
  const farmBtn = document.getElementById('myFarmBtn');
  if (currentUser) {
    btn.innerHTML = `⏻ Logout`;
    btn.title = `Logout ${currentUser.name || currentUser.phone}`;
    btn.onclick = () => {
      if (confirm(`Logout ${currentUser.name || currentUser.phone}?`)) logout();
    };
    if (farmBtn) farmBtn.style.display = 'inline-flex';
  } else {
    btn.innerHTML = '🔐 Login';
    btn.onclick = () => openAuth('login');
    if (farmBtn) farmBtn.style.display = 'none';
    if (typeof applyTranslations === 'function') applyTranslations();
  }
}

function openAuth(mode = 'login') {
  authMode = mode;
  document.getElementById('authTitle').textContent = mode === 'login' ? '🔐 Login' : '📝 Register';
  document.getElementById('registerOnly').style.display = mode === 'register' ? 'block' : 'none';
  document.getElementById('authSubmit').textContent = mode === 'login' ? 'Login' : 'Create Account';
  document.getElementById('authToggleText').textContent = mode === 'login' ? 'No account?' : 'Have one?';
  document.getElementById('authToggleBtn').textContent = mode === 'login' ? 'Register' : 'Login';
  openModal('authModal');
}

function toggleAuthMode() { openAuth(authMode === 'login' ? 'register' : 'login'); }

async function submitAuth() {
  const fields = [
    { el: document.getElementById('authPhone'), message: 'Phone number is required',
      check: v => v.length >= 8 },
    { el: document.getElementById('authPassword'), message: 'Password must be at least 6 characters',
      check: v => v.length >= 6 }
  ];

  if (authMode === 'register') {
    fields.unshift({
      el: document.getElementById('authName'),
      message: 'Your name is required'
    });
  }

  const valid = validateFields(fields);
  if (!valid) {
    toast("⚠️ Please fix the highlighted fields");
    return;
  }

  const phone = document.getElementById('authPhone').value.trim();
  const password = document.getElementById('authPassword').value;

  try {
    let data;
    if (authMode === 'login') {
      data = await api.post('/auth/login', { phone, password });
    } else {
      const name = document.getElementById('authName').value.trim();
      const region = document.getElementById('authRegion').value.trim();
      const town = document.getElementById('authTown').value.trim();
      data = await api.post('/auth/register', { phone, name, region, town, password });
    }
    localStorage.setItem('token', data.token);
    currentUser = data.user;
    window.currentUser = currentUser;
    closeModal('authModal');
    updateAuthUI();
    toast(`✅ Welcome ${data.user.name || data.user.phone}!`);
    if (typeof loadListings === 'function') loadListings();
    if (typeof renderCommunity === 'function') renderCommunity();
    if (typeof renderRFQ === 'function') renderRFQ();
    if (typeof renderProfile === 'function') renderProfile();
  } catch (e) {
    toast("❌ " + e.message);
  }
}

function logout() {
  localStorage.removeItem('token');
  currentUser = null;
  window.currentUser = null;
  updateAuthUI();
  toast("👋 Logged out");
  if (typeof loadListings === 'function') loadListings();
  if (typeof renderProfile === 'function') renderProfile();
  goTo('market');
}

function requireLogin(action = 'do this') {
  if (!currentUser) {
    toast(`🔐 Please login to ${action}`);
    openAuth('login');
    return false;
  }
  return true;
}

window.currentUser = null;
window.openAuth = openAuth;
window.toggleAuthMode = toggleAuthMode;
window.submitAuth = submitAuth;
window.logout = logout;
window.requireLogin = requireLogin;
window.loadSession = loadSession;

document.addEventListener('DOMContentLoaded', loadSession);