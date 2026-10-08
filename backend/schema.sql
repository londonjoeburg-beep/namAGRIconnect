CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  region TEXT,
  town TEXT,
  password_hash TEXT,
  language TEXT DEFAULT 'en',
  rating REAL DEFAULT 0,
  badges TEXT DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  owner_id INTEGER,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  price REAL NOT NULL,
  region TEXT NOT NULL,
  town TEXT NOT NULL,
  phone TEXT,
  contact_phone TEXT,
  contact_name TEXT,
  badge TEXT,
  delivery TEXT,
  photos TEXT DEFAULT '[]',
  sold INTEGER DEFAULT 0,
  sold_at DATETIME,
  buyer_phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_listings_region ON listings(region);
CREATE INDEX IF NOT EXISTS idx_listings_cat ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_sold ON listings(sold);
CREATE INDEX IF NOT EXISTS idx_listings_owner ON listings(owner_id);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER,
  user_name TEXT NOT NULL,
  text TEXT NOT NULL,
  parent_id INTEGER,
  owner_id INTEGER,
  likes INTEGER DEFAULT 0,
  voice_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rfqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item TEXT NOT NULL,
  region TEXT NOT NULL,
  budget REAL,
  posted_by TEXT,
  phone TEXT,
  owner_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS talk_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_name TEXT NOT NULL,
  text TEXT NOT NULL,
  owner_id INTEGER,
  likes INTEGER DEFAULT 0,
  voice_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  target_type TEXT NOT NULL,
  target_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, target_type, target_id)
);

CREATE TABLE IF NOT EXISTS soil_scans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  readings TEXT,
  diagnosis TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS virus_scans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  disease TEXT,
  severity TEXT,
  confidence REAL,
  treatment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS outbreak_alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  disease TEXT NOT NULL,
  region TEXT NOT NULL,
  severity TEXT NOT NULL,
  farms_alerted INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);