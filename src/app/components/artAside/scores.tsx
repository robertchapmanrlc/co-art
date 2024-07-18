"use client";

import { useEffect, useState } from "react";
import { socket } from "../../../socket";
import styles from './artAside.module.css';

export default function Scores() {
  const [scores, setScores] = useState<number[]>([]);

  useEffect(() => {

    socket.on("game-ended", (scores) => {
      setScores(scores);
    });

    return () => {
      socket.off('game-ended');
    }
  }, []);

  return (
    <section className={styles.scores}>
      {scores.map((score, i) => (
        <p key={i} className={styles.score}>{score}</p>
      ))}
    </section>
  );
}
