# 🌾 AgriConnect Namibia

**Connecting Namibian Farmers to Markets, Information, and Each Other**

![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![Version](https://img.shields.io/badge/Version-2.0-blue)
![Node](https://img.shields.io/badge/Node.js-18%2B-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 About the Project

**AgriConnect Namibia** is a full-stack web platform designed to connect Namibian farmers with vital agricultural information, real-time markets, weather updates, and each other. The platform addresses the critical gap in agricultural information access for rural farmers across all 14 regions of Namibia.

### The Problem

Namibia's agricultural sector is the backbone of the economy, with over 70% of the population depending on farming for their livelihoods. However, rural farmers face:

- ❌ Limited access to real-time weather information
- ❌ No knowledge of current market prices
- ❌ Outdated farming techniques
- ❌ Isolation from other farmers
- ❌ Difficulty selling products directly to buyers
- ❌ Exploitation by middlemen (30-40% income loss)

### The Solution

**AgriConnect Namibia** provides:

- ✅ **Real-time weather** from Open-Meteo for 13 farming regions
- ✅ **Live market prices** with in-demand and high-value product tracking
- ✅ **Product listing** with image upload capability
- ✅ **Community forum** with comments, replies, likes, and dislikes
- ✅ **Direct buyer connection** — WhatsApp, Call, or Email
- ✅ **SMS notifications** via Infobip integration
- ✅ **Admin dashboard** for complete platform management

---

## ✨ Features

### For Farmers
| Feature | Description |
|---------|-------------|
| 🏠 **Home** | Welcome page with quick access to all features |
| 📝 **Register** | Create a new account |
| 🔑 **Login** | Secure authentication |
| 📦 **Post Products** | List products for sale with photos |
| 📋 **Browse** | Search and filter products |
| 👥 **Community** | Share tips, ask questions, connect with farmers |
| ☀️ **Weather** | Real-time weather for 13 farming regions |
| 💰 **Market Prices** | Check current prices + in-demand products |
| 🤝 **Partners** | Connect with agricultural organizations |

### For Buyers
| Feature | Description |
|---------|-------------|
| 🔍 **Search** | Find products by name, category, or location |
| 📸 **View Details** | Full product info with photos |
| 💬 **Contact Seller** | WhatsApp, Call, or Email directly |
| ⭐ **Comment** | Leave feedback on products |

### For Admins
| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Platform statistics at a glance |
| 👥 **User Management** | View and delete users |
| 📦 **Product Management** | View and delete products |
| 👥 **Community Management** | View and delete posts |
| 💰 **Price Management** | Update and delete market prices |
| 🚨 **Full Control** | Complete platform oversight |

### Interactive Features
- ❤️ **Like Posts** — Toggle on/off
- 👍 **Like Comments** — Toggle on/off
- 👎 **Dislike Comments** — Toggle on/off
- 💬 **Comment** — Discuss products
- ↩️ **Reply** — Reply to comments (nested)
- 🔍 **Search & Filter** — Find products easily
- 📸 **Image Upload** — Post products with photos
- ✅ **Mark as Sold** — Sellers can close listings
- 📱 **WhatsApp Integration** — Instant contact with sellers

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | SQLite3 |
| **Authentication** | bcryptjs |
| **Weather API** | Open-Meteo (no key needed) |
| **SMS Service** | Infobip |
| **HTTP Client** | Axios |
| **Environment** | dotenv |
| **Version Control** | Git, GitHub |
| **Deployment** | Railway / Render |

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher) — [Download](https://nodejs.org)
- Git (optional) — [Download](https://git-scm.com)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/londonjoeburg-beep/namAGRIconnect.git
cd namAGRIconnect

# 2. Install dependencies
npm install express cors sqlite3 bcryptjs axios dotenv

# 3. Create .env file
notepad .env
Paste this into .env:

env
PORT=3000
NODE_ENV=development
JWT_SECRET=agriconnect_namibia_secret_2026

# Infobip SMS (optional — demo mode works without)
INFOBIP_API_KEY=your_infobip_api_key_here
INFOBIP_BASE_URL=https://jre5kn.api.infobip.com
INFOBIP_SENDER=447491163443
bash
# 4. Start the server
npm start
Access
Open: http://localhost:3000

🔐 Default Credentials
Role	Username	Password
👑 Admin	admin	admin123
Admin access via the 🔐 Admin tab in the navigation.

📊 API Endpoints
Base URL
text
http://localhost:3000/api
Authentication
Method	Endpoint	Description
POST	/auth/register	Register a new user
POST	/auth/login	Login existing user
Products
Method	Endpoint	Description
GET	/products	Get all active products
GET	/products/:id	Get single product
POST	/products	Add new product (with image)
DELETE	/products/:id	Mark product as deleted
POST	/products/:id/sold	Mark as sold (seller only)
POST	/products/:id/toggle	Toggle active status
Product Comments
Method	Endpoint	Description
GET	/products/:id/comments	Get all comments
POST	/products/:id/comments	Post a comment
POST	/products/comments/:id/like	Like a comment
POST	/products/comments/:id/dislike	Dislike a comment
POST	/products/comments/:id/reply	Reply to a comment
Community
Method	Endpoint	Description
GET	/community/posts	Get all posts
POST	/community/posts	Create a post
POST	/community/posts/:id/like-toggle	Toggle like on post
GET	/community/posts/:id/comments	Get post comments
POST	/community/posts/:id/comments	Add comment
POST	/community/comments/:id/like-toggle	Toggle like
POST	/community/comments/:id/dislike-toggle	Toggle dislike
POST	/community/comments/:id/reply	Reply to comment
Weather
Method	Endpoint	Description
GET	/weather	Get weather for 13 farming regions
GET	/weather/:region	Get weather for one region
Market
Method	Endpoint	Description
GET	/market	Get market prices + analytics
GET	/market/live	Get live prices from listings
POST	/market	Add a price (admin)
Partners
Method	Endpoint	Description
GET	/partners	Get all partners
POST	/partners	Add a partner (admin)
POST	/partners/webhook	Receive external notifications
Admin
Method	Endpoint	Description
GET	/admin/stats?key=admin123	Platform statistics
GET	/admin/users?key=admin123	Get all users
DELETE	/admin/users/:id?key=admin123	Delete user
GET	/admin/products?key=admin123	Get all products
DELETE	/admin/products/:id?key=admin123	Delete product
GET	/admin/community?key=admin123	Get all posts
DELETE	/admin/community/:id?key=admin123	Delete post
GET	/admin/market?key=admin123	Get market prices
DELETE	/admin/market/:id?key=admin123	Delete price
SMS
Method	Endpoint	Description
GET	/sms/status	Check SMS configuration
POST	/sms/test	Send test SMS
POST	/sms/product-alert	Send product alert
POST	/sms/weather-alert	Send weather alert
📁 Project Structure
text
namAGRIconnect/
│
├── server.js                   # Main server entry point
├── package.json                # Project dependencies
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
├── DOCUMENTATION.md            # Full documentation
│
├── middleware/
│   ├── database.js             # SQLite setup + tables
│   └── sms.js                  # Infobip SMS service
│
├── routes/
│   ├── auth.js                 # Register + Login
│   ├── products.js             # Products + Comments + Replies
│   ├── community.js            # Community + Toggle likes
│   ├── weather.js              # Real-time weather (Open-Meteo)
│   ├── market.js               # Market prices + analytics
│   ├── partners.js             # Partners + Webhooks
│   ├── admin.js                # Admin dashboard
│   └── sms.js                  # SMS sending endpoints
│
├── database/
│   └── agriconnect.db          # SQLite database (auto-created)
│
└── public/
    ├── index.html              # Main frontend
    ├── styles.css              # Styling
    ├── app.js                  # Frontend logic
    └── uploads/                # Product images
🗄️ Database Schema
users
sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT,
    location TEXT,
    phone TEXT,
    email TEXT,
    role TEXT DEFAULT 'farmer',
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
products
sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    quantity TEXT,
    category TEXT,
    location TEXT,
    image TEXT,
    seller_id INTEGER,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(seller_id) REFERENCES users(id)
);
product_comments
sql
CREATE TABLE product_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    user_id INTEGER,
    comment TEXT,
    parent_id INTEGER DEFAULT NULL,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);
community_posts
sql
CREATE TABLE community_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT,
    author_id INTEGER,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
community_comments
sql
CREATE TABLE community_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    author TEXT,
    author_id INTEGER,
    comment TEXT,
    parent_id INTEGER DEFAULT NULL,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(post_id) REFERENCES community_posts(id)
);
market_prices
sql
CREATE TABLE market_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product TEXT NOT NULL,
    price TEXT NOT NULL,
    unit TEXT,
    market TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
partners
sql
CREATE TABLE partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT,
    contact TEXT,
    website TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
🌤️ Weather Regions Covered
City	Region
Windhoek	Khomas
Oshakati	Oshana
Rundu	Kavango East
Ondangwa	Oshana
Katima Mulilo	Zambezi
Grootfontein	Otjozondjupa
Tsumeb	Oshikoto
Otjiwarongo	Otjozondjupa
Outjo	Kunene
Mariental	Hardap
Keetmanshoop	ǁKaras
Gobabis	Omaheke
Swakopmund	Erongo
Weather data includes:

Temperature + Feels Like

Humidity, Wind Speed + Direction

Rainfall, Rain Probability

Cloud Cover, Pressure, UV Index

Sunrise & Sunset times

6-hour forecast

5-day forecast

Farming advice based on conditions

Best time to farm today

💰 Market Analytics
The platform automatically analyzes product listings to show:

📊 Fixed Market Prices — Curated market prices

🔥 Most In-Demand — Categories with most listings

💎 Highest Value — Categories with highest average prices

Demand indicators: HIGH / MEDIUM / LOW

📱 SMS Integration (Infobip)
Status: Works in demo mode without API key. Add real Infobip key for live SMS.

Get Your Infobip API Key
Sign up at https://www.infobip.com/

Go to Dashboard → API Keys

Create or copy your API key

Add to .env as INFOBIP_API_KEY

SMS Features
✅ Welcome SMS on registration

✅ Product alerts to buyers

✅ Weather alerts by region

✅ Bulk SMS support

🚀 Deployment
Deploy to Railway (Free)
Push code to GitHub

Go to railway.app

Sign up with GitHub

Click New Project → Deploy from GitHub repo

Select namAGRIconnect

Railway auto-deploys

Get your public URL

Deploy to Render (Free)
Push code to GitHub

Go to render.com

Sign up with GitHub

Click New + → Web Service

Connect your repository

Configure:

Build Command: npm install

Start Command: node server.js

Click Create Web Service

Environment Variables
text
PORT=3000
NODE_ENV=production
JWT_SECRET=your_secret_key
INFOBIP_API_KEY=your_key
INFOBIP_BASE_URL=https://jre5kn.api.infobip.com
INFOBIP_SENDER=447491163443
🧪 Testing Checklist
□ Server starts: npm start
□ Home page loads
□ Register new account
□ Login works
□ Post a product with image
□ Browse products
□ Search products
□ View product details
□ Contact seller (WhatsApp/Call/Email)
□ Mark own product as SOLD
□ Comment on product
□ Reply to product comment
□ Like/dislike product comment
□ Community post
□ Comment on community post
□ Reply to community comment
□ Like/dislike community comment
□ Toggle likes on/off
□ Weather loads (real data)
□ Weather shows farming time
□ Market prices load
□ In-demand products show
□ Partners page loads
□ Admin dashboard works
□ Admin can delete items
□ SMS status check
🐛 Troubleshooting
Issue	Solution
Port already in use	Change PORT in .env to 3001
Database errors	Delete database/agriconnect.db and restart
Cannot find module	Run npm install again
Weather not loading	Check internet connection
Images not uploading	Ensure public/uploads/ exists
Login fails	Check credentials, verify bcryptjs
SMS not sending	Add Infobip API key to .env
GitHub 408 timeout	Ensure node_modules is in .gitignore
🤝 Contributing
Contributions, issues, and feature requests are welcome!

Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is licensed under the MIT License.

👨‍💻 Developer
HAUFIKU PETITS PANDULENIOMWENE

🎓 Student Number: 2024049747

🏛 Institution: Triumphant College Namibia

👨‍🏫 Supervisor: MR P.K PULENI

💻 GitHub: @londonjoeburg-beep

📧 Email: londonjoeburg@gmail.com

📞 Phone: 081 861 1837

🙏 Acknowledgments
MR P.K PULENI — Supervisor, for guidance throughout

Triumphant College Namibia — For providing education and support

Open-Meteo — Free real-time weather API

Infobip — SMS service integration

The Namibian Farming Community — For inspiring this work

📞 Support
For support, questions, or feedback:

📧 Email: londonjoeburg@gmail.com

📞 Phone: 081 861 1837

💻 GitHub Issues: Create an issue

<div align="center">
🌾 AgriConnect Namibia 🌾

Connecting Namibian Farmers to Markets, Information, and Each Other

Made with ❤️ in Namibia 🇳🇦

© 2026 Haufiku Petits Panduleniomwene
