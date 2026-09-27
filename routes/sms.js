const express = require('express');
const router = express.Router();
const { sendSMS, sendBulkSMS, templates } = require('../middleware/sms');
const db = require('../middleware/database');

// ==========================================
// TEST SMS — Send to one number
// ==========================================
router.post('/test', async (req, res) => {
    const { phone, message } = req.body;
    
    if (!phone) {
        return res.status(400).json({ 
            success: false, 
            message: 'Phone number required' 
        });
    }

    const result = await sendSMS(phone, message || 'Test from AgriConnect Namibia! 🌾');
    res.json(result);
});

// ==========================================
// SEND PRODUCT ALERT — Notify buyers
// ==========================================
router.post('/product-alert', async (req, res) => {
    const { productTitle, price, category } = req.body;
    
    if (!productTitle || !price) {
        return res.status(400).json({ 
            success: false, 
            message: 'Product title and price required' 
        });
    }

    db.all(
        `SELECT phone FROM users WHERE phone IS NOT NULL AND phone != ''`,
        [],
        async (err, users) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }

            const phones = users.map(u => u.phone);
            const message = templates.newProduct(productTitle, price);
            const result = await sendBulkSMS(phones, message);
            
            res.json({
                success: true,
                sent: result.count || 0,
                message: 'Alerts sent to interested farmers'
            });
        }
    );
});

// ==========================================
// SEND WEATHER ALERT
// ==========================================
router.post('/weather-alert', async (req, res) => {
    const { region, forecast } = req.body;
    
    if (!region || !forecast) {
        return res.status(400).json({ 
            success: false, 
            message: 'Region and forecast required' 
        });
    }

    db.all(
        `SELECT phone FROM users WHERE location LIKE ? AND phone IS NOT NULL`,
        [`%${region}%`],
        async (err, users) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }

            const phones = users.map(u => u.phone);
            const message = templates.weatherAlert(region, forecast);
            const result = await sendBulkSMS(phones, message);
            
            res.json({
                success: true,
                sent: result.count || 0,
                region
            });
        }
    );
});

// ==========================================
// SMS STATUS CHECK
// ==========================================
router.get('/status', (req, res) => {
    const configured = process.env.INFOBIP_API_KEY && 
                       process.env.INFOBIP_API_KEY !== 'your_infobip_api_key_here';
    
    res.json({
        success: true,
        smsService: 'Infobip',
        configured: configured,
        baseUrl: process.env.INFOBIP_BASE_URL || 'Not set',
        sender: process.env.INFOBIP_SENDER || 'Not set',
        mode: configured ? 'LIVE' : 'DEMO'
    });
});

module.exports = router;