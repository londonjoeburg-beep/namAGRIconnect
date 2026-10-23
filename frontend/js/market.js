/* ══════════════════════════════════════════════════
   MARKET.JS — Complete, bulletproof version
   ══════════════════════════════════════════════════ */

let listingsCache = [];
let currentCheckoutListing = null;
let currentListingIdForComments = null;
let uploadedPhotos = [];

/* ══════════════════════════════════════════════════
   PHOTO UPLOAD HANDLER — Works on mobile & desktop
   ══════════════════════════════════════════════════ */

async function handlePhotoSelect(event) {
  const files = Array.from(event.target.files || []);
  const preview = document.getElementById('photoPreview');
  
  if (!preview) {
    console.error('❌ photoPreview element not found');
    return;
  }

  if (files.length === 0) {
    console.log('No files selected');
    return;
  }

  if (files.length > 10) {
    toast('⚠️ Maximum 10 photos allowed. Only first 10 will be used.');
  }

  const limited = files.slice(0, 10);
  uploadedPhotos = [];

  preview.innerHTML = '<div style="padding:12px;font-size:13px;color:var(--muted)"><span class="spinner"></span> Processing photos...</div>';

  for (let i = 0; i < limited.length; i++) {
    const file = limited[i];
    try {
      const dataUrl = await compressImage(file, 1000, 0.75);
      uploadedPhotos.push({ dataUrl, file });
      console.log(`✅ Photo ${i + 1} ready (${Math.round(dataUrl.length / 1024)}KB)`);
    } catch (e) {
      console.error(`❌ Photo ${i + 1} failed:`, e);
      toast(`⚠️ Photo ${i + 1} could not be processed`);
    }
  }

  renderPhotoPreviews();
  console.log(`✅ ${uploadedPhotos.length} photos ready for upload`);
  toast(`✅ ${uploadedPhotos.length} photo${uploadedPhotos.length > 1 ? 's' : ''} ready`);
}

function renderPhotoPreviews() {
  const preview = document.getElementById('photoPreview');
  if (!preview) return;
  preview.innerHTML = '';
  uploadedPhotos.forEach((photo, idx) => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;display:inline-block';
    wrapper.innerHTML = `
      <img src="${photo.dataUrl}" style="width:70px;height:70px;object-fit:cover;border-radius:10px;border:2px solid var(--green)">
      <button type="button" onclick="removePhoto(${idx})" style="position:absolute;top:-6px;right:-6px;width:22px;height:22px;border-radius:50%;background:var(--danger);color:white;border:none;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center">✕</button>
    `;
    preview.appendChild(wrapper);
  });
}

function compressImage(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > h && w > maxDim) {
          h = h * maxDim / w;
          w = maxDim;
        } else if (h > maxDim) {
          w = w * maxDim / h;
          h = maxDim;
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = ev.target.result;
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}

function removePhoto(index) {
  if (index >= 0 && index < uploadedPhotos.length) {
    uploadedPhotos.splice(index, 1);
    renderPhotoPreviews();
    toast(`🗑️ Photo removed`);
  }
}

/* ══════════════════════════════════════════════════
   HELPER: Get API base URL (local or live)
   ══════════════════════════════════════════════════ */

function getApiBase() {
  return window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://namagriconnect-3.onrender.com';
}

/* ══════════════════════════════════════════════════
   LOAD & RENDER LISTINGS
   ══════════════════════════════════════════════════ */

