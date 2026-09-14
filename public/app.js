const API = window.location.origin + '/api';
let currentUser = JSON.parse(localStorage.getItem('user') || 'null');
let allArticles = [];
let urgentPosts = [];
let currentFilter = 'all';
let sentimentChart, sourceChart;

console.log('✅ app.js loaded');

// ==========================================
// THEME
// ==========================================
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

function toggleTheme() {
    const html = document.documentElement;
    const cur = html.getAttribute('data-theme') || 'dark';
    const next = cur === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = next === 'dark' ? '🌙' : '☀️';
}

// ==========================================
// BACKGROUND
// ==========================================
const headlines = ['📰 BREAKING', '🚨 URGENT', '📊 MONITOR', '🔴 CRISIS', '📻 NBC', '🌍 NAMIBIA', '⚡ LIVE', '📈 ANALYSIS', '🚔 POLICE', '📺 TV'];

function createBg() {
    const bg = document.getElementById('animatedBg');
    if (!bg) return;
    for (let i = 0; i < 20; i++) {
        const item = document.createElement('div');
        item.className = 'flying-item';
        item.textContent = headlines[Math.floor(Math.random() * headlines.length)];
        item.style.top = Math.random() * 100 + '%';
        item.style.fontSize = (0.8 + Math.random() * 1.5) + 'rem';
        item.style.animationDuration = (20 + Math.random() * 30) + 's';
        item.style.animationDelay = (Math.random() * 20) + 's';
        bg.appendChild(item);
    }
}

// ==========================================
// PAGES
// ==========================================
function showPage(page, event) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');
    
    if (event && event.target) {
        event.target.closest('.nav-tab')?.classList.add('active');
    }
    
    if (page === 'radio') loadRadio();
    if (page === 'newspapers') loadNewspapers();
    if (page === 'tv') loadTV();
    if (page === 'police') loadPoliceNotices();
    if (page === 'news') loadArticles();
}

// ==========================================
// AUTH
// ==========================================
function openLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
}

function showAuthTab(tab, event) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    document.getElementById(tab + 'Form').classList.add('active');
}

async function doLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) return alert('Enter username and password');
    
    try {
        const res = await fetch(API + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(currentUser));
            updateUserUI();
            closeLoginModal();
            alert(`✅ Welcome, ${currentUser.fullName}!\nRole: ${currentUser.role.toUpperCase()}`);
            loadPoliceNotices();
        } else {
            alert('❌ ' + data.message);
        }
    } catch (e) {
        alert('Error: ' + e.message);
    }
}

async function doRegister() {
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const fullName = document.getElementById('regFullName').value.trim();
    const role = document.getElementById('regRole').value;
    const badgeNumber = document.getElementById('regBadge').value.trim();
    const station = document.getElementById('regStation').value.trim();
    
    if (!username || !password || !fullName) return alert('Fill all required fields');
    
    try {
        const res = await fetch(API + '/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, fullName, role, badgeNumber, station })
        });
        const data = await res.json();
        
        if (data.success) {
            alert('✅ Account created! Please login.');
            showAuthTab('login', { target: document.querySelector('.auth-tab') });
        } else {
            alert('❌ ' + data.message);
        }
    } catch (e) {
        alert('Error: ' + e.message);
    }
}

function logout() {
    if (!confirm('Logout?')) return;
    currentUser = null;
    localStorage.removeItem('user');
    updateUserUI();
    alert('👋 Logged out!');
    loadPoliceNotices();
}

function updateUserUI() {
    const authBtn = document.getElementById('authBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    const policeForm = document.getElementById('policePostForm');
    const policeMsg = document.getElementById('policeAuthMsg');
    
    if (currentUser) {
        if (authBtn) authBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        if (userInfo) {
            userInfo.textContent = `👤 ${currentUser.fullName} (${currentUser.role.toUpperCase()})`;
            userInfo.className = 'user-info show ' + currentUser.role;
        }
        if (currentUser.role === 'police' || currentUser.role === 'admin') {
            if (policeForm) policeForm.style.display = 'block';
            if (policeMsg) policeMsg.style.display = 'none';
        } else {
            if (policeForm) policeForm.style.display = 'none';
            if (policeMsg) {
                policeMsg.style.display = 'block';
                policeMsg.innerHTML = `🔒 <strong>Only police officers and admins can post notices.</strong><br>Your role: <strong>${currentUser.role}</strong>`;
            }
        }
    } else {
        if (authBtn) authBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userInfo) { userInfo.textContent = ''; userInfo.className = 'user-info'; }
        if (policeForm) policeForm.style.display = 'none';
        if (policeMsg) {
            policeMsg.style.display = 'block';
            policeMsg.innerHTML = `🔒 <strong>Police officers must login to post notices.</strong><br><button onclick="openLoginModal()" class="btn-primary" style="margin-top:0.8rem; width:auto; padding:0.6rem 1.5rem;">🔑 Login</button>`;
        }
    }
}

