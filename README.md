# Smart Road Damage - AI Infrastructure Monitoring Platform

[![System Tests](https://img.shields.io/badge/Tests-65%2F65%20Passed-emerald)](file:///c:/SmartRoadDamage/SECURITY.md)
[![Build Status](https://img.shields.io/badge/Vite%20Build-Passed%20(7s)-cyan)](file:///c:/SmartRoadDamage/walkthrough.md)
[![Security Audit](https://img.shields.io/badge/Security%20Audit-16%2F16%20PASS-blue)](file:///c:/SmartRoadDamage/SECURITY.md)

**Smart Road Damage** is an enterprise-grade AI-powered web application for real-time pavement inspection, pothole detection, and municipal road hazard monitoring. Built for city engineers, Department of Transportation surveyors, and smart city operators.

---

## 1. Project Overview
Smart Road Damage automates municipal road hazard inspection using PyTorch and YOLOv8 computer vision models. The platform processes road photos, dashcam video streams, and browser camera feeds to detect pavement defects, calculate severity ratings, compute a 0–100 Road Condition Health Index, and generate user-isolated inspection logs.

---

## 2. Problem Statement
Manual road damage inspections are time-consuming, expensive, hazardous for field operators, and subjective. Potholes and severe pavement cracks frequently remain undetected until causing vehicle damage, traffic congestion, or public safety accidents.

---

## 3. Proposed Solution
An automated AI computer vision platform that ingests road inspection media, identifies visible road defects with bounding box visual overlays, evaluates hazard severity ratings, persists user-isolated audit logs in a PostgreSQL database, and presents executive condition metrics on an interactive command dashboard.

---

## 4. Key Features
- **Multi-Modal Inspection Input**: Image upload (drag & drop), dashcam video frame sampling (MP4/WebM), and browser camera streaming.
- **AI Road Hazard Segmentation**: Detects Potholes, Transverse/Longitudinal Cracks, Surface Raveling, and Skid Marks.
- **Visual Canvas Overlays**: Server-side bounding box overlays with confidence percentages and color-coded severity tags.
- **Executive Command Dashboard**: Interactive analytics charts powered by Recharts (Severity Distribution, Media Source Breakdown, Inspection Trends).
- **Searchable Audit History**: Inspection audit log with damage type filtering, severity sorting, pagination, and delete confirmation modal.
- **Secure Authentication & Isolation**: Salted password hashing (PBKDF2/Bcrypt), stateless JWT tokens, and strict user-scoped multi-tenancy isolation.

---

## 5. End-to-End Architecture

```
User (Browser SPA)
       │
       ├── 1. HTTPS Request & JWT Authorization Header
       ▼
FastAPI Backend Gateway (/api/v1)
       │
       ├── 2. JWT Identity Resolution
       ├── 3. Magic Byte Binary File Security Check
       ▼
YoloRoadDamageDetector Model Adapter
       │
       ├── 4. Neural Network Forward Pass / NMS Filtering
       ├── 5. Severity Grading Matrix
       ▼
PostgreSQL / SQLite Database
       │
       ├── 6. Relational Persistence
       ▼
Annotated JSON API Response
```

---

## 6. AI Pipeline
1. **Input Validation**: Magic byte signature inspection, 25MB payload check, and image decoding.
2. **Pre-Processing**: RGB matrix normalization and corruption verification.
3. **Model Inference**: YOLOv8 neural network forward pass (`YoloRoadDamageDetector` singleton loaded once at server startup).
4. **Post-Processing**: Non-Maximum Suppression (NMS IoU 0.45), coordinate percentage scaling, and explainable severity grading (`CRITICAL`, `HIGH`, `MEDIUM`, `SAFE`).
5. **Annotated Overlay**: Server-side bounding box overlay rendering returned as Base64 JPEG Data URIs.

---

## 7. Authentication
- **Password Security**: Salted PBKDF2/Bcrypt hashing with unique 16-byte random salts. Plaintext passwords are never stored or logged.
- **Session Tokens**: Stateless `HS256` signed JWT Bearer Tokens with expiration claims (`exp`) and token revocation list.
- **Protected Routes**: React `ProtectedRoute` client component and FastAPI `get_current_user_id` server dependency.

---

## 8. Security Controls
- **File Upload Security**: Binary magic byte verification (JPG, PNG, WebP, MP4, WebM), UUID filename sanitization, non-executable temp storage, auto-cleanup post-inference.
- **Multi-Tenancy Isolation**: Server-side user ownership validation (`user_id == current_user.id`) on all database queries.
- **Security HTTP Headers**: HSTS, CSP, X-Frame DENY, X-Content-Type-Options enforced on API responses.

---

## 9. Tech Stack
- **Frontend**: React 18.3.1, TypeScript 5.5.3, Vite 5.4.11, Tailwind CSS 3.4.14, Lucide React, Recharts.
- **Backend API**: FastAPI 0.115.0, Python 3.13.1, Pydantic v2.9.2, Uvicorn 0.32.0, Passlib 1.7.4.
- **AI Engine**: PyTorch 2.5+, YOLOv8 (`ultralytics 8.3.0`), Pillow 11.0.0, OpenCV 4.10.0.
- **Database**: PostgreSQL (`asyncpg 0.30.0`) for production, SQLite (`aiosqlite 0.20.0`) for local development.

---

## 10. Project Structure
```
c:/SmartRoadDamage/
├── ai/
│   ├── models/            # PyTorch model weights (best.pt)
│   ├── pipeline/          # YoloRoadDamageDetector & Severity Grader
│   └── utils/             # Image pre-processing & annotated rendering
├── backend/
│   ├── app/
│   │   ├── api/v1/        # FastAPI Routers (auth, detections, analytics, health)
│   │   ├── core/          # Config & Security JWT handling
│   │   ├── db/            # SQLAlchemy session & database engine
│   │   ├── models/        # UserModel, DetectionModel, DamageDetectionModel
│   │   └── schemas/       # Pydantic DTO validation models
│   ├── requirements.txt   # Backend dependency lock
│   └── test_*.py          # Automated test suites (65 tests)
├── src/
│   ├── components/        # UI Components (Navbar, Sidebar, UploadZone, Canvas)
│   ├── context/           # AuthContext provider
│   └── pages/             # Landing, Dashboard, Detect, Result, History, Analytics
├── .env.example           # Production environment template
├── SECURITY.md            # Security Architecture & Audit Report
├── API.md                 # REST API Specification
├── DEPLOYMENT.md          # Step-by-step Deployment Guide
└── README.md              # Project documentation
```

---

## 11. Installation Instructions

### Prerequisites
- Node.js v20+ & npm
- Python 3.10+ & `py` launcher

### 1. Environment Setup
Copy the template configuration:
```bash
cp .env.example .env
```

### 2. Frontend Dependencies
```bash
npm install
```

### 3. Backend Python Setup
```bash
pip install -r backend/requirements.txt
```

---

## 12. Environment Variables (`.env`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `ENVIRONMENT` | `production` | Environment mode (`development` or `production`) |
| `VITE_AI_SERVICE_TYPE` | `mock` | Engine mode (`mock` or `api`) |
| `VITE_AI_API_URL` | `http://localhost:8000/api/v1/detections` | Real AI backend API URL |
| `JWT_SECRET` | Secret Key | HMAC-SHA256 signing secret |
| `DATABASE_URL` | `sqlite+aiosqlite:///./smart_road_damage.db` | Database connection URI |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | CORS allowed origin domains |
| `MAX_UPLOAD_SIZE_MB` | `25` | Maximum upload size limit in MB |

---

## 13. Database Setup
SQLite (`smart_road_damage.db`) is used for local development. For PostgreSQL in production:
```bash
DATABASE_URL=postgresql+asyncpg://db_user:db_password@postgres-host:5432/smartroaddamage
```

---

## 14. AI Model Weights Setup
Place custom trained PyTorch YOLOv8 model weights at:
`ai/models/best.pt`

When custom weights are not present, the system transparently operates on its computer vision feature fallback engine (`is_simulated = True`).

---

## 15. Running Locally

### Development Server
```bash
npm run dev
```

### Backend API Server
```bash
py -m uvicorn app.main:app --reload --port 8000
```

---

## 16. API Documentation
See [`API.md`](file:///c:/SmartRoadDamage/API.md) for full REST API specifications and JSON schemas.

---

## 17. Testing
Run all 5 test suites (65 tests):
```bash
py backend/test_auth_flow.py
py backend/test_database_api.py
py backend/test_real_ai_pipeline.py
py backend/test_video_camera_pipeline.py
py backend/test_dashboard_analytics.py
```

---

## 18. Production Deployment
See [`DEPLOYMENT.md`](file:///c:/SmartRoadDamage/DEPLOYMENT.md) for complete Nginx reverse proxy, Gunicorn worker, and PostgreSQL deployment setup.

---

## 19. Demo Flow
1. Open Landing Page $\rightarrow$ Overview of AI road inspection value proposition.
2. Click `"Start Detection"` or `"Explore Dashboard"`.
3. Register / Login with secure password strength check.
4. Select `[ IMAGE ]`, `[ VIDEO ]`, or `[ CAMERA ]` mode.
5. Upload road photo/video $\rightarrow$ Watch dynamic progressive AI analysis status.
6. View annotated visual overlay with bounding boxes, confidence, and severity rating.
7. Inspect searchable History audit log and Recharts analytics charts.

---

## 20. Limitations
- **Weights Dependency**: Trained PyTorch weights (`ai/models/best.pt`) must be supplied for custom deep-learning inference.
- **WebCam HTTPS Policy**: Browser camera access requires HTTPS TLS connections in non-localhost deployments.

---

## 21. Future Scope
- **GPS Coordinates Mapping**: Integration with Leaflet/Google Maps for geographic GIS road hazard pinning.
- **Multi-Surveyor Fleet Sync**: WebSocket live streaming for municipal road repair dispatch teams.

---

## 22. Reproducibility & Step-by-Step Execution Guide

To reproduce the project environment from scratch:

1. **Clone Repository**:
   ```bash
   git clone https://github.com/organization/smart-road-damage.git
   cd smart-road-damage
   ```
2. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```
3. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```
4. **Install Backend Dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```
5. **Configure Database Engine**:
   Default SQLite schema initializes automatically. For PostgreSQL, set `DATABASE_URL` in `.env`.
6. **Configure AI Model Weights**:
   Place PyTorch model weights file at `ai/models/best.pt`.
7. **Start Backend API Server**:
   ```bash
   py -m uvicorn app.main:app --port 8000
   ```
8. **Start Frontend Client**:
   ```bash
   npm run dev
   ```
9. **Execute Automated System Tests**:
   ```bash
   py backend/test_auth_flow.py
   py backend/test_database_api.py
   py backend/test_real_ai_pipeline.py
   py backend/test_video_camera_pipeline.py
   py backend/test_dashboard_analytics.py
   ```