async function loadListings() {
  const grid = document.getElementById('listingsGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="card" style="grid-column:1/-1;text-align:center;padding:40px"><span class="spinner"></span> Loading...</div>';

  try {
    const rows = await api.get('/listings?sold=false');
    listingsCache = Array.isArray(rows) ? rows : [];
    renderListings();
  } catch (e) {
    grid.innerHTML = '<div class="card" style="grid-column:1/-1;text-align:center;color:var(--danger);padding:24px">⚠️ ' + e.message + '</div>';
  }
}

function renderListings() {
  const grid = document.getElementById('listingsGrid');
  if (!grid) return;

  const searchBox = document.getElementById('searchBox');
  if (searchBox && searchBox.value === 'steins') {
    searchBox.value = '';
  }

  const q = (searchBox?.value || '').toLowerCase();
  const cat = document.getElementById('filterCat')?.value || '';
  const reg = document.getElementById('filterRegion')?.value || '';

  const filtered = listingsCache.filter(function(l) {
    if (q && !(l.title + ' ' + (l.town || '') + ' ' + (l.description || '')).toLowerCase().includes(q)) return false;
    if (cat && l.category !== cat) return false;
    if (reg && l.region !== reg) return false;
    return true;
  });

  if (!filtered.length) {
    grid.innerHTML = '<div class="card" style="grid-column:1/-1;text-align:center;color:var(--muted);padding:24px">No listings match.</div>';
    return;
  }

  grid.innerHTML = '';
  const baseUrl = getApiBase();

  filtered.forEach(function(l) {
    let photos = [];
    try { photos = typeof l.photos === 'string' ? JSON.parse(l.photos) : (l.photos || []); } catch (err) { photos = []; }

    const photo = photos[0];
    // 🔥 FIX: Use getApiBase() instead of hardcoded localhost
    const photoUrl = photo ? (photo.startsWith('http') ? photo : baseUrl + photo) : null;
    const sellerPhone = l.owner_phone || l.contact_phone || l.phone || '';
    const sellerName = l.owner_name || l.contact_name || 'Farmer';
    const sellerPhoneClean = sellerPhone.replace(/\D/g, '');
    
    const isOwner = window.currentUser && window.currentUser.id === l.owner_id;

    let photoHtml = photoUrl
      ? '<img src="' + photoUrl + '" alt="' + l.title + '">'
      : '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:linear-gradient(135deg,#e8f5ec,#c8e6c9)"><img src="img/logo.png" alt="NamAgriConnect" style="height:80px;opacity:0.85"></div>';
    
    let badgeHtml = l.badge ? '<span class="badge gold">✔ ' + l.badge + '</span>' : '';

    const waIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
    
    const callIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>';
    
    const smsIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/></svg>';

    const waBtn = '<a href="https://wa.me/' + sellerPhoneClean + '" target="_blank" style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:10px;background:#25D366;color:white;box-shadow:0 4px 10px rgba(37,211,102,0.3)">' + waIcon + '</a>';
    const callBtn = '<a href="tel:' + sellerPhone + '" style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:10px;background:#2980b9;color:white;box-shadow:0 4px 10px rgba(41,128,185,0.3)">' + callIcon + '</a>';
    const smsBtn = '<button type="button" onclick="openComments(' + l.id + ')" style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:10px;background:#e8b73a;color:#3a2a00;border:none;cursor:pointer;box-shadow:0 4px 10px rgba(232,183,58,0.3)">' + smsIcon + '</button>';

    const buyBtn = !isOwner ? '<button type="button" onclick="event.preventDefault(); event.stopPropagation(); openCheckout(' + l.id + ');" style="padding:8px 12px;font-size:12px;background:#e8b73a;border:none;border-radius:8px;cursor:pointer;font-weight:bold;color:#3a2a00;margin-left:auto;box-shadow:0 4px 10px rgba(232,183,58,0.3)">🛒 Buy Now</button>' : '';
    const ownerBtn = isOwner ? '<button type="button" onclick="markSold(' + l.id + ')" style="padding:8px 12px;font-size:12px;background:#0b6b3a;color:white;border:none;border-radius:8px;cursor:pointer;margin-left:auto">✅ Mark Sold</button>' : '';

    const el = document.createElement('div');
    el.className = 'listing';

    el.innerHTML =
      '<div class="photos">' + photoHtml + '<div class="price-tag">N$ ' + Number(l.price).toLocaleString() + ' / ' + l.unit + '</div><div class="badges">' + badgeHtml + '<span class="badge info">' + l.region + '</span></div></div>' +
      '<div class="body">' +
        '<h3>' + l.title + '</h3>' +
        '<div class="meta"><span>📍 ' + l.town + '</span><span>📦 ' + l.quantity + ' ' + l.unit + '</span></div>' +
        '<div class="meta" style="color:var(--green);font-weight:600;border-top:1px solid var(--border);padding-top:6px"><span>👤 ' + sellerName + '</span><span>📞 ' + (sellerPhone || '—') + '</span></div>' +
        '<p style="font-size:13px;color:var(--muted)">' + (l.description || '') + '</p>' +
        '<div class="actions" style="display:flex;gap:8px;align-items:center;padding-top:10px">' + waBtn + callBtn + smsBtn + buyBtn + ownerBtn + '</div>' +
      '</div>';

    grid.appendChild(el);
  });
}

/* ══════════════════════════════════════════════════
   CHECKOUT
   ══════════════════════════════════════════════════ */

function openCheckout(listingId) {
  console.log('🛒 Buy clicked for listing:', listingId);
  
  if (!window.currentUser) return requireLogin('place an order');
  
  const listing = listingsCache.find(x => x.id === listingId);
  if (!listing) return alert('Listing not found');

  currentCheckoutListing = listing;

  document.getElementById('checkoutSummary').innerHTML = 
    '<b>' + listing.title + '</b><br>' +
    'Price: N$ ' + listing.price + ' / ' + listing.unit + '<br>' +
    'Available: ' + listing.quantity + ' ' + listing.unit;
    
  document.getElementById('checkoutQty').value = '';
  document.getElementById('checkoutAddress').value = '';
  document.getElementById('checkoutError').style.display = 'none';
  
  const modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.classList.add('show');
    modal.style.display = 'flex';
    modal.style.zIndex = '9999';
    console.log('✅ Modal forced open');
  }
}

