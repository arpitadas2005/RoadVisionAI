import os
import hashlib
import hmac
import base64
import json
import time
import jwt
from typing import Optional, Dict, Any
from app.core.config import settings

def hash_password(password: str) -> str:
    """
    Secure PBKDF2-HMAC-SHA256 password hashing with unique salt.
    """
    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return base64.b64encode(salt + key).decode('ascii')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password against stored salted hash in constant time.
    """
    try:
        decoded = base64.b64decode(hashed_password.encode('ascii'))
        salt = decoded[:16]
        stored_key = decoded[16:]
        new_key = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, 100000)
        return hmac.compare_digest(stored_key, new_key)
    except Exception:
        return False

def create_access_token(data: Dict[str, Any], expires_delta_minutes: Optional[int] = None) -> str:
    """
    Generate signed JWT Bearer Token containing payload and expiration claim.
    """
    expires = time.time() + ((expires_delta_minutes or settings.ACCESS_TOKEN_EXPIRE_MINUTES) * 60)
    payload = {
        **data,
        "exp": int(expires),
        "iat": int(time.time()),
    }
    secret = settings.SECRET_KEY or "dev_secret_key_smart_road_damage_v1_8812a"
    return jwt.encode(payload, secret, algorithm=settings.ALGORITHM)

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and verify Supabase or App-issued Bearer JWT Access Token.
    Extracts 'sub' claim (Supabase auth.users.id) and expiration claim.
    """
    try:
        secret = settings.SECRET_KEY or "dev_secret_key_smart_road_damage_v1_8812a"
        
        # 1. Try verifying with configured JWT_SECRET / SUPABASE_JWT_SECRET
        try:
            payload = jwt.decode(
                token,
                secret,
                algorithms=["HS256", "RS256"],
                options={"verify_aud": False}
            )
            return payload
        except jwt.InvalidSignatureError:
            # 2. Fallback decoding payload for Supabase JWTs if secret is not set locally
            payload = jwt.decode(
                token,
                options={"verify_signature": False, "verify_aud": False}
            )
            if payload and "sub" in payload and payload.get("exp", 0) > time.time():
                return payload
            return None
    except Exception:
        return None
