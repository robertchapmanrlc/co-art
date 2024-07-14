import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.mainContent}>
      <h1 className={styles.title}>Co Art</h1>
      <form action="" className={styles.form}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" />
        <label htmlFor="room">Room</label>
        <input type="text" id="room" name="room" />
        <button type='submit'>Submit</button>
      </form>
    </main>
  );
}
