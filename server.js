require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ==========================================
// DATABASE
// ==========================================
const db = new sqlite3.Database('./agriconnect.db', (err) => {
  if (err) console.error('Database error:', err);
  else console.log('✅ SQLite database connected');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT,
    location TEXT,
    phone TEXT,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(seller_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS product_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    user_id INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS community_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT,
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS community_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    author TEXT,
    comment TEXT,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(post_id) REFERENCES community_posts(id)
  )`);

  // Add columns if missing
  db.run(`ALTER TABLE community_comments ADD COLUMN dislikes INTEGER DEFAULT 0`, (err) => {
    if (err && !err.message.includes('duplicate')) console.log('ℹ️ Dislikes column already exists');
    else console.log('✅ Dislikes column ready');
  });

  db.run(`CREATE TABLE IF NOT EXISTS market_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product TEXT NOT NULL,
    price TEXT NOT NULL,
    unit TEXT,
    market TEXT NOT NULL,
    source TEXT DEFAULT 'admin',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`INSERT OR IGNORE INTO market_prices (product, price, unit, market, source) VALUES 
    ('Maize', 'N$ 500', 'ton', 'Windhoek', 'admin'),
    ('Mahangu', 'N$ 450', 'ton', 'Oshakati', 'admin'),
    ('Tomatoes', 'N$ 30', 'kg', 'Windhoek', 'admin'),
    ('Potatoes', 'N$ 25', 'kg', 'Windhoek', 'admin'),
    ('Onions', 'N$ 20', 'kg', 'Oshakati', 'admin'),
    ('Cabbage', 'N$ 15', 'kg', 'Swakopmund', 'admin'),
    ('Peppers', 'N$ 40', 'kg', 'Windhoek', 'admin'),
    ('Watermelon', 'N$ 50', 'each', 'Oshakati', 'admin')
  `);

  console.log('✅ All tables created');
});

// ==========================================
// AUTOMATED PRICE UPDATER
// ==========================================
async function fetchExternalPrices() {
  // Simulated data – replace with real API later
  return [
    { product: 'Maize', price: 'N$ 520', unit: 'ton', market: 'Windhoek' },
    { product: 'Mahangu', price: 'N$ 470', unit: 'ton', market: 'Oshakati' },
    { product: 'Tomatoes', price: 'N$ 35', unit: 'kg', market: 'Windhoek' },
    { product: 'Potatoes', price: 'N$ 28', unit: 'kg', market: 'Windhoek' },
    { product: 'Onions', price: 'N$ 22', unit: 'kg', market: 'Oshakati' },
    { product: 'Cabbage', price: 'N$ 18', unit: 'kg', market: 'Swakopmund' },
    { product: 'Peppers', price: 'N$ 45', unit: 'kg', market: 'Windhoek' },
    { product: 'Watermelon', price: 'N$ 55', unit: 'each', market: 'Oshakati' }
  ];
}

