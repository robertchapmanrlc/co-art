

export const drawLine = ({ currentPoint, previousPoint, context, color }: DrawLineProps) => {
  const { x: currentX, y: currentY } = currentPoint;
  const lineWidth = 25;

  const startPoint = previousPoint ?? currentPoint;
  context.beginPath();
  context.lineWidth = lineWidth;
  context.strokeStyle = color;
  context.moveTo(startPoint.x, startPoint.y);
  context.lineTo(currentX, currentY);
  context.stroke();

  context.fillStyle = color;
  context.beginPath();
  context.arc(startPoint.x, startPoint.y, 13, 0, 13 * Math.PI);
  context.fill();
};
