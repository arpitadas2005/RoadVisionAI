import json
import uuid
import time
from fastapi import APIRouter, HTTPException, status, Header, UploadFile, File, Form, Depends
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.db.session import get_db
from app.models.detection import DetectionModel
from app.models.damage_detection import DamageDetectionModel
from app.api.v1.auth import get_current_user_id
from app.services.file_security import (
    validate_file_size,
    validate_file_magic_bytes,
    sanitize_filename,
    create_temp_filepath,
    remove_temp_file
)
from app.schemas.detection import DetectionRecordResponse, DetectedObjectSchema, BoundingBoxSchema
from app.services.detection_service import process_road_image_inference
from app.services.audit_service import log_security_event

router = APIRouter()

@router.post("", response_model=DetectionRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_detection(
    file: UploadFile = File(...),
    location: Optional[str] = Form("Survey Location Sector B-4"),
    input_type: Optional[str] = Form("image"), # 'image' | 'video' | 'camera'
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
):
    user_id = get_current_user_id(authorization)
    
    # 1. Read binary header bytes for security validation
    contents = await file.read()
    
    # 2. File Size Enforcement (Max 25MB)
    if not validate_file_size(contents):
        log_security_event("file_size_exceeded", user_id=user_id, details=f"size={len(contents)} bytes")
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds maximum payload limit of 25MB."
        )

    # 3. Binary Magic Byte Signature Inspection
    is_valid_magic, mime_type = validate_file_magic_bytes(contents)
    if not is_valid_magic:
        log_security_event("invalid_magic_bytes", user_id=user_id, details=f"filename={file.filename}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Security Validation Failed: {mime_type}"
        )

    # 4. Filename Sanitization & Path Traversal Prevention
    safe_name = sanitize_filename(file.filename or "media.jpg")
    temp_path = create_temp_filepath(safe_name)

    try:
        # Write to isolated temp location for model processing
        with open(temp_path, "wb") as f:
            f.write(contents)

        # 5. AI Inference Processing Pipeline
        result_dict = process_road_image_inference(
            file_bytes=contents,
            filename=safe_name,
            user_id=user_id,
            location_name=location or "Survey Location Sector B-4",
            input_type=input_type or "image"
        )

        # 6. Database ORM Persistence (Phase 3 requirement)
        detection_entry = DetectionModel(
            id=result_dict["id"],
            user_id=user_id,
            filename=safe_name,
            input_type=result_dict["input_source"],
            overall_condition=result_dict["overall_condition"],
            overall_severity=result_dict["overall_severity"],
            road_condition_score=result_dict["road_condition_score"],
            detection_count=result_dict["detection_count"],
            processing_time_ms=result_dict["processing_time_ms"],
            location_name=result_dict["location_name"]
        )
        db.add(detection_entry)

        for det in result_dict.get("detections", []):
            damage_item = DamageDetectionModel(
                id=det.get("id", f"box-{uuid.uuid4().hex[:8]}"),
                detection_id=detection_entry.id,
                damage_type=det.get("type", "pothole"),
                label=det.get("label", "Road Hazard"),
                confidence=det.get("confidence", 0.90),
                severity=det.get("severity", "warning"),
                bounding_box=json.dumps(det.get("box", {"x": 20, "y": 20, "width": 30, "height": 30})),
                description=det.get("description", ""),
                recommended_action=det.get("recommendedAction", "")
            )
            db.add(damage_item)

        await db.commit()
        log_security_event("detection_success", user_id=user_id, details=f"id={detection_entry.id}")

        return DetectionRecordResponse(
            id=result_dict["id"],
            timestamp=result_dict["timestamp"],
            input_source=result_dict["input_source"],
            original_media_url=result_dict["original_media_url"],
            overall_severity=result_dict["overall_severity"],
            overall_condition=result_dict["overall_condition"],
            road_condition_score=result_dict["road_condition_score"],
            detection_count=result_dict["detection_count"],
            processing_time_ms=result_dict["processing_time_ms"],
            location_name=result_dict["location_name"],
            filename=result_dict["filename"],
            file_size=result_dict["file_size"],
            detections=result_dict["detections"],
            annotated_image=result_dict.get("annotated_image")
        )

    finally:
        # Privacy & Auto-Cleanup: Delete temporary upload file post-processing
        remove_temp_file(temp_path)

