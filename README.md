*AI-Powered Media Monitoring, Sentiment Analysis & Police Public Safety Platform**

---

## 🎯 Overview

Namibia Media Monitor is a full-stack web platform that:
- Monitors 6+ Namibian news sources in real-time
- Performs AI-powered sentiment analysis
- Detects crises and urgent issues
- Provides a secure Police Notice Board (verified officers only)
- Integrates 20+ Namibian radio stations and TV broadcasters

## ✨ Features

### For Citizens
- 📰 One-stop news hub (all Namibian media)
- 🚨 Real-time police safety alerts
- 📻 20+ radio stations (click to visit)
- 📺 TV & newspaper directories
- 🌓 Dark/Light mode

### For Police Officers
- 🚔 Verified posting (badge number required)
- 📸 Image upload (missing persons, suspects)
- 📁 Case number tracking
- ⚠️ Multiple notice types (alert, missing, wanted, traffic, crime)

### For Admins
- 📊 Full dashboard with statistics
- 🚨 Post urgent alerts
- 👥 User management
- 📈 Sentiment analytics

## 🛠 Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | SQLite3 |
| Auth | bcryptjs |
| Scraping | Axios, Cheerio |
| Sentiment | Sentiment.js |
| Charts | Chart.js |
| Scheduling | node-cron |
| Hosting | Railway |

## 🚀 Installation

```bash
git clone https://github.com/londonjoeburg-beep/namAGRIconnect.git
cd namAGRIconnect
npm install express cors sqlite3 bcryptjs node-cron axios cheerio sentiment dotenv
npm start
Open http://localhost:3000

🔐 Default Credentials
Role	Username	Password
👑 Admin	admin	admin123
🚔 Police	officer	police123
📁 Project Structure
text
NamibiaMediaMonitor/
├── server.js              # Main backend
├── package.json           # Dependencies
├── README.md              # This file
├── PROPOSAL.md            # Complete proposal
├── database/
│   └── media.db          # SQLite database
├── scrapers/
│   └── index.js          # News scrapers
├── analysis/
│   └── sentiment.js      # Sentiment engine
└── public/
    ├── index.html        # Main page
    ├── styles.css        # Styling
    ├── app.js            # Frontend logic
    └── uploads/          # Uploaded images
📊 API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login
GET	/api/articles	Get all articles + police posts
GET	/api/police	Get police notices
POST	/api/police	Post notice (police/admin)
GET	/api/radio	Get radio stations
GET	/api/media	Get newspapers & TV
GET	/api/stats	Get sentiment stats
POST	/api/scrape	Trigger scraping
🎯 Purpose
Namibia Media Monitor is designed to:

Track how government and institutions are represented in media

Detect crises and emerging issues in real-time

Provide a secure, verified channel for police public safety notices

Give citizens a single, trusted source for news and safety information

👨‍💻 Developer
HAUFIKU PETITS PANDULENIOMWENE

Student Number: 2024049747

Institution: Triumphant College Namibia

Supervisor: MR P.K PULENI

📄 License
ISC License

© 2026 Haufiku Petits Panduleniomwene

Namibia Media Monitor — Connecting Namibia's Media, Government, and Public Safety

text

---

## 📄 FILE 2: UPDATE `PROPOSAL.md`

**Replace your ENTIRE `PROPOSAL.md` with this:**

```markdown
# NAMIBIA MEDIA MONITOR

## An AI-Powered Media Monitoring, Sentiment Analysis & Police Public Safety Platform

---

### A Research Proposal

---

**Developed by:** HAUFIKU PETITS PANDULENIOMWENE

**Student Number:** 2024049747

**Institution:** TRIUMPHANT COLLEGE NAMIBIA

**Supervisor:** MR P.K PULENI

**Date:** September 2026

**Version:** 1.0

---

## EXECUTIVE SUMMARY

**Namibia Media Monitor** is a comprehensive web-based platform that addresses two critical national challenges:

1. **Media Monitoring Gap** — There is no reliable way to track how government and institutions are represented across the media landscape
2. **Public Safety Communication** — Police lack a modern digital platform to communicate urgent notices to the public

