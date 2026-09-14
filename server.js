require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const cron = require('node-cron');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

// ==========================================
// DATABASE
// ==========================================
const db = new sqlite3.Database(path.join(dbDir, 'media.db'), (err) => {
    if (err) console.error('DB error:', err);
    else console.log('✅ Database connected');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT,
        role TEXT DEFAULT 'user',
        badge_number TEXT,
        station TEXT,
        phone TEXT,
        email TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        source TEXT,
        url TEXT,
        category TEXT,
        sentiment TEXT,
        sentiment_score REAL,
        scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        message TEXT,
        severity TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS urgent_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        priority TEXT DEFAULT 'normal',
        category TEXT DEFAULT 'urgent',
        posted_by TEXT,
        posted_by_id INTEGER,
        badge_number TEXT,
        location TEXT,
        image TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS police_notices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        notice_type TEXT DEFAULT 'general',
        case_number TEXT,
        location TEXT,
        contact TEXT,
        image TEXT,
        posted_by TEXT,
        badge_number TEXT,
        posted_by_id INTEGER,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Auto-migrate image columns
    db.run(`ALTER TABLE police_notices ADD COLUMN image TEXT`, () => {});
    db.run(`ALTER TABLE urgent_posts ADD COLUMN image TEXT`, () => {});

    db.run(`CREATE TABLE IF NOT EXISTS radio_stations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        website_url TEXT,
        description TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS media_sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT,
        url TEXT,
        description TEXT
    )`);

    // Default users
    const adminPass = bcrypt.hashSync('admin123', 10);
    db.run(`INSERT OR IGNORE INTO users (id, username, password, full_name, role) 
        VALUES (1, 'admin', '${adminPass}', 'System Administrator', 'admin')`);

    const policePass = bcrypt.hashSync('police123', 10);
    db.run(`INSERT OR IGNORE INTO users (id, username, password, full_name, role, badge_number, station) 
        VALUES (2, 'officer', '${policePass}', 'Officer John Doe', 'police', 'NPF-001', 'Windhoek Central')`);

    // Radio stations
    db.run(`INSERT OR IGNORE INTO radio_stations (id, name, website_url, description) VALUES 
        (1, 'NBC National', 'https://www.nbc.na', 'NBC National Radio - English'),
        (2, 'NBC African', 'https://www.nbc.na', 'NBC African Language Service'),
        (3, 'NBC Radio Wave', 'https://www.nbc.na', 'NBC Youth Music Station'),
        (4, 'NBC Otjiherero', 'https://www.nbc.na', 'NBC Otjiherero Service'),
        (5, 'Fresh FM', 'https://www.freshfm.com.na', 'Fresh FM 102.9'),
        (6, 'Radiowave', 'https://www.radiowave.com.na', 'Radiowave 96.7 FM'),
        (7, 'Kosmos 94.1', 'https://www.kosmos.com.na', 'Kosmos 94.1 FM'),
        (8, 'Omulunga Radio', 'https://www.omulunga.com.na', 'Omulunga Radio - Oshiwambo'),
        (9, 'Shipi FM', 'https://www.shipifm.com.na', 'Shipi FM Community Radio'),
        (10, 'Kati FM', 'https://www.katifm.com.na', 'Kati FM Community Radio'),
        (11, '7 FM', 'https://www.7fm.com.na', '7 FM Namibia'),
        (12, 'Eagle FM', 'https://www.eaglefm.com.na', 'Eagle FM 88.6'),
        (13, '1 FM', 'https://www.1fm.com.na', '1 FM Namibia'),
        (14, 'Kudu FM', 'https://www.kudufm.com.na', 'Kudu FM'),
        (15, 'Desert Radio', 'https://www.desertradio.com.na', 'Desert Radio Namibia'),
        (16, 'UNAM Radio', 'https://www.unam.edu.na', 'UNAM Radio'),
        (17, 'Radio 99', 'https://www.radio99.com.na', 'Radio 99 FM'),
        (18, 'Wato FM', 'https://www.watofm.com.na', 'Wato FM'),
        (19, 'Base FM', 'https://www.basefm.com.na', 'Base FM'),
        (20, 'Hitradio', 'https://www.hitradio.com.na', 'Hitradio Namibia')
    `);

    // Media sources
    db.run(`INSERT OR IGNORE INTO media_sources (id, name, type, url, description) VALUES 
        (1, 'The Namibian', 'newspaper', 'https://www.namibian.com.na', 'Leading independent newspaper'),
        (2, 'Namibian Sun', 'newspaper', 'https://www.namibiansun.com', 'Daily newspaper'),
        (3, 'New Era', 'newspaper', 'https://neweralive.na', 'Government-owned newspaper'),
        (4, 'Future Media News', 'newspaper', 'https://futuremedianews.com.na', 'Online news portal'),
        (5, 'The Brief', 'newspaper', 'https://thebrief.com.na', 'Business news'),
        (6, 'Informanté', 'newspaper', 'https://informante.web.na', 'Weekly newspaper'),
        (7, 'NBC TV', 'tv', 'https://www.nbc.na', 'National TV broadcaster'),
        (8, 'One Africa TV', 'tv', 'https://www.oneafrica.tv', 'Private TV station')
    `);

    console.log('✅ All tables and default data ready');
});

