cd C:\Users\Lenovo\Desktop\namAGRIconnect
# 📚 NAMIBIA AGRICONNECT — COMPLETE TECHNICAL DOCUMENTATION

## Full System Documentation v2.0

---

**Developer:** HAUFIKU PETITS PANDULENIOMWENE

**Student Number:** 2024049747

**Institution:** Triumphant College Namibia

**Supervisor:** MR P.K PULENI

**Date:** September 2026

**Version:** 2.0

---

## TABLE OF CONTENTS

1. Introduction
2. System Overview
3. Architecture
4. Installation Guide
5. User Guide
6. Admin Guide
7. API Documentation
8. Database Schema
9. Weather System
10. Market Analytics
11. SMS Integration
12. File Structure
13. Deployment Guide
14. Troubleshooting
15. Development Challenges
16. Future Enhancements
17. Conclusion

---

## 1. INTRODUCTION

### 1.1 Project Overview

**AgriConnect Namibia** is a comprehensive web-based platform designed to:
- Connect Namibian farmers with markets
- Provide real-time weather information
- Enable direct buyer-seller communication
- Build a farming community
- Support agricultural growth

### 1.2 Vision

To become Namibia's #1 platform for agricultural trade, information, and community, connecting every farmer regardless of location.

### 1.3 Development Context

This project was developed as a response to:
- Limited rural internet access (only 35% of rural schools)
- 30-40% income loss to middlemen
- No centralized farming information platform
- Isolation of rural farmers

---

## 2. SYSTEM OVERVIEW

### 2.1 Components
┌─────────────────────────────────────────────────────────────┐
│ AGRICONNECT NAMIBIA │
├─────────────────────────────────────────────────────────────┤
│ │
│ Frontend Layer │
│ ├── HTML5 + CSS3 + JavaScript │
│ ├── Responsive Design │
│ └── Real-time Updates │
│ │
│ Backend Layer │
│ ├── Node.js + Express │
│ ├── REST API (15+ endpoints) │
│ ├── bcryptjs Authentication │
│ └── Role-based Access │
│ │
│ Data Layer │
│ ├── SQLite3 Database │
│ ├── 7 Relational Tables │
│ └── Auto-migrations │
│ │
│ External Services │
│ ├── Open-Meteo (Weather) │
│ ├── Infobip (SMS) │
│ └── WhatsApp (Contact) │
│ │
└─────────────────────────────────────────────────────────────┘
text

### 2.2 Key Features

**For Farmers:**
- Product listing with photos
- Direct contact (WhatsApp, Call, Email)
- Real-time weather with farming advice
- Market prices
- Community forum
- Mark products as sold

**For Buyers:**
- Search products by category
- Filter by location
- Contact sellers instantly
- Leave comments and replies

**For Admins:**
- Full platform management
- Statistics dashboard
- Delete any content
- Manage market prices

---

## 3. ARCHITECTURE

### 3.1 System Architecture
User Browser
↓
Frontend (HTML/CSS/JS)
↓
REST API (Express.js)
↓
SQLite Database
↓
External APIs (Open-Meteo, Infobip)
text

### 3.2 Folder Architecture
agri-nam/
├── server.js (Entry point)
├── weather.js (Weather helper)
├── middleware/
│ ├── database.js (DB setup)
│ └── sms.js (SMS service)
├── routes/
│ ├── auth.js (Auth)
│ ├── products.js (Products)
│ ├── community.js (Community)
│ ├── weather.js (Weather)
│ ├── market.js (Market)
│ ├── partners.js (Partners)
│ ├── admin.js (Admin)
│ └── sms.js (SMS)
└── public/
├── index.html (Frontend)
├── styles.css (Styling)
└── app.js (Logic)
text

---

## 4. INSTALLATION GUIDE

### 4.1 Prerequisites
- Node.js v18+
- Git
- Text editor (VS Code)

### 4.2 Setup Steps

