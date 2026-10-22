/* ══════════════════════════════════════════════════
   AUTH.JS — Single source of truth
   ══════════════════════════════════════════════════ */

let currentUser = null;
window.currentUser = null;

async function loadSession() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    updateAuthUI();
    return;
  }

  try {
    currentUser = JSON.parse(user);
    window.currentUser = currentUser;
    console.log('✅ Session restored:', currentUser.name || currentUser.phone);
  } catch (e) {
    console.error('❌ Corrupted user:', e);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
    if (typeof showLoginGate === 'function') showLoginGate();
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;
  window.currentUser = null;

  if (typeof toast === 'function') toast('👋 Logged out');
  window.location.reload();
}

function requireLogin(action) {
  if (!currentUser) {
    if (typeof toast === 'function') toast('🔐 Please login first');
    if (typeof showLoginGate === 'function') showLoginGate();
    return false;
  }
  return true;
}

async function submitGateAuth(phone, password, isRegister, name, region) {
  const endpoint = isRegister ? '/auth/register' : '/auth/login';
  const payload = isRegister 
    ? { phone, name, region, password } 
    : { phone, password };

  const baseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://namagriconnect-3.onrender.com';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90000);

  try {
    const response = await fetch(baseUrl + '/api' + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    currentUser = data.user;
    window.currentUser = currentUser;
    updateAuthUI();

    return data.user;
  } catch (e) {
    clearTimeout(timeoutId);
    if (e.name === 'AbortError') {
      throw new Error('Server took too long. Please try again.');
    }
    throw e;
  }
}

window.openAuth = handleAuthClick;
window.handleAuthClick = handleAuthClick;
window.logout = logout;
window.requireLogin = requireLogin;
window.loadSession = loadSession;
window.updateAuthUI = updateAuthUI;
window.submitGateAuth = submitGateAuth;

document.addEventListener('DOMContentLoaded', loadSession);