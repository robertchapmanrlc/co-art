"use client";

import styles from "./userList.module.css";
import { socket } from "../../../socket";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/userContext";

export default function UserList() {

  const [users, setUsers] = useState<User[]>([]);
  const [isCreator, setIsCreator] = useState(false);
  const [started, setStarted] = useState(false);

  const { user: { room } } = useUserContext();

  const router = useRouter();

  useEffect(() => {
    socket.emit('check-creator', room);
  }, [room]);

  useEffect(() => {

    socket.on('users', (users) => {
      setUsers(users);
    });

    socket.on("invalid-room", () => {
      router.push('/');
    });

    socket.on('is-creator', (isCreator) => {
      setIsCreator(isCreator);
    });

    return () => {
      socket.off('users');
      socket.off("invalid-room");
      socket.off('is-creator');
    }
  }, [users, router]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(room);
  }

  const startGame = () => {
    socket.emit("introduce-drawing", room);
    setStarted(true);
  }

  return (
    <section className={styles.players}>
      {users.map((user, i) => (<div key={user.name + i} className={styles.player}>
        <div className={styles.playerPic} />
        <p>{user.name}</p>
      </div>))}
      {isCreator && !started && <button onClick={startGame} className={styles.startButton}>Start Game</button>}
      {isCreator && <button onClick={copyToClipboard} className={styles.clipboard}>Copy Room Id</button>}
    </section>
  );
}
