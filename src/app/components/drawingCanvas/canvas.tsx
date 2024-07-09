'use client'

import styles from './canvas.module.css';
import { useDraw } from "@/hooks/useDraw";

export default function Canvas() {
  const { canvasRef, onMouseDown } = useDraw(drawLine);

  function drawLine ({ context, previousPoint, currentPoint }: Draw) {
    const { x: currentX, y: currentY } = currentPoint;
    const lineColor = '#00F';
    const lineWidth = 5;

    const startPoint = previousPoint ?? currentPoint;
    context.beginPath();
    context.lineWidth = lineWidth;
    context.strokeStyle = lineColor;
    context.moveTo(startPoint.x, startPoint.y);
    context.lineTo(currentX, currentY);
    context.stroke();

    context.fillStyle = lineColor;
    context.beginPath();
    context.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    context.fill();
  }

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={onMouseDown}
      width={400}
      height={400}
      className={styles.drawingCanvas}
    />
  );
}
