"use client";

import { useEffect, useRef } from "react";

export const useDraw = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleMovement = (e: MouseEvent) => {
      console.log({ x: e.clientX, y: e.clientY });
    }

    canvasRef.current?.addEventListener('mousemove', handleMovement);

    return () => {
      canvasRef.current?.removeEventListener('mousemove', handleMovement);
    }
  }, [])
  

  return { canvasRef };
};
