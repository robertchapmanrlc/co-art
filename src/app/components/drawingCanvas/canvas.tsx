'use client'

import { useEffect, useState } from 'react';
import styles from './canvas.module.css';
import { useDraw } from "@/hooks/useDraw";
import { socket } from '../../../socket';

export default function Canvas() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

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

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

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
