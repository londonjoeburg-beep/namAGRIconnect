const API = window.location.origin + '/api';
let currentUser = JSON.parse(localStorage.getItem('user') || 'null');
let currentFilter = 'all';
let sentimentChart = null;
let sourceChart = null;
let adminKey = localStorage.getItem('adminKey') || '';
let currentAdminTab = 'users';

console.log('✅ app.js loaded');

// ==========================================
// TOAST
// ==========================================
function showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) {
        alert(message);
        return;
    }
    toast.textContent = message;
    toast.className = 'toast ' + type;
    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => toast.classList.remove('show'), duration);
}

// ==========================================
// ESCAPE HTML
// ==========================================
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ==========================================
// ALERT
// ==========================================
function showAlert(msg, type = 'info') {
    const el = document.getElementById('alert');
    if (!el) return;
    el.textContent = msg;
    el.className = 'alert show ' + type;
    setTimeout(() => el.classList.remove('show'), 4000);
}

// ==========================================
// NAVIGATION
// ==========================================
function showSection(name) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(name);
    if (target) target.classList.add('active');
    
    if (name === 'browse') loadProducts();
    if (name === 'weather') loadWeather();
    if (name === 'market') loadMarket();
    if (name === 'community') loadCommunity();
    if (name === 'partners') loadPartners();
    if (name === 'admin') initAdmin();
}

// ==========================================
// UPDATE USER UI
// ==========================================
function updateUI() {
    if (currentUser) {
        document.getElementById('userInfo').textContent = `👤 ${currentUser.username} (${currentUser.role || 'farmer'})`;
        document.getElementById('userInfo').style.display = 'inline-block';
        document.getElementById('regNav').style.display = 'none';
        document.getElementById('loginNav').style.display = 'none';
        document.getElementById('postNav').style.display = 'inline-block';
        document.getElementById('logoutNav').style.display = 'inline-block';
        
        if (currentUser.role === 'admin') {
            document.getElementById('adminNav').style.display = 'inline-block';
        } else {
            document.getElementById('adminNav').style.display = 'none';
        }
    } else {
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('regNav').style.display = 'inline-block';
        document.getElementById('loginNav').style.display = 'inline-block';
        document.getElementById('postNav').style.display = 'none';
        document.getElementById('logoutNav').style.display = 'none';
        document.getElementById('adminNav').style.display = 'none';
    }
}

function logout() {
    if (!confirm('Logout?')) return;
    currentUser = null;
    localStorage.removeItem('user');
    updateUI();
    showAlert('Logged out!', 'success');
    showSection('home');
}

// ==========================================
// REGISTER
// ==========================================
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Registering...';
    
    try {
        const res = await fetch(API + '/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: document.getElementById('regUsername').value.trim(),
                password: document.getElementById('regPassword').value,
                fullName: document.getElementById('regFullName').value.trim(),
                location: document.getElementById('regLocation').value.trim(),
                phone: document.getElementById('regPhone').value.trim(),
                email: document.getElementById('regEmail').value.trim()
            })
        });
        const data = await res.json();
        if (data.success) {
            showAlert('✅ Registration successful! Please login.', 'success');
            e.target.reset();
            setTimeout(() => showSection('login'), 1000);
        } else {
            showAlert('❌ ' + data.message, 'error');
        }
    } catch (err) {
        showAlert('❌ Network error', 'error');
    }
    
    btn.disabled = false;
    btn.textContent = 'Create Account';
});

// ==========================================
// LOGIN
// ==========================================
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Logging in...';
    
    try {
        const res = await fetch(API + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: document.getElementById('loginUsername').value.trim(),
                password: document.getElementById('loginPassword').value
            })
        });
        const data = await res.json();
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(currentUser));
            updateUI();
            showAlert('✅ Welcome, ' + currentUser.username + '!', 'success');
            e.target.reset();
            showSection('home');
        } else {
            showAlert('❌ ' + data.message, 'error');
        }
    } catch (err) {
        showAlert('❌ Network error', 'error');
    }
    
    btn.disabled = false;
    btn.textContent = 'Login';
});

// ==========================================
// POST PRODUCT
// ==========================================
document.getElementById('prodImage').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            document.getElementById('imgPreview').src = ev.target.result;
            document.getElementById('imgPreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) {
        showAlert('⚠️ Please login first', 'error');
        showSection('login');
        return;
    }
    
    let imageData = null;
    const file = document.getElementById('prodImage').files[0];
    if (file) {
        imageData = await new Promise(r => {
            const reader = new FileReader();
            reader.onload = (ev) => r(ev.target.result);
            reader.readAsDataURL(file);
        });
    }
    
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Posting...';
    
    try {
        const res = await fetch(API + '/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: document.getElementById('prodTitle').value.trim(),
                description: document.getElementById('prodDescription').value.trim(),
                price: parseFloat(document.getElementById('prodPrice').value),
                quantity: document.getElementById('prodQuantity').value.trim(),
                category: document.getElementById('prodCategory').value,
                location: document.getElementById('prodLocation').value.trim(),
                sellerId: currentUser.id,
                image: imageData
            })
        });
        const data = await res.json();
        if (data.success) {
            showAlert('✅ Product posted!', 'success');
            e.target.reset();
            document.getElementById('imgPreview').style.display = 'none';
            loadProducts();
            showSection('browse');
        } else {
            showAlert('❌ ' + data.message, 'error');
        }
    } catch (err) {
        showAlert('❌ Network error', 'error');
    }
    
    btn.disabled = false;
    btn.textContent = 'Post Product';
});

