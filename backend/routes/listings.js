import { Router } from 'express';
import { query } from '../db.js';
import { upload } from '../middleware/upload.js';
import { authMiddleware } from '../middleware/auth.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

// GET /api/listings
router.get('/', async (req, res) => {
  try {
    const { q = '', category = '', region = '', sold = 'false' } = req.query;
    let sql = `SELECT l.*, u.name AS owner_name, u.phone AS owner_phone 
               FROM listings l LEFT JOIN users u ON u.id = l.owner_id 
               WHERE l.sold = ?`;
    const params = [sold === 'true' ? 1 : 0];
    if (q) {
      sql += ' AND (LOWER(l.title) LIKE ? OR LOWER(l.town) LIKE ?)';
      params.push(`%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`);
    }
    if (category) { sql += ' AND l.category = ?'; params.push(category); }
    if (region)   { sql += ' AND l.region = ?';   params.push(region); }
    sql += ' ORDER BY l.created_at DESC LIMIT 100';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (e) {
    console.error('GET /listings:', e);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/listings/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await query(
      `SELECT l.*, u.name AS owner_name, u.phone AS owner_phone 
       FROM listings l LEFT JOIN users u ON u.id = l.owner_id WHERE l.id=?`,
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    const c = await query('SELECT * FROM comments WHERE listing_id=? ORDER BY created_at ASC', [req.params.id]);
    res.json({ ...result.rows[0], comments: c.rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/listings — convert photos to base64
router.post('/', authMiddleware, upload.array('photos', 10), async (req, res) => {
  try {
    const photos = [];
    
    // Convert each uploaded photo to base64 data URL (stored in DB, no file system dependency)
    for (const file of req.files || []) {
      try {
        // Compress with sharp and convert to base64
        const buffer = await sharp(file.path)
          .resize(800, 800, { fit: 'inside' })
          .webp({ quality: 70 })
          .toBuffer();
        
        const base64 = `data:image/webp;base64,${buffer.toString('base64')}`;
        photos.push(base64);
        
        // Delete the temp file
        await fs.unlink(file.path).catch(() => {});
      } catch (sharpErr) {
        console.error('⚠️ Sharp failed for', file.filename, sharpErr.message);
        // Fallback: convert original file to base64
        try {
          const buffer = await fs.readFile(file.path);
          const base64 = `data:${file.mimetype};base64,${buffer.toString('base64')}`;
          photos.push(base64);
          await fs.unlink(file.path).catch(() => {});
        } catch (readErr) {
          console.error('❌ Cannot read file:', readErr.message);
        }
      }
    }

    console.log(`📸 ${photos.length} photos processed`);

    const { title, category, description, quantity, unit, price, region, town, badge, delivery } = req.body;
    if (!title || !category || !quantity || !unit || !price || !region || !town) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

 const me = await query('SELECT name, phone FROM users WHERE id=?', [req.user.id]);
if (!me.rows[0]) {
  return res.status(401).json({ error: 'User not found. Please log in again.' });
}
const owner = me.rows[0];
    const result = await query(
      `INSERT INTO listings 
        (title, category, description, quantity, unit, price, region, town, 
         phone, badge, delivery, photos, owner_id, contact_phone, contact_name) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, category, description || '', parseFloat(quantity), unit, parseFloat(price),
        region, town, owner.phone || '', badge || null, delivery || null,
        JSON.stringify(photos), req.user.id, owner.phone, owner.name
      ]
    );

    const created = await query('SELECT * FROM listings WHERE id=?', [result.rows[0].id]);
    console.log('✅ Listing created with', photos.length, 'base64 photos');
    res.status(201).json(created.rows[0]);
  } catch (e) {
    console.error('POST /listings:', e);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/listings/:id/sold
router.post('/:id/sold', authMiddleware, async (req, res) => {
  try {
    const check = await query('SELECT owner_id FROM listings WHERE id=?', [req.params.id]);
    if (!check.rows[0]) return res.status(404).json({ error: 'Listing not found' });
    if (check.rows[0].owner_id !== req.user.id) return res.status(403).json({ error: 'Not your listing' });
    await query('UPDATE listings SET sold=1, sold_at=CURRENT_TIMESTAMP WHERE id=?', [req.params.id]);
    const result = await query('SELECT * FROM listings WHERE id=?', [req.params.id]);
    res.json(result.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/listings/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const check = await query('SELECT owner_id FROM listings WHERE id=?', [req.params.id]);
    if (!check.rows[0]) return res.status(404).json({ error: 'Not found' });
    if (check.rows[0].owner_id !== req.user.id) return res.status(403).json({ error: 'Not yours' });
    await query('DELETE FROM listings WHERE id=?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;