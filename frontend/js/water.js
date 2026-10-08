const cropWater = { maize: 5.5, wheat: 4.5, tomato: 6.5, onion: 4.8, potato: 5.2, grapes: 6.0, pasture: 7.5 };
const soilFactor = { sandy: 1.15, clay: 0.9, loam: 1.0 };

async function calcWater(){
  const crop = document.getElementById('wCrop').value;
  const area = parseFloat(document.getElementById('wArea').value) || 1;
  const soil = document.getElementById('wSoil').value;
  const stage = parseFloat(document.getElementById('wStage').value);

  const el = document.getElementById('waterResult');
  el.classList.add('show');
  el.innerHTML = '<span class="spinner"></span> Calculating...';

  try {
    const d = await api.post('/weather/irrigation', { crop, area, soil, stage });
    renderWater(d);
  } catch (e) { el.innerHTML = `<p style="color:var(--danger)">⚠️ ${e.message}</p>`; }
}

function renderWater(d){
  document.getElementById('waterResult').innerHTML = `
    <h3 style="color:var(--green)">💧 Daily Water Requirement</h3>
    <div class="grid cols-3" style="margin:10px 0">
      <div class="stat"><div class="num">${d.daily_m3}</div><div class="lbl">m³/day</div></div>
      <div class="stat"><div class="num">${d.drip_hours}</div><div class="lbl">Drip hrs/day</div></div>
      <div class="stat"><div class="num">${d.daily_liters ? d.daily_liters.toLocaleString() : '—'}</div><div class="lbl">Liters/day</div></div>
    </div>
    <p style="font-size:13px;color:var(--muted)">Pressure: <b>${d.drip_pressure_bar} bar</b> • Emitter: <b>${d.emitter_spacing_cm} cm</b></p>
    <p style="font-size:12px;color:var(--info);margin-top:8px">${d.note || ''}</p>
    ${d.source === 'js-fallback' ? '<p style="font-size:11px;color:var(--warn)">⚠️ Using local calculation (Python AI offline)</p>' : ''}`;
}

window.calcWater = calcWater;