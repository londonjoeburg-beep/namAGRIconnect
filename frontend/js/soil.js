/* Soil AI Scanner — real camera capture */

async function runSoilScan(){
  // Open camera to capture a soil photo
  const imageData = await captureFromCamera('soil');
  if (!imageData) return; // User cancelled

  const result = document.getElementById('soilResult');
  result.classList.add('show');
  result.innerHTML = '<div style="display:flex;gap:8px;align-items:center"><span class="spinner"></span><b>Analyzing your soil sample...</b></div>';

  try {
    const data = await api.post('/soil/scan', {
      image: imageData,
      readings: null
    });
    renderSoilResult(data, imageData);
  } catch (e) {
    result.innerHTML = '<p style="color:var(--danger);font-size:13px">⚠️ ' + e.message + '<br><small>Start AI: <code>cd ai-service && python app.py</code></small></p>';
  }
}

function renderSoilResult(d, imageData){
  document.getElementById('soilResult').innerHTML =
    (imageData ? '<img src="' + imageData + '" style="max-width:180px;border-radius:10px;margin-bottom:10px;display:block">' : '') +
    '<h3 style="color:var(--green)">✅ Soil Analysis Complete</h3>' +
    '<p style="font-size:13px;color:var(--muted);margin:8px 0">' +
      'Texture: <b>' + d.texture + '</b> • Organic: <b>' + d.organic_matter + '</b>' +
      ' • Salinity: <b>' + d.salinity.status + '</b> • pH: <b>' + d.ph.value + '</b> (' + d.ph.status + ')' +
    '</p>' +
    '<h4 style="margin:10px 0 4px">NPK Diagnostics</h4>' +
    d.nutrients.map(function(n) {
      return '<div style="margin-bottom:10px">' +
        '<div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600">' +
          '<span>' + n.nutrient + '</span><span>' + n.value + ' — ' + n.level + '</span>' +
        '</div>' +
        '<div class="meter"><div style="width:' + Math.min(100, n.value) + '%"></div></div>' +
        '<p style="font-size:12px;color:var(--muted)">💡 ' + n.recommendation + '</p>' +
      '</div>';
    }).join('');
}

async function runManualSoil(){
  const payload = {
    readings: {
      pH: +document.getElementById('mPh').value,
      EC: +document.getElementById('mEc').value,
      N: +document.getElementById('mN').value,
      P: +document.getElementById('mP').value,
      K: +document.getElementById('mK').value
    }
  };
  closeModal('manualSoilModal');
  const result = document.getElementById('soilResult');
  result.classList.add('show');
  result.innerHTML = '<span class="spinner"></span> Analyzing...';
  try {
    const data = await api.post('/soil/scan', payload);
    renderSoilResult(data, null);
    goTo('soil');
  } catch (e) { result.innerHTML = '<p style="color:var(--danger)">⚠️ ' + e.message + '</p>'; }
}

window.runSoilScan = runSoilScan;
window.runManualSoil = runManualSoil;