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
  const [winner, setWinner] = useState<'blue' | 'red' | null>(null)

  useEffect(() => {
    setWinner(null)
  }, [revealKey])

  function handleMarkWinner(side: 'blue' | 'red') {
    if (winner !== null) return
    const [blue, red] = teams
    const winners = (side === 'blue' ? blue : red).map((s) => s.nickname)
    const losers  = (side === 'blue' ? red : blue).map((s) => s.nickname)
    recordResult(winners, losers)
    setWinner(side)
  }

  return (
    <div key={revealKey}>
      <h2 className={styles.heading}>⚔ Teams Assembled ⚔</h2>
      <div className="divider" />
      <div className={styles.grid}>
        <TeamCard
          team={teams[0]}
          side="blue"
          winState={winner === null ? 'pending' : winner === 'blue' ? 'won' : 'lost'}
          onMarkWinner={() => handleMarkWinner('blue')}
        />
        <TeamCard
          team={teams[1]}
          side="red"
          winState={winner === null ? 'pending' : winner === 'red' ? 'won' : 'lost'}
          onMarkWinner={() => handleMarkWinner('red')}
        />
      </div>

      <button className={styles.shuffleBtn} onClick={onShuffle}>
        🔄&nbsp;&nbsp;Shuffle Teams Again
      </button>
    </div>
  )
}