// ==========================================
// LOAD PRODUCTS
// ==========================================
async function loadProducts() {
    const container = document.getElementById('productList');
    if (!container) return;
    container.innerHTML = '<p style="grid-column:1/-1; text-align:center;">Loading products...</p>';
    
    try {
        const res = await fetch(API + '/products');
        const data = await res.json();
        
        if (data.products.length === 0) {
            container.innerHTML = '<p style="grid-column:1/-1; text-align:center;">No products yet. Be the first to post!</p>';
            return;
        }
        
        container.innerHTML = data.products.map(p => `
            <div class="product-card clickable" onclick="viewProduct(${p.id})">
                <span class="badge">${escapeHtml(p.category || 'General')}</span>
                <h3>${escapeHtml(p.title)}</h3>
                <p>${escapeHtml(p.description || '')}</p>
                ${p.image ? `<img src="${p.image}" alt="${escapeHtml(p.title)}">` : ''}
                <div class="price">N$ ${p.price}</div>
                <p>📍 ${escapeHtml(p.location || 'Namibia')}</p>
                <p>👤 ${escapeHtml(p.full_name || p.username)}</p>
                ${p.quantity ? `<p>📦 ${escapeHtml(p.quantity)}</p>` : ''}
                <p style="font-size:0.8rem; opacity:0.7; margin-top:0.5rem;">Click for details →</p>
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#f87171;">Failed to load products</p>';
    }
}

// ==========================================
// VIEW PRODUCT
// ==========================================
async function viewProduct(productId) {
    try {
        const [productRes, commentsRes] = await Promise.all([
            fetch(API + '/products/' + productId),
            fetch(API + '/products/' + productId + '/comments')
        ]);
        const productData = await productRes.json();
        const commentsData = await commentsRes.json();
        
        if (!productData.success) {
            showAlert('Product not found', 'error');
            return;
        }
        
        const p = productData.product;
        const comments = commentsData.comments || [];
        
        const modal = document.getElementById('productModal');
        const body = document.getElementById('productModalBody');
        
        const cleanPhone = (p.phone || '').replace(/[^0-9]/g, '');
        const whatsappLink = cleanPhone ? `https://wa.me/${cleanPhone}` : null;
        
        body.innerHTML = `
            <h2>${escapeHtml(p.title)}</h2>
            <span class="badge">${escapeHtml(p.category || 'General')}</span>
            
            ${p.image ? `<img src="${p.image}" style="width:100%; max-height:300px; object-fit:cover; border-radius:10px; margin:1rem 0;">` : ''}
            
            <p style="margin:1rem 0; font-size:1.05rem;">${escapeHtml(p.description || 'No description')}</p>
            <div class="price" style="font-size:2rem;">N$ ${p.price}</div>
            
            <div style="background:rgba(255,255,255,0.1); padding:1rem; border-radius:10px; margin:1rem 0;">
                <h4 style="margin-bottom:0.5rem; color:#95d5b2;">📋 Seller Information</h4>
                <p>👤 ${escapeHtml(p.full_name || p.username)}</p>
                <p>📍 ${escapeHtml(p.location || 'Namibia')}</p>
                ${p.quantity ? `<p>📦 ${escapeHtml(p.quantity)}</p>` : ''}
            </div>
            
            <div style="background:rgba(74,222,128,0.15); padding:1rem; border-radius:10px; margin:1rem 0; border-left:4px solid #4ade80;">
                <h4 style="margin-bottom:0.8rem; color:#95d5b2;">📞 Contact Seller</h4>
                <p>📞 Phone: <strong>${escapeHtml(p.phone || 'Not provided')}</strong></p>
                <p>📧 Email: <strong>${escapeHtml(p.email || 'Not provided')}</strong></p>
                <div style="display:flex; gap:0.5rem; margin-top:1rem; flex-wrap:wrap;">
                    ${whatsappLink ? `<a href="${whatsappLink}" target="_blank" style="background:#25D366; color:white; padding:0.6rem 1.2rem; border-radius:8px; text-decoration:none; font-weight:600;">💬 WhatsApp</a>` : ''}
                    ${p.phone ? `<a href="tel:${p.phone}" style="background:#4ade80; color:#1b4332; padding:0.6rem 1.2rem; border-radius:8px; text-decoration:none; font-weight:600;">📞 Call</a>` : ''}
                    ${p.email ? `<a href="mailto:${p.email}" style="background:#3b82f6; color:white; padding:0.6rem 1.2rem; border-radius:8px; text-decoration:none; font-weight:600;">📧 Email</a>` : ''}
                </div>
            </div>
            
            ${currentUser && p.seller_id === currentUser.id ? `
                <div style="margin-top:1rem; padding:1rem; background:rgba(248,113,113,0.15); border-radius:10px; border-left:4px solid #f87171;">
                    <h4 style="color:#f87171; margin-bottom:0.5rem;">🔧 Seller Actions</h4>
                    <p style="font-size:0.85rem; opacity:0.8; margin-bottom:0.5rem;">Mark as sold if the product has been purchased.</p>
                    <button onclick="markProductSold(${p.id})" style="background:#f87171; color:white;">✅ Mark as SOLD</button>
                </div>
            ` : ''}
            
            <div style="margin-top:1.5rem;">
                <h4 style="color:#95d5b2; margin-bottom:1rem;">💬 Comments (${comments.length})</h4>
                
                <div id="productCommentsList">
                    ${comments.filter(c => !c.parent_id).map(c => renderProductComment(c, comments, productId)).join('') || '<p style="opacity:0.6;">No comments yet. Be the first!</p>'}
                </div>
                
                ${currentUser ? `
                    <div style="margin-top:1rem; background:rgba(255,255,255,0.05); padding:1rem; border-radius:10px;">
                        <textarea id="newCommentText-${productId}" placeholder="Write a comment..." style="width:100%; min-height:80px;"></textarea>
                        <button onclick="postProductComment(${productId})" style="margin-top:0.5rem;">Post Comment</button>
                    </div>
                ` : `
                    <p style="margin-top:1rem; opacity:0.7;">🔒 <a onclick="closeProductModal(); showSection('login')" style="color:#95d5b2; cursor:pointer;">Login</a> to comment</p>
                `}
            </div>
        `;
        
        modal.classList.add('active');
    } catch (e) {
        console.error(e);
        showAlert('Error loading product', 'error');
    }
}

// ==========================================
// RENDER PRODUCT COMMENT
// ==========================================
function renderProductComment(comment, allComments, productId, depth = 0) {
    const replies = allComments.filter(c => c.parent_id === comment.id);
    const indent = depth * 30;
    
    return `
        <div style="margin-left:${indent}px; margin-bottom:0.8rem; padding:0.8rem; background:rgba(255,255,255,${depth === 0 ? '0.08' : '0.04'}); border-radius:8px; border-left:3px solid ${depth === 0 ? '#95d5b2' : '#4ade80'};">
            <div style="display:flex; justify-content:space-between; align-items:start;">
                <div>
                    <strong>${escapeHtml(comment.full_name || comment.username || 'User')}</strong>
                    <span style="font-size:0.75rem; opacity:0.6; margin-left:0.5rem;">${new Date(comment.created_at).toLocaleString()}</span>
                </div>
            </div>
            <p style="margin:0.5rem 0;">${escapeHtml(comment.comment)}</p>
            
            <div style="display:flex; gap:0.8rem; margin-top:0.5rem; font-size:0.85rem;">
                <button onclick="likeProductComment(${comment.id}, ${productId})" style="background:none; border:none; color:#95d5b2; cursor:pointer; padding:0;">👍 ${comment.likes || 0}</button>
                <button onclick="dislikeProductComment(${comment.id}, ${productId})" style="background:none; border:none; color:#f87171; cursor:pointer; padding:0;">👎 ${comment.dislikes || 0}</button>
                ${currentUser ? `<button onclick="toggleProductReply(${comment.id})" style="background:none; border:none; color:#95d5b2; cursor:pointer; padding:0;">↩️ Reply</button>` : ''}
            </div>
            
            <div id="replyBox-${comment.id}" style="display:none; margin-top:0.5rem;">
                <textarea id="replyText-${comment.id}" placeholder="Write a reply..." style="width:100%; min-height:60px;"></textarea>
                <button onclick="postProductReply(${comment.id}, ${productId})" style="margin-top:0.3rem;">Post Reply</button>
            </div>
            
            ${replies.length > 0 ? replies.map(r => renderProductComment(r, allComments, productId, depth + 1)).join('') : ''}
        </div>
    `;
}

// ==========================================
// PRODUCT COMMENT FUNCTIONS
// ==========================================
async function postProductComment(productId) {
    if (!currentUser) return showAlert('Login first', 'error');
    const text = document.getElementById('newCommentText-' + productId).value.trim();
    if (!text) return showAlert('Write a comment', 'error');
    
    try {
        await fetch(API + '/products/' + productId + '/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id, comment: text })
        });
        viewProduct(productId);
        showToast('✅ Comment posted!');
    } catch (e) {
        showAlert('Error posting', 'error');
    }
}

