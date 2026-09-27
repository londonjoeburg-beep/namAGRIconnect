const express = require('express');
const router = express.Router();
const db = require('../middleware/database');

// ==========================================
// GET ALL MARKET PRICES (with product analytics)
// ==========================================
router.get('/', (req, res) => {
    // Get market_prices table data
    db.all('SELECT * FROM market_prices ORDER BY market, product', [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        // Get product analytics from real listings
        db.all(`
            SELECT 
                category,
                COUNT(*) as listing_count,
                AVG(price) as avg_price,
                MAX(price) as max_price,
                MIN(price) as min_price,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_listings
            FROM products
            WHERE category IS NOT NULL AND category != ''
            GROUP BY category
            ORDER BY listing_count DESC
        `, [], (err, analytics) => {
            if (err) analytics = [];

            // Most in-demand: categories with most listings
            const inDemand = analytics.slice(0, 5).map(a => ({
                category: a.category,
                listings: a.listing_count,
                demand: a.listing_count > 5 ? 'HIGH' : a.listing_count > 2 ? 'MEDIUM' : 'LOW',
                avg_price: `N$ ${Math.round(a.avg_price || 0)}`,
                price_range: `N$ ${Math.round(a.min_price || 0)} - N$ ${Math.round(a.max_price || 0)}`
            }));

            // Most valuable: categories with highest average price
            const mostValuable = [...analytics]
                .sort((a, b) => (b.avg_price || 0) - (a.avg_price || 0))
                .slice(0, 5)
                .map(a => ({
                    category: a.category,
                    avg_price: `N$ ${Math.round(a.avg_price || 0)}`,
                    listings: a.listing_count
                }));

            res.json({
                success: true,
                marketPrices: rows,
                inDemand,
                mostValuable,
                totalListings: analytics.reduce((sum, a) => sum + a.listing_count, 0),
                updated: new Date().toISOString(),
                updated_time: new Date().toLocaleString('en-GB')
            });
        });
    });
});

// ==========================================
// GET BY MARKET
// ==========================================
router.get('/market/:market', (req, res) => {
    db.all('SELECT * FROM market_prices WHERE market = ? ORDER BY product', [req.params.market], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, marketPrices: rows });
    });
});

// ==========================================
// GET LIVE PRICES FROM PRODUCT LISTINGS
// ==========================================
router.get('/live', (req, res) => {
    db.all(`
        SELECT 
            category,
            COUNT(*) as listings,
            AVG(price) as avg_price,
            MIN(price) as min_price,
            MAX(price) as max_price
        FROM products
        WHERE is_active = 1 AND category IS NOT NULL
        GROUP BY category
        ORDER BY listings DESC
    `, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({
            success: true,
            livePrices: rows.map(r => ({
                category: r.category,
                listings: r.listings,
                avg: `N$ ${Math.round(r.avg_price)}`,
                min: `N$ ${Math.round(r.min_price)}`,
                max: `N$ ${Math.round(r.max_price)}`,
                demand: r.listings > 5 ? '🔥 HIGH' : r.listings > 2 ? '📈 MEDIUM' : '📉 LOW'
            })),
            updated_time: new Date().toLocaleString('en-GB')
        });
    });
});

// ==========================================
// ADD PRICE (Admin)
// ==========================================
router.post('/', (req, res) => {
    const { product, price, unit, market } = req.body;
    if (!product || !price || !market) {
        return res.status(400).json({ success: false, message: 'Product, price, and market required' });
    }
    db.run(
        `INSERT INTO market_prices (product, price, unit, market) VALUES (?, ?, ?, ?)`,
        [product, price, unit || '', market],
        function(err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: 'Price added!', id: this.lastID });
        }
    );
});

module.exports = router;