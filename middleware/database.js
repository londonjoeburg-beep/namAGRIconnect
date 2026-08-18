// ==========================================
// DATABASE
// ==========================================
const db = new sqlite3.Database('./agriconnect.db', (err) => {
  if (err) console.error('Database error:', err);
  else console.log('✅ SQLite database connected');
});

db.serialize(() => {
  // Users table
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

  // Products table with image column
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
  )`, (err) => {
    if (err) {
      console.error('Error creating products table:', err.message);
    } else {
      console.log('✅ Products table ready');
    }
  });

  // Product comments table
  db.run(`CREATE TABLE IF NOT EXISTS product_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    user_id INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Community posts table
  db.run(`CREATE TABLE IF NOT EXISTS community_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT,
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Community comments table WITH likes column
  db.run(`CREATE TABLE IF NOT EXISTS community_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    author TEXT,
    comment TEXT,
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(post_id) REFERENCES community_posts(id)
  )`);

  // Community comments with likes and dislikes
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

// Add dislikes column if it doesn't exist
db.run(`ALTER TABLE community_comments ADD COLUMN dislikes INTEGER DEFAULT 0`, (err) => {
  if (err) console.log('ℹ️ Dislikes column already exists');
  else console.log('✅ Added dislikes column');
});


  // Add likes column if it doesn't exist (for existing databases)
  db.run(`ALTER TABLE community_comments ADD COLUMN likes INTEGER DEFAULT 0`, (err) => {
    if (err) {
      console.log('ℹ️ Likes column already exists');
    } else {
      console.log('✅ Added likes column to community_comments');
    }
  });

  // Add dislike column to community_comments
db.run(`ALTER TABLE community_comments ADD COLUMN dislikes INTEGER DEFAULT 0`, (err) => {
  if (err) console.log('ℹ️ Dislikes column already exists');
  else console.log('✅ Added dislikes column');
});

  console.log('✅ All tables created');
});