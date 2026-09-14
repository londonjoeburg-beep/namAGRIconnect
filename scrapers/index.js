const axios = require('axios');
const cheerio = require('cheerio');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const NEWS_SOURCES = [
    { name: 'Namibian Sun', url: 'https://www.namibiansun.com/', baseUrl: 'https://www.namibiansun.com' },
    { name: 'The Namibian', url: 'https://www.namibian.com.na/', baseUrl: 'https://www.namibian.com.na' },
    { name: 'New Era', url: 'https://neweralive.na/', baseUrl: 'https://neweralive.na' },
    { name: 'Future Media News', url: 'https://futuremedianews.com.na/', baseUrl: 'https://futuremedianews.com.na' },
    { name: 'The Brief', url: 'https://thebrief.com.na/', baseUrl: 'https://thebrief.com.na' }
];

function categorizeArticle(title) {
    const l = title.toLowerCase();
    if (l.includes('health') || l.includes('hospital') || l.includes('covid')) return 'Health';
    if (l.includes('education') || l.includes('school') || l.includes('student')) return 'Education';
    if (l.includes('economy') || l.includes('business') || l.includes('money')) return 'Economy';
    if (l.includes('politics') || l.includes('government') || l.includes('minister')) return 'Politics';
    if (l.includes('crime') || l.includes('police') || l.includes('court')) return 'Crime';
    if (l.includes('sport') || l.includes('football')) return 'Sports';
    if (l.includes('water') || l.includes('drought') || l.includes('flood')) return 'Environment';
    return 'General';
}

async function scrapeSource(db, source) {
    try {
        console.log(`📰 Scraping ${source.name}...`);
        const response = await axios.get(source.url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 15000
        });
        const $ = cheerio.load(response.data);
        const articles = [];
        const seen = new Set();

        $('article, h2 a, h3 a, .story a, .headline a').each((i, el) => {
            let title = $(el).text().trim().replace(/\s+/g, ' ');
            let url = $(el).attr('href') || $(el).find('a').attr('href');
            
            if (title && title.length > 15 && title.length < 250 && !seen.has(title)) {
                seen.add(title);
                if (url && !url.startsWith('http')) {
                    url = source.baseUrl + (url.startsWith('/') ? url : '/' + url);
                }
                articles.push({ title, source: source.name, url: url || source.url });
            }
        });

        const top = articles.slice(0, 12);
        for (const a of top) {
            const s = sentiment.analyze(a.title);
            let label = 'neutral';
            if (s.score > 0) label = 'positive';
            else if (s.score < 0) label = 'negative';
            
            const category = categorizeArticle(a.title);
            
            await new Promise(r => db.run(
                `INSERT INTO articles (title, source, url, sentiment, sentiment_score, category) VALUES (?, ?, ?, ?, ?, ?)`,
                [a.title, a.source, a.url, label, s.score, category],
                () => r()
            ));
        }
        
        console.log(`✅ ${source.name}: ${top.length} articles`);
        return top.length;
    } catch (err) {
        console.error(`❌ ${source.name}:`, err.message);
        return 0;
    }
}

async function scrapeAll(db) {
    let total = 0;
    for (const source of NEWS_SOURCES) {
        total += await scrapeSource(db, source);
        await new Promise(r => setTimeout(r, 800));
    }
    console.log(`✅ Total: ${total} articles`);
    return { total };
}

module.exports = { scrapeAll, scrapeSource };