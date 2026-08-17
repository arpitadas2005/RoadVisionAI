from pydantic import BaseModel, Field
from typing import List, Optional

class BoundingBoxSchema(BaseModel):
    x: float = Field(..., description="Left coordinate in percentage 0..100")
    y: float = Field(..., description="Top coordinate in percentage 0..100")
    width: float = Field(..., description="Width in percentage 0..100")
    height: float = Field(..., description="Height in percentage 0..100")

class DetectedObjectSchema(BaseModel):
    id: str
    damage_type: str # 'pothole' | 'crack' | 'surface_damage' | 'other_defect'
    label: str
    confidence: float
    severity: str # 'critical' | 'warning' | 'safe'
    bounding_box: BoundingBoxSchema
    description: Optional[str] = None
    recommended_action: Optional[str] = None

class DetectionRecordResponse(BaseModel):
    id: str
    timestamp: str
    input_source: str
    original_media_url: str
    overall_severity: str
    overall_condition: str
    road_condition_score: int
    detection_count: int
    processing_time_ms: int
    location_name: str
    filename: Optional[str] = None
    file_size: Optional[str] = None
    detections: List[DetectedObjectSchema]
    annotated_image: Optional[str] = None
