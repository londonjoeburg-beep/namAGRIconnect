const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../middleware/database');
const { sendSMS, templates } = require('../middleware/sms');

// ==========================================
// REGISTER
// ==========================================
router.post('/register', (req, res) => {
    const { username, password, fullName, location, phone, email } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(
        `INSERT INTO users (username, password, full_name, location, phone, email) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [username, hashedPassword, fullName || '', location || '', phone || '', email || ''],
        async function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ success: false, message: 'Username already exists' });
                }
                return res.status(500).json({ success: false, message: err.message });
            }
            
            // Send welcome SMS
            if (phone) {
                try {
                    await sendSMS(phone, templates.welcome(fullName || username));
                } catch (smsErr) {
                    console.error('SMS failed:', smsErr.message);
                }
            }

            res.json({ 
                success: true, 
                message: 'Registration successful!', 
                userId: this.lastID 
            });
        }
    );
});

// ==========================================
// LOGIN
// ==========================================
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    db.get('SELECT * FROM users WHERE username = ? AND is_active = 1', [username], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        res.json({
            success: true,
            message: 'Login successful!',
            user: {
                id: user.id,
                username: user.username,
                fullName: user.full_name,
                location: user.location,
                phone: user.phone,
                email: user.email,
                role: user.role
            }
        });
    });
});

module.exports = router;