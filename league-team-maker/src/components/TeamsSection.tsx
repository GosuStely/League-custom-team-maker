import { useState, useEffect } from 'react'
import type { Team } from '../types'
import { recordResult } from '../utils/winTracker'
import TeamCard from './TeamCard'
import styles from './TeamsSection.module.css'

interface Props {
  teams: [Team, Team]
  revealKey: number
  onShuffle: () => void
}

export default function TeamsSection({ teams, revealKey, onShuffle }: Props) {
  const [resultRecorded, setResultRecorded] = useState(false)

  useEffect(() => {
    setResultRecorded(false)
  }, [revealKey])

  function handleResult(winner: 'blue' | 'red') {
    const [blue, red] = teams
    const winners = (winner === 'blue' ? blue : red).map((s) => s.nickname)
    const losers  = (winner === 'blue' ? red : blue).map((s) => s.nickname)
    recordResult(winners, losers)
    setResultRecorded(true)
  }

  return (
    <div key={revealKey}>
      <h2 className={styles.heading}>⚔ Teams Assembled ⚔</h2>
      <div className="divider" />
      <div className={styles.grid}>
        <TeamCard team={teams[0]} side="blue" resultRecorded={resultRecorded} />
        <TeamCard team={teams[1]} side="red"  resultRecorded={resultRecorded} />
      </div>

      <div className={styles.resultRow}>
        {resultRecorded ? (
          <div className={styles.resultDone}>✓ Result recorded</div>
        ) : (
          <>
            <button
              className={`${styles.resultBtn} ${styles.resultBtnBlue}`}
              onClick={() => handleResult('blue')}
            >
              🏆 Blue Won
            </button>
            <span className={styles.resultVs}>vs</span>
            <button
              className={`${styles.resultBtn} ${styles.resultBtnRed}`}
              onClick={() => handleResult('red')}
            >
              🏆 Red Won
            </button>
          </>
        )}
      </div>

      <button className={styles.shuffleBtn} onClick={onShuffle}>
        🔄&nbsp;&nbsp;Shuffle Teams Again
      </button>
    </div>
  )
}
