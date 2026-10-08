/* Marketplace — clean version */
let listingsCache = [];
let uploadedPhotos = [];
let currentListingId = null;
let replyParentId = null;

function loadListings(){
  const grid = document.getElementById('listingsGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="card" style="grid-column:1/-1;text-align:center;padding:40px"><span class="spinner"></span> Loading...</div>';

  api.get('/listings?sold=false').then(rows => {
    listingsCache = Array.isArray(rows) ? rows : [];
    console.log('✅ Loaded', listingsCache.length, 'listings');
    renderListings();
  }).catch(e => {
    console.error('❌ loadListings:', e);
    grid.innerHTML = '<div class="card" style="grid-column:1/-1;text-align:center;color:var(--danger);padding:24px">⚠️ ' + e.message + '<br><button class="btn small" style="margin-top:8px" onclick="loadListings()">🔄 Retry</button></div>';
    if (typeof applyTranslations === 'function') applyTranslations();
  });
}

function renderListings(){
  const grid = document.getElementById('listingsGrid');
  if (!grid) return;
  const q = (document.getElementById('searchBox').value || '').toLowerCase();
  const cat = document.getElementById('filterCat').value;
  const reg = document.getElementById('filterRegion').value;

  const filtered = listingsCache.filter(function(l) {
    if (q && !(l.title + ' ' + (l.town || '') + ' ' + (l.description || '')).toLowerCase().includes(q)) return false;
    if (cat && l.category !== cat) return false;
    if (reg && l.region !== reg) return false;
    return true;
  });

  if (!filtered.length) {
    grid.innerHTML = '<div class="card" style="grid-column:1/-1;text-align:center;color:var(--muted);padding:24px">No listings match.</div>';
    const s = document.getElementById('statListings');
    if (s) s.textContent = 0;
    return;
  }

  grid.innerHTML = '';
  filtered.forEach(function(l) {
    let photos = [];
    try { photos = typeof l.photos === 'string' ? JSON.parse(l.photos) : (l.photos || []); } catch (err) {}
    const photo = photos[0];
    const photoUrl = photo ? 'http://localhost:4000' + photo : null;

    const sellerPhone = l.owner_phone || l.contact_phone || l.phone || '';
    const sellerName = l.owner_name || l.contact_name || 'Farmer';
    const sellerPhoneClean = sellerPhone.replace(/\D/g, '');
    const isOwner = window.currentUser && window.currentUser.id === l.owner_id;

    const el = document.createElement('div');
    el.className = 'listing';
    el.innerHTML =
      '<div class="photos">' +
        (photoUrl ? '<img src="' + photoUrl + '" alt="' + l.title + '">' : '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:56px">🌾</div>') +
        '<div class="price-tag">N$ ' + Number(l.price).toLocaleString() + ' / ' + l.unit + '</div>' +
        '<div class="badges">' +
          (l.badge ? '<span class="badge gold">✔ ' + l.badge + '</span>' : '') +
          '<span class="badge info">' + l.region + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="body">' +
        '<h3>' + l.title + '</h3>' +
        '<div class="meta"><span>📍 ' + l.town + '</span><span>📦 ' + l.quantity + ' ' + l.unit + '</span></div>' +
        '<div class="meta" style="color:var(--green);font-weight:600;border-top:1px solid var(--border);padding-top:6px">' +
          '<span>👤 ' + sellerName + '</span><span>📞 ' + (sellerPhone || '—') + '</span>' +
        '</div>' +
        '<p style="font-size:13px;color:var(--muted)">' + (l.description || '') + '</p>' +
        '<div class="actions">' +
          '<a class="wa-btn" href="https://wa.me/' + sellerPhoneClean + '?text=' + encodeURIComponent('Hello ' + sellerName + '! Interested in: ' + l.title) + '" target="_blank">💬 WhatsApp</a>' +
          '<a class="btn small outline" href="tel:' + sellerPhone + '">📞 Call</a>' +
          '<button class="btn small outline" onclick="openComments(' + l.id + ')">💬 Comments</button>' +
          (isOwner ? '<button class="btn small" onclick="markSold(' + l.id + ')">✅ Mark Sold</button>' : '') +
        '</div>' +
      '</div>';
    grid.appendChild(el);
  });

  const s = document.getElementById('statListings');
  if (s) s.textContent = filtered.length;
  const sf = document.getElementById('statFarmers');
  if (sf) sf.textContent = '12,480';
  const st = document.getElementById('statTrades');
  if (st) st.textContent = '3,721';
}

function markSold(id){
  if (!requireLogin('mark your listing as sold')) return;
  if (!confirm('Mark as SOLD?')) return;
  api.post('/listings/' + id + '/sold', {}).then(function() {
    toast("✅ Archived to Sales History");
    loadListings();
  }).catch(function(e) { toast("⚠️ " + e.message); });
}

document.getElementById('newPhotos')?.addEventListener('change', function(e) {
  uploadedPhotos = [];
  const preview = document.getElementById('photoPreview');
  if (!preview) return;
  preview.innerHTML = '';
  [...e.target.files].slice(0, 10).forEach(function(f) {
    const reader = new FileReader();
    reader.onload = function(ev) {
      uploadedPhotos.push({ dataUrl: ev.target.result, file: f });
      const im = document.createElement('img');
      im.src = ev.target.result;
      im.style.cssText = 'width:60px;height:60px;object-fit:cover;border-radius:8px';
      preview.appendChild(im);
    };
    reader.readAsDataURL(f);
  });
});

function submitListing(){
  if (!requireLogin('post a listing')) return;

  const valid = window.validateFields ? window.validateFields([
    { el: document.getElementById('newTitle'), message: 'Product title required' },
    { el: document.getElementById('newQty'), message: 'Quantity required' },
    { el: document.getElementById('newPrice'), message: 'Price required' },
    { el: document.getElementById('newTown'), message: 'Town required' }
  ]) : true;

  if (!valid) { toast("⚠️ Fill in the red fields"); return; }

  const title = document.getElementById('newTitle').value.trim();
  const qty = document.getElementById('newQty').value.trim();
  const price = parseFloat(document.getElementById('newPrice').value);
  const town = document.getElementById('newTown').value.trim();

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
  uploadedPhotos.forEach(function(p) { fd.append('photos', p.file); });

  api.post('/listings', fd, true).then(function() {
    toast("🌾 Published! Refreshing...");
    uploadedPhotos = [];
    const prev = document.getElementById('photoPreview');
    if (prev) prev.innerHTML = '';
    ['newTitle','newQty','newPrice','newTown','newDesc'].forEach(function(id) {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    goTo('market');
    loadListings();
    toast("✅ Listing is live!");
  }).catch(function(e) { toast("⚠️ " + e.message); });
}

function openComments(id){
  currentListingId = id;
  const l = listingsCache.find(function(x) { return x.id === id; });
  const titleEl = document.getElementById('commentTitle');
  if (titleEl) titleEl.textContent = '💬 ' + (l ? l.title : 'Listing');
  const list = document.getElementById('commentList');
  if (!list) return;
  list.innerHTML = '<span class="spinner"></span>';

  api.get('/comments/listing/' + id).then(function(rows) {
    list.innerHTML = rows.length
      ? rows.map(renderComment).join('')
      : '<p style="color:var(--muted);font-size:13px">No comments yet.</p>';
  }).catch(function(e) {
    list.innerHTML = '<p style="color:var(--danger);font-size:13px">' + e.message + '</p>';
  });

  openModal('commentModal');
}

function renderComment(c){
  const replies = c.replies || [];
  const isOwner = window.currentUser && window.currentUser.id === c.owner_id;
  let html = '<div class="talk-item" style="margin-bottom:12px">' +
    '<div class="who">' + c.user_name + '</div>' +
    '<div style="font-size:13px;margin:4px 0">' + c.text + '</div>' +
    '<div style="display:flex;gap:12px;font-size:12px;color:var(--muted);margin-top:6px">' +
      '<span style="cursor:pointer" onclick="likeComment(' + c.id + ',this)">👍 ' + (c.likes || 0) + '</span>' +
      '<span style="cursor:pointer" onclick="replyToComment(' + c.id + ')">↩️ Reply</span>' +
      (isOwner ? '<span style="cursor:pointer;color:var(--danger)" onclick="deleteComment(' + c.id + ')">🗑️</span>' : '') +
    '</div>';
  if (replies.length) {
    html += '<div style="margin-left:16px;margin-top:8px;padding-left:8px;border-left:2px solid var(--border)">';
    replies.forEach(function(r) {
      html += '<div style="padding:6px 0"><div class="who" style="font-size:12px">' + r.user_name + '</div><div style="font-size:12px">' + r.text + '</div></div>';
    });
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function likeComment(id, el){
  if (!requireLogin('like comments')) return;
  api.post('/comments/' + id + '/like', {}).then(function(r) {
    if (el) el.innerHTML = '👍 ' + r.likes;
  }).catch(function(e) { toast("⚠️ " + e.message); });
}

function replyToComment(id){
  replyParentId = id;
  const inp = document.getElementById('commentInput');
  if (inp) { inp.placeholder = 'Replying to comment #' + id + '...'; inp.focus(); }
}

function deleteComment(id){
  if (!confirm('Delete this comment?')) return;
  api.del('/comments/' + id).then(function() {
    openComments(currentListingId);
    toast("🗑️ Deleted");
  }).catch(function(e) { toast("⚠️ " + e.message); });
}

function postComment(){
  if (!requireLogin('post a comment')) return;
  const input = document.getElementById('commentInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) { toast("⚠️ Type a comment"); return; }
  if (!currentListingId) { toast("⚠️ No listing selected"); return; }
  api.post('/comments', { listing_id: currentListingId, text: text, parent_id: replyParentId }).then(function() {
    input.value = '';
    input.placeholder = 'Ask about delivery, price...';
    replyParentId = null;
    openComments(currentListingId);
    toast("💬 Posted");
  }).catch(function(e) { toast("⚠️ " + e.message); });
}

// Attach everything to window FIRST — before any code runs
window.loadListings = loadListings;
window.renderListings = renderListings;
window.markSold = markSold;
window.submitListing = submitListing;
window.openComments = openComments;
window.postComment = postComment;
window.likeComment = likeComment;
window.replyToComment = replyToComment;
window.deleteComment = deleteComment;

// Ticker — after everything is defined
function initTicker() {
  api.get('/rfqs').then(function(rfqs) {
    const items = rfqs.slice(0, 8).map(function(r) {
      return '📢 ' + r.item + ' — ' + r.region + (r.budget ? ' — N$ ' + Number(r.budget).toLocaleString() : '');
    });
    if (!items.length) items.push('📢 No active RFQs', '🌾 Fresh listings daily');
    const track = document.getElementById('tickerTrack');
    if (track) track.innerHTML = items.map(function(i) { return '<span>' + i + '</span>'; }).join('');
  }).catch(function() {
    const track = document.getElementById('tickerTrack');
    if (track) track.innerHTML = '<span>📢 Market ticker...</span>';
  });
}

// Boot
function bootMarket() {
  loadListings();
  initTicker();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootMarket);
} else {
  bootMarket();
}