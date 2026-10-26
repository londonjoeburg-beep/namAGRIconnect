/* Weather Display — handles both live and fallback data */

async function renderWeather() {
  const grid = document.getElementById('weatherGrid');
  if (!grid) return;
  
  grid.innerHTML = '<div class="card" style="grid-column:1/-1;text-align:center;padding:40px"><span class="spinner"></span> Fetching live weather...</div>';

  try {
    const regions = await api.get('/weather/regions');
    console.log('🌤️ Weather data received:', regions.length, 'regions');

    if (!regions || !Array.isArray(regions) || regions.length === 0) {
      throw new Error('No weather data returned');
    }

    const liveCount = regions.filter(r => r.source === 'live').length;
    const fallbackCount = regions.filter(r => r.source === 'fallback').length;

    grid.innerHTML = regions.map(r => {
      // Handle null temperature with fallback text
      const tempDisplay = (r.temp === null || r.temp === undefined) 
        ? '—' 
        : r.temp + '°C';
      
      const sourceBadge = r.source === 'fallback' 
        ? '<span class="badge warn" style="font-size:9px;padding:2px 6px">⚠ Fallback</span>' 
        : '';

      return `
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:start">
            <div>
              <b>${r.region}</b>
              <div style="font-size:12px;color:var(--muted)">${r.city || ''}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:28px">${r.cond}</div>
              ${sourceBadge}
            </div>
          </div>
          <div style="font-size:28px;font-weight:800;color:var(--green);margin:6px 0">${tempDisplay}</div>
          <div style="font-size:12px;color:var(--muted);display:flex;flex-wrap:wrap;gap:8px">
            <span>🌧️ ${r.rain}%</span>
            <span>💧 ${r.humidity}%</span>
            <span>${r.frost ? '❄️ Frost!' : '❄️ No frost'}</span>
            <span>🔥 ${r.fire}</span>
          </div>
        </div>
      `;
    }).join('');

    // Show summary at the top
    if (fallbackCount > 0) {
      console.log(`⚠ ${fallbackCount} regions using fallback data`);
    }

  } catch (e) {
    console.error('❌ Weather fetch failed:', e);
    grid.innerHTML = `
      <div class="card" style="grid-column:1/-1;text-align:center;color:var(--danger);padding:24px">
        ⚠️ Could not load weather: ${e.message}
        <br><br>
        <button class="btn small" onclick="renderWeather()">🔄 Retry</button>
      </div>
    `;
  }

  // NDVI
  try {
    const ndvi = await api.get('/weather/ndvi');
    const ndviEl = document.getElementById('ndviBars');
    if (ndviEl) {
      ndviEl.innerHTML = ndvi.map(n => `
        <div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600">
            <span>${n.region}</span><span>${n.v}</span>
          </div>
          <div class="meter"><div style="width:${n.v * 100}%"></div></div>
        </div>
      `).join('');
    }
  } catch (e) {
    console.error('NDVI fetch failed:', e);
  }
}

window.renderWeather = renderWeather;
console.log('✅ weather.js loaded');