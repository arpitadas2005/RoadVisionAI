# Smart Road Damage - Production Deployment Guide

Complete step-by-step deployment guide for **Smart Road Damage**.

---

## 1. Production Architecture Overview

```
User (HTTPS Browser)
       │
       ▼
Cloudflare / Nginx Reverse Proxy (SSL Termination)
       │
       ├── Frontend SPA (Vite Static Build / Vercel / Nginx)
       │
       └── Backend API (FastAPI / Uvicorn Gunicorn Workers)
              │
              ├── PostgreSQL Database (AWS RDS / GCP Cloud SQL)
              └── PyTorch Model Weights (ai/models/best.pt)
```

---

## 2. Prerequisites & Server Requirements

- **Operating System**: Ubuntu 22.04 LTS or Docker Container.
- **Python**: Python 3.10+ & `pip`.
- **Node.js**: Node.js 20+ & `npm`.
- **Database**: PostgreSQL 14+ database instance with SSL enabled.
- **Domain & SSL**: Valid domain with Let's Encrypt TLS certificate.

---

## 3. Step-by-Step Production Deployment

### Step 1: Clone & Configure Environment
```bash
git clone https://github.com/organization/smart-road-damage.git
cd smart-road-damage
cp .env.example .env
```

Edit `.env` with production keys:
```bash
ENVIRONMENT=production
VITE_AI_SERVICE_TYPE=api
VITE_AI_API_URL=https://api.smartroad.city.gov/api/v1/detections
JWT_SECRET=super_secure_32_byte_random_secret_hex
DATABASE_URL=postgresql+asyncpg://smartroad_user:secure_password@postgres-db-host:5432/smartroaddamage
ALLOWED_ORIGINS=https://smartroad.city.gov
MAX_UPLOAD_SIZE_MB=25
```

### Step 2: Install Python Dependencies & Database Migration
```bash
pip install -r backend/requirements.txt
py -c "import asyncio; from app.db.session import init_db; asyncio.run(init_db())"
```

### Step 3: Place PyTorch AI Model Weights
Copy trained PyTorch weights file:
```bash
cp /path/to/custom_road_damage_yolov8.pt ai/models/best.pt
```

### Step 4: Build Frontend Production Assets
```bash
npm install
npm run build
```
Static production output will be generated in `dist/`.

### Step 5: Start FastAPI Backend Service (Uvicorn / Systemd)
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000
```

---

## 4. Nginx Reverse Proxy Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name smartroad.city.gov;

    ssl_certificate /etc/letsencrypt/live/smartroad.city.gov/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/smartroad.city.gov/privkey.pem;

    # Frontend Static SPA
    location / {
        root /var/www/smartroaddamage/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api/v1/ {
        proxy_pass http://127.0.0.1:8000/api/v1/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 25M;
    }
}
```

---

## 5. Security & Verification Checks

1. Verify HTTPS redirection (`http://` $\rightarrow$ `https://`).
2. Run health check endpoint: `curl https://api.smartroad.city.gov/api/v1/health`.
3. Test JWT authorization and user isolation.
