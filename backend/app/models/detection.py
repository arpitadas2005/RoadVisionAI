from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.session import Base

class DetectionModel(Base):
    __tablename__ = "detections"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    filename = Column(String, nullable=False)
    input_type = Column(String, default="image") # 'image' | 'video'
    overall_condition = Column(String, nullable=False)
    overall_severity = Column(String, nullable=False) # 'critical' | 'high' | 'medium' | 'safe'
    road_condition_score = Column(Integer, default=75)
    detection_count = Column(Integer, default=0)
    processing_time_ms = Column(Integer, default=140)
    location_name = Column(String, default="Survey Sector B-4")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    # Relationships
    user = relationship("UserModel", back_populates="detections")
    damage_detections = relationship("DamageDetectionModel", back_populates="detection", cascade="all, delete-orphan")
