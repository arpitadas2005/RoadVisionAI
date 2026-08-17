import io
import base64
from typing import List, Dict, Any
from PIL import Image, ImageDraw, ImageFont

def generate_annotated_image_base64(
    image_bytes: bytes,
    detections: List[Dict[str, Any]]
) -> str:
    """
    Generate an annotated road image with color-coded bounding boxes and confidence labels.
    Returns secure base64 data URI string (data:image/jpeg;base64,...).
    Does NOT expose internal server file paths.
    """
    try:
        img = Image.open(io.BytesIO(image_bytes))
        if img.mode != "RGB":
            img = img.convert("RGB")

        draw = ImageDraw.Draw(img)
        width, height = img.width, img.height

        # Color scheme by severity/damage type
        colors = {
            "critical": (239, 68, 68),   # Red (#EF4444)
            "warning": (249, 115, 22),   # Orange (#F97316)
            "high": (249, 115, 22),      # Orange
            "medium": (234, 179, 8),     # Yellow/Amber (#EAB308)
            "safe": (16, 185, 129),      # Emerald (#10B981)
        }

        for det in detections:
            box = det.get("bounding_box", {})
            # Denormalize percentage coordinates to absolute pixel values
            x_min = (box.get("x", 0.0) / 100.0) * width
            y_min = (box.get("y", 0.0) / 100.0) * height
            x_max = x_min + ((box.get("width", 0.0) / 100.0) * width)
            y_max = y_min + ((box.get("height", 0.0) / 100.0) * height)

            sev = (det.get("severity") or "warning").lower()
            stroke_color = colors.get(sev, (6, 182, 212))

            # Draw bounding box rectangle
            draw.rectangle([x_min, y_min, x_max, y_max], outline=stroke_color, width=4)

            # Draw label banner background
            label_text = f"{det.get('label', 'Defect')} ({int(det.get('confidence', 0.85) * 100)}%)"
            text_bbox = draw.textbbox((x_min, y_min), label_text)
            text_w = text_bbox[2] - text_bbox[0] + 12
            text_h = text_bbox[3] - text_bbox[1] + 8

            banner_y_min = max(0, y_min - text_h)
            draw.rectangle([x_min, banner_y_min, x_min + text_w, banner_y_min + text_h], fill=stroke_color)
            draw.text((x_min + 6, banner_y_min + 3), label_text, fill=(255, 255, 255))

        # Save annotated image buffer
        output_buffer = io.BytesIO()
        img.save(output_buffer, format="JPEG", quality=90)
        base64_data = base64.b64encode(output_buffer.getvalue()).decode("utf-8")

        return f"data:image/jpeg;base64,{base64_data}"
    except Exception as err:
        print(f"Warning: Failed to render annotated image overlay: {err}")
        return ""
