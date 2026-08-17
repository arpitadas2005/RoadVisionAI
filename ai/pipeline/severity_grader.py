from typing import List, Dict, Any, Tuple

def calculate_severity_and_score(detections: List[Dict[str, Any]]) -> Tuple[str, int, str]:
    """
    Documented, explainable severity grading and road condition score calculation.
    
    Severity Matrix:
    - Critical (Red): Any pothole with confidence >= 0.70 OR any defect occupying >= 8% frame area.
    - High (Orange): Deep longitudinal/transverse cracks or >= 3 total hazards.
    - Medium (Amber): Single surface defect or moderate crack.
    - Low / Safe (Green): Zero detected hazards or minor skid marks.
    
    Returns:
    - (overall_severity: str, road_condition_score: int, overall_condition_label: str)
    """
    if not detections:
        return "safe", 96, "Safe / Normal Road Surface"

    has_critical_pothole = False
    has_large_defect = False
    critical_count = 0
    warning_count = 0

    for det in detections:
        box = det.get("bounding_box", {})
        area_percent = (box.get("width", 0) * box.get("height", 0)) / 100.0 # Percentage of frame
        damage_type = (det.get("damage_type") or "").lower()
        conf = det.get("confidence", 0.0)

        if damage_type == "pothole" and conf >= 0.70:
            has_critical_pothole = True
            critical_count += 1
        elif area_percent >= 8.0:
            has_large_defect = True
            critical_count += 1
        elif damage_type in ("crack", "surface_damage"):
            warning_count += 1

    if has_critical_pothole or has_large_defect or critical_count > 0:
        overall_severity = "critical"
        score = max(10, 50 - (critical_count * 15) - (warning_count * 5))
        condition_label = "Critical Structural Hazard - Immediate Repair Required"
    elif warning_count >= 2 or len(detections) >= 3:
        overall_severity = "high"
        score = max(35, 65 - (warning_count * 8))
        condition_label = "High Priority Surface Degradation"
    elif warning_count == 1:
        overall_severity = "medium"
        score = 75
        condition_label = "Moderate Maintenance Needed"
    else:
        overall_severity = "safe"
        score = 92
        condition_label = "Safe Surface - Routine Monitoring"

    return overall_severity, score, condition_label