**Our Solution:** A single, integrated platform that:

- 🔍 Monitors 6+ Namibian news sources in real-time
- 📊 Performs AI-powered sentiment analysis on every article
- 🚨 Detects crises and urgent issues automatically
- 🚔 Provides a secure Police Notice Board (verified officers only)
- 📻 Integrates 20+ Namibian radio stations
- 📺 Provides access to TV and media streams
- 🎯 Generates a professional dashboard for decision-makers

---

## 1. INTRODUCTION

### 1.1 Background

Namibia's media landscape is diverse and dynamic. According to the Media Institute of Southern Africa (MISA), Namibia has:

- 6+ major newspapers (The Namibian, Namibian Sun, New Era, etc.)
- 20+ radio stations broadcasting in multiple languages
- Multiple TV broadcasters (NBC, One Africa TV, etc.)
- Growing digital and social media presence

However, **no single integrated system exists** to:

- Track how government is represented across all these platforms
- Detect emerging crises in real-time
- Analyze public sentiment
- Provide a secure, verified channel for police to communicate urgent information

### 1.2 Problem Statement

**Two interconnected problems exist:**

**Problem 1: Information Monitoring Gap**
Government cannot track crisis signals across media in real-time. By the time issues are identified, they have already escalated.

**Problem 2: Public Safety Communication Gap**
Police have no modern, verifiable digital platform to:
- Post urgent alerts (missing persons, wanted suspects, traffic advisories)
- Reach citizens in real-time
- Ensure information integrity (only verified officers can post)

### 1.3 Our Vision

To create **one unified platform** that:

- Gives government real-time media intelligence
- Gives police a trusted public communication channel
- Gives citizens a single source of truth for news + safety
- Uses AI to detect crises before they escalate

---

## 2. PROPOSED SOLUTION

### 2.1 Platform Overview

**Namibia Media Monitor** is a full-stack web application with the following architecture:
┌─────────────────────────────────────────────────────────────────┐
│ USERS │
│ Citizens · Police Officers · Admins · Government │
└─────────────────────────────┬───────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND │
│ HTML5 · CSS3 · JavaScript · Chart.js · Responsive │
│ Role-based UI (Admin · Police · User) │
└─────────────────────────────┬───────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND API │
│ Node.js · Express.js · bcryptjs · node-cron │
│ Session tokens · Role middleware │
└─────────────────────────────┬───────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ DATABASE │
│ SQLite3 · 7 relational tables │
└─────────────────────────────────────────────────────────────────┘

text

### 2.2 Key Features

#### 🔍 Media Monitoring
- Automated scraping of 6 major Namibian news sources
- Scraping runs automatically every 10 minutes
- Categorizes articles (Politics, Health, Crime, Economy, etc.)
- Source attribution and direct links

#### 📊 Sentiment Analysis
- AI-powered sentiment scoring (positive / negative / neutral)
- Custom Namibian-context dictionary
- Real-time visualizations via charts
- Crisis detection based on negative sentiment spikes

#### 🚔 Police Notice Board
- **Role-based authentication** — Only verified police officers can post
- **Badge number verification** during registration
- **Notice types:** Missing Person, Wanted, Traffic, Crime Alert, General
- **Image upload** for suspect/missing person photos
- **Case number** tracking
- Posts appear immediately in News feed with priority styling

#### 🚨 Urgent Alerts
- Admin + Police can post urgent news
- Priority levels: Normal · High · Critical
- Animated ticker displays latest alerts
- Color-coded banners (Red = Critical)

#### 📻 Radio Directory
- 20 Namibian radio stations integrated
- One-click to visit station websites
- Includes NBC, Omulunga, Shipi FM, Kati FM, Fresh FM, etc.

#### 📺 Media Directory
- Newspaper directory (6+ publications)
- TV broadcasters (NBC, One Africa)
- All links verified

#### 🎨 Professional UI
- Dark / Light mode toggle
- Animated background (flying headlines)
- News ticker with slow scroll
- Responsive design (mobile + desktop)
- Police notices styled in blue (trust)
- Urgent posts styled in red (attention)