```bash
# 1. Clone repo
git clone https://github.com/londonjoeburg-beep/namAGRIconnect.git
cd namAGRIconnect

# 2. Install packages
npm install express cors sqlite3 bcryptjs axios dotenv

# 3. Setup environment
notepad .env

# 4. Start server
npm start
4.3 Environment Variables
env
PORT=3000
NODE_ENV=development
JWT_SECRET=agriconnect_namibia_secret_2026
INFOBIP_API_KEY=your_key_here
INFOBIP_BASE_URL=https://jre5kn.api.infobip.com
INFOBIP_SENDER=447491163443
4.4 Access
Open http://localhost:3000
________________________________________
5. USER GUIDE
5.1 Register an Account
1.	Click Register
2.	Fill in: Username, Password, Full Name, Location, Phone, Email
3.	Click Create Account
4.	Wait for success message
5.	Login with your credentials
5.2 Post a Product
1.	Login
2.	Click Post
3.	Fill in:
o	Title (e.g., "Fresh Maize")
o	Description
o	Price (N$)
o	Quantity (e.g., "50kg")
o	Category (Grains, Vegetables, etc.)
o	Location
4.	Upload image (optional)
5.	Click Post Product
5.3 Browse Products
1.	Click Browse
2.	Use search box to filter
3.	Click any product for details
4.	Contact seller via WhatsApp/Call/Email
5.4 Mark Product as Sold
1.	Login as seller
2.	Go to Browse
3.	Click your own product
4.	Scroll to Seller Actions
5.	Click Mark as SOLD
5.5 Community Engagement
1.	Click Community
2.	Write a post (title + content)
3.	Click Post to Community
4.	Like posts (toggle on/off)
5.	Comment on posts
6.	Reply to comments (nested)
7.	Like/dislike comments (toggle)
5.6 Check Weather
1.	Click Weather
2.	See real-time data for 13 regions
3.	View hourly forecast
4.	Read farming advice
5.	Check best farming time today
6.	Expand 5-day forecast
5.7 Check Market Prices
1.	Click Prices
2.	View fixed prices by market
3.	See Most In-Demand products
4.	See Highest Value products
5.	Note demand indicators (HIGH/MEDIUM/LOW)
________________________________________
6. ADMIN GUIDE
6.1 Access Admin Dashboard
1.	Login as admin (or any user)
2.	Click 🔐 Admin in nav
3.	Enter admin key: admin123
4.	Click Enter Dashboard
6.2 Admin Capabilities
Tab	Actions
👥 Users	View all users, delete
📦 Products	View all products, delete
👥 Community	View all posts, delete
💰 Prices	View market prices, delete
6.3 Admin Statistics
Dashboard shows:
•	Total Users
•	Total Products
•	Community Posts
•	Total Comments
________________________________________
7. API DOCUMENTATION
7.1 Authentication Endpoints
POST /api/auth/register
json
{
  "username": "farmer1",
  "password": "pass123",
  "fullName": "John Doe",
  "location": "Windhoek",
  "phone": "0811234567",
  "email": "john@test.com"
}
POST /api/auth/login
json
{
  "username": "farmer1",
  "password": "pass123"
}
7.2 Product Endpoints
GET /api/products — Get all active products
POST /api/products
json
{
  "title": "Fresh Maize",
  "description": "Organic maize",
  "price": 500,
  "quantity": "50kg",
  "category": "Grains",
  "location": "Oshana",
  "sellerId": 1,
  "image": "data:image/png;base64,..."
}
POST /api/products/:id/sold
json
{ "userId": 1 }
7.3 Community Endpoints
GET /api/community/posts — Get all posts
POST /api/community/posts
json
{
  "title": "Farming tips",
  "content": "Plant maize in November",
  "author": "John",
  "authorId": 1
}
POST /api/community/posts/:id/like-toggle
json
{ "userId": 1 }
POST /api/community/comments/:id/like-toggle
json
{ "userId": 1 }
POST /api/community/comments/:id/dislike-toggle
json
{ "userId": 1 }
7.4 Weather Endpoints
GET /api/weather — All 13 regions
GET /api/weather/:region — Single region
7.5 Market Endpoints
GET /api/market — With analytics
GET /api/market/live — From listings
7.6 Admin Endpoints (key=admin123)
•	GET /api/admin/stats?key=admin123
•	GET /api/admin/users?key=admin123
•	GET /api/admin/products?key=admin123
•	GET /api/admin/community?key=admin123
•	GET /api/admin/market?key=admin123
•	DELETE /api/admin/users/:id?key=admin123
•	DELETE /api/admin/products/:id?key=admin123
•	DELETE /api/admin/community/:id?key=admin123
•	DELETE /api/admin/market/:id?key=admin123
7.7 SMS Endpoints
•	GET /api/sms/status
•	POST /api/sms/test
•	POST /api/sms/product-alert
•	POST /api/sms/weather-alert
________________________________________
8. DATABASE SCHEMA
8.1 Entity Relationship
text
users (1) ──── (many) products
users (1) ──── (many) product_comments
users (1) ──── (many) community_posts
users (1) ──── (many) community_comments
products (1) ── (many) product_comments
community_posts (1) ── (many) community_comments
8.2 Table Structures
users
sql
id INTEGER PRIMARY KEY
username TEXT UNIQUE NOT NULL
password TEXT NOT NULL
full_name TEXT
location TEXT
phone TEXT
email TEXT
role TEXT DEFAULT 'farmer'
is_active INTEGER DEFAULT 1
created_at DATETIME
products
sql
id INTEGER PRIMARY KEY
title TEXT NOT NULL
description TEXT
price REAL NOT NULL
quantity TEXT
category TEXT
location TEXT
image TEXT
seller_id INTEGER (FK users)
is_active INTEGER DEFAULT 1
created_at DATETIME
product_comments
sql
id INTEGER PRIMARY KEY
product_id INTEGER (FK products)
user_id INTEGER (FK users)
comment TEXT
parent_id INTEGER (self-FK)
likes INTEGER DEFAULT 0
dislikes INTEGER DEFAULT 0
created_at DATETIME
community_posts
sql
id INTEGER PRIMARY KEY
title TEXT NOT NULL
content TEXT NOT NULL
author TEXT
author_id INTEGER
likes INTEGER DEFAULT 0
dislikes INTEGER DEFAULT 0
is_active INTEGER DEFAULT 1
created_at DATETIME
community_comments
sql
id INTEGER PRIMARY KEY
post_id INTEGER (FK community_posts)
author TEXT
author_id INTEGER
comment TEXT
parent_id INTEGER (self-FK)
likes INTEGER DEFAULT 0
dislikes INTEGER DEFAULT 0
created_at DATETIME
market_prices
sql
id INTEGER PRIMARY KEY
product TEXT NOT NULL
price TEXT NOT NULL
unit TEXT
market TEXT NOT NULL
updated_at DATETIME
partners
sql
id INTEGER PRIMARY KEY
name TEXT NOT NULL
type TEXT
contact TEXT
website TEXT
description TEXT
created_at DATETIME
________________________________________
9. WEATHER SYSTEM
9.1 Data Source
Open-Meteo API — Free, no API key required
•	URL: https://api.open-meteo.com/v1/forecast
•	Resolution: 1-11 km
•	Updates: Hourly
•	Coverage: All Namibia
9.2 Data Included
•	Current temperature + feels-like
•	Humidity, wind speed, direction
•	Rainfall, rain probability
•	Cloud cover, pressure, UV index
•	Sunrise and sunset
•	6-hour forecast
•	5-day forecast
•	Farming advice
•	Best farming time
9.3 Farming Advice Logic
Condition	Advice
Rain > 70%	🌧️ Excellent planting day
Rain > 40%	⛅ Monitor soil moisture
Peak heat (11-15h)	☀️ Water early morning/evening
Clear/Sunny	☀️ Ideal for harvesting
Overcast	☁️ Great for planting/spraying
Thunderstorm	⛈️ Stay indoors
9.4 Best Farming Time
Time	Recommendation
6am - 10am	🌅 Perfect for planting
11am - 3pm	🔥 Rest, avoid heavy work
4pm - 7pm	🌆 Great for harvesting
8pm - 5am	🌙 Rest
________________________________________
10. MARKET ANALYTICS
10.1 Analytics Categories
Fixed Prices:
Curated market prices for common products
Most In-Demand:
Categories with highest number of active listings
•	HIGH: >5 listings
•	MEDIUM: 2-5 listings
•	LOW: 1 listing
Highest Value:
Categories with highest average price
10.2 Auto-Update
Market analytics update automatically based on:
•	Number of active listings
•	Average prices
•	Price ranges
•	Category popularity
________________________________________
11. SMS INTEGRATION
11.1 Infobip Setup
1.	Sign up at infobip.com
2.	Get API key from Dashboard → API Keys
3.	Add to .env:
text
INFOBIP_API_KEY=your_key
INFOBIP_BASE_URL=https://jre5kn.api.infobip.com
INFOBIP_SENDER=447491163443
11.2 SMS Features
Feature	Trigger
Welcome SMS	On registration
Product Alert	New product posted
Weather Alert	Manual or scheduled
Bulk SMS	Custom campaigns
11.3 Demo Mode
Without API key, SMS logs to console only:
text
📱 [DEMO MODE] SMS to 0818611837: Your message
________________________________________
12. FILE STRUCTURE
text
namAGRIconnect/
│
├── server.js                   Main server (60 lines)
├── package.json                Dependencies
├── .env                        Environment variables
├── .gitignore                  Git ignore rules
├── README.md                   Project overview
├── DOCUMENTATION.md            This file
│
├── middleware/
│   ├── database.js             DB setup (120 lines)
│   └── sms.js                  SMS service (80 lines)
│
├── routes/
│   ├── auth.js                 Auth routes (60 lines)
│   ├── products.js             Products (150 lines)
│   ├── community.js            Community (200 lines)
│   ├── weather.js              Weather (180 lines)
│   ├── market.js               Market (100 lines)
│   ├── partners.js             Partners (60 lines)
│   ├── admin.js                Admin (180 lines)
│   └── sms.js                  SMS routes (60 lines)
│
├── database/
│   └── agriconnect.db          SQLite (auto-created)
│
└── public/
    ├── index.html              HTML (280 lines)
    ├── styles.css              CSS (400 lines)
    ├── app.js                  JavaScript (1200 lines)
    └── uploads/                Image uploads
________________________________________
13. DEPLOYMENT GUIDE
13.1 Deploy to Railway
bash
# 1. Push code to GitHub
git push origin main

# 2. Go to railway.app
# 3. New Project → Deploy from GitHub
# 4. Select namAGRIconnect
# 5. Railway auto-deploys
13.2 Deploy to Render
text
1. Go to render.com
2. New + → Web Service
3. Connect GitHub repo
4. Build Command: npm install
5. Start Command: node server.js
6. Click Create Web Service
13.3 Post-Deployment
•	Test all features
•	Monitor logs
•	Update .env if needed
•	Share public URL
________________________________________
14. TROUBLESHOOTING
Issue	Fix
Port 3000 in use	Change PORT in .env
Database corrupt	Delete database/agriconnect.db
Module not found	npm install again
Weather fails	Check internet
Images not saving	Create public/uploads/
Login fails	Check bcryptjs installed
SMS fails	Add Infobip key
Git 408	Add node_modules to .gitignore
User cannot post	Check is_active status
Product not showing	Check is_active = 1
________________________________________
15. DEVELOPMENT CHALLENGES
15.1 Weather API
Problem: Hardcoded weather data was unrealistic
Solution: Integrated Open-Meteo (free, no key)
15.2 Market Prices
Problem: Static prices not reflecting reality
Solution: Auto-analyze product listings
15.3 Toggle Like/Dislike
Problem: Users couldn't unlike a comment
Solution: In-memory reaction tracking + toggle routes
15.4 Product Deletion
Problem: Buyers couldn't be notified of sold items
Solution: "Mark as Sold" button for sellers
15.5 Comment Replies
Problem: No nested discussion support
Solution: parent_id self-reference
15.6 Large Git Push
Problem: HTTP 408 timeout from node_modules
Solution: Add to .gitignore + fresh git init
15.7 SMS Integration
Problem: Infobip curl commands needed JS version
Solution: Axios-based implementation
________________________________________
16. FUTURE ENHANCEMENTS
Short-Term (Next 3 months)
•	⭐ Star ratings for sellers
•	📸 Multiple product photos
•	💾 Data export (PDF reports)
•	🔔 Email notifications
Medium-Term (3-6 months)
•	📱 Mobile app (React Native)
•	💳 MTC Mobile Money integration
•	🌍 Multi-language (Oshiwambo, Afrikaans)
•	🗺️ Map-based product search
Long-Term (6-12 months)
•	🤖 AI price predictions
•	📊 Advanced analytics dashboard
•	🚚 Delivery tracking
•	🎓 Farmer training modules
•	🏆 Seller verification badges
________________________________________
17. CONCLUSION
AgriConnect Namibia successfully addresses:
•	✅ Real-time weather information
•	✅ Live market prices
•	✅ Direct buyer-seller connection
•	✅ Community building
•	✅ SMS notifications
•	✅ Admin oversight
Impact Delivered:
•	🌾 Farmers connect directly (no middlemen)
•	📈 20-30% potential income increase
•	🌍 Nationwide coverage (13 regions)
•	📱 Accessible from any device
Key Achievements:
•	Full-stack web application
•	7-table relational database
•	25+ API endpoints
•	Real-time weather integration
•	Toggle-based reactions
•	Modular architecture
•	Production-ready
________________________________________
Developer: HAUFIKU PETITS PANDULENIOMWENE
Institution: Triumphant College Namibia
Date: September 2026
Version: 2.0
Status: ✅ Complete & Production-Ready
________________________________________
© 2026 Haufiku Petits Panduleniomwene
🌾 AgriConnect Namibia — Growing Together