async function updateAutomatedPrices() {
  const prices = await fetchExternalPrices();
  if (!prices) return;
  db.serialize(() => {
    prices.forEach(p => {
      db.get(`SELECT id, source FROM market_prices WHERE product = ? AND market = ?`, [p.product, p.market], (err, row) => {
        if (row && row.source === 'automated') {
          db.run(`UPDATE market_prices SET price = ?, unit = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [p.price, p.unit || '', row.id]);
        } else if (!row) {
          db.run(`INSERT INTO market_prices (product, price, unit, market, source, updated_at) VALUES (?, ?, ?, ?, 'automated', CURRENT_TIMESTAMP)`, [p.product, p.price, p.unit || '', p.market]);
        }
      });
    });
  });
}
setInterval(updateAutomatedPrices, 1800000);
setTimeout(updateAutomatedPrices, 10000);

// ==========================================
// API ROUTES
// ==========================================

// Health
app.get('/api/health', (req, res) => res.json({ success: true, message: 'OK' }));

// Auth
app.post('/api/register', (req, res) => {
  const { username, password, fullName, location, phone, email } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password required' });
  db.run(`INSERT INTO users (username, password, full_name, location, phone, email) VALUES (?, ?, ?, ?, ?, ?)`,
    [username, password, fullName || '', location || '', phone || '', email || ''],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) return res.status(400).json({ success: false, message: 'Username already exists' });
        return res.status(500).json({ success: false, message: 'Registration failed' });
      }
      res.json({ success: true, message: 'Registration successful!', userId: this.lastID });
    }
  );
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    if (user.password !== password) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    res.json({
      success: true,
      message: 'Login successful!',
      user: { id: user.id, username: user.username, fullName: user.full_name, location: user.location, phone: user.phone, email: user.email }
    });
  });
});

// Products
app.get('/api/products', (req, res) => {
  db.all(`SELECT products.*, users.username, users.full_name, users.phone, users.email FROM products JOIN users ON products.seller_id = users.id ORDER BY products.created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, products: rows });
  });
});

app.post('/api/products', (req, res) => {
  const { title, description, price, quantity, category, location, sellerId, image } = req.body;
  if (!title || !price || !sellerId) return res.status(400).json({ success: false, message: 'Title, price, and seller ID required' });
  let imagePath = null;
  if (image) {
    try {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const imageName = `product_${Date.now()}.png`;
      const imageFullPath = path.join(uploadsDir, imageName);
      fs.writeFileSync(imageFullPath, base64Data, 'base64');
      imagePath = `/uploads/${imageName}`;
    } catch (err) { console.error('Image error:', err); }
  }
  const stmt = db.prepare(`INSERT INTO products (title, description, price, quantity, category, location, image, seller_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  stmt.run(title, description || '', price, quantity || '1 unit', category || 'Other', location || 'Namibia', imagePath, sellerId, function(err) {
    if (err) return res.status(500).json({ success: false, message: 'Failed to add product' });
    res.json({ success: true, message: 'Product posted successfully!', productId: this.lastID });
  });
  stmt.finalize();
});

// Product comments
app.get('/api/products/:id/comments', (req, res) => {
  const { id } = req.params;
  db.all(`SELECT product_comments.*, users.username, users.full_name FROM product_comments JOIN users ON product_comments.user_id = users.id WHERE product_comments.product_id = ? ORDER BY product_comments.created_at DESC`, [id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error fetching comments' });
    res.json({ success: true, comments: rows });
  });
});

app.post('/api/products/:id/comments', (req, res) => {
  const { id } = req.params;
  const { userId, comment } = req.body;
  if (!comment) return res.status(400).json({ success: false, message: 'Comment is required' });
  if (!userId) return res.status(400).json({ success: false, message: 'Please login to comment' });
  db.run(`INSERT INTO product_comments (product_id, user_id, comment) VALUES (?, ?, ?)`, [id, userId, comment], function(err) {
    if (err) return res.status(500).json({ success: false, message: 'Error posting comment' });
    res.json({ success: true, message: 'Comment posted successfully!', commentId: this.lastID });
  });
});

// Community
app.get('/api/community/posts', (req, res) => {
  db.all(`SELECT community_posts.*, (SELECT COUNT(*) FROM community_comments WHERE community_comments.post_id = community_posts.id) as comment_count FROM community_posts ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error fetching posts' });
    res.json({ success: true, posts: rows });
  });
});

app.post('/api/community/posts', (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content) return res.status(400).json({ success: false, message: 'Title and content required' });
  db.run(`INSERT INTO community_posts (title, content, author) VALUES (?, ?, ?)`, [title, content, author || 'Anonymous Farmer'], function(err) {
    if (err) return res.status(500).json({ success: false, message: 'Error creating post' });
    res.json({ success: true, message: 'Post created!', postId: this.lastID });
  });
});

// Community likes/comments
app.post('/api/community/posts/:id/like', (req, res) => {
  const { id } = req.params;
  db.run(`UPDATE community_posts SET likes = likes + 1 WHERE id = ?`, [id], function(err) {
    if (err) return res.status(500).json({ success: false, message: 'Error liking post' });
    res.json({ success: true, message: 'Post liked!' });
  });
});

app.get('/api/community/posts/:id/comments', (req, res) => {
  const { id } = req.params;
  db.all(`SELECT * FROM community_comments WHERE post_id = ? ORDER BY created_at DESC`, [id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error fetching comments' });
    res.json({ success: true, comments: rows });
  });
});

app.post('/api/community/posts/:id/comments', (req, res) => {
  const { id } = req.params;
  const { author, comment } = req.body;
  if (!comment) return res.status(400).json({ success: false, message: 'Comment required' });
  db.run(`INSERT INTO community_comments (post_id, author, comment) VALUES (?, ?, ?)`, [id, author || 'Anonymous Farmer', comment], function(err) {
    if (err) return res.status(500).json({ success: false, message: 'Error posting comment' });
    res.json({ success: true, message: 'Comment posted!', commentId: this.lastID });
  });
});

// === DISLIKE / LIKE FOR COMMUNITY COMMENTS ===
app.post('/api/community/comments/:id/like', (req, res) => {
  const { id } = req.params;
  db.run(`UPDATE community_comments SET likes = likes + 1 WHERE id = ?`, [id], function(err) {
    if (err) return res.status(500).json({ success: false, message: 'Error liking comment' });
    res.json({ success: true, message: 'Comment liked!' });
  });
});

app.post('/api/community/comments/:id/dislike', (req, res) => {
  const { id } = req.params;
  db.run(`UPDATE community_comments SET dislikes = dislikes + 1 WHERE id = ?`, [id], function(err) {
    if (err) return res.status(500).json({ success: false, message: 'Error disliking comment' });
    res.json({ success: true, message: 'Comment disliked!' });
  });
});

// ==========================================
// MARKET, WEATHER
// ==========================================
app.get('/api/weather', (req, res) => {
  res.json({
    success: true,
    weather: [
      { region: 'Windhoek', forecast: 'Sunny', temperature: '28°C', rainfall: '0mm' },
      { region: 'Oshana', forecast: 'Partly Cloudy', temperature: '30°C', rainfall: '5mm' },
      { region: 'Ohangwena', forecast: 'Rain Expected', temperature: '26°C', rainfall: '15mm' },
      { region: 'Omusati', forecast: 'Cloudy', temperature: '27°C', rainfall: '10mm' },
      { region: 'Erongo', forecast: 'Sunny', temperature: '22°C', rainfall: '0mm' },
      { region: 'Hardap', forecast: 'Clear', temperature: '32°C', rainfall: '0mm' }
    ]
  });
});

app.get('/api/market', (req, res) => {
  db.all(`SELECT * FROM market_prices ORDER BY market, product`, [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error fetching prices' });
    res.json({ success: true, marketPrices: rows });
  });
});

// Admin price routes
app.post('/api/admin/prices', (req, res) => {
  const { product, price, unit, market } = req.body;
  if (!product || !price || !market) return res.status(400).json({ success: false, message: 'Product, price, and market required' });
  db.get(`SELECT id FROM market_prices WHERE product = ? AND market = ?`, [product, market], (err, row) => {
    if (row) {
      db.run(`UPDATE market_prices SET price = ?, unit = ?, source = 'admin', updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [price, unit || '', row.id], function(err) {
        if (err) return res.status(500).json({ success: false, message: 'Error updating price' });
        res.json({ success: true, message: 'Price updated!' });
      });
    } else {
      db.run(`INSERT INTO market_prices (product, price, unit, market, source, updated_at) VALUES (?, ?, ?, ?, 'admin', CURRENT_TIMESTAMP)`, [product, price, unit || '', market], function(err) {
        if (err) return res.status(500).json({ success: false, message: 'Error adding price' });
        res.json({ success: true, message: 'Price added!', id: this.lastID });
      });
    }
  });
});

app.delete('/api/admin/prices/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM market_prices WHERE id = ?`, [id], function(err) {
    if (err) return res.status(500).json({ success: false, message: 'Error deleting price' });
    res.json({ success: true, message: 'Price deleted' });
  });
});

app.post('/api/admin/prices/reset/:product/:market', (req, res) => {
  const { product, market } = req.params;
  db.run(`UPDATE market_prices SET source = 'automated', updated_at = CURRENT_TIMESTAMP WHERE product = ? AND market = ?`, [product, market], function(err) {
    if (err) return res.status(500).json({ success: false, message: 'Error resetting' });
    res.json({ success: true, message: 'Reset to automated' });
  });
});

// ==========================================
// ADMIN
// ==========================================
app.get('/api/admin/stats', (req, res) => {
  db.get('SELECT COUNT(*) as totalUsers FROM users', [], (err, userCount) => {
    if (err) return res.status(500).json({ success: false });
    db.get('SELECT COUNT(*) as totalProducts FROM products', [], (err, productCount) => {
      if (err) return res.status(500).json({ success: false });
      db.get('SELECT COUNT(*) as totalPosts FROM community_posts', [], (err, postCount) => {
        if (err) return res.status(500).json({ success: false });
        db.get('SELECT COUNT(*) as totalComments FROM product_comments', [], (err, commentCount) => {
          if (err) return res.status(500).json({ success: false });
          res.json({
            success: true,
            stats: {
              users: userCount ? userCount.totalUsers : 0,
              products: productCount ? productCount.totalProducts : 0,
              posts: postCount ? postCount.totalPosts : 0,
              comments: commentCount ? commentCount.totalComments : 0
            }
          });
        });
      });
    });
  });
});

app.get('/api/admin/users', (req, res) => {
  db.all('SELECT id, username, full_name, location, phone, email, created_at FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error fetching users' });
    res.json({ success: true, users: rows });
  });
});

app.get('/api/admin/products', (req, res) => {
  db.all(`SELECT products.*, users.username as seller_name FROM products JOIN users ON products.seller_id = users.id ORDER BY products.created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error fetching products' });
    res.json({ success: true, products: rows });
  });
});

app.get('/api/admin/community', (req, res) => {
  db.all('SELECT * FROM community_posts ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error fetching posts' });
    res.json({ success: true, posts: rows });
  });
});

app.get('/api/admin/comments', (req, res) => {
  db.all(`SELECT product_comments.*, users.username, products.title as product_title FROM product_comments JOIN users ON product_comments.user_id = users.id LEFT JOIN products ON product_comments.product_id = products.id ORDER BY product_comments.created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error fetching comments' });
    res.json({ success: true, comments: rows });
  });
});

app.delete('/api/admin/:type/:id', (req, res) => {
  const { type, id } = req.params;
  let table = '';
  if (type === 'users') table = 'users';
  else if (type === 'products') table = 'products';
  else if (type === 'community') table = 'community_posts';
  else if (type === 'comments') table = 'product_comments';
  else return res.status(400).json({ success: false, message: 'Invalid type' });
  db.run(`DELETE FROM ${table} WHERE id = ?`, [id], function(err) {
    if (err) return res.status(500).json({ success: false, message: 'Error deleting' });
    res.json({ success: true, message: 'Deleted successfully' });
  });
});

// ==========================================
// FRONTEND
// ==========================================
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
  ==========================================
  🌾 AGRI-CONNECT NAMIBIA API 🌾
  ==========================================
  ✅ Server running on: http://localhost:${PORT}
  ✅ API base: http://localhost:${PORT}/api
  ==========================================
  `);
});