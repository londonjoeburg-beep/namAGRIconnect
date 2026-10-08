import fetch from 'node-fetch';
import { query } from '../db.js';

const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export async function sendWhatsApp(to, message) {
  if (!TOKEN || !PHONE_ID) {
    console.log('📱 [WA-MOCK] →', to, message);
    return { mocked: true };
  }
  const r = await fetch(`https://graph.facebook.com/v20.0/${PHONE_ID}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body: message } })
  });
  return r.json();
}

// Handle inbound text using tiny DSL:
// LIST MAIZE 50 BAGS 350 RUNDU
// BUY <id>
// PRICES
export async function handleIncoming(from, text) {
  const t = (text || '').trim().toUpperCase();

  if (t === 'HI' || t === 'HELLO' || t === 'MENU') {
    return `🌾 *NamAgriConnect*\nReply with:\n• PRICES — live prices\n• LIST <title> <qty> <unit> <price> <town>\n• BUY <id>\n• HELP`;
  }

  if (t === 'PRICES') {
    const { rows } = await query('SELECT title, price, unit, town FROM listings WHERE sold=FALSE ORDER BY created_at DESC LIMIT 5');
    return rows.map(r => `• ${r.title} — N$${r.price}/${r.unit} (${r.town})`).join('\n') || 'No listings.';
  }

  if (t.startsWith('LIST ')) {
    const parts = text.slice(5).trim().split(/\s+/);
    if (parts.length < 5) return '⚠️ Usage: LIST <title> <qty> <unit> <price> <town>';
    const [title, qty, unit, price, town] = parts;
    await query(
      `INSERT INTO listings (title,category,quantity,unit,price,region,town,phone,description)
       VALUES ($1,'Crops & Horticulture',$2,$3,$4,'Unknown',$5,$6,'Posted via WhatsApp')`,
      [title, parseFloat(qty), unit, parseFloat(price), town, from]
    );
    return `✅ Listed: ${title} — ${qty} ${unit} @ N$${price} in ${town}`;
  }

  if (t.startsWith('BUY ')) {
    const id = text.split(/\s+/)[1];
    const { rows } = await query('SELECT title,phone,town FROM listings WHERE id=$1 AND sold=FALSE', [id]);
    if (!rows[0]) return '❌ Listing not found or already sold.';
    return `✅ Contact seller of *${rows[0].title}* in ${rows[0].town}: ${rows[0].phone}`;
  }

  return '🤖 Not sure. Reply MENU for options.';
}