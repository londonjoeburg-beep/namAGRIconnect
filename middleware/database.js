const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dbDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new sqlite3.Database(path.join(dbDir, 'agriconnect.db'), (err) => {
    if (err) console.error('❌ Database error:', err.message);
    else console.log('✅ Database connected');
});

db.serialize(() => {
    // ==========================================
    // USERS
    // ==========================================
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT,
        location TEXT,
        phone TEXT,
        email TEXT,
        role TEXT DEFAULT 'farmer',
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // ==========================================
    // PRODUCTS
    // ==========================================
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        quantity TEXT,
        category TEXT,
        location TEXT,
        image TEXT,
        seller_id INTEGER,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(seller_id) REFERENCES users(id)
    )`);

    // ==========================================
    // PRODUCT COMMENTS (with replies + likes)
    // ==========================================
    db.run(`CREATE TABLE IF NOT EXISTS product_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        user_id INTEGER,
        comment TEXT,
        parent_id INTEGER DEFAULT NULL,
        likes INTEGER DEFAULT 0,
        dislikes INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(product_id) REFERENCES products(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // ==========================================
    // COMMUNITY POSTS
    // ==========================================
    db.run(`CREATE TABLE IF NOT EXISTS community_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT,
        author_id INTEGER,
        likes INTEGER DEFAULT 0,
        dislikes INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // ==========================================
    // COMMUNITY COMMENTS (with replies + likes/dislikes)
    // ==========================================
    db.run(`CREATE TABLE IF NOT EXISTS community_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER,
        author TEXT,
        author_id INTEGER,
        comment TEXT,
        parent_id INTEGER DEFAULT NULL,
        likes INTEGER DEFAULT 0,
        dislikes INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(post_id) REFERENCES community_posts(id)
    )`);

    // ==========================================
    // MARKET PRICES
    // ==========================================
    db.run(`CREATE TABLE IF NOT EXISTS market_prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product TEXT NOT NULL,
        price TEXT NOT NULL,
        unit TEXT,
        market TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // ==========================================
    // PARTNERS
    // ==========================================
    db.run(`CREATE TABLE IF NOT EXISTS partners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT,
        contact TEXT,
        website TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // ==========================================
    // AUTO-MIGRATIONS (add missing columns)
    // ==========================================
    db.run(`ALTER TABLE product_comments ADD COLUMN parent_id INTEGER DEFAULT NULL`, () => {});
    db.run(`ALTER TABLE product_comments ADD COLUMN likes INTEGER DEFAULT 0`, () => {});
    db.run(`ALTER TABLE product_comments ADD COLUMN dislikes INTEGER DEFAULT 0`, () => {});
    db.run(`ALTER TABLE community_comments ADD COLUMN parent_id INTEGER DEFAULT NULL`, () => {});
    db.run(`ALTER TABLE community_comments ADD COLUMN dislikes INTEGER DEFAULT 0`, () => {});
    db.run(`ALTER TABLE products ADD COLUMN is_active INTEGER DEFAULT 1`, () => {});
    db.run(`ALTER TABLE community_posts ADD COLUMN is_active INTEGER DEFAULT 1`, () => {});
    db.run(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'farmer'`, () => {});
    db.run(`ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1`, () => {});

    // ==========================================
    // DEFAULT ADMIN USER
    // ==========================================
    const adminPass = bcrypt.hashSync('admin123', 10);
    db.run(`INSERT OR IGNORE INTO users (id, username, password, full_name, location, role) 
        VALUES (1, 'admin', '${adminPass}', 'System Administrator', 'Windhoek', 'admin')`);

    // ==========================================
    // SAMPLE MARKET PRICES
    // ==========================================
    db.run(`INSERT OR IGNORE INTO market_prices (id, product, price, unit, market) VALUES 
        (1, 'Maize', 'N$ 500', 'ton', 'Windhoek'),
        (2, 'Mahangu', 'N$ 450', 'ton', 'Oshakati'),
        (3, 'Tomatoes', 'N$ 30', 'kg', 'Windhoek'),
        (4, 'Potatoes', 'N$ 25', 'kg', 'Windhoek'),
        (5, 'Onions', 'N$ 20', 'kg', 'Oshakati'),
        (6, 'Cabbage', 'N$ 15', 'kg', 'Swakopmund'),
        (7, 'Peppers', 'N$ 40', 'kg', 'Windhoek'),
        (8, 'Watermelon', 'N$ 50', 'each', 'Oshakati')
    `);

    // ==========================================
    // SAMPLE PARTNERS
    // ==========================================
    db.run(`INSERT OR IGNORE INTO partners (id, name, type, contact, website, description) VALUES 
        (1, 'Ministry of Agriculture', 'Government', '+264 61 208 7111', 'https://www.mawf.gov.na', 'Government agricultural support and policy'),
        (2, 'Namibia Agronomic Board', 'Government', '+264 61 289 9500', 'https://www.nab.com.na', 'Agricultural regulation and marketing'),
        (3, 'Namibian Farmers Association', 'NGO', '+264 61 236 151', 'https://www.nafu.com.na', 'Farmer support organization'),
        (4, 'AgriBank Namibia', 'Financial', '+264 61 433 3000', 'https://www.agribank.com.na', 'Agricultural financing and loans'),
        (5, 'Namibia University of Science and Technology', 'Education', '+264 61 207 9111', 'https://www.nust.na', 'Agricultural research and education'),
        (6, 'MTC Namibia', 'Corporate', '+264 61 280 2000', 'https://www.mtc.com.na', 'Mobile network services')
    `);

    console.log('✅ All tables ready with all features');
});

module.exports = db;