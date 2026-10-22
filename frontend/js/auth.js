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
    btn.style.background = '#c0392b'; // Red for logout
  } else {
    btn.innerHTML = '🔐 Login';
    btn.style.background = 'rgba(0,0,0,0.4)'; // Dark glass
  }
}

function handleAuthClick() {
  if (currentUser) {
    logout(); // If logged in, logout
  } else {
    showLoginGate(); // If logged out, show login gate
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;
  window.currentUser = null;
  
  if (typeof toast === 'function') toast("👋 Logged out");
  
  updateAuthUI();
  
  // Force the page to reload to show the login gate
  window.location.reload(); 
}

// Exports
window.currentUser = null;
window.updateAuthUI = updateAuthUI;
window.handleAuthClick = handleAuthClick;
window.logout = logout;

document.addEventListener('DOMContentLoaded', loadSession);