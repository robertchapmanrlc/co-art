import styles from "./artAside.module.css";
import Scores from "./scores";
import Timer from "./timer";

export default function ArtAside() {
  return (
    <aside className={styles.aside}>
      <Timer />
      <Scores />
    </aside>
  );
}
