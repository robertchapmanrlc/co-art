'use client';
import { useRouter } from "next/navigation";
import { useUserContext } from "./context/userContext";
import styles from "./page.module.css";
import { socket } from "../socket";

export default function Home() {

  const router = useRouter();

  const { setUser } = useUserContext();

  const joinRoom = (formData: FormData) => {
    const name = formData.get('name') as string;
    const room = formData.get('room') as string;

    setUser({ name: name, room: room });

    router.push('/room');
  }

  const createRoom = (formData: FormData) => {
    const name = formData.get('name') as string;
    let myuuid = crypto.randomUUID();

    setUser({ name: name, room: myuuid });

    socket.emit('create-room', myuuid);

    router.push('/room');
  }

  return (
    <main className={styles.mainContent}>
      <h1 className={styles.title}>Co Art</h1>
      <p className={styles.description}>
        Work together with friends to draw a picture. Create a room yourself or
        join one
      </p>
      <div className={styles.forms}>
        <form action={createRoom} className={styles.form}>
          <label htmlFor="name">Name</label>
          <input required type="text" id="name" name="name" />
          <button type="submit">Create Room</button>
        </form>
        <form action={joinRoom} className={styles.form}>
          <label htmlFor="name">Name</label>
          <input required type="text" id="name" name="name" />
          <label htmlFor="room">Room</label>
          <input required type="text" id="room" name="room" />
          <button type="submit">Join Room</button>
        </form>
      </div>
    </main>
  );
}