function toggleProductReply(commentId) {
    const box = document.getElementById('replyBox-' + commentId);
    if (box) box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

async function postProductReply(commentId, productId) {
    if (!currentUser) return;
    const text = document.getElementById('replyText-' + commentId).value.trim();
    if (!text) return showAlert('Write a reply', 'error');
    
    try {
        await fetch(API + '/products/comments/' + commentId + '/reply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id, reply: text })
        });
        viewProduct(productId);
        showToast('✅ Reply posted!');
    } catch (e) {
        showAlert('Error', 'error');
    }
}

async function likeProductComment(commentId, productId) {
    if (!currentUser) return showAlert('Login to like', 'error');
    try {
        await fetch(API + '/products/comments/' + commentId + '/like', { method: 'POST' });
        viewProduct(productId);
    } catch (e) { console.error(e); }
}

async function dislikeProductComment(commentId, productId) {
    if (!currentUser) return showAlert('Login to dislike', 'error');
    try {
        await fetch(API + '/products/comments/' + commentId + '/dislike', { method: 'POST' });
        viewProduct(productId);
    } catch (e) { console.error(e); }
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

// ==========================================
// MARK PRODUCT AS SOLD
// ==========================================
async function markProductSold(productId) {
    if (!currentUser) return showAlert('Login first', 'error');
    if (!confirm('Mark this product as SOLD? It will be removed from listings.')) return;

    try {
        const res = await fetch(API + '/products/' + productId + '/sold', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id })
        });
        const data = await res.json();
        if (data.success) {
            showToast('✅ Product marked as SOLD!', 'success');
            closeProductModal();
            loadProducts();
        } else {
            showAlert('❌ ' + data.message, 'error');
        }
    } catch (e) {
        showAlert('Error', 'error');
    }
}

