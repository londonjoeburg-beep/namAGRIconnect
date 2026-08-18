const express = require('express');
const router = express.Router();

// Admin stats - NO middleware!
router.get('/admin/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      users: 150,
      products: 45,
      messages: 230,
      totalRevenue: 45000
    }
  });
});

// Admin dashboard
router.get('/admin/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      recentUsers: [
        { id: 1, name: 'John Farmer', date: '2026-08-15' },
        { id: 2, name: 'Maria Smith', date: '2026-08-14' }
      ],
      recentProducts: [
        { id: 1, title: 'Fresh Maize', price: 500 },
        { id: 2, title: 'Tomatoes', price: 30 }
      ]
    }
  });
});

module.exports = router;  // ← IMPORTANT: router, NOT an object!