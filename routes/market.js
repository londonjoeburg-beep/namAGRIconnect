const express = require('express');
const router = express.Router();

const MARKET_PRICES = [
  { product: 'White Maize (50kg bag)', price: 'N$ 280 – 320', market: 'Windhoek Fresh Produce' },
  { product: 'Yellow Maize (50kg)', price: 'N$ 250 – 290', market: 'Oshakati Market' },
  { product: 'Mahangu / Pearl Millet (50kg)', price: 'N$ 220 – 260', market: 'Northern Markets' },
  { product: 'Tomatoes (box ~10kg)', price: 'N$ 80 – 120', market: 'Windhoek' },
  { product: 'Onions (bag 10kg)', price: 'N$ 60 – 90', market: 'Keetmanshoop' },
  { product: 'Potatoes (bag 10kg)', price: 'N$ 70 – 100', market: 'Otjiwarongo' },
  { product: 'Cattle (live – average)', price: 'N$ 8 500 – 12 000', market: 'Agra / Local Auctions' },
  { product: 'Goats (live)', price: 'N$ 1 200 – 2 000', market: 'Northern Auctions' },
  { product: 'Sheep (live)', price: 'N$ 1 400 – 2 200', market: 'Southern Markets' },
  { product: 'Chicken (live)', price: 'N$ 80 – 120', market: 'Local Farms' },
  { product: 'Eggs (tray of 30)', price: 'N$ 55 – 75', market: 'Windhoek' },
  { product: 'Fresh Milk (litre)', price: 'N$ 18 – 25', market: 'Dairy Farms' },
  { product: 'Watermelon (each)', price: 'N$ 40 – 70', market: 'Seasonal Markets' },
  { product: 'Cabbage (head)', price: 'N$ 15 – 25', market: 'Fresh Produce Markets' },
  { product: 'Carrots (bunch)', price: 'N$ 12 – 20', market: 'Local Markets' }
];

router.get('/marketprices', (req, res) => {
  res.json({ success: true, marketPrices: MARKET_PRICES, updated: new Date().toISOString() });
});

module.exports = router;