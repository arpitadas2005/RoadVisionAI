import os
import uuid
import re
from typing import Tuple
from app.core.config import settings

def validate_file_size(file_bytes: bytes, max_size_mb: int = settings.MAX_UPLOAD_SIZE_MB) -> bool:
    """
    Ensure uploaded file does not exceed maximum payload size limit.
    """
    max_bytes = max_size_mb * 1024 * 1024
    return len(file_bytes) <= max_bytes

def validate_file_magic_bytes(file_bytes: bytes) -> Tuple[bool, str]:
    """
    Inspect magic byte signatures of binary header to verify actual file format.
    Does not rely on client-supplied Content-Type or file extension alone.
    """
    if len(file_bytes) < 12:
        return False, "File buffer too small for binary header validation."

    # Magic byte signatures
    # JPEG: FF D8 FF
    if file_bytes.startswith(b'\xff\xd8\xff'):
        return True, "image/jpeg"

    # PNG: 89 50 4E 47 0D 0A 1A 0A
    if file_bytes.startswith(b'\x89PNG\r\n\x1a\n'):
        return True, "image/png"

    # WebP: RIFF ... WEBP
    if file_bytes.startswith(b'RIFF') and file_bytes[8:12] == b'WEBP':
        return True, "image/webp"

    # MP4: offset 4 ftyp
    if file_bytes[4:8] == b'ftyp':
        return True, "video/mp4"

    # WebM: 1A 45 DF A3
    if file_bytes.startswith(b'\x1a\x45\xdf\xa3'):
        return True, "video/webm"

    return False, "Invalid or unauthorized file binary header signature."

def sanitize_filename(original_filename: str) -> str:
    """
    Sanitize filename to prevent Directory Traversal, Command Injection, and Script Execution attacks.
    Generates a secure UUIDv4 prefix while retaining sanitized extension.
    """
    # Extract extension
    _, ext = os.path.splitext(original_filename)
    clean_ext = ext.lower().strip('.')

    # Allow only safe media extensions
    allowed_exts = {'jpg', 'jpeg', 'png', 'webp', 'mp4', 'webm'}
    if clean_ext not in allowed_exts:
        clean_ext = 'jpg'

    unique_id = uuid.uuid4().hex[:12]
    return f"survey_{unique_id}.{clean_ext}"

def create_temp_filepath(filename: str) -> str:
    """
    Generate isolated temporary filepath in scratch directory.
    """
    temp_dir = os.path.join(os.getcwd(), "temp_uploads")
    os.makedirs(temp_dir, exist_ok=True)
    return os.path.join(temp_dir, filename)

def remove_temp_file(filepath: str) -> None:
    """
    Safely delete temporary media file post-inference.
    """
    try:
        if os.path.exists(filepath):
            os.remove(filepath)
    except Exception as err:
        print(f"Warning: Failed to cleanup temp file {filepath}: {err}")
