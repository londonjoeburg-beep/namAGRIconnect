const express = require('express');
const axios = require('axios');
const router = express.Router();

// ==========================================
// NAMIBIAN FARMING REGIONS
// ==========================================
const FARMING_REGIONS = [
    { name: 'Windhoek', lat: -22.5597, lon: 17.0832, region: 'Khomas' },
    { name: 'Oshakati', lat: -17.7883, lon: 15.6994, region: 'Oshana' },
    { name: 'Rundu', lat: -17.9333, lon: 19.7667, region: 'Kavango East' },
    { name: 'Ondangwa', lat: -17.9167, lon: 15.9500, region: 'Oshana' },
    { name: 'Katima Mulilo', lat: -17.5000, lon: 24.2667, region: 'Zambezi' },
    { name: 'Grootfontein', lat: -19.5667, lon: 18.1167, region: 'Otjozondjupa' },
    { name: 'Tsumeb', lat: -19.2333, lon: 17.7167, region: 'Oshikoto' },
    { name: 'Otjiwarongo', lat: -20.4637, lon: 16.6477, region: 'Otjozondjupa' },
    { name: 'Outjo', lat: -20.1167, lon: 16.1500, region: 'Kunene' },
    { name: 'Mariental', lat: -24.6333, lon: 17.9667, region: 'Hardap' },
    { name: 'Keetmanshoop', lat: -26.5833, lon: 18.1333, region: 'ǁKaras' },
    { name: 'Gobabis', lat: -22.4500, lon: 18.9667, region: 'Omaheke' },
    { name: 'Swakopmund', lat: -22.6792, lon: 14.5272, region: 'Erongo' }
];

