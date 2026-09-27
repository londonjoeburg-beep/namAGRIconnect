const express = require('express');
const router = express.Router();
const db = require('../middleware/database');

const ADMIN_KEY = 'admin123';

function requireAdmin(req, res, next) {
    const key = req.headers['x-admin-key'] || req.query.key;
    if (key !== ADMIN_KEY) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
}

// ==========================================
// DASHBOARD STATS
// ==========================================
router.get('/stats', requireAdmin, (req, res) => {
    db.get('SELECT COUNT(*) as total FROM users', [], (err, users) => {
        db.get('SELECT COUNT(*) as total FROM products WHERE is_active = 1', [], (err, products) => {
            db.get('SELECT COUNT(*) as total FROM community_posts WHERE is_active = 1', [], (err, posts) => {
                db.get('SELECT COUNT(*) as total FROM product_comments', [], (err, comments) => {
                    db.get('SELECT COUNT(*) as total FROM community_comments', [], (err, communityComments) => {
                        res.json({
                            success: true,
                            stats: {
                                users: users?.total || 0,
                                products: products?.total || 0,
                                posts: posts?.total || 0,
                                productComments: comments?.total || 0,
                                communityComments: communityComments?.total || 0
                            }
                        });
                    });
                });
            });
        });
    });
});

// ==========================================
// ALL USERS
// ==========================================
router.get('/users', requireAdmin, (req, res) => {
    db.all(
        'SELECT id, username, full_name, location, phone, email, role, created_at FROM users ORDER BY created_at DESC',
        [],
        (err, rows) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, users: rows });
        }
    );
});

// ==========================================
// DELETE USER
// ==========================================
router.delete('/users/:id', requireAdmin, (req, res) => {
    db.run('UPDATE users SET is_active = 0 WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'User deactivated' });
    });
});

// ==========================================
// ALL PRODUCTS
// ==========================================
router.get('/products', requireAdmin, (req, res) => {
    db.all(`
        SELECT products.*, users.username as seller_name
        FROM products 
        LEFT JOIN users ON products.seller_id = users.id 
        ORDER BY products.created_at DESC
    `, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, products: rows });
    });
});

// ==========================================
// DELETE PRODUCT
// ==========================================
router.delete('/products/:id', requireAdmin, (req, res) => {
    db.run('UPDATE products SET is_active = 0 WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Product deleted' });
    });
});

// ==========================================
// ALL COMMUNITY POSTS
// ==========================================
router.get('/community', requireAdmin, (req, res) => {
    db.all('SELECT * FROM community_posts ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, posts: rows });
    });
});

// ==========================================
// DELETE COMMUNITY POST
// ==========================================
router.delete('/community/:id', requireAdmin, (req, res) => {
    db.run('UPDATE community_posts SET is_active = 0 WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Post deleted' });
    });
});

// ==========================================
// ALL COMMENTS
// ==========================================
router.get('/comments', requireAdmin, (req, res) => {
    db.all(`
        SELECT product_comments.*, users.username
        FROM product_comments 
        LEFT JOIN users ON product_comments.user_id = users.id
        ORDER BY product_comments.created_at DESC
        LIMIT 100
    `, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, comments: rows });
    });
});

// ==========================================
// DELETE COMMENT
// ==========================================
router.delete('/comments/:id', requireAdmin, (req, res) => {
    db.run('DELETE FROM product_comments WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Comment deleted' });
    });
});

// ==========================================
// ALL MARKET PRICES (with edit capability)
// ==========================================
router.get('/market', requireAdmin, (req, res) => {
    db.all('SELECT * FROM market_prices ORDER BY market, product', [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, marketPrices: rows });
    });
});

// ==========================================
// UPDATE MARKET PRICE
// ==========================================
router.put('/market/:id', requireAdmin, (req, res) => {
    const { product, price, unit, market } = req.body;
    db.run(
        `UPDATE market_prices SET product = ?, price = ?, unit = ?, market = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [product, price, unit || '', market, req.params.id],
        function(err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: 'Price updated' });
        }
    );
});

// ==========================================
// DELETE MARKET PRICE
// ==========================================
router.delete('/market/:id', requireAdmin, (req, res) => {
    db.run('DELETE FROM market_prices WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Price deleted' });
    });
});

module.exports = router;