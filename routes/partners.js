const express = require('express');
const router = express.Router();
const db = require('../middleware/database');

// ==========================================
// GET ALL PARTNERS
// ==========================================
router.get('/', (req, res) => {
    db.all(
        'SELECT * FROM partners ORDER BY name',
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: err.message 
                });
            }
            res.json({ success: true, partners: rows });
        }
    );
});

// ==========================================
// ADD PARTNER (Admin)
// ==========================================
router.post('/', (req, res) => {
    const { name, type, contact, website, description } = req.body;
    
    if (!name) {
        return res.status(400).json({ 
            success: false, 
            message: 'Partner name required' 
        });
    }

    db.run(
        `INSERT INTO partners (name, type, contact, website, description) 
         VALUES (?, ?, ?, ?, ?)`,
        [name, type || 'NGO', contact || '', website || '', description || ''],
        function(err) {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: err.message 
                });
            }
            res.json({ 
                success: true, 
                message: 'Partner added!', 
                id: this.lastID 
            });
        }
    );
});

// ==========================================
// WEBHOOK — Receive external notifications
// ==========================================
router.post('/webhook', (req, res) => {
    const { type, message, source } = req.body;
    console.log(`📨 Webhook received from ${source}: [${type}] ${message}`);
    
    // Log to database or trigger alert
    res.json({ 
        success: true, 
        message: 'Webhook received' 
    });
});

module.exports = router;