### 2.3 Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend | HTML5, CSS3, JavaScript |
| Charts | Chart.js |
| Backend | Node.js, Express.js |
| Database | SQLite3 |
| Authentication | bcryptjs |
| Web Scraping | Axios, Cheerio |
| Sentiment | Sentiment.js |
| Scheduling | node-cron |
| Hosting | Railway |

---

## 3. PROBLEM-TO-SOLUTION MAPPING

| Challenge | Our Solution |
|-----------|-------------|
| Monitor print media daily | Automated scraping every 10 minutes |
| Monitor multiple media types | Newspaper + radio/TV directories |
| Detect crises and issues | Sentiment threshold detection |
| Classify by sentiment | AI-powered positive/negative/neutral |
| Generate dashboard with key stories | Real-time dashboard with charts |
| Support timely decision-making | Police notice board + urgent posts |

---

## 4. INNOVATION & UNIQUENESS

### 4.1 What Makes This Solution Unique

**1. Integration of Media Monitoring + Police Public Safety**
- First platform to combine both in Namibia
- Trusted source for verified police information
- Real-time crisis detection + real-time public alerts

**2. Information Integrity**
- Role-based access control (RBAC)
- Only verified police (with badge numbers) can post notices
- Only admins can modify urgent content
- Prevents misinformation

**3. Namibian Context**
- Custom sentiment dictionary with local terms
- All Namibian sources (6 newspapers, 20 radio, 2 TV)
- Multi-language support ready (Oshiwambo, Afrikaans planned)

**4. Real-Time Automated Intelligence**
- 10-minute auto-scrape cycle
- Crisis detection before escalation
- Historical data for trend analysis

**5. Accessibility**
- Works on any device (mobile + desktop)
- Dark/Light mode
- Simple, clean UI
- Fast loading

---

## 5. IMPACT & BENEFITS

### 5.1 For Government
- 📊 **Real-time media intelligence** for decision-makers
- 🚨 **Early crisis warning** system
- 📈 **Data-driven policy** insights
- 🎯 **Proactive communication** capability

### 5.2 For Namibian Police
- 🚔 **Modern digital** communication channel
- 🎯 **Direct citizen engagement**
- 🔒 **Verified, trusted** information channel
- 📸 **Image uploads** for missing persons / suspects

### 5.3 For Citizens
- 📰 **One-stop news hub** for all Namibian media
- 🚨 **Real-time safety alerts** from police
- 🎯 **Trusted information** (verified sources only)
- 🆓 **Free access** to all features

### 5.4 For National Development
- 🇳🇦 **Supports digital transformation** goals
- 📊 **Improves governance** through data
- 🚔 **Enhances public safety**
- 💡 **Demonstrates** local tech innovation

---

## 6. TECHNICAL IMPLEMENTATION

### 6.1 Database Schema (7 Tables)
users — Authentication + role management
articles — Scraped news with sentiment
alerts — Auto-generated crisis alerts
urgent_posts — Admin/police urgent posts
police_notices — Verified police notices
radio_stations — 20 Namibian radio stations
media_sources — Newspapers, TV

text

### 6.2 Authentication & Security
- **Password hashing** with bcryptjs (10 rounds)
- **Session tokens** via custom auth header
- **Role-based middleware** for protected routes
- **Input validation** on all POST endpoints
- **Ownership checks** — Police can only delete their own posts

### 6.3 Scraping Module
- **6 news sources** configured
- **Cheerio** for HTML parsing
- **Sentiment.js** for immediate analysis
- **Auto-categorization** based on keywords
- **Duplicate prevention** using title matching

### 6.4 Auto-Scrape Scheduling
Runs every 10 minutes via node-cron — scrapes all sources, analyzes sentiment, generates alerts.

### 6.5 Deployment
- **Backend:** Node.js on Railway
- **Database:** SQLite (persistent volume)
- **Frontend:** Static serving from Express
- **Version Control:** Git + GitHub

---

## 7. DEVELOPMENT TIMELINE

