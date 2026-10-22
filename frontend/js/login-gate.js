/* Login Gate — Farm background, NO green overlay */

let gateMode = 'login';

function showLoginGate() {
  document.querySelectorAll('header, nav.tabs, main, .bottom-nav').forEach(el => {
    if (el) el.style.display = 'none';
  });

  const existing = document.getElementById('loginGate');
  if (existing) existing.remove();

  const gate = document.createElement('div');
  gate.id = 'loginGate';
  gate.style.cssText = `
    position: fixed;
    inset: 0;
    background: url('img/farm-bg.jpg') center/cover no-repeat;
    background-color: #1a2c1f;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 9999;
    overflow-y: auto;
  `;

  // VERY subtle dark overlay — only 25% opacity so image stays visible
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.25);pointer-events:none;';
  gate.appendChild(overlay);

  const card = document.createElement('div');
  card.style.cssText = `
    position: relative;
    z-index: 2;
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.35);
    border-radius: 24px;
    max-width: 440px;
    width: 100%;
    padding: 40px 32px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.5);
    text-align: center;
  `;

  card.innerHTML = `
    <img src="img/logo.png" alt="NamAgriConnect" style="height:90px;width:auto;margin-bottom:16px;display:block;margin-left:auto;margin-right:auto;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.5))">
    <h1 style="color:white;font-size:28px;font-weight:800;margin:0 0 4px;text-shadow:0 2px 8px rgba(0,0,0,0.7)">NamAgriConnect</h1>
    <p style="color:rgba(255,255,255,0.95);font-size:14px;margin:0 0 32px;text-shadow:0 1px 4px rgba(0,0,0,0.7)">Namibia All-in-One Agri Platform</p>
    <div style="text-align:left">
      <label style="color:white;font-size:13px;font-weight:700;display:block;margin-bottom:6px;text-shadow:0 1px 3px rgba(0,0,0,0.5)">Phone Number *</label>
      <input id="gatePhone" type="tel" placeholder="+264812345678" style="width:100%;padding:14px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.4);background:rgba(255,255,255,0.2);color:white;font-size:15px;margin-bottom:16px;box-sizing:border-box">
      <div id="registerFields" style="display:none">
        <label style="color:white;font-size:13px;font-weight:700;display:block;margin-bottom:6px;text-shadow:0 1px 3px rgba(0,0,0,0.5)">Your Name *</label>
        <input id="gateName" type="text" placeholder="Full name" style="width:100%;padding:14px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.4);background:rgba(255,255,255,0.2);color:white;font-size:15px;margin-bottom:16px;box-sizing:border-box">
        <label style="color:white;font-size:13px;font-weight:700;display:block;margin-bottom:6px;text-shadow:0 1px 3px rgba(0,0,0,0.5)">Region</label>
        <input id="gateRegion" type="text" placeholder="e.g. Kavango East" style="width:100%;padding:14px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.4);background:rgba(255,255,255,0.2);color:white;font-size:15px;margin-bottom:16px;box-sizing:border-box">
      </div>
      <label style="color:white;font-size:13px;font-weight:700;display:block;margin-bottom:6px;text-shadow:0 1px 3px rgba(0,0,0,0.5)">Password * (min 6 chars)</label>
      <input id="gatePassword" type="password" placeholder="••••••" style="width:100%;padding:14px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.4);background:rgba(255,255,255,0.2);color:white;font-size:15px;margin-bottom:20px;box-sizing:border-box">
      <div id="gateError" style="color:#ffcccc;font-size:13px;margin-bottom:12px;display:none;padding:10px;background:rgba(255,0,0,0.3);border-radius:8px;border:1px solid rgba(255,100,100,0.4)"></div>
      <button id="gateSubmit" onclick="gateSubmit()" style="width:100%;padding:16px;border-radius:12px;border:none;background:linear-gradient(135deg,#e8b73a,#f2c94c);color:#3a2a00;font-size:16px;font-weight:800;cursor:pointer;margin-bottom:16px;box-shadow:0 8px 24px rgba(232,183,58,0.5)">Login</button>
      <p style="color:white;text-align:center;font-size:14px;margin:0;text-shadow:0 1px 3px rgba(0,0,0,0.5)">
        <span id="gateToggleText">No account?</span>
        <a href="#" onclick="event.preventDefault();gateToggleMode();" style="color:#f2c94c;font-weight:700;text-decoration:underline" id="gateToggleBtn">Register</a>
      </p>
    </div>
  `;

  gate.appendChild(card);
  document.body.appendChild(gate);
}

function gateToggleMode() {
  gateMode = gateMode === 'login' ? 'register' : 'login';
  const isReg = gateMode === 'register';
  document.getElementById('registerFields').style.display = isReg ? 'block' : 'none';
  document.getElementById('gateSubmit').textContent = isReg ? 'Create Account' : 'Login';
  document.getElementById('gateToggleText').textContent = isReg ? 'Have an account?' : 'No account?';
  document.getElementById('gateToggleBtn').textContent = isReg ? 'Login' : 'Register';
  document.getElementById('gateError').style.display = 'none';
}

function showGateError(msg) {
  const el = document.getElementById('gateError');
  if (el) { el.textContent = '❌ ' + msg; el.style.display = 'block'; }
}

async function gateSubmit() {
  const phone = document.getElementById('gatePhone').value.trim();
  const password = document.getElementById('gatePassword').value;
  const submitBtn = document.getElementById('gateSubmit');

  document.getElementById('gateError').style.display = 'none';

  if (!phone) return showGateError('Phone number required');
  if (!password) return showGateError('Password required');
  if (password.length < 6) return showGateError('Password must be at least 6 characters');

  let name = '', region = '';
  if (gateMode === 'register') {
    name = document.getElementById('gateName').value.trim();
    region = document.getElementById('gateRegion').value.trim();
    if (!name) return showGateError('Your name is required');
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Please wait...';

  try {
    const endpoint = gateMode === 'login' ? '/auth/login' : '/auth/register';
    const payload = gateMode === 'login' ? { phone, password } : { phone, name, region, password };

       const baseUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:4000' 
      : 'https://namagriconnect-3.onrender.com';

    const response = await fetch(baseUrl + '/api' + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed: ' + response.status);

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.currentUser = data.user;

    const gate = document.getElementById('loginGate');
    if (gate) gate.remove();
    document.querySelectorAll('header, nav.tabs, main, .bottom-nav').forEach(el => {
      if (el) el.style.display = '';
    });

    if (typeof updateAuthUI === 'function') updateAuthUI();
    if (typeof loadListings === 'function') loadListings();
    if (typeof renderCommunity === 'function') renderCommunity();
    if (typeof toast === 'function') toast('✅ Welcome ' + (data.user.name || data.user.phone) + '!');

  } catch (err) {
    console.error('❌', err);
    showGateError(err.message);
    submitBtn.disabled = false;
    submitBtn.textContent = gateMode === 'login' ? 'Login' : 'Create Account';
  }
}

window.gateSubmit = gateSubmit;
window.gateToggleMode = gateToggleMode;
window.showLoginGate = showLoginGate;

document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  if (!token) showLoginGate();
});



console.log('✅ login-gate.js loaded — clean farm background');