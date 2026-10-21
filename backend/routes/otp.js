import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/otp/send
router.post('/send', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone required' });

    const code = generateOTP();
    const expires = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    await query('INSERT INTO otp_codes (phone, code, purpose, expires_at) VALUES (?, ?, ?, ?)',
      [phone, code, 'wallet_deposit', expires]);

    // In production: send via SMS. For now, log to console.
    console.log(`📱 [OTP] To ${phone}: ${code}`);
    
    // MOCK MODE: Return code in response so you can test
    res.json({ 
      ok: true, 
      message: 'OTP sent to your phone',
      debug_code: code  // Remove in production!
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/otp/verify
router.post('/verify', async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ error: 'Phone and code required' });

    const result = await query(
      `SELECT * FROM otp_codes 
       WHERE phone=? AND code=? AND used=0 AND expires_at > datetime('now')
       ORDER BY created_at DESC LIMIT 1`,
      [phone, code]
    );

    if (!result.rows[0]) return res.status(400).json({ error: 'Invalid or expired OTP' });

    await query('UPDATE otp_codes SET used=1 WHERE id=?', [result.rows[0].id]);
    res.json({ ok: true, verified: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;