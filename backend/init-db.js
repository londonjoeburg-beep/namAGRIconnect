import { db } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('\n🌱 Initializing NamAgriConnect database...\n');

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);
console.log('✅ Schema applied');

const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
try {
  db.exec(seed);
  console.log('✅ Seed data inserted');
} catch (e) {
  console.log('ℹ️  Seed skipped:', e.message);
}

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
console.log('\n📋 Tables:');
tables.forEach(t => console.log('   •', t.name));

const listings = db.prepare('SELECT COUNT(*) AS c FROM listings').get();
console.log(`\n📦 Listings: ${listings.c}`);
console.log('✅ Done! Run `npm run dev`.\n');