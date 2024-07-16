"use client";

import styles from "./userList.module.css";
import { socket } from "../../../socket";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/userContext";
import toast from "react-hot-toast";

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

    socket.on('game-ended', () => {
      toast.error("Game ended");
      router.push('/');
    })

    return () => {
      socket.off('users');
      socket.off("invalid-room");
      socket.off('is-creator');
      socket.off('game-ended');
    }
  }, [users, router]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(room);
  }

  const startGame = () => {
    if (users.length > 1) {
      socket.emit("introduce-drawing", room);
      setStarted(true);
    } else {
      toast.error('Room must have at least 2 players');
    }
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