// ==========================================
// DATA
// ==========================================
async function loadArticles() {
    try {
        const res = await fetch(API + '/articles');
        const data = await res.json();
        if (data.success) {
            allArticles = data.articles;
            renderArticles();
            updateTicker();
        }
    } catch (e) { console.error(e); }
}

function renderArticles() {
    const container = document.getElementById('articles');
    if (!container) return;
    let list = currentFilter === 'all' ? allArticles : allArticles.filter(a => a.sentiment === currentFilter);
    
    if (list.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:2rem; opacity:0.6;">No articles. Click 🔄 Refresh to scrape.</p>';
        return;
    }
    
    container.innerHTML = list.map(a => `
        <div class="article-item ${a.sentiment}" onclick="readMore(${a.id})">
            <h4>${escapeHtml(a.title)}</h4>
            <div class="meta">
                <span>📰 ${escapeHtml(a.source)}</span>
                <span class="category-tag">${escapeHtml(a.category || 'General')}</span>
                <span>${a.sentiment === 'positive' ? '😊' : a.sentiment === 'negative' ? '😟' : '😐'} ${a.sentiment}</span>
            </div>
        </div>
    `).join('');
}

function filterArticles(filter, event) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    renderArticles();
}

async function readMore(id) {
    try {
        const res = await fetch(API + '/articles/' + id);
        const data = await res.json();
        if (data.success && data.article) {
            const a = data.article;
            document.getElementById('modalBody').innerHTML = `
                <h2>${escapeHtml(a.title)}</h2>
                <div style="margin-bottom:1rem; font-size:0.85rem; opacity:0.8;">
                    📰 ${escapeHtml(a.source)} · ${escapeHtml(a.category || 'General')} · ${a.sentiment} (${a.sentiment_score})
                </div>
                <p>${escapeHtml(a.content || a.title)}</p>
                ${a.url ? `<p style="margin-top:1.5rem;"><a href="${a.url}" target="_blank" style="display:inline-block; padding:0.75rem 1.5rem; background:var(--accent); color:#0f2027; border-radius:8px; text-decoration:none; font-weight:700;">🔗 Read at ${escapeHtml(a.source)} →</a></p>` : ''}
            `;
            document.getElementById('articleModal').classList.add('active');
        }
    } catch (e) { console.error(e); }
}

function closeModal() {
    document.getElementById('articleModal').classList.remove('active');
}

// ==========================================
// STATS
// ==========================================
async function loadStats() {
    try {
        const res = await fetch(API + '/stats');
        const data = await res.json();
        if (data.success) {
            let pos = 0, neg = 0, neu = 0;
            data.stats.forEach(s => {
                if (s.sentiment === 'positive') pos = s.count;
                if (s.sentiment === 'negative') neg = s.count;
                if (s.sentiment === 'neutral') neu = s.count;
            });
            const total = pos + neg + neu;
            ['totalArticles', 'heroArticles'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = total; });
            ['positiveCount'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = pos; });
            ['negativeCount'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = neg; });
            ['neutralCount'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = neu; });
            updateSentimentChart(pos, neg, neu);
        }
    } catch (e) { console.error(e); }
}

async function loadSources() {
    try {
        const res = await fetch(API + '/sources');
        const data = await res.json();
        if (data.success) {
            const el = document.getElementById('heroSources');
            if (el) el.textContent = data.sources.length;
            updateSourceChart(data.sources);
        }
    } catch (e) { console.error(e); }
}