async function submitCheckout() {
  const qty = parseFloat(document.getElementById('checkoutQty').value);
  const address = document.getElementById('checkoutAddress').value.trim();
  const errEl = document.getElementById('checkoutError');
  
  errEl.style.display = 'none';
  if (isNaN(qty) || qty <= 0) { errEl.textContent = 'Enter valid quantity'; errEl.style.display = 'block'; return; }
  if (!address) { errEl.textContent = 'Delivery address required'; errEl.style.display = 'block'; return; }

  const btn = document.querySelector('#checkoutModal .btn');
  btn.textContent = 'Processing...'; btn.disabled = true;

  try {
    const res = await api.post('/orders', { 
      listing_id: currentCheckoutListing.id, 
      quantity: qty, 
      delivery_address: address,
      contact_phone: window.currentUser.phone 
    });
    
    closeModal('checkoutModal');
    alert('✅ Order Confirmed!\n\nTracking: ' + res.tracking_code + '\nNew Balance: N$ ' + res.new_balance);
    loadListings();
    goTo('orders');
  } catch (e) {
    errEl.textContent = e.message; errEl.style.display = 'block';
  } finally {
    btn.textContent = '✅ Confirm & Pay'; btn.disabled = false;
  }
}

/* ══════════════════════════════════════════════════
   COMMENTS
   ══════════════════════════════════════════════════ */

async function openComments(id) {
  currentListingIdForComments = id;
  const list = document.getElementById('commentList');
  list.innerHTML = '<span class="spinner"></span>';
  openModal('commentModal');
  
  try {
    const rows = await api.get('/comments/listing/' + id);
    list.innerHTML = rows.length
      ? rows.map(c => '<div class="talk-item"><div class="who">' + c.user_name + '</div><div style="font-size:13px">' + c.text + '</div></div>').join('')
      : '<p style="color:var(--muted)">No comments yet.</p>';
  } catch (e) {
    list.innerHTML = '<p style="color:red">' + e.message + '</p>';
  }
}

async function postComment() {
  if (!requireLogin('post a comment')) return;
  const input = document.getElementById('commentInput');
  const text = input.value.trim();
  if (!text) return;
  
  try {
    await api.post('/comments', { listing_id: currentListingIdForComments, text: text });
    input.value = '';
    openComments(currentListingIdForComments);
  } catch (e) { toast(e.message); }
}

