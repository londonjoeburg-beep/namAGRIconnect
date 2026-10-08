async function renderCommunity(){
  const feed = document.getElementById('talkFeed');
  feed.innerHTML = '<span class="spinner"></span> Loading...';
  try {
    const rows = await api.get('/talk');
    feed.innerHTML = rows.length
      ? rows.map(t => {
          const isOwner = window.currentUser && window.currentUser.id === t.owner_id;
          return `
            <div class="talk-item" style="margin-bottom:12px">
              <div class="who">${t.owner_name || t.user_name}</div>
              ${t.owner_region ? `<div style="font-size:11px;color:var(--muted)">${t.owner_region}</div>` : ''}
              <div style="font-size:13px;margin:4px 0">${t.text}</div>
              <div style="font-size:11px;color:var(--muted);display:flex;gap:12px;margin-top:6px">
                <span>${new Date(t.created_at).toLocaleString()}</span>
                <span style="cursor:pointer" onclick="likeTalk(${t.id}, this)">👍 ${t.likes || 0}</span>
                ${isOwner ? `<span style="cursor:pointer;color:var(--danger)" onclick="deleteTalk(${t.id})">🗑️</span>` : ''}
              </div>
            </div>`;
        }).join('')
      : '<p style="color:var(--muted);font-size:13px">No posts yet. Be the first!</p>';
  } catch (e) {
    feed.innerHTML = `<p style="color:var(--danger);font-size:13px">${e.message}</p>`;
  }

  try {
    const leaders = await api.get('/users/leaderboard');
    document.getElementById('leaderboard').innerHTML = leaders.length
      ? leaders.map((l, i) => `
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px">
            <span>${['🥇','🥈','🥉'][i] || '⭐'} <b>${l.name || 'Anon'}</b></span>
            <span style="color:var(--green);font-weight:700">${l.rating || '-'} ★</span>
          </div>`).join('')
      : '<p style="color:var(--muted);font-size:13px">No rankings yet.</p>';
  } catch {}

  renderOutbreaks();
}

async function likeTalk(id, el){
  if (!requireLogin('like posts')) return;
  try {
    const r = await api.post(`/talk/${id}/like`, {});
    if (el) el.innerHTML = `👍 ${r.likes}`;
  } catch (e) { toast("⚠️ " + e.message); }
}

async function deleteTalk(id){
  if (!confirm('Delete this post?')) return;
  try {
    await api.del(`/talk/${id}`);
    renderCommunity();
    toast("🗑️ Deleted");
  } catch (e) { toast("⚠️ " + e.message); }
}

async function postTalk(){
  if (!requireLogin('post in Agri-Talk')) return;

  const input = document.getElementById('talkInput');
  if (!validateFields([{ el: input, message: 'Write something first' }])) return;

  const text = input.value.trim();
  try {
    await api.post('/talk', { text });
    input.value = '';
    renderCommunity();
    toast("💬 Posted!");
  } catch (e) { toast("⚠️ " + e.message); }
}

async function renderOutbreaks(){
  try {
    const rows = await api.get('/virus/outbreaks');
    document.getElementById('outbreakAlerts').innerHTML = rows.length
      ? rows.map(o => `<div class="talk-item" style="border-color:var(--danger)"><div class="who">🚨 ${o.disease} — ${o.region}</div><div style="font-size:13px">${o.farms_alerted} farms • ${o.severity}</div></div>`).join('')
      : '<p style="color:var(--muted);font-size:13px">No outbreaks.</p>';
  } catch {}
}

async function runVirusScan(){
  // Open camera
  const imageData = await captureFromCamera('virus');
  if (!imageData) return;

  const r = document.getElementById('virusResult');
  r.classList.add('show');
  r.innerHTML = '<span class="spinner"></span> Analyzing your plant photo...';

  try {
    const d = await api.post('/virus/scan', { image: imageData });
    r.innerHTML =
      '<img src="' + imageData + '" style="max-width:180px;border-radius:10px;margin-bottom:10px;display:block">' +
      '<div style="display:flex;justify-content:space-between;align-items:center">' +
        '<h3 style="color:' + (d.severity === 'Critical' ? 'var(--danger)' : 'var(--green)') + '">' + d.disease + '</h3>' +
        '<span class="badge ' + (d.severity === 'Critical' ? 'danger' : 'warn') + '">' + d.severity + '</span>' +
      '</div>' +
      '<p style="font-size:13px;margin:8px 0">Confidence: <b>' + (d.confidence * 100).toFixed(0) + '%</b> • ' + d.cause + '</p>' +
      '<h4 style="margin:10px 0 4px">Treatment Plan</h4>' +
      '<ol style="padding-left:18px;font-size:13px;line-height:1.7">' +
        d.treatment.map(function(t) { return '<li>' + t + '</li>'; }).join('') +
      '</ol>';
  } catch (e) {
    r.innerHTML = '<p style="color:var(--danger);font-size:13px">⚠️ ' + e.message + '<br><small>Start AI: <code>cd ai-service && python app.py</code></small></p>';
  }
}

