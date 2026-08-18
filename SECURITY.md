# Smart Road Damage / RoadVisionAI - Security Architecture & Production Audit Report

This document details the security architecture, Supabase authentication integration, Row Level Security (RLS) policies, and security audit checklist for **RoadVisionAI**.

---

## 1. Security Architecture Overview

* **Supabase Authentication**: Authentication is handled via official Supabase Auth (`@supabase/supabase-js`). Client sessions persist securely via `supabase.auth.getSession()` and real-time state listeners (`onAuthStateChange`). Plaintext passwords are never handled or stored by custom application logic.
* **Backend JWT Verification**: FastAPI decodes Supabase Bearer JWT tokens (`Authorization: Bearer <access_token>`). User identity is strictly derived server-side from the decoded `sub` claim (`auth.users.id`).
* **Authorization & Multi-Tenancy Data Isolation**: All inspection queries (`GET /detections`, `DELETE /detections/{id}`, `GET /analytics/summary`) enforce `record.user_id == current_user_id`. Cross-tenant requests return `HTTP 403 Forbidden`.
* **File Upload Defenses**: Binary magic byte header verification (JPG `FF D8 FF`, PNG `89 50 4E 47`, WebP `RIFF...WEBP`, MP4 `ftyp`, WebM `1A 45 DF A3`). Files are assigned randomized UUIDv4 names, stored in non-executable temporary paths (`temp_uploads/`), and automatically purged (`remove_temp_file`) post-inference.
* **Security HTTP Headers**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Content-Security-Policy`: Default-src restricted
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`

---

## 2. Supabase PostgreSQL Row Level Security (RLS) Policies

When deploying to Supabase PostgreSQL, execute the following schema and RLS policies:

```sql
-- 1. Create Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    organization TEXT DEFAULT 'Road Infrastructure Ops',
    role TEXT DEFAULT 'operator',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 2. Create Detections Table
CREATE TABLE IF NOT EXISTS public.detections (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    input_type TEXT DEFAULT 'image',
    overall_condition TEXT NOT NULL,
    overall_severity TEXT NOT NULL,
    road_condition_score INT DEFAULT 75,
    detection_count INT DEFAULT 0,
    processing_time_ms INT DEFAULT 140,
    location_name TEXT DEFAULT 'Survey Sector B-4',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Detections
ALTER TABLE public.detections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own detections"
    ON public.detections FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own detections"
    ON public.detections FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own detections"
    ON public.detections FOR DELETE
    USING (auth.uid() = user_id);
```

---

## 3. Final 16-Point Security Checklist

| Security Area | Status | Verified Control |
| :--- | :---: | :--- |
| **1. Supabase Auth Integration** | **PASS** | Official `@supabase/supabase-js` client, session persistence, automatic token refresh. |
| **2. Authorization & Multi-Tenancy** | **PASS** | Server-side user ownership verification (`user_id == current_user.id`), cross-tenant isolation. |
| **3. Password Security** | **PASS** | Supabase managed auth; zero plaintext passwords stored in custom tables. |
| **4. JWT Verification** | **PASS** | FastAPI Bearer token decoding (`sub` claim claim extraction), expiration claim check. |
| **5. File Upload Defenses** | **PASS** | Magic byte binary validation, 25MB payload limit, UUID sanitized names, non-executable temp files, auto-cleanup post-inference. |
| **6. API Input Validation** | **PASS** | Pydantic v2 DTO schema validation, strict email format checking, numeric coordinate boundaries. |
| **7. Rate Limiting** | **PASS** | Request payload size enforcement and connection throttling. |
| **8. CORS Security** | **PASS** | Restricted strictly to configured trusted origins (`ALLOWED_ORIGINS`). |
| **9. Security Headers** | **PASS** | Nosniff, Frame DENY, CSP, and HSTS headers enforced on all HTTP responses. |
| **10. Database Security & RLS** | **PASS** | Parameterized ORM query execution, user ownership foreign key constraints, Supabase RLS policies. |
| **11. Secrets Management** | **PASS** | Environment variables (`.env`), zero hardcoded secrets in source files, [`.env.example`](file:///.env.example) template provided. |
| **12. Privacy & Data Retention** | **PASS** | Temporary upload files purged post-inference; clear user communication on data usage. |
| **13. Security Audit Logging** | **PASS** | Structured security audit logging (`audit_service.py`) for login attempts, registrations, file uploads, and unauthorized access attempts. |
| **14. Error Handling** | **PASS** | Generic sanitized error responses to client; stack traces logged securely on server. |
| **15. HTTPS Configuration** | **PASS** | HTTPS termination documented at Load Balancer / Reverse Proxy level. |
| **16. Dependency Review** | **PASS** | Zero vulnerable outdated packages in production dependencies (`package.json`, `requirements.txt`). |

---

## 4. Vulnerability Reporting

To report security issues or vulnerability findings:  
`security@smartroad.city.gov`
