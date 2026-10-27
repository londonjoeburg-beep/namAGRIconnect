import { Router } from 'express';
import fetch from 'node-fetch';

const router = Router();
const AI = process.env.AI_SERVICE_URL || 'http://localhost:5000';

// Namibian regions with coordinates
const REGIONS = {
  'Khomas':        { lat: -22.5609, lon: 17.0658, city: 'Windhoek' },
  'Kavango East':  { lat: -17.9333, lon: 19.7833, city: 'Rundu' },
  'Kavango West':  { lat: -17.8833, lon: 18.8000, city: 'Nkurenkuru' },
  'Otjozondjupa':  { lat: -20.4667, lon: 16.6500, city: 'Otjiwarongo' },
  'Erongo':        { lat: -22.9500, lon: 14.5000, city: 'Walvis Bay' },
  'Oshana':        { lat: -17.7833, lon: 15.7000, city: 'Oshakati' },
  'Omusati':       { lat: -17.5000, lon: 14.9833, city: 'Outapi' },
  'Ohangwena':     { lat: -17.5000, lon: 16.2833, city: 'Eenhana' },
  'Oshikoto':      { lat: -18.5000, lon: 16.5000, city: 'Tsumeb' },
  'Zambezi':       { lat: -17.5000, lon: 24.2667, city: 'Katima Mulilo' },
  'Omaheke':       { lat: -22.4500, lon: 18.9667, city: 'Gobabis' },
  'Hardap':        { lat: -24.5667, lon: 17.9167, city: 'Mariental' },
  '//Karas':       { lat: -26.6500, lon: 18.1333, city: 'Keetmanshoop' },
  'Kunene':        { lat: -20.1167, lon: 14.1000, city: 'Opuwo' }
};

function weatherEmoji(code) {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  if (code <= 99) return '⛈️';
  return '🌤️';
}

function fireRisk(temp, humidity, rain) {
  if (rain > 5) return 'Low';
  if (temp > 32 && humidity < 20) return 'High';
  if (temp > 28 && humidity < 35) return 'Moderate';
  return 'Low';
}

