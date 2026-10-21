/* Orders — Bulletproof Checkout */
let currentCheckoutListing = null;

function placeOrder(listingId) {
  if (!requireLogin('place an order')) return;
  const listing = listingsCache.find(x => x.id === listingId);
  if (!listing) return toast('❌ Listing not found');

  currentCheckoutListing = listing;

  // Fill modal
  const summary = document.getElementById('checkoutSummary');
  if (summary) {
    summary.innerHTML = '<b>' + listing.title + '</b><br>Price: N$ ' + listing.price + ' / ' + listing.unit + '<br>Available: ' + listing.quantity + ' ' + listing.unit;
  }
  
  const qtyLabel = document.querySelector('label[for="checkoutQty"]');
  if (qtyLabel) qtyLabel.textContent = 'Quantity (' + listing.unit + ')';

  document.getElementById('checkoutQty').value = '';
  document.getElementById('checkoutAddress').value = '';
  document.getElementById('checkoutError').style.display = 'none';

  openModal('checkoutModal');
}

async function submitCheckout() {
  const qty = parseFloat(document.getElementById('checkoutQty').value);
  const address = document.getElementById('checkoutAddress').value.trim();
  const errEl = document.getElementById('checkoutError');
  
  errEl.style.display = 'none';

  if (isNaN(qty) || qty <= 0) return showError('❌ Please enter a valid quantity.');
  if (qty > currentCheckoutListing.quantity) return showError('❌ Only ' + currentCheckoutListing.quantity + ' available.');
  if (!address) return showError('❌ Delivery address is required.');

  function showError(msg) {
    errEl.textContent = msg;
    errEl.style.display = 'block';
  }

  const btn = document.querySelector('#checkoutModal .btn');
  btn.disabled = true;
  btn.textContent = 'Processing...';

  try {
    const res = await api.post('/orders', {
      listing_id: currentCheckoutListing.id,
      quantity: qty,
      delivery_address: address,
      contact_phone: window.currentUser.phone
    });

    closeModal('checkoutModal');
    alert('✅ ORDER CONFIRMED\n\nTracking Code: ' + res.tracking_code + '\nTotal Paid: N$ ' + res.total.toFixed(2) + '\nNew Balance: N$ ' + res.new_balance.toFixed(2));
    
    loadListings();
    goTo('orders');
    renderMyOrders();

  } catch (e) {
    showError('❌ ' + e.message);
    if (e.message.includes('Insufficient') || e.message.includes('balance')) {
      setTimeout(() => { closeModal('checkoutModal'); goTo('wallet'); }, 1500);
    }
  } finally {
    btn.disabled = false;
    btn.textContent = '✅ Confirm & Pay';
  }
}

// Render Orders
async function renderMyOrders() {
  const container = document.getElementById('myOrdersContent');
  if (!container) return;
  if (!window.currentUser) return container.innerHTML = '<p>Login to view orders.</p>';

  container.innerHTML = '<span class="spinner"></span> Loading...';
  try {
    const orders = await api.get('/orders/my');
    if (!orders.length) return container.innerHTML = '<p>No orders yet.</p>';
    
    container.innerHTML = orders.map(o => `
      <div class="card" style="padding:12px;margin-bottom:10px;border-left:4px solid var(--green)">
        <div style="display:flex;justify-content:space-between">
          <div>
            <b>${o.title}</b><br>
            <small style="color:var(--muted)">${o.quantity} units • N$ ${Number(o.total_price).toFixed(2)}</small>
          </div>
          <div style="text-align:right">
            <span class="badge ${o.status==='delivered'?'ok':'warn'}">${o.status.toUpperCase()}</span>
            <div style="font-size:11px;margin-top:4px">${o.tracking_code}</div>
          </div>
        </div>
      </div>
    `).join('');
  } catch (e) { container.innerHTML = '<p style="color:red">' + e.message + '</p>'; }
}

// Track Order
async function trackOrder() {
  const code = document.getElementById('trackingCode').value.trim().toUpperCase();
  if (!code) return toast('⚠️ Enter code');
  const result = document.getElementById('trackingResult');
  result.style.display = 'block';
  result.innerHTML = 'Tracking...';
  try {
    const o = await api.get('/orders/track/' + code);
    result.innerHTML = `<h3>${o.title}</h3><p>Status: <b>${o.status.toUpperCase()}</b></p><p>Total: N$ ${o.total_price}</p><p>Deliver to: ${o.delivery_address}</p>`;
  } catch (e) { result.innerHTML = '<p style="color:red">' + e.message + '</p>'; }
}

window.placeOrder = placeOrder;
window.submitCheckout = submitCheckout;
window.renderMyOrders = renderMyOrders;
window.trackOrder = trackOrder;