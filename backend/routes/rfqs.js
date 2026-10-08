import { Router } from 'express';
import { query } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const result = await query(
      `SELECT r.*, u.name AS owner_name 
       FROM rfqs r LEFT JOIN users u ON u.id = r.owner_id 
       WHERE r.created_at > datetime('now', '-7 days') 
       ORDER BY r.created_at DESC LIMIT 100`
    );
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { item, region, budget } = req.body;
    if (!item || !region) return res.status(400).json({ error: 'item + region required' });
    const me = await query('SELECT name, phone FROM users WHERE id=?', [req.user.id]);
    const result = await query(
      'INSERT INTO rfqs (item, region, budget, posted_by, phone, owner_id) VALUES (?, ?, ?, ?, ?, ?)',
      [item, region, budget || null, me.rows[0]?.name || 'Farmer', me.rows[0]?.phone || '', req.user.id]
    );
    const created = await query('SELECT * FROM rfqs WHERE id=?', [result.rows[0].id]);
    res.status(201).json(created.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const check = await query('SELECT owner_id FROM rfqs WHERE id=?', [req.params.id]);
    if (!check.rows[0]) return res.status(404).json({ error: 'Not found' });
    if (check.rows[0].owner_id !== req.user.id) return res.status(403).json({ error: 'Not yours' });
    await query('DELETE FROM rfqs WHERE id=?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;