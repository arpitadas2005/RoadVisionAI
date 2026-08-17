from abc import ABC, abstractmethod
from typing import Dict, Any, List

class RoadDamageDetector(ABC):
    """
    Abstract Base Class interface for Road Damage Detection Models.
    Allows replacing YOLOv8 with Faster R-CNN, ONNX Runtime, or custom PyTorch models.
    """

    @abstractmethod
    def load_model(self, model_path: str) -> bool:
        """
        Load neural network model weights into memory.
        """
        pass

    @abstractmethod
    def predict(self, image_bytes: bytes, confidence_threshold: float = 0.40) -> Dict[str, Any]:
        """
        Run inference on image bytes and return raw model predictions.
        """
        pass

    @abstractmethod
    def process_results(self, raw_predictions: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Post-process raw predictions into normalized bounding box detections.
        """
        pass