async function postRFQ(){
  if (!requireLogin('post an RFQ')) return;

  const itemEl = document.getElementById('rfqItem');
  const regionEl = document.getElementById('rfqRegion');
  const budgetEl = document.getElementById('rfqBudget');

  const valid = validateFields([
    { el: itemEl, message: 'What do you need? e.g. 500kg tomatoes' },
    { el: regionEl, message: 'Select a region' }
  ]);
  if (!valid) return;

  try {
    await api.post('/rfqs', {
      item: itemEl.value.trim(),
      region: regionEl.value,
      budget: parseFloat(budgetEl.value) || null
    });
    itemEl.value = '';
    budgetEl.value = '';
    renderRFQ();
    toast("📢 Posted (auto-archives in 7 days)");
  } catch (e) { toast("⚠️ " + e.message); }
}

async function renderRFQ(){
  try {
    const rows = await api.get('/rfqs');
    document.getElementById('rfqList').innerHTML = rows.length
      ? rows.map(r => `
          <div class="card" style="border-left:4px solid var(--gold)">
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px">
              <div>
                <b>${r.item}</b>
                <div style="font-size:12px;color:var(--muted)">📍 ${r.region} • ${r.posted_by || 'Anonymous'} • ${new Date(r.created_at).toLocaleDateString()}</div>
              </div>
              ${r.budget ? `<div style="font-weight:800;color:var(--green)">N$ ${Number(r.budget).toLocaleString()}</div>` : ''}
            </div>
          </div>`).join('')
      : '<p style="color:var(--muted);font-size:13px;padding:12px">No active RFQs.</p>';
  } catch {}

  const trends = [
    { c: "White Maize", p: [320, 335, 350, 360, 380], d: "+18%" },
    { c: "Beef (A2)", p: [48, 50, 52, 54, 56], d: "+16%" },
    { c: "Tomatoes", p: [38, 42, 45, 48, 52], d: "+12%" }
  ];
  document.getElementById('priceTrends').innerHTML = trends.map(t => {
    const max = Math.max(...t.p);
    return `<div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600"><span>${t.c}</span><span style="color:var(--ok)">${t.d}</span></div>
      <div style="display:flex;gap:4px;align-items:flex-end;height:40px;margin-top:4px">
        ${t.p.map(v => `<div style="flex:1;background:linear-gradient(180deg,var(--green),var(--gold));height:${v / max * 100}%;border-radius:4px"></div>`).join('')}
      </div>
      <div style="font-size:11px;color:var(--muted);text-align:right">Last: N$ ${t.p[t.p.length - 1]}</div>
    </div>`;
  }).join('');
}

async function renderProfile(){
  const card = document.getElementById('profileCard');
  if (!window.currentUser) {
    card.innerHTML = '<p style="color:var(--muted)">Login to see your farm data.</p>';
    document.getElementById('salesHistory').innerHTML = '';
    return;
  }
  try {
    const active = await api.get('/auth/my-listings');
    const sold = await api.get('/auth/my-sales');
    card.innerHTML = `
      <h3>🌾 ${currentUser.name}</h3>
      <p style="color:var(--muted);margin-top:6px">📍 ${currentUser.region || '—'}, ${currentUser.town || '—'} • 📞 ${currentUser.phone}</p>
      <div class="grid cols-3" style="margin-top:12px">
        <div class="stat"><div class="num">${active.length}</div><div class="lbl">Active</div></div>
        <div class="stat"><div class="num">${sold.length}</div><div class="lbl">Sold</div></div>
        <div class="stat"><div class="num">${currentUser.rating || '—'} ★</div><div class="lbl">Rating</div></div>
      </div>
      <button class="btn outline small" style="margin-top:12px" onclick="logout()">👋 Logout</button>`;
    document.getElementById('salesHistory').innerHTML = sold.length
      ? sold.map(s => `
          <div class="talk-item" style="border-color:var(--ok);margin-bottom:8px">
            <b>${s.title}</b>
            <div style="font-size:12px;color:var(--muted)">N$ ${s.price} • ${new Date(s.sold_at).toLocaleDateString()}</div>
            <span class="badge ok">✅ Sold</span>
          </div>`).join('')
      : '<p style="color:var(--muted);font-size:13px">No sales yet.</p>';
  } catch (e) {
    card.innerHTML = `<p style="color:var(--danger)">${e.message}</p>`;
  }
}

function ussdBoot(){
  document.getElementById('ussdScreen').textContent = 'Dialing *555#...';
  ussdSend('');
}

async function ussdSend(){
  const inp = document.getElementById('ussdInput').value.trim();
  try {
    const r = await fetch('http://localhost:4000/api/ussd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inp })
    });
    const txt = await r.text();
    document.getElementById('ussdScreen').textContent = txt.replace(/^CON |^END /, '');
    document.getElementById('ussdInput').value = '';
  } catch (e) {
    document.getElementById('ussdScreen').textContent = '❌ USSD service offline';
  }
}

window.renderCommunity = renderCommunity;
window.likeTalk = likeTalk;
window.deleteTalk = deleteTalk;
window.runVirusScan = runVirusScan;
window.postRFQ = postRFQ;
window.renderRFQ = renderRFQ;
window.renderOutbreaks = renderOutbreaks;
window.renderProfile = renderProfile;
window.postTalk = postTalk;
window.ussdBoot = ussdBoot;
window.ussdSend = ussdSend;