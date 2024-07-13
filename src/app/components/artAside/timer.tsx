"use client";

import { useState, useEffect } from "react";
import { socket } from "../../../socket";
import styles from "./artAside.module.css";

export default function Timer() {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    socket.on("display-time", (time: number) => {
      setRemainingTime(time);
    });

    return () => {
      socket.off("display-time");
    };
  }, []);

  return (
    <div className={styles.time}>
      <h3>{remainingTime}</h3>
    </div>
  );
}