// ==========================================
// SEARCH
// ==========================================
document.getElementById('searchBox').addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    document.querySelectorAll('#productList .product-card').forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(search) ? 'block' : 'none';
    });
});

// ==========================================
// WEATHER
// ==========================================
async function loadWeather() {
    const container = document.getElementById('weatherList');
    if (!container) return;
    
    container.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:2rem;">🌤️ Loading LIVE weather from Namibia...</p>';
    
    try {
        const res = await fetch(API + '/weather');
        const data = await res.json();
        
        if (data.success && data.weather) {
            container.innerHTML = data.weather.map(w => {
                if (w.error) {
                    return `<div class="product-card" style="border-left-color:#f87171;"><h3>📍 ${w.region}</h3><p>Data unavailable</p></div>`;
                }
                
                const hourly = w.hourly_next_6h ? w.hourly_next_6h.map(h => `
                    <div style="text-align:center; padding:0.4rem; background:rgba(0,0,0,0.2); border-radius:6px;">
                        <div style="font-size:0.7rem; opacity:0.7;">${h.time}</div>
                        <div style="font-weight:700;">${h.temp}</div>
                        <div style="font-size:0.7rem;">💧${h.rain}</div>
                    </div>
                `).join('') : '';
                
                return `
                    <div class="product-card" style="border-left-color:#4ade80;">
                        <div style="display:flex; justify-content:space-between; align-items:start;">
                            <div>
                                <h3 style="color:#95d5b2;">📍 ${escapeHtml(w.region)}</h3>
                                <p style="font-size:0.8rem; opacity:0.7;">${escapeHtml(w.province)} Region</p>
                            </div>
                            <div style="text-align:right; font-size:0.7rem; opacity:0.6;">
                                <div>🕐 ${w.updated_time ? w.updated_time.split(',')[1] : ''}</div>
                            </div>
                        </div>
                        
                        <div style="text-align:center; margin:0.8rem 0;">
                            <div style="font-size:3rem; font-weight:900; color:#ffd166; line-height:1;">${w.temperature}</div>
                            <p style="font-size:1rem; margin-top:0.3rem;">${w.forecast}</p>
                            <p style="font-size:0.85rem; opacity:0.8;">Feels like ${w.feels_like}</p>
                        </div>
                        
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.4rem; font-size:0.8rem; margin:0.8rem 0;">
                            <div>💧 Humidity: ${w.humidity}</div>
                            <div>💨 Wind: ${w.wind_speed} ${w.wind_direction}</div>
                            <div>🌧️ Rain: ${w.rainfall}</div>
                            <div>☔ Chance: ${w.rain_probability}</div>
                            <div>☁️ Clouds: ${w.cloud_cover}</div>
                            <div>🔆 UV: ${w.uv_index}</div>
                            <div>🌅 Sunrise: ${w.sunrise}</div>
                            <div>🌇 Sunset: ${w.sunset}</div>
                        </div>
                        
                        <div style="background:rgba(74,222,128,0.2); padding:0.6rem; border-radius:8px; font-size:0.85rem; margin-bottom:0.5rem;">
                            🌾 ${w.farming_advice}
                        </div>
                        
                        <div style="background:rgba(59,130,246,0.2); padding:0.6rem; border-radius:8px; font-size:0.85rem; margin-bottom:0.8rem;">
                            ⏰ ${w.best_farming_time}
                        </div>
                        
                        <div style="font-size:0.75rem; opacity:0.7; margin-bottom:0.3rem;">Next 6 hours:</div>
                        <div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:0.2rem; margin-bottom:0.8rem;">
                            ${hourly}
                        </div>
                        
                        <details style="margin-top:0.5rem;">
                            <summary style="cursor:pointer; font-size:0.85rem; opacity:0.8;">📅 5-Day Forecast</summary>
                            <div style="margin-top:0.5rem;">
                                ${w.daily_forecast ? w.daily_forecast.map(d => `
                                    <div style="display:flex; justify-content:space-between; padding:0.3rem 0; border-bottom:1px solid rgba(255,255,255,0.1); font-size:0.8rem;">
                                        <span>${d.day}</span>
                                        <span>${d.condition.split(' ')[0]}</span>
                                        <span>${d.min_temp} / ${d.max_temp}</span>
                                        <span>☔${d.rain_chance}</span>
                                    </div>
                                `).join('') : ''}
                            </div>
                        </details>
                    </div>
                `;
            }).join('');
            
            const note = document.createElement('p');
            note.style.cssText = 'grid-column:1/-1; text-align:center; font-size:0.75rem; opacity:0.6; margin-top:1rem;';
            note.textContent = `🌍 LIVE Weather from Open-Meteo.com · Namibia · Updated ${data.updated_time || new Date().toLocaleTimeString()}`;
            container.appendChild(note);
        }
    } catch (err) {
        container.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#f87171;">❌ Failed to load weather</p>';
    }
}

