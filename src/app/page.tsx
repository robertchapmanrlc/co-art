
import Canvas from "@/components/drawingCanvas/canvas";
import styles from "./page.module.css";
import ArtAside from "./components/artAside/artAside";

export default function Home() {
  return (
    <main>
      <h1 className={styles.title}>Co Art</h1>
      <div className={styles.mainContent}>
        <section className={styles.players}>
          <div className={styles.player}>
            <div className={styles.playerPic} />
            <p>Player 1</p>
          </div>
          <div className={styles.player}>
            <div className={styles.playerPic} />
            <p>Player 2</p>
          </div>
          <div className={styles.player}>
            <div className={styles.playerPic} />
            <p>Player 3</p>
          </div>
          <div className={styles.player}>
            <div className={styles.playerPic} />
            <p>Player 4</p>
          </div>
        </section>
        <Canvas />
        <ArtAside />
      </div>
    </main>
  );
}
