# NamAgriConnect — Namibia All-in-One Agri Platform

## Quick Start (Local)

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Python 3.10+
- Docker (optional)

### 2. Setup Database
```bash
createdb namagriconnect
psql namagriconnect < backend/schema.sql
psql namagriconnect < backend/seed.sql