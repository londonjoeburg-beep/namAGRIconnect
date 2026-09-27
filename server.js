require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

require('./middleware/database');

// ==========================================
// ROUTES
// ==========================================
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const communityRoutes = require('./routes/community');
const weatherRoutes = require('./routes/weather');
const marketRoutes = require('./routes/market');
const partnerRoutes = require('./routes/partners');
const adminRoutes = require('./routes/admin');
const smsRoutes = require('./routes/sms');        // ← ADD THIS

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sms', smsRoutes);                    // ← ADD THIS

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'AgriConnect Namibia API is running' });
});

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`
    ==========================================
    🌾 AGRICONNECT NAMIBIA
    ==========================================
    ✅ Server:  http://localhost:${PORT}
    ✅ API:     http://localhost:${PORT}/api
    ✅ SMS:     http://localhost:${PORT}/api/sms/status
    🔐 Admin:   admin / admin123
    ==========================================
    `);
});