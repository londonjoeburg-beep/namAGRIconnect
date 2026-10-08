import { Router } from 'express';
import fetch from 'node-fetch';
import { query } from '../db.js';

const router = Router();
const AI = process.env.AI_SERVICE_URL || 'http://localhost:5000';

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

function emoji(code) {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  if (code <= 99) return '⛈️';
  return '🌤️';
}

function fireRisk(t, h, r) {
  if (r > 5) return 'Low';
  if (t > 32 && h < 20) return 'High';
  if (t > 28 && h < 35) return 'Moderate';
  return 'Low';
}

router.get('/regions', async (_req, res) => {
  try {
    const entries = Object.entries(REGIONS);
    const results = await Promise.all(entries.map(async ([region, { lat, lon, city }]) => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&hourly=precipitation_probability&forecast_days=1&timezone=Africa/Windhoek`;
        const r = await fetch(url);
        const d = await r.json();
        const c = d.current || {};
        const t = c.temperature_2m;
        const h = c.relative_humidity_2m ?? 50;
        const rr = c.precipitation ?? 0;
        return {
          region, city,
          temp: Math.round(t),
          cond: emoji(c.weather_code ?? 0),
          humidity: h,
          rain: d.hourly?.precipitation_probability?.[12] ?? 0,
          wind: Math.round(c.wind_speed_10m ?? 0),
          frost: t !== null && t <= 3,
          fire: fireRisk(t, h, rr),
          moisture: Math.max(5, Math.min(90, Math.round(h * 0.9))),
          updatedAt: new Date().toISOString()
        };
      } catch (err) {
        return { region, city, temp: null, cond: '❓', error: true };
      }
    }));
    res.json(results);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/ndvi', (_req, res) => {
  res.json([
    { region: 'Kavango East', v: 0.78 }, { region: 'Oshana', v: 0.62 },
    { region: 'Khomas', v: 0.41 },       { region: 'Erongo', v: 0.35 },
    { region: 'Otjozondjupa', v: 0.55 }, { region: '//Karas', v: 0.22 }
  ]);
});

router.post('/irrigation', async (req, res) => {
  try {
    const r = await fetch(`${AI}/analyze/water`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    if (!r.ok) throw new Error('AI error');
    res.json(await r.json());
  } catch (e) {
    // JS fallback
    const CROP = { maize: 5.5, wheat: 4.5, tomato: 6.5, onion: 4.8, potato: 5.2, grapes: 6.0, pasture: 7.5 };
    const SOIL = { sandy: 1.15, clay: 0.9, loam: 1.0 };
    const { crop = 'maize', area = 1, soil = 'loam', stage = 1 } = req.body || {};
    const base = (CROP[crop] || 5.5) * (SOIL[soil] || 1) * stage;
    const liters = base * 10000 * area;
    res.json({
      crop, area_ha: area, soil, stage,
      daily_liters: Math.round(liters),
      daily_m3: +(liters / 1000).toFixed(1),
      drip_hours: +(liters / (2.3 * 4 * 10000 * area)).toFixed(1),
      drip_pressure_bar: 1.2,
      emitter_spacing_cm: 30,
      note: 'Adjust for rain forecast.',
      source: 'js-fallback'
    });
  }
});

export default router;