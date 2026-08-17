import { DetectedObject } from '../types';

export function drawBoundingBoxesOnCanvas(
  canvas: HTMLCanvasElement,
  imageElement: HTMLImageElement | HTMLVideoElement,
  detections: DetectedObject[],
  selectedId: string | null = null,
  activeSeverityFilter: string = 'all'
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const displayWidth = imageElement.clientWidth || canvas.clientWidth || 800;
  const displayHeight = imageElement.clientHeight || canvas.clientHeight || 500;

  canvas.width = displayWidth;
  canvas.height = displayHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const filteredDetections = detections.filter((d) => {
    if (activeSeverityFilter === 'all') return true;
    return d.severity === activeSeverityFilter;
  });

  filteredDetections.forEach((det) => {
    const isSelected = selectedId === det.id;

    // Convert percentage bounding box coordinates [0..100] to actual canvas pixel values
    const x = (det.box.x / 100) * displayWidth;
    const y = (det.box.y / 100) * displayHeight;
    const w = (det.box.width / 100) * displayWidth;
    const h = (det.box.height / 100) * displayHeight;

    let strokeColor = '#06b6d4'; // Default cyan
    let fillColor = 'rgba(6, 182, 212, 0.15)';

    if (det.severity === 'critical') {
      strokeColor = '#ef4444'; // Red
      fillColor = 'rgba(239, 68, 68, 0.2)';
    } else if (det.severity === 'warning') {
      strokeColor = '#f97316'; // Orange
      fillColor = 'rgba(249, 115, 22, 0.2)';
    } else if (det.severity === 'safe') {
      strokeColor = '#10b981'; // Green
      fillColor = 'rgba(16, 185, 129, 0.2)';
    }

    if (isSelected) {
      strokeColor = '#38bdf8'; // Bright cyan blue highlight
      fillColor = 'rgba(56, 189, 248, 0.35)';
    }

    // 1. Draw Bounding Box Fill & Stroke
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, w, h);

    ctx.lineWidth = isSelected ? 3.5 : 2.5;
    ctx.strokeStyle = strokeColor;

    if (isSelected) {
      ctx.shadowColor = strokeColor;
      ctx.shadowBlur = 15;
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.strokeRect(x, y, w, h);

    // 2. Draw Corner Crosshair Reticles
    const cornerLength = Math.min(12, Math.min(w, h) / 3);
    ctx.lineWidth = isSelected ? 4 : 3;
    ctx.strokeStyle = strokeColor;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(x, y + cornerLength);
    ctx.lineTo(x, y);
    ctx.lineTo(x + cornerLength, y);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(x + w - cornerLength, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + cornerLength);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(x, y + h - cornerLength);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x + cornerLength, y + h);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(x + w - cornerLength, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + w, y + h - cornerLength);
    ctx.stroke();

    // 3. Draw Label Tag Badge
    ctx.shadowBlur = 0;
    const labelText = `${det.label} (${(det.confidence * 100).toFixed(0)}%)`;
    ctx.font = '600 12px Inter, sans-serif';
    const textMetrics = ctx.measureText(labelText);
    const badgePaddingX = 8;
    const badgeHeight = 22;
    const badgeWidth = textMetrics.width + badgePaddingX * 2;

    const badgeX = Math.max(0, Math.min(x, displayWidth - badgeWidth));
    const badgeY = y > badgeHeight ? y - badgeHeight : y;

    ctx.fillStyle = strokeColor;
    ctx.fillRect(badgeX, badgeY, badgeWidth, badgeHeight);

    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.fillText(labelText, badgeX + badgePaddingX, badgeY + badgeHeight / 2);
  });
}
