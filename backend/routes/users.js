import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.get('/leaderboard', async (_req, res) => {
  try {
    const result = await query('SELECT id, name, region, rating, badges FROM users ORDER BY rating DESC LIMIT 10');
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;