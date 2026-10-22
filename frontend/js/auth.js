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
  const btn = document.getElementById('authBtn');
  if (!btn) return;
  
  if (currentUser) {
    btn.innerHTML = '⏻ Logout';
    btn.style.background = '#c0392b'; 
    btn.style.borderColor = '#c0392b';
  } else {
    btn.innerHTML = '🔐 Login';
    btn.style.background = 'rgba(0,0,0,0.4)'; 
    btn.style.borderColor = 'rgba(255,255,255,0.2)';
  }
}

function handleAuthClick() {
  if (currentUser) {
    logout();
  } else {
    openAuth('login');
  }
}

function openAuth(mode = 'login') {
  authMode = mode;
  const title = document.getElementById('authTitle');
  const regFields = document.getElementById('registerOnly');
  const submit = document.getElementById('authSubmit');
  
  if(title) title.textContent = mode === 'login' ? '🔐 Login' : '📝 Register';
  if(regFields) regFields.style.display = mode === 'register' ? 'block' : 'none';
  if(submit) submit.textContent = mode === 'login' ? 'Login' : 'Create Account';
  
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
      if (!name) return toast("⚠️ Name required");
      data = await api.post('/auth/register', { phone, name, region, password });
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
  localStorage.removeItem('user');
  currentUser = null;
  window.currentUser = null;
  if (typeof toast === 'function') toast("👋 Logged out");
  window.location.reload(); 
}

// 🔥 THIS WAS MISSING! 
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
window.updateAuthUI = updateAuthUI;
window.handleAuthClick = handleAuthClick;

document.addEventListener('DOMContentLoaded', loadSession);