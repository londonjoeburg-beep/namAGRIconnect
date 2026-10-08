import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'namagri.db');

const db = new DatabaseSync(dbPath);
console.log('📦 Native SQLite DB →', dbPath);

function convertPlaceholders(sql) {
  return sql.replace(/\$\d+/g, '?');
}

export function query(text, params = []) {
  const sql = convertPlaceholders(text);
  const stmt = db.prepare(sql);
  const trimmed = text.trim().toUpperCase();

  if (trimmed.startsWith('SELECT') || trimmed.startsWith('WITH')) {
    return { rows: stmt.all(...params) };
  }

  const info = stmt.run(...params);
  return { rows: [{ id: info.lastInsertRowid, changes: info.changes }] };
}

export { db };