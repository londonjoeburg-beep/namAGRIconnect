const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function ensureFile(filename, defaultValue = []) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
  return filePath;
}

function read(filename) {
  const filePath = ensureFile(filename);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Read error', filename, err.message);
    return [];
  }
}

function write(filename, data) {
  const filePath = ensureFile(filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function nextId(collection) {
  if (!collection.length) return 1;
  const max = Math.max(...collection.map(i => Number(i.id) || 0));
  return max + 1;
}

module.exports = { read, write, nextId, DATA_DIR };