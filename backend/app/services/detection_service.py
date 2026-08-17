import uuid
import time
from typing import Dict, Any, List
from ai.pipeline.yolo_detector import global_detector
from ai.pipeline.severity_grader import calculate_severity_and_score
from ai.utils.annotated_image import generate_annotated_image_base64
from ai.utils.video_processing import process_video_bytes_pipeline
from app.schemas.detection import DetectionRecordResponse, DetectedObjectSchema, BoundingBoxSchema

def process_road_image_inference(
    file_bytes: bytes,
    filename: str,
    user_id: str,
    location_name: str = "Survey Location Sector B-4",
    input_type: str = "image"
) -> Dict[str, Any]:
    """
    Execute AI Inference Pipeline for Image, Video, or Camera Stream:
    1. Handles image vs video frame sampling
    2. Runs YOLO model prediction (PyTorch or fallback engine)
    3. Aggregates detection metrics & severity index score
    4. Generates annotated image URI
    5. Returns structured JSON dictionary
    """
    is_video = input_type == "video" or filename.lower().endswith(".mp4") or filename.lower().endswith(".webm")

    if is_video:
        vid_res = process_video_bytes_pipeline(file_bytes, filename, global_detector, sample_rate_fps=1.0)
        
        record_id = f"det-{uuid.uuid4().hex[:10]}"
        file_size_str = f"{(len(file_bytes) / (1024 * 1024)):.2f} MB"

        detected_objects = [
            DetectedObjectSchema(
                id=d["id"],
                damage_type=d["damage_type"],
                label=d["label"],
                confidence=d["confidence"],
                severity=d["severity"],
                bounding_box=BoundingBoxSchema(**d["bounding_box"]),
                description=d.get("description"),
                recommended_action=d.get("recommended_action")
            )
            for d in vid_res["detections"]
        ]

        return {
            "id": record_id,
            "user_id": user_id,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "input_source": "video",
            "original_media_url": f"/uploads/{filename}",
            "overall_severity": vid_res["overall_severity"],
            "overall_condition": vid_res["overall_condition"],
            "road_condition_score": vid_res["road_condition_score"],
            "detection_count": vid_res["total_detected_defects"],
            "processing_time_ms": vid_res["processing_time_ms"],
            "location_name": location_name,
            "filename": filename,
            "file_size": file_size_str,
            "detections": detected_objects,
            "annotated_image": vid_res["annotated_image"],
            "is_simulated": False
        }

    # Image or Live Camera Frame Processing
    raw_pred = global_detector.predict(file_bytes)
    detections_list = global_detector.process_results(raw_pred)
    overall_sev, road_score, condition_label = calculate_severity_and_score(detections_list)

    if not detections_list:
        overall_sev = "safe"
        condition_label = "No visible damage detected"

    annotated_uri = generate_annotated_image_base64(file_bytes, detections_list)
    record_id = f"det-{uuid.uuid4().hex[:10]}"
    file_size_str = f"{(len(file_bytes) / (1024 * 1024)):.2f} MB"

    detected_objects = [
        DetectedObjectSchema(
            id=d["id"],
            damage_type=d["damage_type"],
            label=d["label"],
            confidence=d["confidence"],
            severity=d["severity"],
            bounding_box=BoundingBoxSchema(**d["bounding_box"]),
            description=d["description"],
            recommended_action=d["recommended_action"]
        )
        for d in detections_list
    ]

    return {
        "id": record_id,
        "user_id": user_id,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "input_source": "camera" if input_type == "camera" else "image",
        "original_media_url": f"/uploads/{filename}",
        "overall_severity": overall_sev,
        "overall_condition": condition_label,
        "road_condition_score": road_score,
        "detection_count": len(detected_objects),
        "processing_time_ms": raw_pred.get("processing_time_ms", 140),
        "location_name": location_name,
        "filename": filename,
        "file_size": file_size_str,
        "detections": detected_objects,
        "annotated_image": annotated_uri,
        "is_simulated": raw_pred.get("is_simulated", True)
    }