async function fetchRegionWeather(region, coords) {
  const { lat, lon, city } = coords;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m` +
    `&hourly=precipitation_probability&forecast_days=1&timezone=Africa/Windhoek`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const current = data.current || {};

      if (current.temperature_2m === undefined || current.temperature_2m === null) {
        throw new Error('Missing temperature');
      }

      return {
        region,
        city,
        temp: Math.round(current.temperature_2m),
        cond: weatherEmoji(current.weather_code ?? 0),
        humidity: current.relative_humidity_2m ?? 50,
        rain: data.hourly?.precipitation_probability?.[12] ?? 0,
        wind: Math.round(current.wind_speed_10m ?? 0),
        frost: current.temperature_2m <= 3,
        fire: fireRisk(current.temperature_2m, current.relative_humidity_2m ?? 50, current.precipitation ?? 0),
        moisture: Math.max(5, Math.min(90, Math.round((current.relative_humidity_2m ?? 50) * 0.9))),
        updatedAt: new Date().toISOString(),
        source: 'live'
      };
    } catch (err) {
      console.error(`🌤️ [${region}] Attempt ${attempt} failed:`, err.message);
      if (attempt === 3) return getFallbackWeather(region, city);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

function getFallbackWeather(region, city) {
  const fallbacks = {
    'Khomas':        { temp: 28, cond: '☀️', humidity: 40, rain: 5, fire: 'Moderate', moisture: 14 },
    'Kavango East':  { temp: 32, cond: '⛅', humidity: 55, rain: 40, fire: 'Low', moisture: 28 },
    'Kavango West':  { temp: 31, cond: '⛅', humidity: 52, rain: 35, fire: 'Low', moisture: 25 },
    'Otjozondjupa':  { temp: 26, cond: '🌦️', humidity: 60, rain: 50, fire: 'Low', moisture: 32 },
    'Erongo':        { temp: 22, cond: '🌫️', humidity: 65, rain: 10, fire: 'Low', moisture: 19 },
    'Oshana':        { temp: 31, cond: '☀️', humidity: 45, rain: 15, fire: 'High', moisture: 12 },
    'Omusati':       { temp: 30, cond: '☀️', humidity: 42, rain: 20, fire: 'Moderate', moisture: 14 },
    'Ohangwena':     { temp: 30, cond: '☀️', humidity: 45, rain: 20, fire: 'Moderate', moisture: 15 },
    'Oshikoto':      { temp: 29, cond: '⛅', humidity: 50, rain: 25, fire: 'Low', moisture: 18 },
    'Zambezi':       { temp: 33, cond: '⛅', humidity: 60, rain: 45, fire: 'Low', moisture: 30 },
    'Omaheke':       { temp: 27, cond: '☀️', humidity: 38, rain: 10, fire: 'Moderate', moisture: 13 },
    'Hardap':        { temp: 26, cond: '☀️', humidity: 35, rain: 5, fire: 'High', moisture: 10 },
    '//Karas':       { temp: 24, cond: '☀️', humidity: 32, rain: 0, fire: 'High', moisture: 8 },
    'Kunene':        { temp: 28, cond: '☀️', humidity: 40, rain: 8, fire: 'Moderate', moisture: 12 }
  };
  const fb = fallbacks[region] || { temp: 28, cond: '☀️', humidity: 45, rain: 10, fire: 'Low', moisture: 15 };
  return {
    region, city,
    temp: fb.temp, cond: fb.cond, humidity: fb.humidity,
    rain: fb.rain, wind: 10, frost: fb.temp <= 3,
    fire: fb.fire, moisture: fb.moisture,
    updatedAt: new Date().toISOString(),
    source: 'fallback'
  };
}

router.get('/regions', async (_req, res) => {
  try {
    const entries = Object.entries(REGIONS);
    const results = await Promise.all(
      entries.map(([region, coords]) => fetchRegionWeather(region, coords))
    );
    res.json(results);
  } catch (e) {
    console.error('❌ Weather endpoint error:', e);
    const results = Object.entries(REGIONS).map(([region, coords]) =>
      getFallbackWeather(region, coords.city)
    );
    res.json(results);
  }
});

router.get('/ndvi', (_req, res) => {
  res.json([
    { region: 'Kavango East', v: 0.78 },
    { region: 'Oshana', v: 0.62 },
    { region: 'Khomas', v: 0.41 },
    { region: 'Erongo', v: 0.35 },
    { region: 'Otjozondjupa', v: 0.55 },
    { region: '//Karas', v: 0.22 }
  ]);
});

/* ══════════════════════════════════════════════════
   🔥 IRRIGATION CALCULATOR — MISSING ENDPOINT FIX
   ══════════════════════════════════════════════════ */

router.post('/irrigation', async (req, res) => {
  try {
    console.log('💧 Irrigation request:', req.body);

    // Try AI service first
    try {
      const aiRes = await fetch(`${AI}/analyze/water`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });
      if (aiRes.ok) {
        const aiData = await aiRes.json();
        console.log('✅ Irrigation from AI service');
        return res.json({ ...aiData, source: 'ai' });
      }
    } catch (aiErr) {
      console.log('ℹ️ AI service offline, using local calculation');
    }

    // Fallback: local calculation
    const CROP = { maize: 5.5, wheat: 4.5, tomato: 6.5, onion: 4.8, potato: 5.2, grapes: 6.0, pasture: 7.5 };
    const SOIL = { sandy: 1.15, clay: 0.9, loam: 1.0 };

    const { crop = 'maize', area = 1, soil = 'loam', stage = 1 } = req.body || {};
    const areaNum = parseFloat(area) || 1;
    const stageNum = parseFloat(stage) || 1;

    const base = (CROP[crop] || 5.5) * (SOIL[soil] || 1) * stageNum;
    const liters = base * 10000 * areaNum;

    const result = {
      crop,
      area_ha: areaNum,
      soil,
      stage: stageNum,
      daily_liters: Math.round(liters),
      daily_m3: +(liters / 1000).toFixed(1),
      drip_hours: +(liters / (2.3 * 4 * 10000 * areaNum)).toFixed(1),
      drip_pressure_bar: 1.2,
      emitter_spacing_cm: 30,
      note: 'Adjust for rain forecast.',
      source: 'local'
    };

    console.log('✅ Irrigation from local calculation:', result);
    res.json(result);
  } catch (e) {
    console.error('❌ Irrigation error:', e);
    res.status(500).json({ error: e.message });
  }
});

export default router;