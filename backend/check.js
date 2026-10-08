import { query } from './db.js';

console.log('\n🔍 NamAgriConnect Diagnostic\n');

const tables = ['users','listings','comments','rfqs','talk_posts','likes'];
for (const t of tables) {
  try {
    const r = query(`SELECT COUNT(*) AS c FROM ${t}`);
    console.log(`✅ ${t}: ${r.rows[0].c} rows`);
  } catch (e) {
    console.log(`❌ ${t}: ${e.message}`);
  }
}

console.log('\n📋 Listings columns:');
try {
  const cols = query("PRAGMA table_info(listings)");
  const names = cols.rows.map(r => r.name);
  ['id','title','owner_id','contact_phone','contact_name','phone','sold','photos'].forEach(c => {
    console.log(names.includes(c) ? `✅ ${c}` : `❌ MISSING: ${c}`);
  });
} catch (e) { console.log('❌', e.message); }

console.log('\n📋 rfqs columns:');
try {
  const cols = query("PRAGMA table_info(rfqs)");
  const names = cols.rows.map(r => r.name);
  ['id','item','region','owner_id'].forEach(c => {
    console.log(names.includes(c) ? `✅ ${c}` : `❌ MISSING: ${c}`);
  });
} catch (e) { console.log('❌', e.message); }

console.log('\n📋 Test query (with JOINs):');
try {
  const r = query(`
    SELECT l.id, l.title, u.name AS owner_name 
    FROM listings l LEFT JOIN users u ON u.id = l.owner_id 
    WHERE l.sold = ? LIMIT 3
  `, [0]);
  console.log('✅ Listings JOIN works. Sample:');
  r.rows.forEach(row => console.log('   •', row.id, row.title, '→', row.owner_name || '(no owner)'));
} catch (e) { console.log('❌ JOIN failed:', e.message); }

try {
  const r = query(`
    SELECT r.*, u.name AS owner_name 
    FROM rfqs r LEFT JOIN users u ON u.id = r.owner_id 
    WHERE r.created_at > datetime('now', '-7 days') 
    LIMIT 3
  `);
  console.log('✅ RFQs JOIN + datetime works. Rows:', r.rows.length);
} catch (e) { console.log('❌ RFQs JOIN failed:', e.message); }

console.log('\n✅ Diagnostic complete\n');
process.exit(0);