"use client";

import { useEffect, useRef, useState } from "react";

export const useDraw = (onDraw: ({ context, currentPoint, previousPoint }: Draw) => void) => {
  const [mouseDown, setMouseDown] = useState(false);
  const [canDraw, setCanDraw] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previousPoint = useRef<Point | null>(null);

  const onMouseDown = () => setMouseDown(true);

  const enableDraw = () => setCanDraw(true);
  const disableDraw = () => setCanDraw(false);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  const mouseUpHandler = () => {
    setMouseDown(false);
    previousPoint.current = null;
  };

  useEffect(() => {
    const handleMovement = (e: MouseEvent) => {
      if (!mouseDown || !canDraw) return;
      const currentPoint = computeCanvasPoint(e);
      
      const context = canvasRef.current?.getContext('2d');

      if (!context || !currentPoint) return;

      onDraw({ context, currentPoint, previousPoint: previousPoint.current });
      previousPoint.current = currentPoint;
    }

    const computeCanvasPoint = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.x;
      const y = e.clientY - rect.y;

      return { x, y };
    }

    canvasRef.current?.addEventListener('mousemove', handleMovement);
    canvasRef.current?.addEventListener('mouseleave', mouseUpHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    return () => {
      canvasRef.current?.removeEventListener('mousemove', handleMovement);
      canvasRef.current?.removeEventListener('mouseleave', mouseUpHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
    }
  }, [mouseDown, onDraw, canDraw])
  

  return { canvasRef, onMouseDown, clear, enableDraw, disableDraw, canDraw };
};
