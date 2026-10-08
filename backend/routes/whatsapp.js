import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

router.post('/webhook', async (req, res) => {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value;
    const msg = entry?.messages?.[0];
    if (msg?.text?.body) {
      const from = msg.from;
      const text = msg.text.body.toUpperCase();
      let reply = 'Reply MENU for options';

      if (text === 'MENU' || text === 'HI' || text === 'HELLO') {
        reply = '🌾 NamAgriConnect\nPRICES — market prices\nLIST <title> <qty> <unit> <price> <town>';
      } else if (text === 'PRICES') {
        const r = await query('SELECT title, price, unit, town FROM listings WHERE sold=0 ORDER BY created_at DESC LIMIT 5');
        reply = r.rows.map(l => `• ${l.title}: N$${l.price}/${l.unit} (${l.town})`).join('\n') || 'No listings.';
      }
      console.log('WhatsApp reply →', from, reply);
    }
    res.sendStatus(200);
  } catch (e) {
    console.error('WA error:', e);
    res.sendStatus(200);
  }
});

router.post('/test', async (req, res) => {
  const { text = 'MENU' } = req.body || {};
  const t = text.toUpperCase();
  if (t === 'MENU') return res.json({ reply: '🌾 Menu: PRICES, LIST, HELP' });
  if (t === 'PRICES') {
    const r = await query('SELECT title, price, unit FROM listings WHERE sold=0 LIMIT 5');
    return res.json({ reply: r.rows.map(l => `${l.title}: N$${l.price}/${l.unit}`).join('\n') });
  }
  res.json({ reply: 'Unknown command' });
});

export default router;