/* Soil AI Scanner — with fallback */

async function runSoilScan() {
  const result = document.getElementById('soilResult');
  result.classList.add('show');
  result.innerHTML = '<div style="display:flex;gap:8px;align-items:center"><span class="spinner"></span><b>Analyzing soil sample...</b></div>';

  // Get manual readings if available
  const readings = {
    pH: parseFloat(document.getElementById('mPh')?.value) || 6.2,
    EC: parseFloat(document.getElementById('mEc')?.value) || 1.1,
    N: parseFloat(document.getElementById('mN')?.value) || 22,
    P: parseFloat(document.getElementById('mP')?.value) || 14,
    K: parseFloat(document.getElementById('mK')?.value) || 110
  };

  try {
    // Try AI service first
    const data = await api.post('/soil/scan', {
      image: 'sample-' + Date.now(),
      readings: readings
    });
    renderSoilResult(data, true);
  } catch (e) {
    console.log('AI service unavailable, using local analysis:', e.message);
    // Smart local fallback
    const data = localSoilAnalysis(readings);
    renderSoilResult(data, false);
  }
}

function localSoilAnalysis(readings) {
  const N = readings.N, P = readings.P, K = readings.K, pH = readings.pH, EC = readings.EC;

  // Classify nutrients
  function classify(val, low, high) {
    if (val < low) return 'Low';
    if (val > high) return 'High';
    return 'Adequate';
  }

  // Determine texture from N-P-K ratios (heuristic)
  let texture = 'Loam';
  if (readings.N < 15 && readings.K < 100) texture = 'Sandy';
  else if (readings.P > 25 && readings.K > 200) texture = 'Clay';

  // Organic matter estimate
  let organic = '1.5%';
  if (N > 30 && P > 20) organic = '3.0%+';
  else if (N > 20) organic = '2.0%';
  else if (N < 15) organic = '0.8%';

  // pH status
  let phStatus = 'Optimal';
  if (pH < 5.8) phStatus = 'Too acidic';
  else if (pH > 7.5) phStatus = 'Too alkaline';

  // Salinity
  let salStatus = 'Safe';
  if (EC > 4) salStatus = 'High risk';
  else if (EC > 2) salStatus = 'Moderate';

  return {
    texture: texture,
    organic_matter: organic,
    salinity: { value: EC, status: salStatus },
    ph: { value: pH, status: phStatus },
    nutrients: [
      { nutrient: 'Nitrogen (N)', value: N, level: classify(N, 25, 60),
        recommendation: N < 25 ? 'Apply kraal manure (2 t/ha) or urea top-dress.' : 'Maintain current practices.' },
      { nutrient: 'Phosphorus (P)', value: P, level: classify(P, 15, 40),
        recommendation: P < 15 ? 'Apply bone meal or rock phosphate (200 kg/ha).' : 'Adequate.' },
      { nutrient: 'Potassium (K)', value: K, level: classify(K, 100, 250),
        recommendation: K < 100 ? 'Apply wood ash or KCl.' : 'Adequate.' }
    ],
    source: 'local-fallback'
  };
}

function renderSoilResult(d, fromAI) {
  document.getElementById('soilResult').innerHTML =
    '<h3 style="color:var(--green)">✅ Soil Analysis Complete</h3>' +
    (fromAI ? '' : '<p style="font-size:11px;color:var(--warn);margin-bottom:8px">⚠️ Using smart local analysis (AI service offline)</p>') +
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

async function runManualSoil() {
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
    renderSoilResult(data, true);
    goTo('soil');
  } catch (e) {
    const data = localSoilAnalysis(payload.readings);
    renderSoilResult(data, false);
    goTo('soil');
  }
}

window.runSoilScan = runSoilScan;
window.runManualSoil = runManualSoil;
window.localSoilAnalysis = localSoilAnalysis;