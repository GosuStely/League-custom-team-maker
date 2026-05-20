import type { Team } from '../types'
import TeamCard from './TeamCard'
import styles from './TeamsSection.module.css'

interface Props {
  teams: [Team, Team]
  revealKey: number
  onShuffle: () => void
}

export default function TeamsSection({ teams, revealKey, onShuffle }: Props) {
  return (
    <div key={revealKey}>
      <h2 className={styles.heading}>⚔ Teams Assembled ⚔</h2>
      <div className="divider" />
      <div className={styles.grid}>
        <TeamCard team={teams[0]} side="blue" />
        <TeamCard team={teams[1]} side="red" />
      </div>
      <button className={styles.shuffleBtn} onClick={onShuffle}>
        🔄&nbsp;&nbsp;Shuffle Teams Again
      </button>
    </div>
  )
}