function updateSentimentChart(pos, neg, neu) {
    const ctx = document.getElementById('sentimentChart');
    if (!ctx) return;
    if (sentimentChart) sentimentChart.destroy();
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    sentimentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Positive', 'Negative', 'Neutral'],
            datasets: [{ data: [pos, neg, neu], backgroundColor: ['#4ade80', '#f87171', '#fbbf24'] }]
        },
        options: { responsive: true, plugins: { legend: { labels: { color: isDark ? 'white' : '#0f172a' } } } }
    });
}

function updateSourceChart(sources) {
    const ctx = document.getElementById('sourceChart');
    if (!ctx) return;
    if (sourceChart) sourceChart.destroy();
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    sourceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sources.map(s => s.source),
            datasets: [{ label: 'Articles', data: sources.map(s => s.count), backgroundColor: '#4ade80' }]
        },
        options: {
            responsive: true,
            plugins: { legend: { labels: { color: isDark ? 'white' : '#0f172a' } } },
            scales: {
                y: { ticks: { color: isDark ? 'white' : '#0f172a' } },
                x: { ticks: { color: isDark ? 'white' : '#0f172a' } }
            }
        }
    });
}

// ==========================================
// TOP STORIES
// ==========================================
async function loadTopStories() {
    try {
        const res = await fetch(API + '/articles/top');
        const data = await res.json();
        if (data.success) {
            const container = document.getElementById('topStories');
            if (!container) return;
            if (data.articles.length === 0) {
                container.innerHTML = '<p style="opacity:0.6;">No stories yet. Click 🔄 Refresh in News.</p>';
                return;
            }
            container.innerHTML = data.articles.map(a => `
                <div class="top-story" onclick="readMore(${a.id})">
                    <h4>${escapeHtml(a.title)}</h4>
                    <div class="meta">📰 ${escapeHtml(a.source)} · ${a.sentiment}</div>
                </div>
            `).join('');
        }
    } catch (e) { console.error(e); }
}

// ==========================================
// RADIO, NEWSPAPERS, TV
// ==========================================
async function loadRadio() {
    try {
        const res = await fetch(API + '/radio');
        const data = await res.json();
        if (data.success) {
            const grid = document.getElementById('radioGrid');
            if (!grid) return;
            grid.innerHTML = data.stations.map(s => `
                <div class="media-card" onclick="window.open('${s.website_url}', '_blank')">
                    <div class="media-icon">📻</div>
                    <h4>${escapeHtml(s.name)}</h4>
                    <p>${escapeHtml(s.description || '')}</p>
                </div>
            `).join('');
            const heroEl = document.getElementById('heroRadio');
            if (heroEl) heroEl.textContent = data.stations.length;
        }
    } catch (e) { console.error(e); }
}

async function loadNewspapers() {
    try {
        const res = await fetch(API + '/media');
        const data = await res.json();
        if (data.success) {
            const papers = data.sources.filter(s => s.type === 'newspaper');
            const grid = document.getElementById('newspaperGrid');
            if (!grid) return;
            grid.innerHTML = papers.map(s => `
                <div class="media-card" onclick="window.open('${s.url}', '_blank')">
                    <div class="media-icon">🗞️</div>
                    <h4>${escapeHtml(s.name)}</h4>
                    <p>${escapeHtml(s.description || '')}</p>
                </div>
            `).join('');
        }
    } catch (e) { console.error(e); }
}

async function loadTV() {
    try {
        const res = await fetch(API + '/media');
        const data = await res.json();
        if (data.success) {
            const tv = data.sources.filter(s => s.type === 'tv');
            const grid = document.getElementById('tvGrid');
            if (!grid) return;
            grid.innerHTML = tv.map(s => `
                <div class="media-card" onclick="window.open('${s.url}', '_blank')">
                    <div class="media-icon">📺</div>
                    <h4>${escapeHtml(s.name)}</h4>
                    <p>${escapeHtml(s.description || '')}</p>
                </div>
            `).join('');
        }
    } catch (e) { console.error(e); }
}