// ==========================================
// MARKET
// ==========================================
async function loadMarket() {
    const container = document.getElementById('marketList');
    if (!container) return;
    
    container.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:2rem;">💰 Loading market prices...</p>';
    
    try {
        const res = await fetch(API + '/market');
        const data = await res.json();
        
        let html = '';
        
        if (data.marketPrices && data.marketPrices.length > 0) {
            html += `<div style="grid-column:1/-1; margin-bottom:1rem;">
                <h3 style="color:#95d5b2; margin-bottom:0.8rem;">📊 Market Prices</h3>
                <div class="grid">
                    ${data.marketPrices.map(m => `
                        <div class="product-card">
                            <h3>${escapeHtml(m.product)}</h3>
                            <div class="price">${escapeHtml(m.price)}</div>
                            <p>${escapeHtml(m.unit || '')} · 📍 ${escapeHtml(m.market)}</p>
                            <p style="font-size:0.75rem; opacity:0.6;">Updated: ${new Date(m.updated_at).toLocaleDateString()}</p>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        }
        
        if (data.inDemand && data.inDemand.length > 0) {
            html += `<div style="grid-column:1/-1; margin-bottom:1rem;">
                <h3 style="color:#ffd166; margin-bottom:0.8rem;">🔥 Most In-Demand Products</h3>
                <div class="grid">
                    ${data.inDemand.map(d => `
                        <div class="product-card" style="border-left-color:#ffd166;">
                            <h3>${escapeHtml(d.category)}</h3>
                            <span class="badge" style="background:rgba(255,209,102,0.3); color:#ffd166;">${d.demand} DEMAND</span>
                            <p style="margin-top:0.5rem;">📦 ${d.listings} active listings</p>
                            <p style="font-size:0.85rem;">Avg: ${d.avg_price}</p>
                            <p style="font-size:0.8rem; opacity:0.7;">Range: ${d.price_range}</p>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        }
        
        if (data.mostValuable && data.mostValuable.length > 0) {
            html += `<div style="grid-column:1/-1; margin-bottom:1rem;">
                <h3 style="color:#95d5b2; margin-bottom:0.8rem;">💎 Highest Value Products</h3>
                <div class="grid">
                    ${data.mostValuable.map(v => `
                        <div class="product-card" style="border-left-color:#95d5b2;">
                            <h3>${escapeHtml(v.category)}</h3>
                            <div class="price">${v.avg_price}</div>
                            <p style="font-size:0.85rem; opacity:0.7;">${v.listings} listings</p>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        }
        
        html += `<p style="grid-column:1/-1; text-align:center; font-size:0.75rem; opacity:0.6; margin-top:1rem;">
            Live data from product listings · Updated ${data.updated_time || new Date().toLocaleTimeString()}
        </p>`;
        
        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#f87171;">Failed to load prices</p>';
    }
}

// ==========================================
// COMMUNITY
// ==========================================
document.getElementById('communityForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) return showAlert('Login first', 'error');
    
    try {
        await fetch(API + '/community/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: document.getElementById('commTitle').value.trim(),
                content: document.getElementById('commBody').value.trim(),
                author: currentUser.fullName || currentUser.username,
                authorId: currentUser.id
            })
        });
        showAlert('✅ Posted!', 'success');
        e.target.reset();
        loadCommunity();
    } catch (e) {
        showAlert('Error', 'error');
    }
});

