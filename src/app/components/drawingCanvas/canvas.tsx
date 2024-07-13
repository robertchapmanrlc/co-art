'use client'

import { useEffect, useState } from 'react';
import styles from './canvas.module.css';
import { useDraw } from "@/hooks/useDraw";
import { socket } from '../../../socket';
import { drawLine } from '@/utils/drawLine';

export default function Canvas() {

  const { canvasRef, onMouseDown } = useDraw(createLine);

  const color = '#00F';

  function createLine({ context, previousPoint, currentPoint }: Draw) {
    socket.emit('draw-line', ({ currentPoint, context, previousPoint, color }));
    drawLine({ context, currentPoint, previousPoint, color });
  }

  useEffect(() => {

    const context = canvasRef.current?.getContext('2d');

    socket.on('draw-line', ({ currentPoint, color, previousPoint }: DrawLineProps) => {
      if (!context) return;
      drawLine({ previousPoint, currentPoint, color, context });
    });

    return () => {
      socket.off('draw-line');
    };
  }, [canvasRef]);

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
