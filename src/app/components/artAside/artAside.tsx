import styles from "./artAside.module.css";
import Timer from "./timer";

export default function ArtAside() {
  return (
    <aside className={styles.aside}>
      <Timer />
    </aside>
  );
}
