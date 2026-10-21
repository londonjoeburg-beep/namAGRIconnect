import { Router } from 'express';
import { query } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/wallet
router.get('/', authMiddleware, async (req, res) => {
  try {
    let wallet = await query('SELECT * FROM wallets WHERE user_id=?', [req.user.id]);
    if (!wallet.rows[0]) {
      await query('INSERT INTO wallets (user_id, balance) VALUES (?, 0)', [req.user.id]);
      wallet = await query('SELECT * FROM wallets WHERE user_id=?', [req.user.id]);
    }
    const txs = await query(
      'SELECT * FROM transactions WHERE wallet_id=? ORDER BY created_at DESC LIMIT 20',
      [wallet.rows[0].id]
    );
    res.json({ ...wallet.rows[0], transactions: txs.rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/wallet/deposit
router.post('/deposit', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
    
    let wallet = await query('SELECT * FROM wallets WHERE user_id=?', [req.user.id]);
    if (!wallet.rows[0]) {
      await query('INSERT INTO wallets (user_id, balance) VALUES (?, 0)', [req.user.id]);
      wallet = await query('SELECT * FROM wallets WHERE user_id=?', [req.user.id]);
    }
    
    await query('UPDATE wallets SET balance = balance + ?, updated_at=CURRENT_TIMESTAMP WHERE user_id=?', [amount, req.user.id]);
    await query('INSERT INTO transactions (wallet_id, type, amount, description) VALUES (?, ?, ?, ?)',
      [wallet.rows[0].id, 'deposit', amount, 'Wallet deposit via OTP']);
    
    const updated = await query('SELECT * FROM wallets WHERE user_id=?', [req.user.id]);
    res.json({ ok: true, balance: updated.rows[0].balance });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;