// ==========================================
// AUTO-SCRAPE
// ==========================================
cron.schedule('*/10 * * * *', async () => {
    console.log('🔄 Auto-scraping...');
    try {
        const { scrapeAll } = require('./scrapers');
        await scrapeAll(db);
    } catch (err) {
        console.error('Scrape error:', err.message);
    }
});

// ==========================================
// AUTH MIDDLEWARE
// ==========================================
function requireAuth(req, res, next) {
    const token = req.headers['x-auth-token'];
    if (!token) return res.status(401).json({ success: false, message: 'Login required' });
    
    db.get('SELECT * FROM users WHERE id = ? AND is_active = 1', [token], (err, user) => {
        if (err || !user) return res.status(401).json({ success: false, message: 'Invalid session' });
        req.user = user;
        next();
    });
}

function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ success: false, message: 'Login required' });
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Insufficient permissions' });
        }
        next();
    };
}

// ==========================================
// AUTH ROUTES
// ==========================================
app.post('/api/auth/register', async (req, res) => {
    const { username, password, fullName, role, badgeNumber, station, phone, email } = req.body;
    
    if (!username || !password || !fullName) {
        return res.status(400).json({ success: false, message: 'All fields required' });
    }
    
    if (role === 'police' && !badgeNumber) {
        return res.status(400).json({ success: false, message: 'Badge number required for police' });
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    db.run(
        `INSERT INTO users (username, password, full_name, role, badge_number, station, phone, email) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [username, hashedPassword, fullName, role || 'user', badgeNumber || '', station || '', phone || '', email || ''],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ success: false, message: 'Username already exists' });
                }
                return res.status(500).json({ success: false, message: err.message });
            }
            res.json({ success: true, message: 'Account created!', userId: this.lastID });
        }
    );
});

// ==========================================
// LOGIN ROUTE - THE MISSING PIECE!
// ==========================================
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required' });
    }
    
    db.get('SELECT * FROM users WHERE username = ? AND is_active = 1', [username], (err, user) => {
        if (err) {
            console.error('Login error:', err.message);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        
        if (!user) {
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
                role: user.role,
                badgeNumber: user.badge_number,
                station: user.station
            }
        });
    });
});

// ==========================================
// ARTICLES
// ==========================================
app.get('/api/articles', (req, res) => {
    db.all('SELECT * FROM articles ORDER BY scraped_at DESC LIMIT 100', [], (err, articles) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        
        db.all('SELECT * FROM police_notices WHERE is_active = 1 ORDER BY created_at DESC LIMIT 20', [], (err, police) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            
            db.all('SELECT * FROM urgent_posts WHERE is_active = 1 ORDER BY created_at DESC LIMIT 10', [], (err, urgent) => {
                if (err) return res.status(500).json({ success: false, message: err.message });
                
                const policeAsArticles = police.map(p => ({
                    id: 'police_' + p.id,
                    title: '🚔 ' + p.title,
                    content: p.content,
                    source: 'Namibian Police - ' + (p.badge_number || 'NPF'),
                    category: 'Police',
                    sentiment: 'urgent',
                    sentiment_score: 0,
                    image: p.image,
                    scraped_at: p.created_at,
                    is_police: true,
                    notice_type: p.notice_type,
                    case_number: p.case_number,
                    location: p.location,
                    contact: p.contact,
                    badge_number: p.badge_number,
                    posted_by: p.posted_by
                }));
                
                const urgentAsArticles = urgent.map(u => ({
                    id: 'urgent_' + u.id,
                    title: '🚨 ' + u.title,
                    content: u.content,
                    source: u.posted_by || 'System',
                    category: 'Urgent',
                    sentiment: 'urgent',
                    sentiment_score: 0,
                    image: u.image,
                    scraped_at: u.created_at,
                    is_urgent: true,
                    priority: u.priority,
                    badge_number: u.badge_number,
                    location: u.location
                }));
                
                const combined = [...policeAsArticles, ...urgentAsArticles, ...articles];
                combined.sort((a, b) => new Date(b.scraped_at) - new Date(a.scraped_at));
                
                res.json({ success: true, articles: combined });
            });
        });
    });
});

app.get('/api/articles/top', (req, res) => {
    db.all(`SELECT * FROM articles ORDER BY scraped_at DESC LIMIT 6`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, articles: rows });
    });
});

app.get('/api/articles/:id', (req, res) => {
    db.get('SELECT * FROM articles WHERE id = ?', [req.params.id], (err, row) => {
        if (err || !row) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, article: row });
    });
});

app.get('/api/stats', (req, res) => {
    db.all('SELECT sentiment, COUNT(*) as count FROM articles GROUP BY sentiment', [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, stats: rows });
    });
});

app.get('/api/sources', (req, res) => {
    db.all('SELECT source, COUNT(*) as count FROM articles GROUP BY source ORDER BY count DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, sources: rows });
    });
});

app.post('/api/scrape', async (req, res) => {
    try {
        const { scrapeAll } = require('./scrapers');
        const result = await scrapeAll(db);
        res.json({ success: true, message: 'Scraped!', result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ==========================================
// RADIO & MEDIA
// ==========================================
app.get('/api/radio', (req, res) => {
    db.all('SELECT * FROM radio_stations ORDER BY name', [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, stations: rows });
    });
});

app.get('/api/media', (req, res) => {
    db.all('SELECT * FROM media_sources ORDER BY type, name', [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, sources: rows });
    });
});

// ==========================================
// URGENT POSTS
// ==========================================
app.get('/api/urgent', (req, res) => {
    db.all('SELECT * FROM urgent_posts WHERE is_active = 1 ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, posts: rows });
    });
});

app.post('/api/urgent', requireAuth, requireRole('admin', 'police'), (req, res) => {
    const { title, content, priority, category, location, image } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title required' });
    
    let imagePath = null;
    if (image) {
        try {
            const uploadsDir = path.join(__dirname, 'public', 'uploads');
            if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
            const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
            const imageName = `urgent_${Date.now()}.png`;
            fs.writeFileSync(path.join(uploadsDir, imageName), base64Data, 'base64');
            imagePath = `/uploads/${imageName}`;
        } catch (err) { console.error('Image error:', err.message); }
    }
    
    db.run(
        `INSERT INTO urgent_posts (title, content, priority, category, posted_by, posted_by_id, badge_number, location, image) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, content || '', priority || 'normal', category || 'urgent', 
         req.user.full_name, req.user.id, req.user.badge_number || '', location || '', imagePath],
        function(err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: 'Posted!', id: this.lastID });
        }
    );
});