// ==========================================
// POLICE
// ==========================================
async function loadPoliceNotices() {
    try {
        const res = await fetch(API + '/police');
        const data = await res.json();
        if (data.success) {
            const container = document.getElementById('policeNotices');
            if (!container) return;
            
            if (data.notices.length === 0) {
                container.innerHTML = '<p style="text-align:center; padding:2rem; opacity:0.6;">No police notices yet.</p>';
            } else {
                container.innerHTML = data.notices.map(n => `
                    <div class="police-notice ${n.notice_type}">
                        <h4>🚔 ${escapeHtml(n.title)}</h4>
                        <p>${escapeHtml(n.content || '')}</p>
                        <div class="notice-meta">
                            <span class="badge-info">👮 ${escapeHtml(n.badge_number || 'Unknown')}</span>
                            ${n.location ? `<span>📍 ${escapeHtml(n.location)}</span>` : ''}
                            ${n.case_number ? `<span>📁 ${escapeHtml(n.case_number)}</span>` : ''}
                            ${n.contact ? `<span>📞 ${escapeHtml(n.contact)}</span>` : ''}
                            <span>📅 ${new Date(n.created_at).toLocaleString()}</span>
                        </div>
                    </div>
                `).join('');
            }
            
            const heroEl = document.getElementById('heroPolice');
            if (heroEl) heroEl.textContent = data.notices.length;
        }
    } catch (e) { console.error(e); }
}

async function postPoliceNotice(event) {
    if (!currentUser) {
        alert('⚠️ Please login first');
        openLoginModal();
        return;
    }
    
    if (currentUser.role !== 'police' && currentUser.role !== 'admin') {
        alert('⚠️ Only police officers and admins can post');
        return;
    }
    
    const title = document.getElementById('policeTitle').value.trim();
    const content = document.getElementById('policeContent').value.trim();
    const noticeType = document.getElementById('policeType').value;
    const caseNumber = document.getElementById('policeCaseNumber').value.trim();
    const location = document.getElementById('policeLocation').value.trim();
    const contact = document.getElementById('policeContact').value.trim();
    
    if (!title) return alert('Title required');
    
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = '⏳ Posting...';
    
    try {
        const res = await fetch(API + '/police', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': currentUser.id },
            body: JSON.stringify({ title, content, noticeType, caseNumber, location, contact })
        });
        const data = await res.json();
        
        if (data.success) {
            alert('✅ Notice posted!');
            document.getElementById('policeTitle').value = '';
            document.getElementById('policeContent').value = '';
            document.getElementById('policeCaseNumber').value = '';
            document.getElementById('policeLocation').value = '';
            document.getElementById('policeContact').value = '';
            loadPoliceNotices();
        } else {
            alert('❌ ' + data.message);
        }
    } catch (e) {
        alert('❌ Error: ' + e.message);
    }
    
    btn.disabled = false;
    btn.textContent = '📢 Post Notice';
}
async function readMoreArticle(id) {
    // Check if it's police or urgent
    if (typeof id === 'string' && id.startsWith('police_')) {
        const policeId = id.replace('police_', '');
        try {
            const res = await fetch(API + '/police');
            const data = await res.json();
            const notice = data.notices.find(n => n.id == policeId);
            if (notice) {
                document.getElementById('modalBody').innerHTML = `
                    <h2 style="color:#60a5fa;">🚔 ${escapeHtml(notice.title)}</h2>
                    <div style="background:rgba(59,130,246,0.15); padding:1rem; border-radius:8px; margin:1rem 0; border-left:4px solid #3b82f6;">
                        <strong>Type:</strong> ${escapeHtml(notice.notice_type || 'General')}<br>
                        <strong>Badge:</strong> ${escapeHtml(notice.badge_number || 'NPF')}<br>
                        ${notice.case_number ? `<strong>Case:</strong> ${escapeHtml(notice.case_number)}<br>` : ''}
                        ${notice.location ? `<strong>Location:</strong> ${escapeHtml(notice.location)}<br>` : ''}
                        ${notice.contact ? `<strong>Contact:</strong> ${escapeHtml(notice.contact)}<br>` : ''}
                    </div>
                    ${notice.image ? `<img src="${notice.image}" style="max-width:100%; border-radius:8px; margin:1rem 0;">` : ''}
                    <p style="font-size:1.05rem; line-height:1.6;">${escapeHtml(notice.content || '')}</p>
                    <p style="font-size:0.8rem; opacity:0.7; margin-top:1.5rem;">Posted by ${escapeHtml(notice.posted_by)} on ${new Date(notice.created_at).toLocaleString()}</p>
                `;
                document.getElementById('articleModal').classList.add('active');
            }
        } catch (e) { alert('Error loading notice'); }
        return;
    }
    
    if (typeof id === 'string' && id.startsWith('urgent_')) {
        const urgentId = id.replace('urgent_', '');
        try {
            const res = await fetch(API + '/urgent');
            const data = await res.json();
            const post = data.posts.find(p => p.id == urgentId);
            if (post) {
                document.getElementById('modalBody').innerHTML = `
                    <h2 style="color:#f87171;">🚨 ${escapeHtml(post.title)}</h2>
                    <div style="background:rgba(248,113,113,0.15); padding:1rem; border-radius:8px; margin:1rem 0; border-left:4px solid #f87171;">
                        <strong>Priority:</strong> ${escapeHtml(post.priority || 'normal')}<br>
                        <strong>Posted by:</strong> ${escapeHtml(post.posted_by || 'System')}<br>
                        ${post.badge_number ? `<strong>Badge:</strong> ${escapeHtml(post.badge_number)}<br>` : ''}
                        ${post.location ? `<strong>Location:</strong> ${escapeHtml(post.location)}<br>` : ''}
                    </div>
                    ${post.image ? `<img src="${post.image}" style="max-width:100%; border-radius:8px; margin:1rem 0;">` : ''}
                    <p style="font-size:1.05rem; line-height:1.6;">${escapeHtml(post.content || '')}</p>
                `;
                document.getElementById('articleModal').classList.add('active');
            }
        } catch (e) { alert('Error loading post'); }
        return;
    }
    
    // Regular article
    readMore(id);
}
// ==========================================
// URGENT
// ==========================================
async function loadUrgentPosts() {
    try {
        const res = await fetch(API + '/urgent');
        const data = await res.json();
        if (data.success) {
            urgentPosts = data.posts;
            if (data.posts.length > 0) {
                const banner = document.getElementById('urgentBanner');
                if (banner) {
                    banner.style.display = 'block';
                    const latest = data.posts[0];
                    banner.innerHTML = `🚨 <strong>${escapeHtml(latest.title)}</strong> — ${escapeHtml(latest.content || '')}`;
                }
            }
            updateTicker();
        }
    } catch (e) { console.error(e); }
}

