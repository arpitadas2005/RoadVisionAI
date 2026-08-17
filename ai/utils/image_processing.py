import io
from typing import Tuple, Optional
from PIL import Image

def preprocess_image_bytes(image_bytes: bytes) -> Tuple[bool, Optional[Image.Image], str]:
    """
    Validate binary image stream, detect corruption, convert color space to RGB,
    and return PIL Image object with dimensions.
    """
    if not image_bytes or len(image_bytes) < 100:
        return False, None, "Image payload is empty or corrupted."

    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify() # Verify file integrity
        
        # Re-open for actual processing as verify() modifies file pointer
        img = Image.open(io.BytesIO(image_bytes))
        
        # Convert RGBA/P to RGB
        if img.mode != "RGB":
            img = img.convert("RGB")
            
        return True, img, f"{img.width}x{img.height}"
    except Exception as err:
        return False, None, f"Image processing failed: Invalid or corrupted image format ({err})."