@router.get("", response_model=List[DetectionRecordResponse])
async def list_detections(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
):
    user_id = get_current_user_id(authorization)
    
    # Strict Server-Side User Isolation Query (Phase 4 requirement)
    stmt = (
        select(DetectionModel)
        .options(selectinload(DetectionModel.damage_detections))
        .where(DetectionModel.user_id == user_id)
        .order_by(DetectionModel.created_at.desc())
    )
    result = await db.execute(stmt)
    records = result.scalars().all()
    
    response_list = []
    for r in records:
        det_objects = []
        for d in r.damage_detections:
            box_data = json.loads(d.bounding_box) if d.bounding_box else {"x": 20, "y": 20, "width": 30, "height": 30}
            det_objects.append(
                DetectedObjectSchema(
                    id=d.id,
                    type=d.damage_type,
                    label=d.label,
                    confidence=d.confidence,
                    severity=d.severity,
                    box=BoundingBoxSchema(**box_data),
                    description=d.description,
                    recommendedAction=d.recommended_action
                )
            )

        response_list.append(
            DetectionRecordResponse(
                id=r.id,
                timestamp=r.created_at.strftime("%Y-%m-%dT%H:%M:%SZ") if r.created_at else time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                input_source=r.input_type,
                original_media_url="/uploads/survey_sample.jpg",
                overall_severity=r.overall_severity,
                overall_condition=r.overall_condition,
                road_condition_score=r.road_condition_score,
                detection_count=r.detection_count,
                processing_time_ms=r.processing_time_ms,
                location_name=r.location_name,
                filename=r.filename,
                file_size="2.4 MB",
                detections=det_objects
            )
        )

    return response_list

@router.get("/{id}", response_model=DetectionRecordResponse)
async def get_detection(
    id: str,
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
):
    user_id = get_current_user_id(authorization)
    
    stmt = (
        select(DetectionModel)
        .options(selectinload(DetectionModel.damage_detections))
        .where(DetectionModel.id == id)
    )
    result = await db.execute(stmt)
    record = result.scalars().first()

    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inspection record not found.")

    # User Data Isolation Check (Phase 4 requirement)
    if record.user_id != user_id:
        log_security_event("unauthorized_record_access_attempt", user_id=user_id, details=f"target_id={id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: You do not have permission to view this inspection record."
        )

    det_objects = []
    for d in record.damage_detections:
        box_data = json.loads(d.bounding_box) if d.bounding_box else {"x": 20, "y": 20, "width": 30, "height": 30}
        det_objects.append(
            DetectedObjectSchema(
                id=d.id,
                type=d.damage_type,
                label=d.label,
                confidence=d.confidence,
                severity=d.severity,
                box=BoundingBoxSchema(**box_data),
                description=d.description,
                recommendedAction=d.recommended_action
            )
        )

    return DetectionRecordResponse(
        id=record.id,
        timestamp=record.created_at.strftime("%Y-%m-%dT%H:%M:%SZ") if record.created_at else time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        input_source=record.input_type,
        original_media_url="/uploads/survey_sample.jpg",
        overall_severity=record.overall_severity,
        overall_condition=record.overall_condition,
        road_condition_score=record.road_condition_score,
        detection_count=record.detection_count,
        processing_time_ms=record.processing_time_ms,
        location_name=record.location_name,
        filename=record.filename,
        file_size="2.4 MB",
        detections=det_objects
    )

@router.delete("/{id}")
async def delete_detection(
    id: str,
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
):
    user_id = get_current_user_id(authorization)
    
    stmt = select(DetectionModel).where(DetectionModel.id == id)
    result = await db.execute(stmt)
    record = result.scalars().first()

    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inspection record not found.")

    # User Data Isolation Check (Phase 4 requirement)
    if record.user_id != user_id:
        log_security_event("unauthorized_delete_attempt", user_id=user_id, details=f"target_id={id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: You do not have permission to delete this record."
        )

    await db.delete(record)
    await db.commit()

    return {"status": "deleted", "id": id}
