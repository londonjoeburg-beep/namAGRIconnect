const Sentiment = require('sentiment');
const sentiment = new Sentiment();

// Namibian context keywords (expand as needed)
const namibianContext = {
    // Positive words
    'development': 2,
    'progress': 2,
    'success': 3,
    'achievement': 3,
    'improvement': 2,
    'growth': 2,
    'opportunity': 2,
    'investment': 2,
    'partnership': 2,
    'support': 2,
    'empowerment': 2,
    'innovation': 2,
    'excellent': 3,
    'outstanding': 3,
    'victory': 3,
    'celebration': 2,
    
    // Negative words
    'corruption': -4,
    'scandal': -4,
    'crisis': -4,
    'protest': -2,
    'strike': -2,
    'unemployment': -3,
    'poverty': -3,
    'drought': -3,
    'flood': -3,
    'crime': -3,
    'murder': -5,
    'accident': -2,
    'failure': -3,
    'collapse': -4,
    'shortage': -2,
    'delay': -1,
    'poor': -2,
    'bad': -2,
    'worse': -3,
    'worst': -4,
    'angry': -2,
    'frustrated': -2,
    'disappointed': -2,
    'concern': -1,
    'worry': -1,
    'fear': -2,
    'threat': -3,
    'danger': -3,
};

// ==========================================
// ANALYZE SENTIMENT
// ==========================================
function analyzeSentiment(text) {
    if (!text) return { label: 'neutral', score: 0 };

    // Get base sentiment
    const result = sentiment.analyze(text, { extras: namibianContext });
    
    // Normalize score based on text length
    const wordCount = text.split(/\s+/).length;
    const normalizedScore = wordCount > 0 ? result.score / Math.sqrt(wordCount) : result.score;

    let label = 'neutral';
    if (normalizedScore >= 1) label = 'positive';
    else if (normalizedScore <= -1) label = 'negative';

    return {
        label,
        score: parseFloat(normalizedScore.toFixed(2)),
        comparative: result.comparative,
        positive: result.positive,
        negative: result.negative
    };
}

// ==========================================
// DETECT CRISIS
// ==========================================
function detectCrisis(text, threshold = -3) {
    const result = analyzeSentiment(text);
    return {
        isCrisis: result.score <= threshold,
        severity: result.score <= -5 ? 'critical' : result.score <= -3 ? 'high' : result.score <= -1 ? 'medium' : 'low',
        sentiment: result
    };
}

// ==========================================
// BATCH ANALYSIS
// ==========================================
function analyzeBatch(articles) {
    return articles.map(article => ({
        ...article,
        sentiment: analyzeSentiment(article.title || article.content)
    }));
}

module.exports = { analyzeSentiment, detectCrisis, analyzeBatch };