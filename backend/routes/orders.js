import { Router } from 'express';
import { query } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

function generateTrackingCode() {
  return 'NGC-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
}

/* ══════════════════════════════════════════════════
   POST /api/orders — Place a new order
   ══════════════════════════════════════════════════ */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { listing_id, quantity, delivery_address, contact_phone } = req.body;
    if (!listing_id || !quantity || !delivery_address) {
      return res.status(400).json({ error: 'listing_id, quantity, delivery_address required' });
    }

    const listing = await query('SELECT * FROM listings WHERE id=?', [listing_id]);
    if (!listing.rows[0]) return res.status(404).json({ error: 'Listing not found' });
    
    const l = listing.rows[0];
    if (l.owner_id === req.user.id) return res.status(400).json({ error: 'Cannot order your own listing' });
    if (l.sold) return res.status(400).json({ error: 'Listing already sold' });

    const total = l.price * parseFloat(quantity);
    const tracking = generateTrackingCode();

    let wallet = await query('SELECT * FROM wallets WHERE user_id=?', [req.user.id]);
    if (!wallet.rows[0]) {
      await query('INSERT INTO wallets (user_id, balance) VALUES (?, 0)', [req.user.id]);
      wallet = await query('SELECT * FROM wallets WHERE user_id=?', [req.user.id]);
    }

    if (wallet.rows[0].balance < total) {
      return res.status(400).json({ error: `Insufficient balance. Need N$ ${total.toFixed(2)}, have N$ ${wallet.rows[0].balance.toFixed(2)}` });
    }

    await query('UPDATE wallets SET balance = balance - ? WHERE user_id=?', [total, req.user.id]);
    await query('INSERT INTO transactions (wallet_id, type, amount, description) VALUES (?, ?, ?, ?)',
      [wallet.rows[0].id, 'purchase', total, `Order #${tracking}`]);

    const order = await query(
      `INSERT INTO orders (buyer_id, listing_id, seller_id, quantity, total_price, delivery_address, contact_phone, tracking_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, listing_id, l.owner_id, quantity, total, delivery_address, contact_phone || null, tracking]
    );

    const sellerAmount = total * 0.9;
    let sellerWallet = await query('SELECT * FROM wallets WHERE user_id=?', [l.owner_id]);
    if (!sellerWallet.rows[0]) {
      await query('INSERT INTO wallets (user_id, balance) VALUES (?, 0)', [l.owner_id]);
      sellerWallet = await query('SELECT * FROM wallets WHERE user_id=?', [l.owner_id]);
    }
    await query('UPDATE wallets SET balance = balance + ? WHERE user_id=?', [sellerAmount, l.owner_id]);
    await query('INSERT INTO transactions (wallet_id, type, amount, description) VALUES (?, ?, ?, ?)',
      [sellerWallet.rows[0].id, 'sale', sellerAmount, `Sale - Order ${tracking} (after 10% fee)`]);

    await query('UPDATE listings SET sold=1, sold_at=CURRENT_TIMESTAMP WHERE id=?', [listing_id]);

    res.status(201).json({
      ok: true,
      order_id: order.rows[0].id,
      tracking_code: tracking,
      total: total,
      new_balance: wallet.rows[0].balance - total
    });
  } catch (e) { 
    console.error('Order error:', e);
    res.status(500).json({ error: e.message }); 
  }
});

/* ══════════════════════════════════════════════════
   GET /api/orders/my — Buyer's orders
   ══════════════════════════════════════════════════ */
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const result = await query(
      `SELECT o.*, l.title, l.unit, l.photos, u.name AS seller_name
       FROM orders o
       LEFT JOIN listings l ON l.id = o.listing_id
       LEFT JOIN users u ON u.id = o.seller_id
       WHERE o.buyer_id=?
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ══════════════════════════════════════════════════
   GET /api/orders/sales — Seller's sales
   ══════════════════════════════════════════════════ */
router.get('/sales', authMiddleware, async (req, res) => {
  try {
    const result = await query(
      `SELECT o.*, l.title, u.name AS buyer_name, u.phone AS buyer_phone
       FROM orders o
       LEFT JOIN listings l ON l.id = o.listing_id
       LEFT JOIN users u ON u.id = o.buyer_id
       WHERE o.seller_id=?
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ══════════════════════════════════════════════════
   GET /api/orders/track/:code — Public tracking
   ══════════════════════════════════════════════════ */
router.get('/track/:code', async (req, res) => {
  try {
    const result = await query(
      `SELECT o.*, l.title, u1.name AS buyer_name, u2.name AS seller_name
       FROM orders o
       LEFT JOIN listings l ON l.id = o.listing_id
       LEFT JOIN users u1 ON u1.id = o.buyer_id
       LEFT JOIN users u2 ON u2.id = o.seller_id
       WHERE o.tracking_code=?`,
      [req.params.code.toUpperCase()]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ══════════════════════════════════════════════════
   POST /api/orders/:id/status — Update status (seller)
   ══════════════════════════════════════════════════ */
router.post('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const order = await query('SELECT * FROM orders WHERE id=?', [req.params.id]);
    if (!order.rows[0]) return res.status(404).json({ error: 'Not found' });
    if (order.rows[0].seller_id !== req.user.id) return res.status(403).json({ error: 'Not your order' });

    await query('UPDATE orders SET status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?', [status, req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ══════════════════════════════════════════════════
   POST /api/orders/:id/confirm-received — Buyer confirms + rates
   ══════════════════════════════════════════════════ */
router.post('/:id/confirm-received', authMiddleware, async (req, res) => {
  try {
    const { condition, notes } = req.body;
    const orderId = req.params.id;

    const validConditions = ['excellent', 'good', 'acceptable', 'damaged', 'wrong_item'];
    if (!validConditions.includes(condition)) {
      return res.status(400).json({ error: 'Invalid condition' });
    }

    const order = await query('SELECT * FROM orders WHERE id=?', [orderId]);
    if (!order.rows[0]) return res.status(404).json({ error: 'Order not found' });
    if (order.rows[0].buyer_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the buyer can confirm receipt' });
    }
    if (order.rows[0].buyer_reviewed) {
      return res.status(400).json({ error: 'Already confirmed' });
    }

    // Update order with condition + archive
    await query(
      `UPDATE orders 
       SET status='delivered', 
           received_at=CURRENT_TIMESTAMP,
           condition_rating=?,
           condition_notes=?,
           buyer_reviewed=1,
           archived=1,
           updated_at=CURRENT_TIMESTAMP
       WHERE id=?`,
      [condition, notes || null, orderId]
    );

    // Mark listing as sold (final)
    await query(
      `UPDATE listings SET sold=1, sold_at=CURRENT_TIMESTAMP WHERE id=?`,
      [order.rows[0].listing_id]
    );

    res.json({ 
      ok: true, 
      message: 'Order confirmed and archived',
      condition 
    });
  } catch (e) {
    console.error('❌ Confirm received error:', e);
    res.status(500).json({ error: e.message });
  }
});

export default router;