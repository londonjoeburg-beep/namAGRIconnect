async function renderWeather(){
  const grid = document.getElementById('weatherGrid');
  grid.innerHTML = '<div class="card" style="grid-column:1/-1;text-align:center"><span class="spinner"></span> Fetching live weather...</div>';
  try {
    const regions = await api.get('/weather/regions');
    const valid = regions.filter(r => !r.error);
    grid.innerHTML = valid.map(r => `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div><b>${r.region}</b><div style="font-size:12px;color:var(--muted)">${r.city || ''}</div></div>
          <div style="font-size:28px">${r.cond}</div>
        </div>
        <div style="font-size:28px;font-weight:800;color:var(--green);margin:6px 0">${r.temp}°C</div>
        <div style="font-size:12px;color:var(--muted);display:flex;flex-wrap:wrap;gap:8px">
          <span>🌧️ ${r.rain}%</span><span>💧 ${r.humidity}%</span>
          <span>${r.frost ? '❄️ Frost!' : '❄️ No frost'}</span><span>🔥 ${r.fire}</span>
        </div>
      </div>`).join('');
  } catch (e) {
    grid.innerHTML = `<div class="card" style="grid-column:1/-1;text-align:center;color:var(--danger)">
      ⚠️ ${e.message}<br><button class="btn small" style="margin-top:8px" onclick="renderWeather()">🔄 Retry</button>
    </div>`;
  }

  try {
    const ndvi = await api.get('/weather/ndvi');
    document.getElementById('ndviBars').innerHTML = ndvi.map(n => `
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600"><span>${n.region}</span><span>${n.v}</span></div>
        <div class="meter"><div style="width:${n.v * 100}%"></div></div>
      </div>`).join('');
  } catch {}
}

window.renderWeather = renderWeather;