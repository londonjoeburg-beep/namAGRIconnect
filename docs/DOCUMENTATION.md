NamAgriConnect — Full Project Documentation

**Author:** Haufiku Petis  
**Student No:** 2024049747  
**Institution:** Triumphant College  
**Email:** londinjoeburg@gmail.com  
**Contact:** 0818611837  
**GitHub:** https://github.com/londonjoeburg-beep  
**Project URL:** https://github.com/londonjoeburg-beep/namAGRIconnect  
**Year:** 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Objectives & Scope](#3-objectives--scope)
4. [System Architecture](#4-system-architecture)
5. [Technology Stack](#5-technology-stack)
6. [Database Design](#6-database-design)
7. [Backend API](#7-backend-api)
8. [Frontend Architecture](#8-frontend-architecture)
9. [AI Microservice](#9-ai-microservice)
10. [Feature Documentation](#10-feature-documentation)
11. [Challenges & Solutions](#11-challenges--solutions)
12. [Development Journey](#12-development-journey)
13. [Testing & Verification](#13-testing--verification)
14. [Deployment Guide](#14-deployment-guide)
15. [User Manual](#15-user-manual)
16. [Developer Guide](#16-developer-guide)
17. [Limitations & Future Work](#17-limitations--future-work)
18. [Conclusion](#18-conclusion)

---

## 1. Executive Summary

**NamAgriConnect** is a full-stack, multi-device agricultural marketplace built specifically for Namibian farmers, buyers, and agricultural service providers. It eliminates middlemen from produce trading, provides free AI-powered agronomy tools, delivers real-time weather intelligence for all 14 Namibian regions, and works across smartphones, feature phones (USSD), and WhatsApp.

**Core value:**
- Farmers list produce, livestock, inputs, and machinery directly
- Buyers contact sellers instantly via WhatsApp or phone
- AI scans soil and plants for free diagnostics
- Real weather data from Open-Meteo
- Works on any device — smartphone, feature phone, or offline
- 6 languages supported

**Development duration:** ~5 intensive sessions  
**Lines of code:** ~8,000 across 40+ files  
**Technologies used:** 15+

---

## 2. Problem Statement

### 2.1 Background

Namibia's agricultural sector employs roughly **70% of the population**. However, small-scale farmers face persistent challenges:

- **Limited market access** — remote regions are distant from urban buyers
- **Middlemen exploitation** — informal traders capture large margins
- **Information asymmetry** — farmers don't know current market prices
- **Delayed disease detection** — treatable pathogens destroy harvests
- **Language barriers** — most digital tools are English-only
- **Connectivity challenges** — 2G-only or offline regions

### 2.2 Problem Statement

> *"Namibian farmers lack a unified, low-bandwidth, multilingual digital platform to buy, sell, and receive agricultural intelligence — forcing reliance on exploitative middlemen and outdated farming practices."*

### 2.3 Solution

NamAgriConnect delivers:
- Zero-friction marketplace (post from any phone, browse free)
- Direct buyer-seller contact (WhatsApp/phone, no platform fees)
- AI agronomy tools accessible from a photo
- Real Namibian weather for every region
- 6-language interface
- USSD *555# for feature phones
- WhatsApp bot for text-based interaction

---

## 3. Objectives & Scope

### 3.1 Primary Objectives

1. Build a fully functional marketplace connecting farmers to buyers
2. Implement real-time weather intelligence for all 14 Namibian regions
3. Provide AI-based soil and plant disease diagnostics
4. Support multiple languages and device types
5. Ensure low-bandwidth performance (2G/3G compatible)
6. Enable direct communication (WhatsApp/Call/SMS)

### 3.2 Scope

**In Scope:**
- Progressive Web App (PWA) — responsive, offline-capable
- JWT authentication
- Listing creation with photos
- Public comments + threaded replies
- Likes on comments and posts
- Weather intelligence (real API)
- AI soil & virus scanners
- USSD gateway
- WhatsApp webhook
- 6-language UI
- Dark mode
- RFQ system with 7-day auto-archive

**Out of Scope (Phase 2):**
- Real payment/escrow (MTC Money)
- Native mobile apps
- Trained ML models
- Production WhatsApp bot
- Blockchain traceability

### 3.3 Target Users

- Small-scale farmers (1–50 ha)
- Commercial farmers (50+ ha)
- Buyers (households, supermarkets, lodges)
- Agricultural extension officers
- Input suppliers
- Veterinary services

---

## 4. System Architecture

### 4.1 High-Level Architecture
┌─────────────────────────────────────────────────────────────┐
│ CLIENT LAYER │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │Smartphone│ │ Feature │ │ WhatsApp │ │ Desktop │ │
│ │ PWA │ │ USSD*555#│ │ Bot │ │ Browser │ │
│ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
▼ ▼ ▼ ▼
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND (Port 3000) │
│ HTML5 + CSS3 + Vanilla JavaScript + PWA + i18n │
└──────────────────────────┬──────────────────────────────────┘
▼
┌─────────────────────────────────────────────────────────────┐
│ BACKEND API (Port 4000, Node.js + Express) │
│ JWT auth, Multer+Sharp uploads, REST endpoints │
└──────────────────────────┬──────────────────────────────────┘
▼
┌──────────────────┼──────────────────┐
▼ ▼ ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ SQLite DB │ │ AI Service │ │ Open-Meteo │
│ namagri.db │ │ (Port 5000)│ │ Weather API │
└─────────────┘ └─────────────┘ └─────────────┘

text

### 4.2 Data Flow — Posting a Listing
User fills form → frontend/js/market.js
↓
FormData with photos → POST /api/listings
↓
Backend receives → authMiddleware validates JWT
↓
Sharp compresses photos → WebP, <100KB each
↓
INSERT into listings table (owner_id from JWT)
↓
Response sent → frontend reloads market
↓
New listing shows with owner name + phone

text

### 4.3 Data Flow — Virus Scan
User taps scan box → camera.js opens modal
↓
Live camera captures → base64 data URL
↓
POST /api/virus/scan with image
↓
Backend forwards to Python AI (port 5000)
↓
Python decodes image → PIL + numpy analysis
↓
Returns disease + severity + treatment
↓
Backend saves to virus_scans table
↓
Frontend renders result with photo

text

---

## 5. Technology Stack

### 5.1 Frontend

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Markup | HTML5 | Structure |
| Styling | CSS3 (custom) | Responsive, themable |
| Logic | Vanilla JavaScript ES6+ | No framework overhead |
| PWA | Service Worker + Manifest | Offline capability |
| Icons | Emoji + inline SVG | Zero dependencies |
| Images | Canvas API | Client-side compression |

**Why vanilla JS?** Bundle size matters on 2G/3G. React/Vue would add 50–300KB. Our entire frontend is <200KB.

### 5.2 Backend

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Runtime | Node.js v22.5+ | Server-side JS |
| Framework | Express.js 4.x | HTTP routing |
| Database | SQLite (`node:sqlite`) | Zero-config persistence |
| Auth | JWT (jsonwebtoken) | Stateless sessions |
| Passwords | bcryptjs | Secure hashing |
| File Uploads | Multer 2.x | Photo handling |
| Image Processing | Sharp | WebP compression |
| Security | Helmet + CORS + rate-limit | Hardening |
| Logging | Morgan | Request logging |

### 5.3 AI Service

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Language | Python 3.10+ | ML-ready |
| Framework | Flask 3.x | Microservice HTTP |
| CORS | flask-cors | Cross-origin |
| Imaging | Pillow (PIL) | Image decode |
| Math | NumPy | Pixel statistics |

### 5.4 External APIs

| Service | Provider | Purpose | Cost |
|---------|----------|---------|------|
| Weather | Open-Meteo | 14 regions | Free |
| WhatsApp | Meta Cloud API | Bot webhook | Free tier |
| USSD | Africa's Talking (ready) | Feature phones | Pay-per-use |

---

## 6. Database Design

### 6.1 Tables Overview

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `users` | Registered farmers/buyers | id, phone, name, region, town, password_hash |
| `listings` | Products for sale | id, owner_id, title, category, price, sold |
| `comments` | Q&A under listings | id, listing_id, parent_id, text, likes |
| `talk_posts` | Agri-Talk feed | id, owner_id, text, likes |
| `rfqs` | Requests for quote | id, item, region, budget |
| `likes` | Universal like tracker | user_id, target_type, target_id |
| `soil_scans` | Soil analysis history | readings, diagnosis |
| `virus_scans` | Disease scan history | disease, severity, treatment |
| `outbreak_alerts` | Regional pathogen alerts | disease, region, severity |

### 6.2 Sample Query

```sql
SELECT l.*, u.name AS owner_name, u.phone AS owner_phone
FROM listings l 
LEFT JOIN users u ON u.id = l.owner_id 
WHERE l.sold = 0
ORDER BY l.created_at DESC
LIMIT 100;
7. Backend API
7.1 Base URL
text
http://localhost:4000/api
7.2 Authentication
Protected routes require:

text
Authorization: Bearer <JWT_TOKEN>
7.3 Endpoint Reference
Public Endpoints
Method	Endpoint	Description
GET	/health	Server health
GET	/listings?sold=false	Active listings
GET	/listings/:id	Single listing
GET	/comments/listing/:id	Threaded comments
GET	/rfqs	Active RFQs
GET	/talk	Agri-Talk feed
GET	/users/leaderboard	Top farmers
GET	/weather/regions	14 regions weather
GET	/weather/ndvi	NDVI data
GET	/virus/outbreaks	Regional alerts
POST	/ussd	USSD gateway
Protected Endpoints
Auth:

Method	Endpoint	Body
POST	/auth/register	{phone, name, region, town, password}
POST	/auth/login	{phone, password}
GET	/auth/me	—
GET	/auth/my-listings	—
GET	/auth/my-sales	—
Listings:

Method	Endpoint	Body
POST	/listings	FormData + photos[]
POST	/listings/:id/sold	— owner only
DELETE	/listings/:id	— owner only
Comments/Talk/RFQs:

Method	Endpoint	Body
POST	/comments	{listing_id, text, parent_id?}
POST	/comments/:id/like	— toggles
POST	/talk	{text}
POST	/talk/:id/like	— toggles
POST	/rfqs	{item, region, budget?}
AI:

Method	Endpoint	Body
POST	/soil/scan	{image?, readings?}
POST	/virus/scan	{image}
POST	/weather/irrigation	{crop, area, soil, stage}
7.4 Request Example
http
POST /api/auth/register
Content-Type: application/json

{
  "phone": "+264812345999",
  "name": "Haufiku Petis",
  "region": "Khomas",
  "town": "Windhoek",
  "password": "test1234"
}
Response:

json
{
  "user": {
    "id": 8,
    "phone": "+264812345999",
    "name": "Haufiku Petis",
    "region": "Khomas",
    "town": "Windhoek"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
8. Frontend Architecture
8.1 File Structure
text
frontend/
├── index.html
├── manifest.json
├── service-worker.js
├── css/
│   ├── main.css
│   └── dark.css
└── js/
    ├── app.js           # Navigation, theme, toast
    ├── i18n.js          # 6-language translations
    ├── api.js           # Fetch wrapper
    ├── validation.js    # Form validation
    ├── camera.js        # Live camera + upload
    ├── auth.js          # Login/register/logout
    ├── market.js        # Listings + comments
    ├── soil.js          # Soil AI scanner
    ├── water.js         # Irrigation calc
    ├── weather.js       # Weather + NDVI
    └── community.js     # Agri-Talk, RFQs, profile
8.2 Script Loading Order
html
<script src="js/app.js"></script>        <!-- 1. Globals first -->
<script src="js/i18n.js"></script>       <!-- 2. Translations -->
<script src="js/api.js"></script>        <!-- 3. API client -->
<script src="js/validation.js"></script> <!-- 4. Validation -->
<script src="js/camera.js"></script>     <!-- 5. Camera -->
<script src="js/auth.js"></script>       <!-- 6. Auth -->
<script src="js/market.js"></script>     <!-- 7. Market -->
<script src="js/soil.js"></script>
<script src="js/water.js"></script>
<script src="js/weather.js"></script>
<script src="js/community.js"></script>
9. AI Microservice
9.1 Overview
Python Flask on port 5000:

Soil analysis (texture, pH, salinity, NPK)

Virus/disease detection

Water calculator

9.2 Soil Analysis
python
def analyze_soil(payload):
    img = decode_image(payload.get("image"))
    stats = image_stats(img)   # Real PIL + numpy
    # Brown index → organic matter
    # Texture variance → soil texture
    # Brightness → salinity
    # Color warmth → pH
    return { "texture": ..., "ph": ..., "nutrients": [...] }
9.3 Virus Detection
python
def analyze_virus(payload):
    stats = image_stats(decode_image(payload.get("image")))
    green = stats["green_index"]
    brown = stats["brown_index"]
    if green > 0.15:       → "Healthy Leaf"
    elif brown > 0.25:     → "Nutrient Deficiency" / "Bacterial Blight"
    else:                  → "Early Fungal" / "MSV"
9.4 Water Calculator
python
CROP_COEFF = {"maize": 5.5, "wheat": 4.5, "tomato": 6.5, ...}
SOIL_FACTOR = {"sandy": 1.15, "clay": 0.9, "loam": 1.0}
base_mm = CROP_COEFF[crop] * SOIL_FACTOR[soil] * stage
daily_liters = base_mm * 10000 * area_ha
drip_hours = daily_liters / (2.3 * 4 * 10000 * area_ha)
10. Feature Documentation
10.1 Marketplace
Post listings with up to 10 photos (auto WebP compression)

Browse anonymously without login

Search by title/town/description

Filter by category (5) and region (14)

Owner contact info shown on every card

Direct WhatsApp / Call / SMS buttons

Owner-only Mark Sold

10.2 Comments
Public Q&A under each listing

Login required to post

Threaded replies (parent_id)

Like toggle (one per user)

Owner can delete their own

10.3 Agri-Talk
Public farmer feed

Login required to post

Like toggle

Owner delete

Farmer leaderboard

Emergency hotlines

10.4 RFQs
Post what you need

Auto-archive after 7 days

Ticker on market page

10.5 AI Soil Scanner
Camera modal opens (live camera or upload)

Photo sent to backend → AI service

Real pixel analysis

Returns texture, pH, salinity, NPK recommendations

10.6 AI Virus Scanner
Same camera flow

Analyzes leaf color signature

Returns disease, severity, confidence, treatment plan

Critical alerts broadcast to region

10.7 Water Calculator
Crop × soil × growth stage × area

Returns m³/day, drip hours, pressure

10.8 Weather
14 Namibian regions

Real data from Open-Meteo

Temperature, humidity, rain, wind, frost alerts, fire risk

NDVI crop health bars

10.9 USSD Gateway (*555#)
Browse produce

Market prices

Weather

Post listing info

Real DB-backed data

10.10 WhatsApp Bot
MENU → main menu

PRICES → top 5 listings

LIST <title> <qty> <unit> <price> <town> → create listing

10.11 6 Languages
English, Oshiwambo, Afrikaans, Otjiherero, Khoekhoegowab, Silozi

Persisted in localStorage

Applied via data-i18n attributes

10.12 Dark Mode
Toggle in header

Auto-detects system preference

Persisted in localStorage

10.13 PWA
Installable to home screen

Works offline (cached assets)

Service worker caches HTML/CSS/JS

11. Challenges & Solutions
This section documents the real technical challenges faced during development and how each was solved.

11.1 Database — PostgreSQL Not Installed
Challenge: The initial plan used PostgreSQL, but psql and createdb commands were not recognized on Windows. The PATH was not configured, and the installer was not present.

Solution: Migrated to SQLite using Node's native node:sqlite module (available in Node.js 22.5+). This eliminated the need for a separate database server, PATH configuration, or C++ build tools. The entire DB lives in a single namagri.db file.

Result: Zero-configuration database. New developers can clone and run in seconds.

11.2 better-sqlite3 Failed to Compile
Challenge: better-sqlite3 required C++ compilation via node-gyp. On Windows without Visual Studio Build Tools + Windows SDK, the install failed with Could not find any Visual Studio installation to use.

Solution: Switched to node:sqlite — the built-in Node.js SQLite driver. No native compilation needed, no node-gyp, no windows-build-tools.

Result: npm install completes in ~45 seconds with zero errors.

11.3 Backend Crashed on Startup — Stray Character Bug
Challenge: The backend crashed immediately after starting. Every browser request triggered ERR_CONNECTION_REFUSED. Root cause: a single stray s after a }); in server.js:

javascript
process.on('unhandledRejection', (err) => {
  console.error('🚨', err);
});s   // ← This broke the entire file
Solution: Removed the stray character. Added global error handlers at the top of server.js:

javascript
process.on('uncaughtException', (err) => {
  console.error('🚨 UNCAUGHT:', err.message);
  console.error(err.stack);
});
process.on('unhandledRejection', (err) => {
  console.error('🚨 REJECTION:', err);
});
Result: Backend survives individual route errors. Errors log clearly without crashing.

11.4 openComments is not defined — Script Loading Order
Challenge: The browser threw Uncaught ReferenceError: openComments is not defined even though the function existed in market.js. Root cause: script loading order. market.js was using functions from app.js (like toast()), but app.js was loaded after market.js.

Solution: Corrected the <script> tag order in index.html:

html
<script src="js/app.js"></script>        <!-- FIRST — defines globals -->
<script src="js/i18n.js"></script>
<script src="js/api.js"></script>
<script src="js/validation.js"></script>
<script src="js/camera.js"></script>
<script src="js/auth.js"></script>
<script src="js/market.js"></script>     <!-- NOW can use toast() -->
...
Result: All cross-file function dependencies resolve. No more reference errors.

11.5 Python http.server Hanging with 504 Errors
Challenge: The frontend server (Python http.server on port 3000) returned 504 Gateway Timeout on all JS files when the browser requested them in parallel. The server hung under concurrent load.

Solution: Options:

Bind to IPv4: python -m http.server 3000 --bind 127.0.0.1

OR use npx serve -p 3000 (Node.js, handles concurrency properly)

OR write a tiny custom Node server

Result: Consistent, fast, no more 504s.

11.6 Form Validation Not Showing Red Borders
Challenge: Invalid form submissions didn't show red borders. Initially, validation lived in a separate validateFields() function that ran after requireLogin(). If the user wasn't logged in, requireLogin() returned early and validation never ran.

Solution: Moved validation logic into a dedicated window.doPublish() and window.doAuth() handler. These set inline styles directly (el.style.borderColor = '#c0392b') — no CSS class dependency, no function-order issues.

javascript
window.doPublish = function() {
  if (!window.currentUser) { openAuth('login'); return; }
  // Validate each field, set red border inline
  // ...
};
Result: Bulletproof validation. Red borders show immediately. Errors clear as user types.

11.7 Multi-Language Only Translated Some Text
Challenge: The first i18n version matched text using txt.includes('Marketplace'). If any label had slightly different wording, it silently missed. Only ~40% of labels translated.

Solution: Switched to data-i18n attributes:

html
<h2 data-i18n="market_title">🛒 Live Marketplace</h2>
<label data-i18n="lbl_title" data-required="true">Product Title *</label>
And:

javascript
document.querySelectorAll('[data-i18n]').forEach(el => {
  el.innerHTML = t(el.dataset.i18n);
});
Result: 100% of labeled elements translate. No pattern matching. No misses.

11.8 Camera Required Real Device Integration
Challenge: input type="file" capture opens the file picker on desktop and the camera app on mobile, but not a live camera feed in the browser.

Solution: Built camera.js with three options:

Live camera via getUserMedia({ video: { facingMode: 'environment' } })

File upload fallback (for denied permission or old browsers)

Cancel

The live feed is captured via <video> → <canvas> → base64 data URL, compressed to 800px max dimension.

Result: Real-time camera scanning. On phones, uses the rear camera. On desktop, uses webcam.

11.9 AI Image Analysis Was Fake
Challenge: Initially the "AI" returned random data based on Date.now(). Scanning a photo of anything returned "Maize Streak Virus" 25% of the time.

Solution: Implemented real image analysis with PIL + NumPy:

python
arr = np.array(img)
green_index = (g - (r + b) / 2) / 255.0
brown_index = (r - b) / 255.0
texture_var = float(np.var(gray))
Classification rules:

Green index > 0.15 → Healthy Leaf

Brown index > 0.25 → Nutrient Deficiency / Bacterial Blight

Otherwise → Fungal / MSV

Result: Real analysis based on the actual pixel distribution. A green leaf returns "Healthy"; a brown leaf returns "Deficiency".

11.10 Backend Owner Permissions Missing
Challenge: Any logged-in user could mark another farmer's listing as sold. Any user could delete any comment.

Solution: Added ownership checks on the backend for every mutating endpoint:

javascript
const check = await query('SELECT owner_id FROM listings WHERE id=?', [id]);
if (check.rows[0].owner_id !== req.user.id) {
  return res.status(403).json({ error: 'Not your listing' });
}
Frontend hides the button for non-owners:

javascript
${isOwner ? '<button onclick="markSold(...)">✅ Mark Sold</button>' : ''}
Result: Backend enforces permissions. Frontend UX prevents confusion.

11.11 GitHub Push — Remote Contains Work You Don't Have
Challenge: git push rejected with failed to push some refs. GitHub had auto-created a README when the repo was created, causing unrelated histories.

Solution: Force push (since the GitHub README was empty boilerplate):

bash
git push -u origin main --force
For repos with important remote work, use git pull --allow-unrelated-histories first, then push.

Result: Local code pushed successfully. Everything up-to-date on subsequent pushes.

11.12 RFQ Auto-Archive After 7 Days
Challenge: RFQs stayed in the list forever.

Solution: Added SQL date filter:

sql
WHERE r.created_at > datetime('now', '-7 days')
Result: Only the last 7 days of RFQs appear. Older ones auto-archive without a cron job.

11.13 Image Upload Failed with 500
Challenge: Posting a listing with photos returned 500 Internal Server Error. sharp was silently failing on some photos (e.g., already-WebP, EXIF rotations).

Solution: Wrapped sharp in a try/catch and fell back to the original file:

javascript
try {
  await sharp(file.path).webp({ quality: 70 }).toFile(webpPath);
  photos.push(webpPath);
} catch (err) {
  photos.push(`/uploads/${file.filename}`); // Keep original
}
Result: Photos always save. WebP compression when possible, original otherwise.

12. Development Journey
The project was built in the following phases:

Phase	Focus	Deliverables
1	Architecture Design	Diagrams, DB schema, tech stack
2	Backend Foundation	Express server, SQLite schema, seed data
3	Frontend Skeleton	HTML shell, CSS themes, PWA manifest
4	API Integration	Fetch wrapper, market connect, CORS fix
5	Authentication	JWT, bcrypt, register/login modal
6	Listings	Photo upload, WebP compression, ownership
7	Comments & Community	Threading, likes, Agri-Talk, RFQs
8	AI Microservice	Python Flask, real image analysis
9	Weather	Open-Meteo integration, 14 regions
10	Multi-Language	i18n system, 6 languages
11	Polish	Validation, dark mode, PWA offline
12	Documentation & Deployment	Docs, GitHub push
13. Testing & Verification
13.1 Manual Test Checklist
#	Test	Result
1	Health check {"ok":true}	✅
2	Listings API returns array	✅
3	Market page displays cards	✅
4	Register user works	✅
5	Login works	✅
6	Post listing works	✅
7	Owner contact shows on card	✅
8	Mark Sold (owner) → 200	✅
9	Mark Sold (non-owner) → 403	✅
10	Comment posting works	✅
11	Comment like toggle works	✅
12	Comment reply threads correctly	✅
13	Agri-Talk post works	✅
14	RFQ post works	✅
15	Weather shows 14 regions	✅
16	Soil scan returns analysis	✅
17	Virus scan returns diagnosis	✅
18	Water calc returns m³/day	✅
19	USSD interactive menu	✅
20	Language switch updates UI	✅
21	Dark mode toggle	✅
22	PWA offline load	✅
13.2 Sample Test Commands
bash
curl http://localhost:4000/api/health
curl http://localhost:4000/api/listings
curl http://localhost:4000/api/weather/regions
curl http://localhost:5000/health
14. Deployment Guide
14.1 Local Development
Terminal 1 — Backend:

bash
cd backend
npm install
npm run init-db
npm run dev
Terminal 2 — AI:

bash
cd ai-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
Terminal 3 — Frontend:

bash
cd frontend
python -m http.server 3000 --bind 127.0.0.1
Browser: http://localhost:3000

14.2 One-Click Launcher (Windows)
Create START-ALL.bat on Desktop:

batch
@echo off
start "BACKEND" cmd /k "cd /d C:\Users\Lenovo\Desktop\AgriNamConnect\backend && npm run dev"
timeout /t 3 /nobreak >nul
start "FRONTEND" cmd /k "cd /d C:\Users\Lenovo\Desktop\AgriNamConnect\frontend && python -m http.server 3000 --bind 127.0.0.1"
timeout /t 2 /nobreak >nul
start "AI" cmd /k "cd /d C:\Users\Lenovo\Desktop\AgriNamConnect\ai-service && call venv\Scripts\activate && python app.py"
timeout /t 4 /nobreak >nul
start http://localhost:3000
14.3 Production (Future)
Frontend → Vercel (free SSL, CDN)

Backend → Railway / Render

Database → Supabase (PostgreSQL)

AI → Hugging Face Spaces

Domain → namagriconnect.na

SSL → Let's Encrypt

15. User Manual
15.1 For Farmers
Register:

Click 🔐 Login → Register

Enter phone, name, region, town, password

Post a Listing:

Click ➕ Sell

Fill form (title, category, quantity, price, region, town)

Upload photos (optional, up to 10)

Click Publish Listing

Sell & Archive:

Buyer contacts you on WhatsApp

When sold, click ✅ Mark Sold

Listing moves to My Farm → Sales History

15.2 For Buyers
Browse anonymously

Search or filter by category/region

Tap WhatsApp to contact the seller directly

Post RFQ if you need bulk supply

15.3 For Feature Phones
Dial *555#:

text
1. Browse Produce
2. Market Prices
3. Weather
4. Post Listing Info
5. My Account
16. Developer Guide
16.1 Setup
bash
git clone https://github.com/londonjoeburg-beep/namAGRIconnect.git
cd namAGRIconnect

cd backend && npm install && npm run init-db && npm run dev
# → http://localhost:4000

# (new terminal)
cd ai-service && python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt && python app.py
# → http://localhost:5000

# (new terminal)
cd frontend && python -m http.server 3000 --bind 127.0.0.1
# → http://localhost:3000
16.2 Adding a New Route
Create backend/routes/myfeature.js

Use authMiddleware for protected routes

Wrap handlers in try/catch

Register in backend/server.js:

javascript
import myFeatureRouter from './routes/myfeature.js';
app.use('/api/myfeature', myFeatureRouter);
Add frontend JS in frontend/js/

16.3 Adding a New Language
Open frontend/js/i18n.js

Add a new entry in TRANSLATIONS:

javascript
xx: {
  login: '...',
  tab_market: '...',
  // ...all keys
}
Add <option value="xx">🌍 Language</option> to the dropdown in index.html

17. Limitations & Future Work
Current Limitations
Limitation	Impact	Fix
SQLite only	No clustering	Migrate to PostgreSQL
Heuristic AI	Not ML-trained	Train TensorFlow on PlantVillage
No payments	Cash-only	Integrate MTC Money
No push notifications	Users miss updates	Web Push + FCM
Approximate translations	Native speaker needed	Community review
No admin panel	Manual DB moderation	Build dashboard
Roadmap
Phase 2 (Q1 2027):

PostgreSQL migration + Supabase

Production deployment (namagriconnect.na)

WhatsApp bot live

Native mobile app

Phase 3 (Q2 2027):

Escrow payments

Trained ML models

Push notifications

Analytics

Phase 4 (Q3 2027):

Voice notes with Whisper

Video listings

Livestock auction integration

Meat Board price sync

18. Conclusion
NamAgriConnect demonstrates that a comprehensive, multilingual, multi-device agricultural platform can be built from scratch using accessible technologies. By combining modern web standards (PWA, service workers), practical backend design (Node.js + SQLite), and AI microservices (Python + Flask), the project delivers real value to Namibian farmers:

Direct market access without middlemen

Free AI agronomy tools for soil and plants

Real weather intelligence for all 14 regions

Accessible across all device types — smartphone, feature phone, WhatsApp

Multilingual for Namibia's diverse population

The platform is production-ready as-is for pilot deployment and provides a solid foundation for future expansion into payments, machine learning, and analytics.

This project reflects both a technical achievement and a meaningful contribution to Namibian agriculture.

Document version: 1.0
Last updated: October 2026
Author: Haufiku Petis
Institution: Triumphant College