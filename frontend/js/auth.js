function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;
  window.currentUser = null;
  
  updateAuthUI();
  
  if (typeof toast === 'function') toast("👋 Logged out");

  // Hide the app UI
  document.querySelectorAll('header, nav.tabs, main, .bottom-nav').forEach(el => {
    if (el) el.style.display = 'none';
  });

  // Show the login gate
  if (typeof showLoginGate === 'function') {
    showLoginGate();
  } else {
    window.location.reload();
  }
}