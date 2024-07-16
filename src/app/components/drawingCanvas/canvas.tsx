'use client'

import { useEffect } from 'react';
import styles from './canvas.module.css';
import { useDraw } from "@/hooks/useDraw";
import { socket } from '../../../socket';
import { drawLine } from '@/utils/drawLine';
import { useUserContext } from '@/context/userContext';
import { canvasData } from '@/utils/pics';

export default function Canvas() {

  const { user: {name, room} } = useUserContext();

  const { canvasRef, onMouseDown, clear, enableDraw, disableDraw } = useDraw(createLine);

  const color = '#0F0';

  function createLine({ context, previousPoint, currentPoint }: Draw) {
    socket.emit('draw-line', ({ currentPoint, context, previousPoint, color, room }));
    drawLine({ context, currentPoint, previousPoint, color });
  }

  useEffect(() => {
    socket.emit("enter-room", { name, room });
  }, [name, room]);

  useEffect(() => {

    const context = canvasRef.current?.getContext('2d');

    socket.emit("client-ready", room);

    socket.on('draw-line', ({ currentPoint, color, previousPoint }: DrawLineProps) => {
      if (!context) return;
      drawLine({ previousPoint, currentPoint, color, context });
    });

    socket.on('preview-drawing', (image) => {
      const img = new Image();
      img.src = canvasData[image];
      img.onload = () => {
        context?.drawImage(img, 0, 0);
      };
    });

    socket.on('get-canvas-state', () => {
      if (!canvasRef.current?.toDataURL()) return;
      const state = canvasRef.current.toDataURL()
      socket.emit("canvas-state", ({state, room }));
    });
    
    socket.on("canvas-state-from-server", (state: string) => {
      const img = new Image();
      img.src = state;
      img.onload = () => {
        context?.drawImage(img, 0, 0);
      }
    });

    socket.on("enable-draw", () => {
      enableDraw();
    });

    socket.on("disable-draw", () => {
      disableDraw();
    });

    socket.on('clear', clear);

    return () => {
      socket.off('draw-line');
      socket.off('get-canvas-state');
      socket.off('canvas-state-from-server');
      socket.off('clear');
      socket.off('enable-draw');
      socket.off('disable-draw');
      socket.off('preview-drawing');
    };
  }, [canvasRef, clear, room, enableDraw, disableDraw]);

  return (
    <>
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        width={400}
        height={400}
        className={styles.drawingCanvas}
      />
    </>
  );
}