| Phase | Deliverable |
|-------|-------------|
| Phase 1: Research & Design | Architecture + Database schema |
| Phase 2: Backend Development | API endpoints + Auth system |
| Phase 3: Scrapers & Sentiment | Automated news collection |
| Phase 4: Frontend Development | UI + Dashboard + Police Board |
| Phase 5: Testing & Polish | Bug fixes + Optimization |
| Phase 6: Deployment | Live on Railway |

---

## 8. BUDGET

| Item | Cost (N$) |
|------|-----------|
| Domain name (1 year) | 250 |
| Hosting (Railway - FREE tier) | 0 |
| Development tools (VS Code - FREE) | 0 |
| GitHub (FREE tier) | 0 |
| Internet & Data | 500 |
| Printing & Documentation | 300 |
| **TOTAL** | **N$1,050** |

**This solution is extraordinarily cost-effective** because it uses free cloud hosting, free development tools, and open-source libraries.

---

## 9. SUCCESS METRICS

| Metric | Target |
|--------|--------|
| Articles scraped per day | 200+ |
| Sources monitored | 6+ |
| Sentiment accuracy | 85%+ |
| Police notices posted (test) | 10+ |
| Platform uptime | 99%+ |
| Response time | < 2 seconds |
| Mobile responsiveness | 100% |

---

## 10. FUTURE ENHANCEMENTS

| Feature | Priority |
|---------|----------|
| **SMS Alerts** — Send urgent alerts via SMS | High |
| **USSD Integration** — Access via *123# for feature phones | High |
| **Mobile App** — Native Android/iOS apps | Medium |
| **Multi-language** — Oshiwambo, Afrikaans, Damara | Medium |
| **AI Crisis Prediction** — ML models for forecasting | Medium |
| **Social Media Monitoring** — Twitter/X, Facebook scraping | Medium |
| **WhatsApp Integration** — Broadcast police notices | Low |
| **Real-time Radio Streams** — Live audio playback | Low |
| **Blockchain Verification** — Tamper-proof police posts | Low |

---

## 11. DEVELOPER

**HAUFIKU PETITS PANDULENIOMWENE**

**Student Number:** 2024049747

**Institution:** Triumphant College Namibia

**Supervisor:** MR P.K PULENI

**Skills:**
- Full-stack web development (Node.js, Express, SQLite)
- Frontend (HTML5, CSS3, JavaScript)
- Web scraping (Axios, Cheerio)
- Git & GitHub
- UI/UX Design

**Previous Project:** AgriConnect Namibia (full-stack farming platform, deployed on Railway)

---

## 12. CONCLUSION

**Namibia Media Monitor** solves two critical national problems in one elegant platform:

1. **Real-time media intelligence** for government
2. **Verified public safety communication** for police

By combining AI-powered sentiment analysis with secure role-based content publishing, we deliver a platform that is:

- ✅ **Trusted** — Only verified sources and officers
- ✅ **Real-time** — 10-minute auto-updates
- ✅ **Comprehensive** — 6+ newspapers, 20+ radio, 2 TV
- ✅ **Accessible** — Works on any device
- ✅ **Affordable** — Costs under N$1,100 to operate

**We are ready to build, test, and deliver.**

---

## 13. REFERENCES

Africa's Talking. (2023). USSD and SMS API Documentation. Nairobi: Africa's Talking.

Ministry of Information and Communication Technology. (2026). National ICT Summit Challenge Brief. Windhoek: MICT.

MISA Namibia. (2024). State of the Media in Namibia Report. Windhoek: MISA.

Namibia Statistics Agency. (2023). Namibia Labour Force Survey. Windhoek: NSA.

NBC. (2024). Broadcasting Statistics Report. Windhoek: NBC.

---

**Prepared by:** HAUFIKU PETITS PANDULENIOMWENE

**Date:** September 2026

**Version:** 1.0

**Status:** Ready for Review

---

**© 2026 Haufiku Petits Panduleniomwene**

**Namibia Media Monitor — Connecting Namibia's Media, Government, and Public Safety*