function updateTicker() {
    const items = document.getElementById('tickerItems');
    if (!items) return;
    
    let all = [];
    urgentPosts.forEach(p => {
        all.push({ text: `🚨 ${p.title}`, urgent: true });
    });
    allArticles.slice(0, 12).forEach(a => {
        const e = a.sentiment === 'negative' ? '⚠️' : a.sentiment === 'positive' ? '✅' : '📰';
        all.push({ text: `${e} ${a.title} (${a.source})`, urgent: false });
    });
    
    if (all.length === 0) all.push({ text: '📰 Loading...', urgent: false });
    const doubled = [...all, ...all];
    items.innerHTML = doubled.map(item => `
        <span class="ticker-item ${item.urgent ? 'urgent' : ''}">${escapeHtml(item.text)}</span>
    `).join('');
}

// ==========================================
// SCRAPE
// ==========================================
async function triggerScrape() {
    try {
        await fetch(API + '/scrape', { method: 'POST' });
        await Promise.all([loadStats(), loadArticles(), loadSources(), loadTopStories()]);
        alert('✅ Scraped!');
    } catch (e) { alert('❌ Failed'); }
}

// ==========================================
// UTILS
// ==========================================
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ==========================================
// INIT
// ==========================================
async function init() {
    createBg();
    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    
    updateUserUI();
    
    await Promise.all([
        loadStats(), loadArticles(), loadSources(),
        loadUrgentPosts(), loadRadio(), loadPoliceNotices(),
        loadTopStories(), loadNewspapers(), loadTV()
    ]);
    
    console.log('✅ All loaded');
}

window.addEventListener('DOMContentLoaded', init);
setInterval(() => {
    loadStats();
    loadArticles();
    loadUrgentPosts();
}, 60000);
// ==========================================
// POLICE IMAGE PREVIEW
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const policeImage = document.getElementById('policeImage');
    if (policeImage) {
        policeImage.addEventListener('change', (e) => {
            const file = e.target.files[0];
            const preview = document.getElementById('policeImagePreview');
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    preview.src = ev.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                preview.style.display = 'none';
            }
        });
    }
});