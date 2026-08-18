const express = require('express');
const router = express.Router();

const WEATHER_DATA = [
  { region: 'Khomas (Windhoek)', forecast: 'Sunny with clear skies', temperature: '28°C / 14°C', rainfall: '0 mm expected' },
  { region: 'Erongo (Swakopmund)', forecast: 'Cool coastal fog in the morning', temperature: '22°C / 12°C', rainfall: '0 mm' },
  { region: 'Oshana (Oshakati)', forecast: 'Partly cloudy, chance of afternoon showers', temperature: '31°C / 18°C', rainfall: '5–10 mm possible' },
  { region: 'Kavango East (Rundu)', forecast: 'Warm and humid', temperature: '33°C / 20°C', rainfall: 'Light rain possible' },
  { region: '//Karas (Keetmanshoop)', forecast: 'Hot and dry', temperature: '34°C / 16°C', rainfall: '0 mm' },
  { region: 'Otjozondjupa (Otjiwarongo)', forecast: 'Mostly sunny', temperature: '30°C / 15°C', rainfall: '0 mm' },
  { region: 'Hardap (Mariental)', forecast: 'Clear and hot', temperature: '32°C / 14°C', rainfall: '0 mm' },
  { region: 'Zambezi (Katima Mulilo)', forecast: 'Thunderstorms possible late afternoon', temperature: '29°C / 19°C', rainfall: '10–20 mm possible' }
];

router.get('/weather', (req, res) => {
  res.json({ success: true, weather: WEATHER_DATA, updated: new Date().toISOString() });
});

module.exports = router;