import styles from "./artAside.module.css";
import Timer from "./timer";

export default function ArtAside() {
  return (
    <aside className={styles.aside}>
      <div className={styles.art} />
      <Timer />
    </aside>
  );
}
