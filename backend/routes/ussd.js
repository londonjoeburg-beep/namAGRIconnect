import { Router } from 'express';
import { query } from '../db.js';
import fetch from 'node-fetch';

const router = Router();

const COORDS = {
  'Khomas': [-22.5609, 17.0658], 'Kavango East': [-17.9333, 19.7833],
  'Erongo': [-22.95, 14.5], 'Oshana': [-17.7833, 15.7], 'Otjozondjupa': [-20.4667, 16.65]
};

router.post('/', async (req, res) => {
  try {
    const input = (req.body.text || '').trim();
    const parts = input.split('*').filter(Boolean);
    const step = parts.length;

    if (step === 0) {
      return res.send(`CON Welcome to NamAgriConnect
1. Browse Produce
2. Market Prices
3. Weather
4. Post Listing Info
5. My Account`);
    }

    const choice = parts[0];

    if (step === 1) {
      if (choice === '1') {
        const listings = await query('SELECT id, title, price, unit, town FROM listings WHERE sold=0 ORDER BY created_at DESC LIMIT 5');
        let menu = 'CON Browse Listings:\n';
        listings.rows.forEach((l, i) => { menu += `${i + 1}. ${l.title} - N$${l.price}/${l.unit} (${l.town})\n`; });
        menu += '0. Back';
        return res.send(menu);
      }
      if (choice === '2') {
        const prices = await query('SELECT title, AVG(price) AS avg_price, unit FROM listings WHERE sold=0 GROUP BY title LIMIT 5');
        let menu = 'CON Market Prices:\n';
        prices.rows.forEach(p => { menu += `${p.title}: N$${Math.round(p.avg_price)}/${p.unit}\n`; });
        menu += '0. Back';
        return res.send(menu);
      }
      if (choice === '3') {
        const regions = Object.keys(COORDS);
        let menu = 'CON Select Region:\n';
        regions.forEach((r, i) => { menu += `${i + 1}. ${r}\n`; });
        menu += '0. Back';
        return res.send(menu);
      }
      if (choice === '4') {
        return res.send(`CON To post a listing:
Visit http://localhost:3000
Login and click Post Listing
0. Back`);
      }
      if (choice === '5') {
        return res.send(`CON My Account:
Visit http://localhost:3000
Login to view your farm
0. Back`);
      }
    }

    if (step === 2) {
      if (choice === '1') {
        const listings = await query('SELECT id, title, price, unit, town, phone, contact_name FROM listings WHERE sold=0 ORDER BY created_at DESC LIMIT 5');
        const idx = parseInt(parts[1], 10) - 1;
        const l = listings.rows[idx];
        if (!l) return res.send('END Listing not found. Dial *555# to retry.');
        return res.send(`END ${l.title}
N$${l.price}/${l.unit}
${l.town}
Seller: ${l.contact_name || 'Farmer'}
Phone: ${l.phone}`);
      }
      if (choice === '3') {
        const regions = Object.keys(COORDS);
        const idx = parseInt(parts[1], 10) - 1;
        const region = regions[idx];
        if (!region) return res.send('END Invalid. Try again.');
        const [lat, lon] = COORDS[region];
        try {
          const wr = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation&timezone=Africa/Windhoek`);
          const wd = await wr.json();
          const c = wd.current || {};
          return res.send(`END ${region} Weather:
Temp: ${c.temperature_2m}°C
Humidity: ${c.relative_humidity_2m}%
Rain: ${c.precipitation}mm`);
        } catch {
          return res.send('END Weather unavailable.');
        }
      }
    }

    res.send('END Invalid choice. Dial *555# to restart.');
  } catch (e) {
    console.error('USSD error:', e);
    res.send('END Service error.');
  }
});

export default router;