from sqlalchemy import Column, String, DateTime
from datetime import datetime, timezone
from app.db.session import Base

class ProfileModel(Base):
    __tablename__ = "profiles"

    id = Column(String, primary_key=True, index=True) # auth.users.id UUID
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    organization = Column(String, nullable=True, default="Road Infrastructure Ops")
    role = Column(String, default="operator")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
