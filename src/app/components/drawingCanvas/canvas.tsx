'use client'

import styles from './canvas.module.css';
import { useDraw } from "@/hooks/useDraw";

export default function Canvas() {
  const { canvasRef } = useDraw();
  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      className={styles.drawingCanvas}
    />
  );
}
