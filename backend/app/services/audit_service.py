import logging
import time
from typing import Optional

# Configure structured security logger
logger = logging.getLogger("security_audit")
logger.setLevel(logging.INFO)

# Console handler with clean formatting
if not logger.handlers:
    ch = logging.StreamHandler()
    formatter = logging.Formatter(
        '[SECURITY AUDIT] %(asctime)s - %(levelname)s - Event: %(message)s'
    )
    ch.setFormatter(formatter)
    logger.addHandler(ch)

def log_security_event(
    event_type: str,
    user_id: Optional[str] = None,
    ip_address: Optional[str] = None,
    details: Optional[str] = None
):
    """
    Log security-relevant events without recording passwords, JWT tokens, or credentials.
    """
    msg = f"type={event_type} | user_id={user_id or 'anonymous'} | ip={ip_address or 'unknown'} | details={details or 'none'}"
    logger.info(msg)
