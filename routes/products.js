const express = require('express');
const router = express.Router();
const db = require('../middleware/database');
const { notifyProductComment } = require('../middleware/sms');

// GET all products
router.get('/products', (req, res) => {
  try {
    const products = db.prepare(`
      SELECT p.*, 
             u.username, 
             u.fullName as full_name, 
             u.phone, 
             u.email
      FROM products p
      LEFT JOIN users u ON p.sellerId = u.id
      ORDER BY p.created_at DESC
    `).all();

    res.json({ success: true, products });
  } catch (err) {
    console.error('Load products error:', err);
    res.status(500).json({ success: false, message: 'Failed to load products' });
  }
});

// POST new product
router.post('/products', (req, res) => {
  try {
    const { title, description, price, quantity, category, location, sellerId, image } = req.body;

    if (!title || price === undefined || price === null) {
      return res.status(400).json({ success: false, message: 'Title and price are required' });
    }
    if (!sellerId) {
      return res.status(400).json({ success: false, message: 'Seller ID required – please login' });
    }

    const result = db.prepare(`
      INSERT INTO products (title, description, price, quantity, category, location, sellerId, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title.trim(),
      description || '',
      Number(price),
      quantity || '',
      category || 'Other',
      location || 'Namibia',
      Number(sellerId),
      image || null
    );

    res.json({
      success: true,
      message: 'Product posted successfully!',
      product: {
        id: result.lastInsertRowid,
        title: title.trim(),
        price: Number(price),
        category: category || 'Other',
        location: location || 'Namibia',
        sellerId: Number(sellerId)
      }
    });
  } catch (err) {
    console.error('Post product error:', err);
    res.status(500).json({ success: false, message: 'Failed to post product' });
  }
});

// GET comments for a product
router.get('/products/:id/comments', (req, res) => {
  try {
    const comments = db.prepare(`
      SELECT * FROM comments 
      WHERE productId = ? 
      ORDER BY date DESC
    `).all(req.params.id);

    res.json({ success: true, comments });
  } catch (err) {
    console.error('Load comments error:', err);
    res.status(500).json({ success: false, message: 'Failed to load comments' });
  }
});

// POST a comment
router.post('/products/:id/comments', (req, res) => {
  try {
    const { user, text } = req.body;

    if (!text || !String(text).trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const productId = req.params.id;
    const commentUser = user || 'Anonymous';
    const commentText = String(text).trim();

    const result = db.prepare(`
      INSERT INTO comments (productId, user, text)
      VALUES (?, ?, ?)
    `).run(productId, commentUser, commentText);

    // Try to notify the seller by SMS
    try {
      const product = db.prepare(`
        SELECT p.title, u.phone 
        FROM products p 
        LEFT JOIN users u ON p.sellerId = u.id 
        WHERE p.id = ?
      `).get(productId);

      if (product && product.phone) {
        notifyProductComment(product.phone, product.title, commentUser)
          .catch(err => console.error('SMS failed:', err.message));
      }
    } catch (smsErr) {
      console.error('SMS lookup failed:', smsErr.message);
    }

    res.json({
      success: true,
      message: 'Comment added',
      comment: {
        id: result.lastInsertRowid,
        productId: Number(productId),
        user: commentUser,
        text: commentText,
        date: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ success: false, message: 'Failed to add comment: ' + err.message });
  }
});

module.exports = router;