async function loadCommunity() {
    const container = document.getElementById('communityList');
    if (!container) return;
    
    try {
        const res = await fetch(API + '/community/posts');
        const data = await res.json();
        
        if (data.posts.length === 0) {
            container.innerHTML = '<div class="card"><p>No community posts yet.</p></div>';
            return;
        }
        
        const postsWithComments = await Promise.all(data.posts.map(async (p) => {
            const cRes = await fetch(API + '/community/posts/' + p.id + '/comments');
            const cData = await cRes.json();
            return { ...p, comments: cData.comments || [] };
        }));
        
        container.innerHTML = postsWithComments.map(p => `
            <div class="card">
                <h3>${escapeHtml(p.title)}</h3>
                <p>${escapeHtml(p.content)}</p>
                <p style="font-size:0.85rem; opacity:0.7; margin-top:0.5rem;">
                    👤 ${escapeHtml(p.author)} · ${new Date(p.created_at).toLocaleString()}
                </p>
                <div style="margin-top:0.8rem; display:flex; gap:1rem; flex-wrap:wrap;">
                    <button onclick="likeCommunityPost(${p.id})" style="background:rgba(149,213,178,0.3); padding:0.4rem 1rem; font-size:0.85rem;">❤️ ${p.likes || 0} Likes</button>
                    <button onclick="toggleCommunityComments(${p.id})" style="background:rgba(59,130,246,0.3); padding:0.4rem 1rem; font-size:0.85rem;">💬 ${p.comments.length} Comments</button>
                </div>
                
                <div id="communityComments-${p.id}" style="display:none; margin-top:1rem; padding-top:1rem; border-top:1px solid rgba(255,255,255,0.1);">
                    <div id="commentsList-${p.id}">
                        ${p.comments.filter(c => !c.parent_id).map(c => renderCommunityComment(c, p.comments, p.id)).join('') || '<p style="opacity:0.6;">No comments yet.</p>'}
                    </div>
                    
                    ${currentUser ? `
                        <div style="margin-top:1rem;">
                            <textarea id="communityComment-${p.id}" placeholder="Write a comment..." style="width:100%; min-height:60px;"></textarea>
                            <button onclick="postCommunityComment(${p.id})" style="margin-top:0.5rem;">Post Comment</button>
                        </div>
                    ` : `<p style="opacity:0.6; margin-top:1rem;">🔒 <a onclick="showSection('login')" style="color:#95d5b2; cursor:pointer;">Login</a> to comment</p>`}
                </div>
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = '<div class="card"><p>Failed to load</p></div>';
    }
}

function renderCommunityComment(comment, allComments, postId, depth = 0) {
    const replies = allComments.filter(c => c.parent_id === comment.id);
    const indent = depth * 30;
    
    return `
        <div style="margin-left:${indent}px; margin-bottom:0.6rem; padding:0.6rem; background:rgba(255,255,255,${depth === 0 ? '0.08' : '0.04'}); border-radius:8px; border-left:3px solid ${depth === 0 ? '#95d5b2' : '#4ade80'};">
            <strong>${escapeHtml(comment.author || 'Anonymous')}</strong>
            <span style="font-size:0.75rem; opacity:0.6; margin-left:0.5rem;">${new Date(comment.created_at).toLocaleString()}</span>
            <p style="margin:0.4rem 0;">${escapeHtml(comment.comment)}</p>
            <div style="display:flex; gap:0.8rem; font-size:0.85rem;">
                <button onclick="likeCommunityComment(${comment.id}, ${postId})" style="background:none; border:none; color:#95d5b2; cursor:pointer; padding:0;">👍 ${comment.likes || 0}</button>
                <button onclick="dislikeCommunityComment(${comment.id}, ${postId})" style="background:none; border:none; color:#f87171; cursor:pointer; padding:0;">👎 ${comment.dislikes || 0}</button>
                ${currentUser ? `<button onclick="toggleCommunityReply(${comment.id})" style="background:none; border:none; color:#95d5b2; cursor:pointer; padding:0;">↩️ Reply</button>` : ''}
            </div>
            <div id="communityReplyBox-${comment.id}" style="display:none; margin-top:0.5rem;">
                <textarea id="communityReplyText-${comment.id}" placeholder="Write a reply..." style="width:100%; min-height:50px;"></textarea>
                <button onclick="postCommunityReply(${comment.id}, ${postId})" style="margin-top:0.3rem;">Post Reply</button>
            </div>
            ${replies.length > 0 ? replies.map(r => renderCommunityComment(r, allComments, postId, depth + 1)).join('') : ''}
        </div>
    `;
}

function toggleCommunityComments(postId) {
    const box = document.getElementById('communityComments-' + postId);
    if (box) box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

async function postCommunityComment(postId) {
    if (!currentUser) return showAlert('Login first', 'error');
    const text = document.getElementById('communityComment-' + postId).value.trim();
    if (!text) return showAlert('Write a comment', 'error');
    
    try {
        await fetch(API + '/community/posts/' + postId + '/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                author: currentUser.fullName || currentUser.username,
                authorId: currentUser.id,
                comment: text
            })
        });
        loadCommunity();
        showToast('✅ Comment posted!');
    } catch (e) {
        showAlert('Error', 'error');
    }
}

async function likeCommunityPost(postId) {
    if (!currentUser) return showAlert('Login first', 'error');
    try {
        const res = await fetch(API + '/community/posts/' + postId + '/like-toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id })
        });
        const data = await res.json();
        if (data.success) {
            showToast(data.action === 'liked' ? '❤️ Liked!' : '❤️ Like removed', 'info', 1500);
            loadCommunity();
        }
    } catch (e) { console.error(e); }
}

async function likeCommunityComment(commentId, postId) {
    if (!currentUser) return showAlert('Login first', 'error');
    try {
        const res = await fetch(API + '/community/comments/' + commentId + '/like-toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id })
        });
        const data = await res.json();
        if (data.success) {
            showToast(data.action === 'liked' ? '👍 Liked!' : '👍 Like removed', 'info', 1500);
            loadCommunity();
        }
    } catch (e) { console.error(e); }
}

async function dislikeCommunityComment(commentId, postId) {
    if (!currentUser) return showAlert('Login first', 'error');
    try {
        const res = await fetch(API + '/community/comments/' + commentId + '/dislike-toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id })
        });
        const data = await res.json();
        if (data.success) {
            showToast(data.action === 'disliked' ? '👎 Disliked' : '👎 Dislike removed', 'info', 1500);
            loadCommunity();
        }
    } catch (e) { console.error(e); }
}

function toggleCommunityReply(commentId) {
    const box = document.getElementById('communityReplyBox-' + commentId);
    if (box) box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

async function postCommunityReply(commentId, postId) {
    if (!currentUser) return;
    const text = document.getElementById('communityReplyText-' + commentId).value.trim();
    if (!text) return showAlert('Write a reply', 'error');
    
    try {
        await fetch(API + '/community/comments/' + commentId + '/reply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                author: currentUser.fullName || currentUser.username,
                authorId: currentUser.id,
                reply: text
            })
        });
        loadCommunity();
        showToast('✅ Reply posted!');
    } catch (e) {
        showAlert('Error', 'error');
    }
}

// ==========================================
// PARTNERS
// ==========================================
async function loadPartners() {
    const container = document.getElementById('partnerList');
    if (!container) return;
    
    try {
        const res = await fetch(API + '/partners');
        const data = await res.json();
        
        container.innerHTML = data.partners.map(p => `
            <div class="product-card">
                <h3>🤝 ${escapeHtml(p.name)}</h3>
                <span class="badge">${escapeHtml(p.type)}</span>
                <p style="margin-top:0.5rem;">${escapeHtml(p.description || '')}</p>
                ${p.contact ? `<p style="font-size:0.85rem; margin-top:0.5rem;">📞 ${escapeHtml(p.contact)}</p>` : ''}
                ${p.website ? `<p style="font-size:0.85rem;">🌐 <a href="${p.website}" target="_blank" style="color:#95d5b2;">${escapeHtml(p.website)}</a></p>` : ''}
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = '<p>Failed to load partners</p>';
    }
}

// ==========================================
// ADMIN DASHBOARD
// ==========================================
function initAdmin() {
    const loginBox = document.getElementById('adminLoginBox');
    const dashboard = document.getElementById('adminDashboard');
    
    if (adminKey) {
        loginBox.style.display = 'none';
        dashboard.style.display = 'block';
        loadAdminData();
    } else {
        loginBox.style.display = 'block';
        dashboard.style.display = 'none';
    }
}

function loginAdmin() {
    const key = document.getElementById('adminKeyInput').value.trim();
    if (key !== 'admin123') return showAlert('❌ Wrong admin key', 'error');
    
    adminKey = key;
    localStorage.setItem('adminKey', key);
    showAlert('✅ Admin access granted', 'success');
    initAdmin();
}

function logoutAdmin() {
    adminKey = '';
    localStorage.removeItem('adminKey');
    showAlert('Admin logged out', 'info');
    initAdmin();
}

async function loadAdminData() {
    try {
        const res = await fetch(API + '/admin/stats?key=' + adminKey);
        const data = await res.json();
        if (data.success) {
            document.getElementById('statUsers').textContent = data.stats.users;
            document.getElementById('statProducts').textContent = data.stats.products;
            document.getElementById('statPosts').textContent = data.stats.posts;
            document.getElementById('statComments').textContent = (data.stats.productComments || 0) + (data.stats.communityComments || 0);
        }
        
        loadAdminTab(currentAdminTab);
    } catch (e) {
        console.error(e);
    }
}

function showAdminTab(tab) {
    currentAdminTab = tab;
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    loadAdminTab(tab);
}

async function loadAdminTab(tab) {
    const content = document.getElementById('adminTabContent');
    content.innerHTML = '<p>Loading...</p>';
    
    try {
        if (tab === 'users') {
            const res = await fetch(API + '/admin/users?key=' + adminKey);
            const data = await res.json();
            content.innerHTML = `
                <table style="width:100%; border-collapse:collapse;">
                    <thead><tr style="background:rgba(149,213,178,0.2);">
                        <th style="padding:0.5rem;">ID</th><th>Username</th><th>Full Name</th><th>Phone</th><th>Action</th>
                    </tr></thead>
                    <tbody>
                        ${data.users.map(u => `
                            <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
                                <td style="padding:0.5rem;">${u.id}</td>
                                <td>${escapeHtml(u.username)}</td>
                                <td>${escapeHtml(u.full_name || '-')}</td>
                                <td>${escapeHtml(u.phone || '-')}</td>
                                <td><button onclick="adminDeleteUser(${u.id})" style="background:#e74c3c; padding:0.3rem 0.8rem; font-size:0.8rem;">Delete</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else if (tab === 'products') {
            const res = await fetch(API + '/admin/products?key=' + adminKey);
            const data = await res.json();
            content.innerHTML = `
                <table style="width:100%; border-collapse:collapse;">
                    <thead><tr style="background:rgba(149,213,178,0.2);">
                        <th style="padding:0.5rem;">ID</th><th>Title</th><th>Price</th><th>Seller</th><th>Action</th>
                    </tr></thead>
                    <tbody>
                        ${data.products.map(p => `
                            <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
                                <td style="padding:0.5rem;">${p.id}</td>
                                <td>${escapeHtml(p.title)}</td>
                                <td>N$ ${p.price}</td>
                                <td>${escapeHtml(p.seller_name || '-')}</td>
                                <td><button onclick="adminDeleteProduct(${p.id})" style="background:#e74c3c; padding:0.3rem 0.8rem; font-size:0.8rem;">Delete</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else if (tab === 'community') {
            const res = await fetch(API + '/admin/community?key=' + adminKey);
            const data = await res.json();
            content.innerHTML = data.posts.map(p => `
                <div style="padding:0.8rem; background:rgba(255,255,255,0.05); margin-bottom:0.5rem; border-radius:8px;">
                    <strong>${escapeHtml(p.title)}</strong>
                    <p style="font-size:0.85rem;">${escapeHtml((p.content || '').substring(0, 100))}...</p>
                    <button onclick="adminDeletePost(${p.id})" style="background:#e74c3c; padding:0.3rem 0.8rem; font-size:0.8rem; margin-top:0.5rem;">Delete</button>
                </div>
            `).join('');
        } else if (tab === 'market') {
            const res = await fetch(API + '/admin/market?key=' + adminKey);
            const data = await res.json();
            content.innerHTML = `
                <table style="width:100%; border-collapse:collapse;">
                    <thead><tr style="background:rgba(149,213,178,0.2);">
                        <th style="padding:0.5rem;">Product</th><th>Price</th><th>Market</th><th>Action</th>
                    </tr></thead>
                    <tbody>
                        ${data.marketPrices.map(m => `
                            <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
                                <td style="padding:0.5rem;">${escapeHtml(m.product)}</td>
                                <td>${escapeHtml(m.price)}</td>
                                <td>${escapeHtml(m.market)}</td>
                                <td><button onclick="adminDeletePrice(${m.id})" style="background:#e74c3c; padding:0.3rem 0.8rem; font-size:0.8rem;">Delete</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    } catch (e) {
        content.innerHTML = '<p>Failed to load</p>';
    }
}

async function adminDeleteUser(id) {
    if (!confirm('Delete this user?')) return;
    await fetch(API + '/admin/users/' + id + '?key=' + adminKey, { method: 'DELETE' });
    loadAdminData();
}

async function adminDeleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    await fetch(API + '/admin/products/' + id + '?key=' + adminKey, { method: 'DELETE' });
    loadAdminData();
}

async function adminDeletePost(id) {
    if (!confirm('Delete this post?')) return;
    await fetch(API + '/admin/community/' + id + '?key=' + adminKey, { method: 'DELETE' });
    loadAdminData();
}

async function adminDeletePrice(id) {
    if (!confirm('Delete this price?')) return;
    await fetch(API + '/admin/market/' + id + '?key=' + adminKey, { method: 'DELETE' });
    loadAdminData();
}

// ==========================================
// INIT
// ==========================================
updateUI();
loadProducts();
loadMarket();
loadCommunity();
loadWeather();
loadPartners();

document.getElementById('productModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'productModal') closeProductModal();
});

setInterval(() => {
    const weatherSection = document.getElementById('weather');
    if (weatherSection && weatherSection.classList.contains('active')) {
        loadWeather();
    }
}, 300000);