// ==========================================
// GET WEATHER FOR ONE REGION — REAL DATA
// ==========================================
async function getWeatherForRegion(region) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${region.lat}&longitude=${region.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,weather_code,precipitation,cloud_cover,pressure_msl,uv_index&hourly=temperature_2m,precipitation_probability,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,sunrise,sunset,uv_index_max&timezone=Africa/Windhoek&forecast_days=5`;
        
        const response = await axios.get(url, { timeout: 12000 });
        const data = response.data;
        const now = new Date();
        const hour = now.getHours();
        
        // Find current hour index in hourly data
        const currentHourIndex = data.hourly.time.findIndex(t => {
            const hourTime = new Date(t);
            return hourTime.getHours() === hour && hourTime.getDate() === now.getDate();
        });

        return {
            region: region.name,
            province: region.region,
            temperature: `${Math.round(data.current.temperature_2m)}°C`,
            feels_like: `${Math.round(data.current.apparent_temperature)}°C`,
            humidity: `${data.current.relative_humidity_2m}%`,
            wind_speed: `${Math.round(data.current.wind_speed_10m)} km/h`,
            wind_direction: getWindDirection(data.current.wind_direction_10m),
            rainfall: `${data.current.precipitation || 0}mm`,
            cloud_cover: `${data.current.cloud_cover || 0}%`,
            pressure: `${Math.round(data.current.pressure_msl || 1013)} hPa`,
            uv_index: data.current.uv_index || 0,
            forecast: getWeatherDescription(data.current.weather_code),
            rain_probability: `${data.daily.precipitation_probability_max[0] || 0}%`,
            sunrise: data.daily.sunrise[0] ? new Date(data.daily.sunrise[0]).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
            sunset: data.daily.sunset[0] ? new Date(data.daily.sunset[0]).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
            farming_advice: getFarmingAdvice(data.current.weather_code, data.daily.precipitation_probability_max[0], hour),
            best_farming_time: getBestFarmingTime(hour, data.current.temperature_2m, data.current.wind_speed_10m, data.current.uv_index),
            hourly_next_6h: currentHourIndex >= 0 ? data.hourly.time.slice(currentHourIndex, currentHourIndex + 6).map((t, i) => ({
                time: new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                temp: `${Math.round(data.hourly.temperature_2m[currentHourIndex + i])}°C`,
                rain: `${data.hourly.precipitation_probability[currentHourIndex + i] || 0}%`,
                wind: `${Math.round(data.hourly.wind_speed_10m[currentHourIndex + i])} km/h`
            })) : [],
            daily_forecast: data.daily.time.map((date, i) => ({
                date: date,
                day: new Date(date).toLocaleDateString('en-GB', { weekday: 'short' }),
                max_temp: `${Math.round(data.daily.temperature_2m_max[i])}°C`,
                min_temp: `${Math.round(data.daily.temperature_2m_min[i])}°C`,
                precipitation: `${data.daily.precipitation_sum[i] || 0}mm`,
                rain_chance: `${data.daily.precipitation_probability_max[i] || 0}%`,
                condition: getWeatherDescription(data.daily.weather_code[i]),
                sunrise: new Date(data.daily.sunrise[i]).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                sunset: new Date(data.daily.sunset[i]).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            })),
            updated: new Date().toISOString(),
            updated_time: now.toLocaleString('en-GB'),
            source: 'Open-Meteo',
            coordinates: `${region.lat}, ${region.lon}`
        };
    } catch (error) {
        console.error(`Weather error for ${region.name}:`, error.message);
        return {
            region: region.name,
            province: region.region,
            temperature: 'N/A',
            forecast: 'Data unavailable',
            error: true
        };
    }
}

function getWeatherDescription(code) {
    const codes = {
        0: '☀️ Clear Sky', 1: '🌤️ Mainly Clear', 2: '⛅ Partly Cloudy', 3: '☁️ Overcast',
        45: '🌫️ Foggy', 48: '🌫️ Rime Fog',
        51: '🌧️ Light Drizzle', 53: '🌧️ Moderate Drizzle', 55: '🌧️ Dense Drizzle',
        61: '🌧️ Slight Rain', 63: '🌧️ Moderate Rain', 65: '🌧️ Heavy Rain',
        71: '🌨️ Slight Snow', 73: '🌨️ Moderate Snow', 75: '🌨️ Heavy Snow',
        80: '🌧️ Slight Showers', 81: '🌧️ Moderate Showers', 82: '🌧️ Violent Showers',
        95: '⛈️ Thunderstorm', 96: '⛈️ Thunderstorm + Hail', 99: '⛈️ Severe Thunderstorm'
    };
    return codes[code] || '🌡️ Unknown';
}

function getWindDirection(degrees) {
    if (!degrees) return 'N/A';
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(degrees / 45) % 8];
}

function getFarmingAdvice(weatherCode, rainChance, hour) {
    if (weatherCode >= 95) return '⛈️ SEVERE: Stay indoors, protect livestock and crops';
    if (rainChance > 70) return '🌧️ Excellent planting day — rain expected';
    if (rainChance > 40) return '⛅ Good conditions — monitor soil moisture';
    if (hour >= 11 && hour <= 15) return '☀️ Peak heat — water crops early morning or evening';
    if (weatherCode === 0 || weatherCode === 1) return '☀️ Ideal for harvesting, weeding, and field work';
    if (weatherCode === 3) return '☁️ Great for planting, transplanting, and spraying';
    return '🌾 Good general farming conditions';
}

function getBestFarmingTime(hour, temp, wind, uv) {
    // Best times: early morning (6-10) and evening (16-19)
    if (hour >= 6 && hour <= 10) return '🌅 Early Morning — Perfect for planting and watering';
    if (hour >= 11 && hour <= 15) return '🔥 Midday — Rest, avoid heavy field work (UV high)';
    if (hour >= 16 && hour <= 19) return '🌆 Evening — Great for harvesting and animal care';
    if (hour >= 20 || hour <= 5) return '🌙 Night — Rest, low visibility for farm work';
    return '🌾 Check weather conditions';
}

// ==========================================
// GET ALL REGIONS — REAL DATA
// ==========================================
router.get('/', async (req, res) => {
    try {
        console.log('🌤️ Fetching real-time weather for Namibia...');
        const results = await Promise.all(
            FARMING_REGIONS.map(region => getWeatherForRegion(region))
        );
        console.log(`✅ Weather loaded for ${results.length} regions`);
        res.json({
            success: true,
            weather: results,
            source: 'Open-Meteo',
            country: 'Namibia',
            updated: new Date().toISOString(),
            updated_time: new Date().toLocaleString('en-GB')
        });
    } catch (err) {
        console.error('Weather error:', err.message);
        res.status(500).json({ success: false, message: 'Weather service unavailable' });
    }
});

// ==========================================
// GET WEATHER FOR ONE REGION
// ==========================================
router.get('/:region', async (req, res) => {
    try {
        const region = FARMING_REGIONS.find(r =>
            r.name.toLowerCase() === req.params.region.toLowerCase() ||
            r.region.toLowerCase() === req.params.region.toLowerCase()
        );
        if (!region) return res.status(404).json({ success: false, message: 'Region not found' });
        const weather = await getWeatherForRegion(region);
        res.json({ success: true, weather });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;