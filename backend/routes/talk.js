import { Router } from 'express';
import { query } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const result = await query(
      `SELECT t.*, u.name AS owner_name, u.region AS owner_region 
       FROM talk_posts t LEFT JOIN users u ON u.id = t.owner_id 
       ORDER BY t.created_at DESC LIMIT 50`
    );
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text required' });
    const me = await query('SELECT name FROM users WHERE id=?', [req.user.id]);
    const name = me.rows[0]?.name || 'Farmer';
    const result = await query(
      'INSERT INTO talk_posts (user_name, text, owner_id) VALUES (?, ?, ?)',
      [name, text, req.user.id]
    );
    const created = await query('SELECT * FROM talk_posts WHERE id=?', [result.rows[0].id]);
    res.status(201).json(created.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const check = await query('SELECT owner_id FROM talk_posts WHERE id=?', [req.params.id]);
    if (!check.rows[0]) return res.status(404).json({ error: 'Not found' });
    if (check.rows[0].owner_id !== req.user.id) return res.status(403).json({ error: 'Not yours' });
    await query('DELETE FROM talk_posts WHERE id=?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const existing = await query(
      'SELECT id FROM likes WHERE user_id=? AND target_type=? AND target_id=?',
      [req.user.id, 'talk', req.params.id]
    );
    if (existing.rows[0]) {
      await query('DELETE FROM likes WHERE id=?', [existing.rows[0].id]);
      await query('UPDATE talk_posts SET likes = MAX(0, COALESCE(likes,0) - 1) WHERE id=?', [req.params.id]);
      const r = await query('SELECT likes FROM talk_posts WHERE id=?', [req.params.id]);
      return res.json({ liked: false, likes: r.rows[0]?.likes || 0 });
    }
    await query('INSERT INTO likes (user_id, target_type, target_id) VALUES (?, ?, ?)', [req.user.id, 'talk', req.params.id]);
    await query('UPDATE talk_posts SET likes = COALESCE(likes,0) + 1 WHERE id=?', [req.params.id]);
    const r = await query('SELECT likes FROM talk_posts WHERE id=?', [req.params.id]);
    res.json({ liked: true, likes: r.rows[0]?.likes || 0 });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;