"use client";

import styles from "./userList.module.css";
import { socket } from "../../../socket";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserList() {

  const [users, setUsers] = useState<User[]>([]);

  const router = useRouter();

  useEffect(() => {

    socket.on('users', (users) => {
      setUsers(users);
    });

    socket.on("invalid-room", () => {
      router.push('/');
    });

    return () => {
      socket.off('users');
      socket.off("invalid-room");
    }
  }, [users, router]);

  return (
    <section className={styles.players}>
      {users.map((user, i) => (<div key={user.name + i} className={styles.player}>
        <div className={styles.playerPic} />
        <p>{user.name}</p>
      </div>))}
    </section>
  );
}
