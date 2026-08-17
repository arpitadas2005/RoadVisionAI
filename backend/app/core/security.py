import os
import hashlib
import hmac
import base64
import json
import time
from typing import Optional, Dict, Any
from app.core.config import settings

def hash_password(password: str) -> str:
    """
    Secure PBKDF2-HMAC-SHA256 password hashing with unique salt.
    Never stores plain-text passwords.
    """
    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return base64.b64encode(salt + key).decode('ascii')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password against stored salted hash in constant time to prevent timing attacks.
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
    
    header = {"alg": settings.ALGORITHM, "typ": "JWT"}
    
    header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    
    signature_base = f"{header_b64}.{payload_b64}"
    signature = hmac.new(
        settings.SECRET_KEY.encode('utf-8'),
        signature_base.encode('utf-8'),
        hashlib.sha256
    ).digest()
    
    signature_b64 = base64.urlsafe_b64encode(signature).decode().rstrip("=")
    return f"{signature_base}.{signature_b64}"

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify HMAC signature and expiration claim of JWT access token.
    """
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
            
        header_b64, payload_b64, signature_b64 = parts
        
        # Re-compute signature
        signature_base = f"{header_b64}.{payload_b64}"
        expected_sig = hmac.new(
            settings.SECRET_KEY.encode('utf-8'),
            signature_base.encode('utf-8'),
            hashlib.sha256
        ).digest()
        
        # Re-pad base64
        rem = len(signature_b64) % 4
        padded_sig_b64 = signature_b64 + ("=" * (4 - rem) if rem else "")
        provided_sig = base64.urlsafe_b64decode(padded_sig_b64.encode())
        
        if not hmac.compare_digest(expected_sig, provided_sig):
            return None
            
        rem_p = len(payload_b64) % 4
        padded_p_b64 = payload_b64 + ("=" * (4 - rem_p) if rem_p else "")
        payload = json.loads(base64.urlsafe_b64decode(padded_p_b64.encode()).decode())
        
        if payload.get("exp", 0) < time.time():
            return None # Expired
            
        return payload
    except Exception:
        return None
