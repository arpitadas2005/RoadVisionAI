from fastapi import APIRouter, Header, Depends
from typing import Optional, Dict, Any, List
from collections import Counter
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.db.session import get_db
from app.models.detection import DetectionModel
from app.api.v1.auth import get_current_user_id

router = APIRouter()

@router.get("/summary")
async def get_analytics_summary(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    user_id = get_current_user_id(authorization)
    
    # Query database for user-isolated detection records (Phase 4 & Phase 10)
    stmt = (
        select(DetectionModel)
        .options(selectinload(DetectionModel.damage_detections))
        .where(DetectionModel.user_id == user_id)
    )
    result = await db.execute(stmt)
    user_records = result.scalars().all()
    
    total_detections = len(user_records)
    image_count = sum(1 for r in user_records if r.input_type == "image")
    video_count = sum(1 for r in user_records if r.input_type == "video")
    camera_count = sum(1 for r in user_records if r.input_type == "camera")

    all_damage_items = []
    critical_count = 0
    high_count = 0
    medium_count = 0
    low_count = 0

    for r in user_records:
        sev = (r.overall_severity or "safe").lower()
        if sev == "critical":
            critical_count += 1
        elif sev == "high":
            high_count += 1
        elif sev == "medium" or sev == "warning":
            medium_count += 1
        else:
            low_count += 1

        for det in r.damage_detections:
            all_damage_items.append(det.damage_type or "pothole")

    total_damage_instances = len(all_damage_items)
    
    most_common_type = "None"
    if all_damage_items:
        counter = Counter(all_damage_items)
        most_common_type = counter.most_common(1)[0][0]
        if most_common_type == "surface_damage":
            most_common_type = "Surface Damage"
        elif most_common_type == "other_defect":
            most_common_type = "Other Defect"
        else:
            most_common_type = most_common_type.capitalize()

    avg_health_score = (
        sum(r.road_condition_score for r in user_records) // total_detections
        if total_detections > 0
        else 75
    )

    return {
        "total_detections": total_detections,
        "image_count": image_count,
        "video_count": video_count,
        "camera_count": camera_count,
        "total_damage_instances": total_damage_instances,
        "critical_count": critical_count,
        "high_count": high_count,
        "medium_count": medium_count,
        "low_count": low_count,
        "most_common_damage_type": most_common_type,
        "average_road_health_index": avg_health_score
    }

@router.get("/trends")
async def get_analytics_trends(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
) -> List[Dict[str, Any]]:
    user_id = get_current_user_id(authorization)
    
    stmt = (
        select(DetectionModel)
        .options(selectinload(DetectionModel.damage_detections))
        .where(DetectionModel.user_id == user_id)
    )
    result = await db.execute(stmt)
    user_records = result.scalars().all()

    total_count = len(user_records)
    total_defects = sum(len(r.damage_detections) for r in user_records)
    avg_score = (
        sum(r.road_condition_score for r in user_records) // total_count
        if total_count > 0
        else 75
    )

    return [
        {"period": "Week 1", "inspections": total_count, "defects": total_defects, "avg_score": avg_score},
        {"period": "Week 2", "inspections": total_count, "defects": total_defects, "avg_score": avg_score},
        {"period": "Week 3", "inspections": total_count, "defects": total_defects, "avg_score": avg_score},
        {"period": "Week 4", "inspections": total_count, "defects": total_defects, "avg_score": avg_score},
    ]
