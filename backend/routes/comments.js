import { Router } from 'express';
import { query } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/listing/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM comments WHERE listing_id=? ORDER BY created_at ASC', [req.params.id]);
    const topLevel = result.rows.filter(c => !c.parent_id);
    const replies = result.rows.filter(c => c.parent_id);
    const threaded = topLevel.map(c => ({ ...c, replies: replies.filter(r => r.parent_id === c.id) }));
    res.json(threaded);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { listing_id, text, parent_id } = req.body;
    if (!listing_id || !text) return res.status(400).json({ error: 'listing_id + text required' });
    const me = await query('SELECT name FROM users WHERE id=?', [req.user.id]);
    const userName = me.rows[0]?.name || 'Farmer';
    const result = await query(
      'INSERT INTO comments (listing_id, user_name, text, parent_id, owner_id) VALUES (?, ?, ?, ?, ?)',
      [listing_id, userName, text, parent_id || null, req.user.id]
    );
    const created = await query('SELECT * FROM comments WHERE id=?', [result.rows[0].id]);
    res.status(201).json(created.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const check = await query('SELECT owner_id FROM comments WHERE id=?', [req.params.id]);
    if (!check.rows[0]) return res.status(404).json({ error: 'Not found' });
    if (check.rows[0].owner_id !== req.user.id) return res.status(403).json({ error: 'Not yours' });
    await query('DELETE FROM comments WHERE id=?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const existing = await query(
      'SELECT id FROM likes WHERE user_id=? AND target_type=? AND target_id=?',
      [req.user.id, 'comment', req.params.id]
    );
    if (existing.rows[0]) {
      await query('DELETE FROM likes WHERE id=?', [existing.rows[0].id]);
      await query('UPDATE comments SET likes = MAX(0, COALESCE(likes,0) - 1) WHERE id=?', [req.params.id]);
      const r = await query('SELECT likes FROM comments WHERE id=?', [req.params.id]);
      return res.json({ liked: false, likes: r.rows[0]?.likes || 0 });
    }
    await query('INSERT INTO likes (user_id, target_type, target_id) VALUES (?, ?, ?)', [req.user.id, 'comment', req.params.id]);
    await query('UPDATE comments SET likes = COALESCE(likes,0) + 1 WHERE id=?', [req.params.id]);
    const r = await query('SELECT likes FROM comments WHERE id=?', [req.params.id]);
    res.json({ liked: true, likes: r.rows[0]?.likes || 0 });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;