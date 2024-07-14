

import Canvas from "@/components/drawingCanvas/canvas";
import ArtAside from "@/components/artAside/artAside";
import styles from "./page.module.css";
import UserList from "@/components/userList/userList";

export default async function Room() {

  return (
    <main>
      <h1 className={styles.title}>Co Art</h1>
      <div className={styles.mainContent}>
        <UserList />
        <Canvas />
        <ArtAside />
      </div>
    </main>
  );
}
