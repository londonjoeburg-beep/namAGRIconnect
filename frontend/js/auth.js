/* Authentication System */

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
    window.currentUser = null;
  }
  updateAuthUI();
}

function updateAuthUI() {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (currentUser) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';
  } else {
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (logoutBtn) logoutBtn.style.display = 'none';
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
  const phone = document.getElementById('authPhone').value.trim();
  const password = document.getElementById('authPassword').value;
  if (!phone || !password) return toast("⚠️ Phone + password required");

  try {
    let data;
    if (authMode === 'login') {
      data = await api.post('/auth/login', { phone, password });
    } else {
      const name = document.getElementById('authName').value.trim();
      const region = document.getElementById('authRegion').value.trim();
      const town = document.getElementById('authTown').value.trim();
      if (!name) return toast("⚠️ Name required");
      data = await api.post('/auth/register', { phone, name, region, town, password });
    }
    localStorage.setItem('token', data.token);
    currentUser = data.user;
    window.currentUser = currentUser;
    closeModal('authModal');
    updateAuthUI();
    toast(`✅ Welcome ${data.user.name || data.user.phone}!`);
    if (typeof loadListings === 'function') loadListings();
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

  // Hide the app UI
  document.querySelectorAll('header, nav.tabs, main, .bottom-nav').forEach(el => {
    if (el) el.style.display = 'none';
  });

  // Show the login gate
  if (typeof showLoginGate === 'function') {
    showLoginGate();
  } else {
    location.reload();
  }
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

document.addEventListener('DOMContentLoaded', loadSession);