import os
import sys
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Smart Road Damage API"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Security Configuration
    SECRET_KEY: str = os.getenv("JWT_SECRET", "")
    ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440)) # 24 hours
    
    # CORS Security Origins
    @property
    def ALLOWED_ORIGINS(self) -> list[str]:
        raw_origins = os.getenv("ALLOWED_ORIGINS", "")
        if raw_origins:
            return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]
        return [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
        ]
    
    # Database Connection String (PostgreSQL for prod, SQLite for local dev)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./smart_road_damage.db")
    
    # File Upload Security Limits
    MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", 25))
    ALLOWED_IMAGE_TYPES: set[str] = {"image/jpeg", "image/png", "image/webp"}
    ALLOWED_VIDEO_TYPES: set[str] = {"video/mp4", "video/webm"}
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Phase 13 Enforcement: Fail fast if JWT_SECRET is missing in production environment
if settings.ENVIRONMENT == "production" and (not settings.SECRET_KEY or settings.SECRET_KEY == "default_jwt_secret_change_in_production"):
    print("FATAL ERROR: JWT_SECRET environment variable is missing or set to a default value in production mode!", file=sys.stderr)
    print("Please configure a strong, random JWT_SECRET in your production .env environment file.", file=sys.stderr)
    sys.exit(1)
elif not settings.SECRET_KEY:
    # Use development default secret key when in development mode
    settings.SECRET_KEY = "dev_secret_key_smart_road_damage_v1_8812a"
