/* ══════════════════════════════════════════════════
   AUTH.JS — Single source of truth for authentication
   ══════════════════════════════════════════════════ */

let currentUser = null;
window.currentUser = null;

// Load session from localStorage
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
    console.error('❌ Corrupted user data:', e);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    window.currentUser = null;
  }

  updateAuthUI();
}

// Update the header button based on login state
function updateAuthUI() {
  const btn = document.getElementById('authBtn');
  if (!btn) return;

  if (currentUser) {
    // LOGGED IN → show Logout (red)
    btn.innerHTML = '⏻ Logout';
    btn.style.background = '#c0392b';
    btn.style.borderColor = '#c0392b';
    btn.onclick = logout;
  } else {
    // LOGGED OUT → show Login
    btn.innerHTML = '🔐 Login';
    btn.style.background = 'rgba(0,0,0,0.4)';
    btn.style.borderColor = 'rgba(255,255,255,0.2)';
    btn.onclick = () => {
      if (typeof showLoginGate === 'function') showLoginGate();
    };
  }
}

// Logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;
  window.currentUser = null;

  if (typeof toast === 'function') toast('👋 Logged out');

  // Reload to show login gate fresh
  window.location.reload();
}

// Only for actions that absolutely need login
function requireLogin(action) {
  if (!currentUser) {
    if (typeof toast === 'function') toast('🔐 Please login first');
    if (typeof showLoginGate === 'function') showLoginGate();
    return false;
  }
  return true;
}

// Submit login/register from the login gate
async function submitGateAuth(phone, password, isRegister, name, region) {
  const endpoint = isRegister ? '/auth/register' : '/auth/login';
  const payload = isRegister 
    ? { phone, name, region, password } 
    : { phone, password };

  const baseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://namagriconnect-3.onrender.com';

  const response = await fetch(baseUrl + '/api' + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Login failed');

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  currentUser = data.user;
  window.currentUser = currentUser;
  updateAuthUI();

  return data.user;
}

// Exports
window.currentUser = null;
window.logout = logout;
window.requireLogin = requireLogin;
window.loadSession = loadSession;
window.updateAuthUI = updateAuthUI;
window.submitGateAuth = submitGateAuth;

// Load session on page load
document.addEventListener('DOMContentLoaded', loadSession);