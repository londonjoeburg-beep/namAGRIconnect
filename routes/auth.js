const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../middleware/database');
const { sendWelcomeSMS } = require('../middleware/sms');

router.post('/register', async (req, res) => {
  try {
    const { username, password, fullName, location, phone, email } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?)').get(username);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = db.prepare(`
      INSERT INTO users (username, password, fullName, location, phone, email)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(username.trim(), hashedPassword, fullName || '', location || '', phone || '', email || '');

    const newUser = {
      id: result.lastInsertRowid,
      username: username.trim(),
      fullName: fullName || '',
      location: location || '',
      phone: phone || '',
      email: email || ''
    };

    if (phone) {
      sendWelcomeSMS(phone, username).catch(err => console.error('Welcome SMS failed:', err.message));
    }

    res.json({ success: true, message: 'Registration successful! Please login.', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE LOWER(username) = LOWER(?)').get(username);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    let isMatch = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = user.password === password;
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const { password: _, ...safeUser } = user;
    res.json({ success: true, message: `Welcome back, ${safeUser.fullName || safeUser.username}!`, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

module.exports = router;