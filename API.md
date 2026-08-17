# Smart Road Damage - REST API Specification

This document details the public and protected REST API v1 endpoints for **Smart Road Damage**.

Base URL: `http://localhost:8000/api/v1` (Development) | `https://api.smartroad.city.gov/api/v1` (Production)

---

## 1. Authentication Endpoints

### `POST /auth/register`
Create a new operator account.

* **Request Body**:
  ```json
  {
    "full_name": "Jane Doe",
    "email": "jane.doe@smartcity.gov",
    "password": "StrongPassword123!",
    "confirm_password": "StrongPassword123!",
    "organization": "Department of Transportation"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "id": "usr-8a92b1c4",
    "email": "jane.doe@smartcity.gov",
    "full_name": "Jane Doe",
    "organization": "Department of Transportation",
    "role": "operator",
    "created_at": "2026-08-16T12:00:00Z"
  }
  ```

### `POST /auth/login`
Authenticate credentials and issue a signed Bearer JWT access token.

* **Request Body**:
  ```json
  {
    "email": "jane.doe@smartcity.gov",
    "password": "StrongPassword123!"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 86400,
    "user": {
      "id": "usr-8a92b1c4",
      "email": "jane.doe@smartcity.gov",
      "full_name": "Jane Doe",
      "role": "operator"
    }
  }
  ```

### `POST /auth/logout`
Revoke active session token.
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Response (200 OK)**: `{"message": "Session logged out and access token invalidated."}`

### `GET /auth/me`
Retrieve authenticated user profile.
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Response (200 OK)**: User profile DTO.

---

## 2. Detection Endpoints

### `POST /detections`
Upload a road image or video for AI model inspection.

* **Headers**: `Authorization: Bearer <TOKEN>`
* **Form Data**:
  - `file`: Media binary file (JPG, PNG, WebP, MP4, WebM, Max 25MB)
  - `location`: String (optional, e.g. "Sector B-4 Highway")
  - `input_type`: String (`"image"`, `"video"`, or `"camera"`)
* **Response (201 Created)**:
  ```json
  {
    "id": "det-7f92b10a",
    "timestamp": "2026-08-16T12:05:00Z",
    "input_source": "image",
    "original_media_url": "/uploads/survey_92a81b.jpg",
    "overall_severity": "critical",
    "overall_condition": "Critical Structural Hazard - Immediate Repair Required",
    "road_condition_score": 38,
    "detection_count": 2,
    "processing_time_ms": 142,
    "location_name": "Sector B-4 Highway",
    "detections": [
      {
        "id": "box-1a2b",
        "damage_type": "pothole",
        "label": "Severe Pothole",
        "confidence": 0.96,
        "severity": "critical",
        "bounding_box": { "x": 25.0, "y": 42.0, "width": 38.0, "height": 32.0 },
        "recommended_action": "Emergency cold-patch filling & traffic diversion warning."
      }
    ],
    "annotated_image": "data:image/jpeg;base64,..."
  }
  ```

### `GET /detections`
List detection records belonging to authenticated user.
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Response (200 OK)**: Array of `DetectionRecordResponse` objects.

### `GET /detections/{id}`
Retrieve a single inspection record.
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Response (200 OK)**: Single inspection object. Returns `403 Forbidden` if unauthorized.

### `DELETE /detections/{id}`
Delete a single inspection record.
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Response (200 OK)**: `{"status": "deleted", "id": "det-7f92b10a"}`

---

## 3. Analytics Endpoints

### `GET /analytics/summary`
Retrieve aggregated statistics for authenticated user.
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Response (200 OK)**:
  ```json
  {
    "total_detections": 12,
    "image_count": 8,
    "video_count": 3,
    "camera_count": 1,
    "total_damage_instances": 24,
    "critical_count": 4,
    "high_count": 5,
    "medium_count": 3,
    "low_count": 0,
    "most_common_damage_type": "Pothole",
    "average_road_health_index": 74
  }
  ```

### `GET /analytics/trends`
Retrieve time-series weekly inspection trends.
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Response (200 OK)**: Array of trend data points.

---

## 4. Health Check Endpoint

### `GET /health`
Public health status check.
* **Response (200 OK)**: `{"status": "healthy", "service": "Smart Road Damage API", "version": "1.0.0"}`
