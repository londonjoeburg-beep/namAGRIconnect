import { Router } from 'express';
import { query } from '../db.js';
import fetch from 'node-fetch';

const router = Router();
const AI = process.env.AI_SERVICE_URL || 'http://localhost:5000';

router.post('/scan', async (req, res) => {
  try {
    const body = req.body || {};
    console.log('📸 Soil scan received, image size:',
      body.image ? Math.round(body.image.length / 1024) + ' KB' : 'none');

    const r = await fetch(AI + '/analyze/soil', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!r.ok) throw new Error('AI service returned ' + r.status);
    const result = await r.json();

    // Save to DB (store hash only, not full image)
    await query('INSERT INTO soil_scans (readings, diagnosis) VALUES (?, ?)',
      [JSON.stringify({ hasImage: !!body.image, readings: body.readings }), JSON.stringify(result)]);

    res.json(result);
  } catch (e) {
    console.error('❌ Soil scan error:', e.message);
    res.status(503).json({ error: 'AI service offline: ' + e.message });
  }
});

export default router;