app.delete('/api/urgent/:id', requireAuth, requireRole('admin', 'police'), (req, res) => {
    db.get('SELECT * FROM urgent_posts WHERE id = ?', [req.params.id], (err, post) => {
        if (err || !post) return res.status(404).json({ success: false, message: 'Not found' });
        if (req.user.role === 'police' && post.posted_by_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Can only delete your own posts' });
        }
        db.run('DELETE FROM urgent_posts WHERE id = ?', [req.params.id], function(err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: 'Deleted!' });
        });
    });
});

// ==========================================
// POLICE NOTICES
// ==========================================
app.get('/api/police', (req, res) => {
    db.all('SELECT * FROM police_notices WHERE is_active = 1 ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, notices: rows });
    });
});

app.post('/api/police', requireAuth, requireRole('police', 'admin'), (req, res) => {
    const { title, content, noticeType, caseNumber, location, contact, image } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title required' });
    
    let imagePath = null;
    if (image) {
        try {
            const uploadsDir = path.join(__dirname, 'public', 'uploads');
            if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
            const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
            const imageName = `police_${Date.now()}.png`;
            fs.writeFileSync(path.join(uploadsDir, imageName), base64Data, 'base64');
            imagePath = `/uploads/${imageName}`;
        } catch (err) { console.error('Image error:', err.message); }
    }
    
    db.run(
        `INSERT INTO police_notices (title, content, notice_type, case_number, location, contact, image, posted_by, badge_number, posted_by_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, content || '', noticeType || 'general', caseNumber || '', location || '', contact || '', imagePath,
         req.user.full_name, req.user.badge_number || '', req.user.id],
        function(err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: 'Notice posted!', id: this.lastID });
        }
    );
});

app.delete('/api/police/:id', requireAuth, requireRole('police', 'admin'), (req, res) => {
    db.get('SELECT * FROM police_notices WHERE id = ?', [req.params.id], (err, notice) => {
        if (err || !notice) return res.status(404).json({ success: false, message: 'Not found' });
        if (req.user.role === 'police' && notice.posted_by_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Can only delete your own notices' });
        }
        db.run('DELETE FROM police_notices WHERE id = ?', [req.params.id], function(err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: 'Deleted!' });
        });
    });
});

// ==========================================
// ADMIN
// ==========================================
app.get('/api/admin/stats', requireAuth, requireRole('admin'), (req, res) => {
    db.get('SELECT COUNT(*) as total FROM articles', [], (err, articles) => {
        db.get('SELECT COUNT(*) as total FROM urgent_posts WHERE is_active = 1', [], (err, urgent) => {
            db.get('SELECT COUNT(*) as total FROM users', [], (err, users) => {
                db.get('SELECT COUNT(*) as total FROM police_notices WHERE is_active = 1', [], (err, police) => {
                    res.json({
                        success: true,
                        stats: {
                            articles: articles ? articles.total : 0,
                            urgent: urgent ? urgent.total : 0,
                            users: users ? users.total : 0,
                            police: police ? police.total : 0
                        }
                    });
                });
            });
        });
    });
});

// ==========================================
// SERVE FRONTEND
// ==========================================
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`
    ==========================================
    📊 NAMIBIA MEDIA MONITOR
    ==========================================
    ✅ http://localhost:${PORT}
    
    🔐 Admin: admin / admin123
    🚔 Police: officer / police123
    ==========================================
    `);
});