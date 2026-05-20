import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <span className={styles.crown}>👑</span>
      <h1 className={styles.title}>League Team Maker</h1>
      <p className={styles.subtitle}>Balanced 5v5 Team Generator</p>
      <div className="divider" style={{ marginTop: 14 }} />
    </header>
  )
}
