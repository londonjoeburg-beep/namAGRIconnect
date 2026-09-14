// ==========================================
// CRISIS DETECTION ENGINE
// ==========================================

const crisisKeywords = {
    critical: ['emergency', 'disaster', 'catastrophe', 'collapse', 'outbreak', 'war', 'attack'],
    high: ['crisis', 'scandal', 'corruption', 'protest', 'strike', 'shutdown', 'murder', 'death'],
    medium: ['concern', 'problem', 'issue', 'delay', 'shortage', 'complaint', 'dispute'],
    low: ['question', 'debate', 'discussion', 'review', 'reviewing']
};

const crisisCategories = {
    health: ['hospital', 'clinic', 'disease', 'covid', 'outbreak', 'medicine', 'doctor'],
    education: ['school', 'university', 'student', 'teacher', 'exam', 'education'],
    economy: ['unemployment', 'inflation', 'recession', 'poverty', 'job losses'],
    security: ['crime', 'police', 'murder', 'robbery', 'attack', 'violence'],
    infrastructure: ['water', 'electricity', 'road', 'bridge', 'housing', 'load shedding'],
    politics: ['corruption', 'scandal', 'protest', 'strike', 'resignation'],
    environment: ['drought', 'flood', 'fire', 'pollution', 'climate'],
    agriculture: ['crop failure', 'livestock', 'locust', 'disease']
};

// ==========================================
// DETECT CRISIS LEVEL
// ==========================================
function detectCrisisLevel(text) {
    const lower = text.toLowerCase();
    
    // Check for critical keywords
    if (crisisKeywords.critical.some(k => lower.includes(k))) {
        return { level: 'critical', severity: 4, category: categorizeCrisis(text) };
    }
    
    // Check for high severity
    if (crisisKeywords.high.some(k => lower.includes(k))) {
        return { level: 'high', severity: 3, category: categorizeCrisis(text) };
    }
    
    // Check for medium
    if (crisisKeywords.medium.some(k => lower.includes(k))) {
        return { level: 'medium', severity: 2, category: categorizeCrisis(text) };
    }
    
    // Check for low
    if (crisisKeywords.low.some(k => lower.includes(k))) {
        return { level: 'low', severity: 1, category: categorizeCrisis(text) };
    }
    
    return { level: 'none', severity: 0, category: 'general' };
}

// ==========================================
// CATEGORIZE CRISIS
// ==========================================
function categorizeCrisis(text) {
    const lower = text.toLowerCase();
    
    for (const [category, keywords] of Object.entries(crisisCategories)) {
        if (keywords.some(k => lower.includes(k))) {
            return category;
        }
    }
    return 'general';
}

// ==========================================
// GENERATE ALERT
// ==========================================
function generateAlert(article, sentiment, crisisLevel) {
    if (crisisLevel.level === 'none') return null;
    
    return {
        type: crisisLevel.category,
        message: `[${crisisLevel.level.toUpperCase()}] ${article.title.substring(0, 100)}`,
        severity: crisisLevel.level,
        articleId: article.id,
        createdAt: new Date().toISOString()
    };
}

// ==========================================
// GET CRISIS SUMMARY
// ==========================================
function getCrisisSummary(articles) {
    const summary = {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        none: 0,
        categories: {}
    };
    
    articles.forEach(article => {
        const level = detectCrisisLevel(article.title);
        summary[level.level]++;
        
        if (!summary.categories[level.category]) {
            summary.categories[level.category] = 0;
        }
        summary.categories[level.category]++;
    });
    
    return summary;
}

module.exports = { 
    detectCrisisLevel, 
    categorizeCrisis, 
    generateAlert, 
    getCrisisSummary 
};