import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { authMiddleware, signToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { phone, name, region, town, password } = req.body;
    if (!phone || !name || !password) return res.status(400).json({ error: 'phone, name, password required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password min 6 characters' });

    const exists = await query('SELECT id FROM users WHERE phone=?', [phone]);
    if (exists.rows.length) return res.status(409).json({ error: 'Phone already registered' });

    const hash = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (phone, name, region, town, password_hash) VALUES (?, ?, ?, ?, ?)',
      [phone, name, region || '', town || '', hash]
    );

    const user = await query('SELECT id, phone, name, region, town, rating, badges FROM users WHERE id=?', [result.rows[0].id]);
    const token = signToken({ id: user.rows[0].id, phone: user.rows[0].phone });
    res.status(201).json({ user: user.rows[0], token });
  } catch (e) {
    console.error('register:', e);
    res.status(500).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ error: 'phone + password required' });
    const result = await query('SELECT * FROM users WHERE phone=?', [phone]);
    if (!result.rows[0]) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, result.rows[0].password_hash || '');
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const { password_hash, ...safe } = result.rows[0];
    const token = signToken({ id: safe.id, phone: safe.phone });
    res.json({ user: safe, token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, phone, name, region, town, rating, badges, created_at FROM users WHERE id=?',
      [req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'User gone' });
    res.json(result.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/my-listings', authMiddleware, async (req, res) => {
  try {
    const result = await query('SELECT * FROM listings WHERE owner_id=? AND sold=0 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/my-sales', authMiddleware, async (req, res) => {
  try {
    const result = await query('SELECT * FROM listings WHERE owner_id=? AND sold=1 ORDER BY sold_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;