// SMS middleware - Simplified version (no africastalking required)

function sendSMS(phone, message) {
  console.log(`📱 Sending SMS to ${phone}: ${message}`);
  // In production, you would integrate with Africa's Talking API
  return { success: true, message: 'SMS sent' };
}

module.exports = { sendSMS };