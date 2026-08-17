from typing import List, Dict, Any

def normalize_bounding_box(
    x_min: float,
    y_min: float,
    x_max: float,
    y_max: float,
    img_width: int,
    img_height: int
) -> Dict[str, float]:
    """
    Convert absolute pixel coordinates [x_min, y_min, x_max, y_max] to normalized percentage values [0..100%].
    """
    if img_width <= 0 or img_height <= 0:
        return {"x": 20.0, "y": 20.0, "width": 30.0, "height": 30.0}

    x_percent = max(0.0, min(100.0, (x_min / img_width) * 100.0))
    y_percent = max(0.0, min(100.0, (y_min / img_height) * 100.0))
    w_percent = max(1.0, min(100.0, ((x_max - x_min) / img_width) * 100.0))
    h_percent = max(1.0, min(100.0, ((y_max - y_min) / img_height) * 100.0))

    return {
        "x": round(x_percent, 2),
        "y": round(y_percent, 2),
        "width": round(w_percent, 2),
        "height": round(h_percent, 2),
    }

def apply_nms(boxes: List[Dict[str, Any]], iou_threshold: float = 0.45) -> List[Dict[str, Any]]:
    """
    Apply IoU Non-Maximum Suppression to remove redundant overlapping bounding box predictions.
    """
    if not boxes:
        return []

    # Sort boxes by confidence descending
    sorted_boxes = sorted(boxes, key=lambda b: b.get("confidence", 0.0), reverse=True)
    selected = []

    for box in sorted_boxes:
        keep = True
        for prev in selected:
            if box.get("damage_type") == prev.get("damage_type"):
                iou = compute_iou(box["bounding_box"], prev["bounding_box"])
                if iou > iou_threshold:
                    keep = False
                    break
        if keep:
            selected.append(box)

    return selected

def compute_iou(box1: Dict[str, float], box2: Dict[str, float]) -> float:
    """
    Compute Intersection over Union (IoU) of two percentage bounding boxes.
    """
    x1_min, y1_min = box1["x"], box1["y"]
    x1_max, y1_max = box1["x"] + box1["width"], box1["y"] + box1["height"]

    x2_min, y2_min = box2["x"], box2["y"]
    x2_max, y2_max = box2["x"] + box2["width"], box2["y"] + box2["height"]

    inter_x_min = max(x1_min, x2_min)
    inter_y_min = max(y1_min, y2_min)
    inter_x_max = min(x1_max, x2_max)
    inter_y_max = min(y1_max, y2_max)

    inter_w = max(0.0, inter_x_max - inter_x_min)
    inter_h = max(0.0, inter_y_max - inter_y_min)
    inter_area = inter_w * inter_h

    area1 = box1["width"] * box1["height"]
    area2 = box2["width"] * box2["height"]
    union_area = area1 + area2 - inter_area

    if union_area <= 0:
        return 0.0
    return inter_area / union_area
