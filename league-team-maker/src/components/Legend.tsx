import styles from './Legend.module.css'

export default function Legend() {
  return (
    <div className={styles.legend}>
      <div className={styles.item}>
        <span className={`${styles.badge} ${styles.main}`}>Main</span>
        preferred role
      </div>
      <div className={styles.item}>
        <span className={`${styles.badge} ${styles.secondary}`}>Fill</span>
        secondary role
      </div>
      <div className={styles.item}>
        <span className={`${styles.badge} ${styles.autofill}`}>Auto</span>
        autofilled
      </div>
    </div>
  )
}
