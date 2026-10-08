import { Router } from 'express';
import { query } from '../db.js';
import fetch from 'node-fetch';

const router = Router();
const AI = process.env.AI_SERVICE_URL || 'http://localhost:5000';

router.post('/scan', async (req, res) => {
  try {
    const body = req.body || {};
    console.log('🦠 Virus scan received, image size:',
      body.image ? Math.round(body.image.length / 1024) + ' KB' : 'none');

    const r = await fetch(AI + '/analyze/virus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!r.ok) throw new Error('AI service returned ' + r.status);
    const result = await r.json();

    await query('INSERT INTO virus_scans (disease, severity, confidence, treatment) VALUES (?, ?, ?, ?)',
      [result.disease, result.severity, result.confidence, JSON.stringify(result.treatment)]);

    if (result.severity === 'Critical') {
      await query('INSERT INTO outbreak_alerts (disease, region, severity, farms_alerted) VALUES (?, ?, ?, ?)',
        [result.disease, body.region || 'Unknown', 'Critical', 47]);
    }

    res.json(result);
  } catch (e) {
    console.error('❌ Virus scan error:', e.message);
    res.status(503).json({ error: 'AI service offline: ' + e.message });
  }
});

router.get('/outbreaks', async (_req, res) => {
  try {
    const result = await query('SELECT * FROM outbreak_alerts ORDER BY created_at DESC LIMIT 20');
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;