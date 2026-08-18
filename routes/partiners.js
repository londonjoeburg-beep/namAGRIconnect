const express = require('express');
const router = express.Router();

// Get partner organizations
router.get('/partners', (req, res) => {
  const partners = [
    { name: 'Ministry of Agriculture', type: 'Government', location: 'Windhoek' },
    { name: 'Namibia Agronomic Board', type: 'Government', location: 'Windhoek' },
    { name: 'Namibian Farmers Association', type: 'NGO', location: 'Windhoek' },
    { name: 'MTC Namibia', type: 'Corporate', location: 'Windhoek' },
    { name: 'AgriBank Namibia', type: 'Financial', location: 'Windhoek' }
  ];
  
  res.json({ success: true, partners });
});



router.post('/partners/sync', (req, res) => {
  const { source, data, type } = req.body;
  console.log(`[Partner Sync] from ${source || 'unknown'} | type: ${type}`);
  res.json({ success: true, message: `Received data from partner: ${source || 'unknown'}`, receivedAt: new Date().toISOString() });
});

router.get('/partners/internal/stats', (req, res) => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    const communityPosts = db.prepare('SELECT COUNT(*) as count FROM community').get().count;
    const totalComments = db.prepare('SELECT COUNT(*) as count FROM comments').get().count;
    res.json({ success: true, stats: { totalUsers, totalProducts, communityPosts, totalComments, generatedAt: new Date().toISOString() } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load stats' });
  }
});

router.get('/partners/export/products', (req, res) => {
  const products = db.prepare('SELECT id, title, price, category, location, created_at FROM products').all();
  res.json({ success: true, count: products.length, products });
});

router.post('/partners/community-announce', (req, res) => {
  try {
    const { title, body, partnerName } = req.body;
    if (!title || !body) return res.status(400).json({ success: false, message: 'Title and body required' });

    const result = db.prepare('INSERT INTO community (title, body, user, fullName) VALUES (?, ?, ?, ?)').run(
      `[Partner] ${title.trim()}`, body.trim(), partnerName || 'Partner', partnerName || 'Official Partner'
    );

    res.json({ success: true, message: 'Announcement posted', post: { id: result.lastInsertRowid, title, body } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to post announcement' });
  }
});

function verifyWebhook(req, res, next) {
  const signature = req.headers['x-webhook-signature'] || req.headers['x-partner-secret'];
  if (signature !== WEBHOOK_SECRET) {
    return res.status(401).json({ success: false, message: 'Invalid webhook signature' });
  }
  next();
}

router.post('/partners/webhook', verifyWebhook, (req, res) => {
  const { event, source, data } = req.body;
  console.log(`🔔 Webhook: ${event} from ${source}`);

  try {
    if (event === 'weather.alert') {
      db.prepare('INSERT INTO community (title, body, user, fullName) VALUES (?, ?, ?, ?)').run(
        `⚠️ Weather Alert: ${data.region || 'Namibia'}`,
        data.message || data.body || 'Weather warning issued.',
        source || 'Weather Service',
        'Official Weather Partner'
      );
    }
    if (event === 'community.announcement') {
      db.prepare('INSERT INTO community (title, body, user, fullName) VALUES (?, ?, ?, ?)').run(
        `[Partner] ${data.title || 'Announcement'}`,
        data.body || data.message || '',
        source || 'Partner',
        data.partnerName || source || 'Official Partner'
      );
    }
    res.json({ success: true, message: `Webhook processed: ${event}`, receivedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error processing webhook' });
  }
});

module.exports = router;