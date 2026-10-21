/* Wallet — Balance, deposit, transactions */

async function renderWallet() {
  const container = document.getElementById('walletContent');
  if (!container) return;
  
  if (!window.currentUser) {
    container.innerHTML = '<p style="color:var(--muted)">Login to view wallet.</p>';
    return;
  }
  
  container.innerHTML = '<span class="spinner"></span>';
  
  try {
    const data = await api.get('/wallet');
    
    container.innerHTML = `
      <div style="
        background:linear-gradient(135deg,#0b6b3a,#12934f);
        color:white;
        border-radius:20px;
        padding:24px;
        margin-bottom:16px;
        text-align:center;
      ">
        <div style="font-size:13px;opacity:0.8;margin-bottom:4px">Available Balance</div>
        <div style="font-size:36px;font-weight:800">N$ ${data.balance.toFixed(2)}</div>
      </div>
      
      <button class="btn block" onclick="openDepositModal()" style="margin-bottom:16px">
        ➕ Deposit Money
      </button>
      
      <h4 style="margin:16px 0 8px">Recent Transactions</h4>
      ${data.transactions.length ? data.transactions.map(t => `
        <div class="talk-item" style="border-left-color:${t.type === 'deposit' ? 'var(--ok)' : 'var(--warn)'};margin-bottom:8px">
          <div style="display:flex;justify-content:space-between">
            <div>
              <b>${t.type === 'deposit' ? '📥 Deposit' : t.type === 'purchase' ? '🛒 Purchase' : '💰 Sale'}</b>
              <div style="font-size:11px;color:var(--muted)">${t.description || ''}</div>
              <div style="font-size:11px;color:var(--muted)">${new Date(t.created_at).toLocaleString()}</div>
            </div>
            <div style="font-weight:800;color:${t.type === 'deposit' || t.type === 'sale' ? 'var(--ok)' : 'var(--danger)'}">
              ${t.type === 'deposit' || t.type === 'sale' ? '+' : '-'}N$ ${t.amount.toFixed(2)}
            </div>
          </div>
        </div>
      `).join('') : '<p style="color:var(--muted);font-size:13px">No transactions yet.</p>'}
    `;
  } catch (e) {
    container.innerHTML = `<p style="color:var(--danger)">${e.message}</p>`;
  }
}

let depositStep = 1;
let depositAmount = 0;
let depositOTP = '';

function openDepositModal() {
  depositStep = 1;
  depositAmount = 0;
  depositOTP = '';
  renderDepositModal();
}

function renderDepositModal() {
  let content = '';
  
  if (depositStep === 1) {
    content = `
      <h3 style="margin-bottom:16px">💳 Deposit to Wallet</h3>
      <label>Amount (N$)</label>
      <input type="number" id="depositAmount" min="10" step="10" placeholder="100" style="margin-bottom:16px">
      <p style="font-size:12px;color:var(--muted);margin-bottom:16px">Minimum N$ 10</p>
      <button class="btn block" onclick="requestOTP()">Send OTP</button>
    `;
  } else if (depositStep === 2) {
    content = `
      <h3 style="margin-bottom:16px">🔐 Verify OTP</h3>
      <p style="font-size:13px;color:var(--muted);margin-bottom:16px">
        Enter the 6-digit code sent to ${window.currentUser.phone}
      </p>
      <input type="tel" id="otpInput" maxlength="6" placeholder="000000" 
        style="text-align:center;font-size:24px;letter-spacing:8px;margin-bottom:16px">
      <button class="btn block" onclick="verifyOTP()">Verify & Deposit</button>
      <button class="btn outline block" style="margin-top:8px" onclick="closeModal('depositModal')">Cancel</button>
    `;
  } else if (depositStep === 3) {
    content = `
      <h3 style="color:var(--ok);margin-bottom:16px">✅ Deposit Successful!</h3>
      <p style="font-size:16px;text-align:center;margin:20px 0">
        N$ ${depositAmount.toFixed(2)} has been added to your wallet.
      </p>
      <button class="btn block" onclick="closeModal('depositModal');renderWallet()">Done</button>
    `;
  }
  
  const box = document.querySelector('#depositModal .box');
  if (box) box.innerHTML = content;
  openModal('depositModal');
}

async function requestOTP() {
  const amount = parseFloat(document.getElementById('depositAmount').value);
  if (isNaN(amount) || amount < 10) return toast('❌ Minimum deposit N$ 10');
  
  depositAmount = amount;
  
  try {
    const res = await api.post('/otp/send', { phone: window.currentUser.phone });
    depositStep = 2;
    renderDepositModal();
    
    // In dev mode: show the code
    if (res.debug_code) {
      toast(`📱 OTP: ${res.debug_code} (dev mode)`);
      setTimeout(() => {
        const input = document.getElementById('otpInput');
        if (input) input.value = res.debug_code;
      }, 500);
    }
  } catch (e) {
    toast('❌ ' + e.message);
  }
}

async function verifyOTP() {
  const code = document.getElementById('otpInput').value.trim();
  if (!code || code.length !== 6) return toast('❌ Enter 6-digit code');
  
  try {
    await api.post('/otp/verify', { phone: window.currentUser.phone, code });
    await api.post('/wallet/deposit', { amount: depositAmount });
    depositStep = 3;
    renderDepositModal();
  } catch (e) {
    toast('❌ ' + e.message);
  }
}

window.renderWallet = renderWallet;
window.openDepositModal = openDepositModal;
window.requestOTP = requestOTP;
window.verifyOTP = verifyOTP;