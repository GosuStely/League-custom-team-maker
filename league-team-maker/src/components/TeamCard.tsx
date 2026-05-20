import type { Team } from '../types'
import { DIVISIONS, DIVISION_CONFIG } from '../constants/roles'
import { teamAvgScore } from '../utils/generateTeams'
import PlayerRow from './PlayerRow'
import styles from './TeamCard.module.css'

type WinState = 'pending' | 'won' | 'lost'

interface Props {
  team: Team
  side: 'blue' | 'red'
  winState: WinState
  onMarkWinner: () => void
}

function avgScoreToLabel(avg: number): string {
  let closest = DIVISIONS[0]
  let minDiff = Infinity
  for (const d of DIVISIONS) {
    const diff = Math.abs(DIVISION_CONFIG[d].score - avg)
    if (diff < minDiff) { minDiff = diff; closest = d }
  }
  return closest
}

export default function TeamCard({ team, side, winState, onMarkWinner }: Props) {
  const isBlue = side === 'blue'
  const avg    = teamAvgScore(team)
  const label  = avgScoreToLabel(avg)
  const divCfg = DIVISION_CONFIG[label as keyof typeof DIVISION_CONFIG]

  const cardClass = [
    styles.card,
    isBlue ? styles.cardBlue : styles.cardRed,
    winState === 'won'  ? styles.cardWon  : '',
    winState === 'lost' ? styles.cardLost : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClass}>

      <div className={`${styles.header} ${isBlue ? styles.headerBlue : styles.headerRed}`}>
        <span className={styles.teamIcon}>
          {winState === 'won' ? '🏆' : isBlue ? '🔵' : '🔴'}
        </span>
        <span className={styles.teamName}>Team {isBlue ? 'Blue' : 'Red'}</span>
        <span
          className={styles.avgBadge}
          style={{ borderColor: `${divCfg.color}66`, color: divCfg.color, background: `${divCfg.color}18` }}
          title={`Average rank score: ${avg}`}
        >
          {divCfg.icon}&nbsp;~{label}
        </span>

        {winState === 'pending' && (
          <button
            className={`${styles.winBtn} ${isBlue ? styles.winBtnBlue : styles.winBtnRed}`}
            onClick={onMarkWinner}
            title="Mark this team as the winner"
          >
            🏆 Winner
          </button>
        )}

        {winState === 'won' && (
          <span className={styles.wonLabel}>VICTORY</span>
        )}

        {winState === 'lost' && (
          <span className={styles.lostLabel}>DEFEAT</span>
        )}
      </div>

      <div className={styles.body}>
        {team.map((slot, i) => (
          <PlayerRow key={slot.role} slot={slot} index={i} winState={winState} />
        ))}
      </div>
    </div>
  )
}