/* ══════════════════════════════════════════════════
   MARK SOLD
   ══════════════════════════════════════════════════ */

async function markSold(id) {
  if (!confirm('Mark as sold?')) return;
  await api.post('/listings/' + id + '/sold', {});
  loadListings();
}

/* ══════════════════════════════════════════════════
   POST NEW LISTING
   ══════════════════════════════════════════════════ */

async function submitListing() {
  if (!requireLogin('post a listing')) return;

  const title = document.getElementById('newTitle')?.value.trim();
  const qty = document.getElementById('newQty')?.value.trim();
  const price = parseFloat(document.getElementById('newPrice')?.value);
  const town = document.getElementById('newTown')?.value.trim();

  if (!title || !qty || !price || !town) {
    return toast("⚠️ Fill in: Title, Quantity, Price, Town");
  }

  const fd = new FormData();
  fd.append('title', title);
  fd.append('category', document.getElementById('newCat').value);
  fd.append('description', document.getElementById('newDesc').value || '');
  fd.append('quantity', qty);
  fd.append('unit', document.getElementById('newUnit').value);
  fd.append('price', price);
  fd.append('region', document.getElementById('newRegion').value);
  fd.append('town', town);
  fd.append('badge', document.getElementById('newBadge').value || '');
  fd.append('delivery', document.getElementById('newDelivery').value || 'Pickup only');
  
  console.log(`📤 Submitting with ${uploadedPhotos.length} photos`);
  uploadedPhotos.forEach(function(p) { fd.append('photos', p.file); });

  toast('📤 Publishing... please wait');

  try {
    const baseUrl = getApiBase();
    const token = localStorage.getItem('token');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    const response = await fetch(baseUrl + '/api/listings', {
      method: 'POST',
      headers: { 'Authorization': token ? 'Bearer ' + token : '' },
      body: fd,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({ error: 'Server error ' + response.status }));
      throw new Error(errData.error || 'Failed: ' + response.status);
    }

    toast('🌾 Published successfully!');
    
    uploadedPhotos = [];
    const preview = document.getElementById('photoPreview');
    if (preview) preview.innerHTML = '';
    
    ['newTitle', 'newQty', 'newPrice', 'newTown', 'newDesc'].forEach(function(id) {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    
    goTo('market');
    await loadListings();
  } catch (e) {
    console.error('❌ Publish error:', e);
    if (e.name === 'AbortError') {
      toast('⏱️ Server took too long. Try again.');
    } else {
      toast('⚠️ ' + e.message);
    }
  }
}

/* ══════════════════════════════════════════════════
   ORDERS & TRACKING
   ══════════════════════════════════════════════════ */

async function renderMyOrders() {
  const container = document.getElementById('myOrdersContent');
  if (!container) return;
  
  if (!window.currentUser) {
    container.innerHTML = '<p style="color:var(--muted)">Login to view orders.</p>';
    return;
  }

  container.innerHTML = '<span class="spinner"></span> Loading...';

  try {
    const orders = await api.get('/orders/my');
    if (!orders.length) {
      container.innerHTML = '<p style="color:var(--muted)">No orders yet. Browse the market to place your first order!</p>';
      return;
    }

    let html = '';
    orders.forEach(o => {
      let statusEmoji = '⏳';
      if (o.status === 'processing') statusEmoji = '📦';
      if (o.status === 'shipped') statusEmoji = '🚚';
      if (o.status === 'delivered') statusEmoji = '✅';
      if (o.status === 'cancelled') statusEmoji = '❌';

      let badgeClass = 'warn';
      if (o.status === 'delivered') badgeClass = 'ok';
      if (o.status === 'cancelled') badgeClass = 'danger';

      html += '<div class="talk-item" style="margin-bottom:10px">';
      html +=   '<div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:8px">';
      html +=     '<div>';
      html +=       '<b>' + o.title + '</b>';
      html +=       '<div style="font-size:12px;color:var(--muted);margin-top:4px">' + o.quantity + ' units • N$ ' + Number(o.total_price).toFixed(2) + '</div>';
      html +=       '<div style="font-size:11px;color:var(--muted);margin-top:2px">Seller: ' + (o.seller_name || 'Farmer') + ' • ' + new Date(o.created_at).toLocaleDateString() + '</div>';
      html +=     '</div>';
      html +=     '<div style="text-align:right">';
      html +=       '<span class="badge ' + badgeClass + '">' + statusEmoji + ' ' + o.status + '</span>';
      html +=       '<div style="font-size:11px;font-family:monospace;margin-top:6px;background:rgba(0,0,0,0.05);padding:4px 8px;border-radius:6px">' + o.tracking_code + '</div>';
      html +=     '</div>';
      html +=   '</div>';
      html += '</div>';
    });
    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = '<p style="color:var(--danger)">' + e.message + '</p>';
  }
}

async function trackOrder() {
  const code = document.getElementById('trackingCode').value.trim().toUpperCase();
  if (!code) return toast('⚠️ Enter tracking code');

  const result = document.getElementById('trackingResult');
  result.style.display = 'block';
  result.innerHTML = '<span class="spinner"></span> Tracking...';

  try {
    const order = await api.get('/orders/track/' + code);

    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIdx = steps.indexOf(order.status);

    let stepsHtml = '';
    steps.forEach((s, i) => {
      const active = i <= currentIdx;
      stepsHtml += '<div style="text-align:center;flex:1;position:relative;z-index:2">';
      stepsHtml +=   '<div style="width:40px;height:40px;border-radius:50%;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;font-size:20px;background:' + (active ? 'var(--green)' : 'rgba(0,0,0,0.1)') + ';color:' + (active ? 'white' : 'var(--muted)') + '">' + (active ? '✓' : (i + 1)) + '</div>';
      stepsHtml +=   '<div style="font-size:11px;font-weight:600;color:' + (active ? 'var(--green)' : 'var(--muted)') + '">' + s.toUpperCase() + '</div>';
      stepsHtml += '</div>';
    });

    result.innerHTML =
      '<h3 style="color:var(--green);margin-bottom:12px">📦 Order ' + order.tracking_code + '</h3>' +
      '<p style="font-size:13px;margin-bottom:8px"><b>' + order.title + '</b> × ' + order.quantity + '</p>' +
      '<p style="font-size:13px;color:var(--muted);margin-bottom:16px">Total: N$ ' + Number(order.total_price).toFixed(2) + '</p>' +
      '<div style="display:flex;justify-content:space-between;margin:24px 0;position:relative">' + stepsHtml + '</div>' +
      '<p style="font-size:13px;margin-top:16px"><b>Deliver to:</b> ' + order.delivery_address + '</p>' +
      '<p style="font-size:13px"><b>Ordered:</b> ' + new Date(order.created_at).toLocaleString() + '</p>';
  } catch (e) {
    result.innerHTML = '<p style="color:var(--danger)">' + e.message + '</p>';
  }
}

/* ══════════════════════════════════════════════════
   WIRE UP PHOTO INPUT (replaces old duplicate)
   ══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
  const photoInput = document.getElementById('newPhotos');
  if (photoInput) {
    photoInput.addEventListener('change', handlePhotoSelect);
    console.log('✅ Photo input wired to handlePhotoSelect');
  }
});

/* ══════════════════════════════════════════════════
   EXPORTS
   ══════════════════════════════════════════════════ */

window.loadListings = loadListings;
window.renderListings = renderListings;
window.openCheckout = openCheckout;
window.submitCheckout = submitCheckout;
window.openComments = openComments;
window.postComment = postComment;
window.markSold = markSold;
window.submitListing = submitListing;
window.renderMyOrders = renderMyOrders;
window.trackOrder = trackOrder;
window.handlePhotoSelect = handlePhotoSelect;
window.removePhoto = removePhoto;

// Initial Load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadListings);
} else {
  loadListings();
}

console.log('✅ market.js loaded — clean version');