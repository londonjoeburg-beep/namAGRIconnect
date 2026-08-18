const express = require('express');
const router = express.Router();
const db = require('../middleware/database');

// GET all community posts
router.get('/community', (req, res) => {
  try {
    const posts = db.prepare(`
      SELECT * FROM community 
      ORDER BY date DESC
    `).all();

    res.json({ success: true, posts });
  } catch (err) {
    console.error('Load community error:', err);
    res.status(500).json({ success: false, message: 'Failed to load community posts' });
  }
});

// POST a community message
router.post('/community', (req, res) => {
  try {
    const { title, body, user, fullName } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    if (!body || !String(body).trim()) {
      return res.status(400).json({ success: false, message: 'Message body is required' });
    }

    const cleanTitle = String(title).trim();
    const cleanBody = String(body).trim();
    const cleanUser = user || 'Farmer';
    const cleanFullName = fullName || user || 'Farmer';

    const result = db.prepare(`
      INSERT INTO community (title, body, user, fullName)
      VALUES (?, ?, ?, ?)
    `).run(cleanTitle, cleanBody, cleanUser, cleanFullName);

    res.json({
      success: true,
      message: 'Posted to Farmers Community!',
      post: {
        id: result.lastInsertRowid,
        title: cleanTitle,
        body: cleanBody,
        user: cleanUser,
        fullName: cleanFullName,
        date: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Post community error:', err);
    res.status(500).json({ success: false, message: 'Failed to create community post: ' + err.message });
  }
});

module.exports = router;