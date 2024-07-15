'use client';
import { useRouter } from "next/navigation";
import { useUserContext } from "./context/userContext";
import styles from "./page.module.css";

export default function Home() {

  const router = useRouter();

  const { setUser } = useUserContext();

  const handleSubmit = (formData: FormData) => {
    const name = formData.get('name') as string;
    const room = formData.get('room') as string;

    setUser({ name: name, room: room });

    router.push('/room');
  }

  return (
    <main className={styles.mainContent}>
      <h1 className={styles.title}>Co Art</h1>
      <form action={handleSubmit} className={styles.form}>
        <label htmlFor="name">Name</label>
        <input required type="text" id="name" name="name" />
        <label htmlFor="room">Room</label>
        <input required type="text" id="room" name="room" />
        <button type='submit'>Submit</button>
      </form>
    </main>
  );
}
