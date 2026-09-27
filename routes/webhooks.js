const express = require('express');
const router = express.Router();

// Webhook endpoint (for future integrations)
router.post('/webhooks/africastalking', (req, res) => {
  console.log('📨 Webhook received:', req.body);
  res.json({ success: true, message: 'Webhook received' });
});

// USSD webhook
router.post('/webhooks/ussd', (req, res) => {
  console.log('📱 USSD request:', req.body);
  
  const { sessionId, phoneNumber, text } = req.body;
  
  // Simple USSD menu
  let response = '';
  if (text === '') {
    response = 'Welcome to AgriConnect Namibia!\n';
    response += '1. Register\n';
    response += '2. Check Prices\n';
    response += '3. Weather\n';
    response += '4. Post Product\n';
    response += '5. Exit';
  } else if (text === '1') {
    response = 'Register:\nEnter your full name:';
  } else if (text === '2') {
    response = 'Market Prices:\nMaize: N$500/ton\nTomatoes: N$30/kg';
  } else if (text === '3') {
    response = 'Weather:\nWindhoek: Sunny 28°C\nOshana: Cloudy 30°C';
  } else if (text === '4') {
    response = 'Post Product:\nEnter product title:';
  } else {
    response = 'Thank you for using AgriConnect! Goodbye.';
  }
  
  res.json({ 
    success: true, 
    message: response,
    sessionId: sessionId
  });
});

module.exports = router;