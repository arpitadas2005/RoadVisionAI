from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.session import Base

class DamageDetectionModel(Base):
    __tablename__ = "damage_detections"

    id = Column(String, primary_key=True, index=True)
    detection_id = Column(String, ForeignKey("detections.id", ondelete="CASCADE"), nullable=False, index=True)
    damage_type = Column(String, nullable=False) # 'pothole' | 'crack' | 'surface_damage' | 'other_defect'
    label = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    severity = Column(String, nullable=False) # 'critical' | 'warning' | 'safe'
    bounding_box = Column(Text, nullable=False) # Stored as JSON string {"x": 10, "y": 20, "width": 30, "height": 40}
    description = Column(Text, nullable=True)
    recommended_action = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    detection = relationship("DetectionModel", back_populates="damage_detections")
