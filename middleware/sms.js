const axios = require('axios');

// ==========================================
// INFOBIP SMS SERVICE — JAVASCRIPT
// ==========================================

// Format phone number for Namibia (add 264 country code)
function formatPhoneNumber(phone) {
    if (!phone) return null;
    
    // Remove all non-digit characters
    let cleaned = String(phone).replace(/\D/g, '');
    
    // If starts with 0, replace with 264
    if (cleaned.startsWith('0')) {
        cleaned = '264' + cleaned.substring(1);
    }
    
    // If doesn't start with 264, add it
    if (!cleaned.startsWith('264') && cleaned.length === 9) {
        cleaned = '264' + cleaned;
    }
    
    // Validate length (264 + 9 digits = 12)
    if (cleaned.length < 11 || cleaned.length > 15) {
        return null;
    }
    
    return cleaned;
}

// ==========================================
// SEND SINGLE SMS — JavaScript version of curl
// ==========================================
async function sendSMS(phoneNumber, message) {
    try {
        const apiKey = process.env.INFOBIP_API_KEY;
        const baseUrl = process.env.INFOBIP_BASE_URL || 'https://jre5kn.api.infobip.com';
        const sender = process.env.INFOBIP_SENDER || '447491163443';

        // Demo mode if no API key
        if (!apiKey || apiKey === 'your_infobip_api_key_here') {
            console.log(`📱 [DEMO MODE] SMS to ${phoneNumber}: ${message}`);
            return {
                success: true,
                message: 'SMS logged (demo mode)',
                phone: phoneNumber,
                demo: true
            };
        }

        // Format phone number
        const to = formatPhoneNumber(phoneNumber);
        if (!to) {
            return {
                success: false,
                message: 'Invalid phone number format'
            };
        }

        // Build the request — EXACT translation of your curl command
        const url = `${baseUrl}/sms/3/messages`;
        
        const payload = {
            messages: [
                {
                    destinations: [
                        { to: to }
                    ],
                    sender: sender,
                    content: {
                        text: message
                    }
                }
            ]
        };

        const headers = {
            'Authorization': `App ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        console.log(`📱 Sending SMS to ${to}...`);

        const response = await axios({
            method: 'POST',
            url: url,
            headers: headers,
            data: payload,
            timeout: 15000
        });

        console.log(`✅ SMS sent to ${to}`);
        console.log('Response:', JSON.stringify(response.data, null, 2));

        return {
            success: true,
            message: 'SMS sent successfully',
            phone: to,
            response: response.data
        };

    } catch (error) {
        console.error('❌ SMS error:', error.message);
        
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }

        return {
            success: false,
            message: error.response?.data?.requestError?.serviceException?.text 
                     || error.message
        };
    }
}

// ==========================================
// SEND BULK SMS
// ==========================================
async function sendBulkSMS(phoneNumbers, message) {
    try {
        const apiKey = process.env.INFOBIP_API_KEY;
        const baseUrl = process.env.INFOBIP_BASE_URL || 'https://jre5kn.api.infobip.com';
        const sender = process.env.INFOBIP_SENDER || '447491163443';

        if (!apiKey || apiKey === 'your_infobip_api_key_here') {
            console.log(`📱 [DEMO] Bulk SMS to ${phoneNumbers.length} numbers`);
            return { success: true, demo: true, count: phoneNumbers.length };
        }

        // Format all numbers
        const destinations = phoneNumbers
            .map(p => formatPhoneNumber(p))
            .filter(p => p !== null)
            .map(p => ({ to: p }));

        if (destinations.length === 0) {
            return { success: false, message: 'No valid phone numbers' };
        }

        const url = `${baseUrl}/sms/3/messages`;
        
        const payload = {
            messages: [
                {
                    destinations: destinations,
                    sender: sender,
                    content: {
                        text: message
                    }
                }
            ]
        };

        const headers = {
            'Authorization': `App ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        console.log(`📱 Sending bulk SMS to ${destinations.length} recipients...`);

        const response = await axios({
            method: 'POST',
            url: url,
            headers: headers,
            data: payload,
            timeout: 30000
        });

        console.log(`✅ Bulk SMS sent`);
        return {
            success: true,
            count: destinations.length,
            response: response.data
        };

    } catch (error) {
        console.error('❌ Bulk SMS error:', error.message);
        return {
            success: false,
            message: error.response?.data?.requestError?.serviceException?.text 
                     || error.message
        };
    }
}

// ==========================================
// SMS TEMPLATES
// ==========================================
const templates = {
    welcome: (name) => 
        `Welcome ${name}! You're now registered on AgriConnect Namibia. Start selling your products today!`,
    
    newProduct: (title, price) => 
        `New product listed: ${title} at N$${price}. Check AgriConnect Namibia!`,
    
    weatherAlert: (region, forecast) => 
        `Weather Alert for ${region}: ${forecast}. Plan your farming accordingly.`,
    
    priceUpdate: (product, price) => 
        `Market Update: ${product} is now N$${price}. Check AgriConnect Namibia for details.`,
    
    buyerInquiry: (product) => 
        `A buyer is interested in your ${product}. Log in to AgriConnect Namibia to respond.`,
    
    urgent: (message) => 
        `🚨 URGENT from AgriConnect: ${message}`
};

module.exports = { 
    sendSMS, 
    sendBulkSMS, 
    templates, 
    formatPhoneNumber 
};