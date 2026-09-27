const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../middleware/database');

// ==========================================
// GET ALL PRODUCTS
// ==========================================
router.get('/', (req, res) => {
    db.all(`
        SELECT products.*, users.username, users.full_name, users.phone, users.email, users.location as seller_location
        FROM products 
        JOIN users ON products.seller_id = users.id 
        WHERE products.is_active = 1
        ORDER BY products.created_at DESC
    `, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, products: rows });
    });
});

// ==========================================
// GET SINGLE PRODUCT
// ==========================================
router.get('/:id', (req, res) => {
    db.get(`
        SELECT products.*, users.username, users.full_name, users.phone, users.email, users.location as seller_location
        FROM products 
        JOIN users ON products.seller_id = users.id 
        WHERE products.id = ?
    `, [req.params.id], (err, row) => {
        if (err || !row) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, product: row });
    });
});

// ==========================================
// ADD PRODUCT
// ==========================================
router.post('/', (req, res) => {
    const { title, description, price, quantity, category, location, sellerId, image } = req.body;
    
    if (!title || !price || !sellerId) {
        return res.status(400).json({ success: false, message: 'Title, price, and seller ID required' });
    }

    let imagePath = null;
    if (image) {
        try {
            const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
            if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
            
            const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
            const imageName = `product_${Date.now()}.png`;
            fs.writeFileSync(path.join(uploadsDir, imageName), base64Data, 'base64');
            imagePath = `/uploads/${imageName}`;
        } catch (err) {
            console.error('Image save error:', err.message);
        }
    }

    db.run(
        `INSERT INTO products (title, description, price, quantity, category, location, image, seller_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description || '', price, quantity || '1 unit', category || 'Other', location || 'Namibia', imagePath, sellerId],
        function(err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: 'Product posted!', productId: this.lastID });
        }
    );
});

// ==========================================
// DELETE PRODUCT (Seller only)
// ==========================================
router.delete('/:id', (req, res) => {
    const { userId } = req.body;
    db.run(
        `UPDATE products SET is_active = 0 WHERE id = ? AND seller_id = ?`,
        [req.params.id, userId],
        function(err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: 'Product deleted' });
        }
    );
});

// ==========================================
// GET PRODUCT COMMENTS (with replies and user info)
// ==========================================
router.get('/:id/comments', (req, res) => {
    db.all(`
        SELECT 
            product_comments.*, 
            users.username, 
            users.full_name
        FROM product_comments
        JOIN users ON product_comments.user_id = users.id
        WHERE product_comments.product_id = ?
        ORDER BY product_comments.created_at ASC
    `, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, comments: rows });
    });
});

// ==========================================
// ADD PRODUCT COMMENT (or reply)
// ==========================================
router.post('/:id/comments', (req, res) => {
    const { userId, comment, parentId } = req.body;
    
    if (!comment || !userId) {
        return res.status(400).json({ success: false, message: 'Comment and userId required' });
    }

    db.run(
        `INSERT INTO product_comments (product_id, user_id, comment, parent_id) VALUES (?, ?, ?, ?)`,
        [req.params.id, userId, comment, parentId || null],
        function(err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: 'Comment posted!', commentId: this.lastID });
        }
    );
});

// ==========================================
// LIKE/TOGGLE PRODUCT COMMENT
// ==========================================
router.post('/comments/:id/like', (req, res) => {
    db.run(`UPDATE product_comments SET likes = likes + 1 WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Liked!' });
    });
});

// ==========================================
// DISLIKE/TOGGLE PRODUCT COMMENT
// ==========================================
router.post('/comments/:id/dislike', (req, res) => {
    db.run(`UPDATE product_comments SET dislikes = dislikes + 1 WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Disliked!' });
    });
});

// ==========================================
// REPLY TO PRODUCT COMMENT
// ==========================================
router.post('/comments/:id/reply', (req, res) => {
    const { userId, reply } = req.body;
    
    if (!reply || !userId) {
        return res.status(400).json({ success: false, message: 'Reply and userId required' });
    }

    // Get the parent comment to find product_id
    db.get('SELECT product_id FROM product_comments WHERE id = ?', [req.params.id], (err, parent) => {
        if (err || !parent) return res.status(404).json({ success: false, message: 'Parent comment not found' });
        
        db.run(
            `INSERT INTO product_comments (product_id, user_id, comment, parent_id) VALUES (?, ?, ?, ?)`,
            [parent.product_id, userId, reply, req.params.id],
            function(err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({ success: true, message: 'Reply posted!', replyId: this.lastID });
            }
        );
    });
});
// ==========================================
// MARK PRODUCT AS SOLD (Seller only)
// ==========================================
router.post('/:id/sold', (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID required' });
    }

    db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
        if (err || !product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        if (product.seller_id !== userId) {
            return res.status(403).json({ success: false, message: 'You can only delete your own products' });
        }

        db.run('UPDATE products SET is_active = 0 WHERE id = ?', [req.params.id], function(err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: '✅ Product marked as SOLD and removed' });
        });
    });
});

// ==========================================
// TOGGLE PRODUCT STATUS
// ==========================================
router.post('/:id/toggle', (req, res) => {
    const { userId } = req.body;
    db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
        if (err || !product) return res.status(404).json({ success: false, message: 'Not found' });
        if (product.seller_id !== userId) return res.status(403).json({ success: false, message: 'Not your product' });

        const newStatus = product.is_active ? 0 : 1;
        db.run('UPDATE products SET is_active = ? WHERE id = ?', [newStatus, req.params.id], function(err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, is_active: newStatus, message: newStatus ? 'Product re-listed' : 'Product hidden' });
        });
    });
});
module.exports = router;