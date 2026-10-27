import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ─── Prevent backend from dying on uncaught errors ───
process.on('uncaughtException', (err) => {
  console.error('\n🚨 UNCAUGHT EXCEPTION:', err.message);
  console.error(err.stack);
  console.error('Server stayed alive.\n');
});

process.on('unhandledRejection', (err) => {
  console.error('\n🚨 UNHANDLED REJECTION:', err);
  console.error('Server stayed alive.\n');
});

// ─── Route Imports ───
import authRouter from './routes/auth.js';
import listingsRouter from './routes/listings.js';
import commentsRouter from './routes/comments.js';
import rfqsRouter from './routes/rfqs.js';
import talkRouter from './routes/talk.js';
import soilRouter from './routes/soil.js';
import virusRouter from './routes/virus.js';
import weatherRouter from './routes/weather.js';
import ussdRouter from './routes/ussd.js';
import usersRouter from './routes/users.js';
import walletRouter from './routes/wallet.js';
import ordersRouter from './routes/orders.js';
import otpRouter from './routes/otp.js';
import { errorHandler } from './middleware/error.js';
import { db } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// ══════════════════════════════════════════════════
// 1️⃣ DATABASE SCHEMA — MUST RUN BEFORE ROUTES
// ══════════════════════════════════════════════════
console.log('\n🌱 Checking database schema...');
try {
  // Apply base schema
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema);
    console.log('✅ Base schema (users, listings, etc.) ensured');
  }

  // Create extended tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS wallets (
      id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER UNIQUE, balance REAL DEFAULT 0, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT, wallet_id INTEGER, type TEXT, amount REAL, description TEXT, status TEXT DEFAULT 'completed', created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT, buyer_id INTEGER, listing_id INTEGER, seller_id INTEGER, quantity REAL, total_price REAL, status TEXT DEFAULT 'pending', delivery_address TEXT, contact_phone TEXT, tracking_code TEXT UNIQUE, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS otp_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT, phone TEXT, code TEXT, purpose TEXT, expires_at DATETIME, used INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✅ Extended tables (wallets, orders, otp) ensured');

  // 🔥 ADD NEW COLUMNS FOR ORDER TRACKING (BEFORE routes load)
  const cols = db.prepare("PRAGMA table_info(orders)").all().map(c => c.name);
  
  if (!cols.includes('received_at')) {
    db.exec('ALTER TABLE orders ADD COLUMN received_at DATETIME');
    console.log('✅ Added orders.received_at');
  }
  if (!cols.includes('condition_rating')) {
    db.exec('ALTER TABLE orders ADD COLUMN condition_rating TEXT');
    console.log('✅ Added orders.condition_rating');
  }
  if (!cols.includes('condition_notes')) {
    db.exec('ALTER TABLE orders ADD COLUMN condition_notes TEXT');
    console.log('✅ Added orders.condition_notes');
  }
  if (!cols.includes('buyer_reviewed')) {
    db.exec('ALTER TABLE orders ADD COLUMN buyer_reviewed INTEGER DEFAULT 0');
    console.log('✅ Added orders.buyer_reviewed');
  }
  if (!cols.includes('archived')) {
    db.exec('ALTER TABLE orders ADD COLUMN archived INTEGER DEFAULT 0');
    console.log('✅ Added orders.archived');
  }
  console.log('✅ Order tracking columns verified');
  
  // Seed data if empty
  const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get();
  if (userCount.c === 0) {
    const seedPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      const seed = fs.readFileSync(seedPath, 'utf8');
      db.exec(seed);
      console.log('✅ Seed data inserted (6 listings, 3 users)');
    }
  }
} catch (e) {
  console.error('❌ DB Init Error:', e.message);
}
console.log('🌱 Database initialization complete.\n');

// ══════════════════════════════════════════════════
// 2️⃣ MIDDLEWARE
// ══════════════════════════════════════════════════
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: [
    'http://localhost:3000',
    /\.vercel\.app$/
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/api', rateLimit({ windowMs: 60000, max: 500 }));

// ══════════════════════════════════════════════════
// 3️⃣ HEALTH CHECK
// ══════════════════════════════════════════════════
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'NamAgriConnect', ts: Date.now() }));

// ══════════════════════════════════════════════════
// 4️⃣ ROUTES (Now safe — columns exist)
// ══════════════════════════════════════════════════
app.use('/api/auth', authRouter);
app.use('/api/listings', listingsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/rfqs', rfqsRouter);
app.use('/api/talk', talkRouter);
app.use('/api/soil', soilRouter);
app.use('/api/virus', virusRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/ussd', ussdRouter);
app.use('/api/users', usersRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/otp', otpRouter);

app.use(errorHandler);

// ══════════════════════════════════════════════════
// 5️⃣ START SERVER
// ══════════════════════════════════════════════════
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🌾 NamAgriConnect backend → http://localhost:${PORT}`));