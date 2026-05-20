import type { TeamSlot } from '../types'
import { ROLE_CONFIG, DIVISION_CONFIG } from '../constants/roles'
import { getWinRecord, winRatePct } from '../utils/winTracker'
import styles from './PlayerRow.module.css'

type WinState = 'pending' | 'won' | 'lost'

interface Props {
  slot: TeamSlot
  index: number
  winState?: WinState
}

export default function PlayerRow({ slot, index, winState }: Props) {
  const rc  = ROLE_CONFIG[slot.role]
  const div = DIVISION_CONFIG[slot.division]

  const record = getWinRecord(slot.nickname)
  const total  = record.wins + record.losses
  const pct    = winRatePct(record)

  const badgeClass =
    slot.assignedAs === 'Main'      ? styles.badgeMain :
    slot.assignedAs === 'Secondary' ? styles.badgeSecondary :
                                      styles.badgeAutofill

  const badgeLabel =
    slot.assignedAs === 'Main' ? 'Main' : slot.assignedAs === 'Secondary' ? 'Fill' : 'Auto'

  const wrColor =
    pct === null  ? 'rgba(200,184,150,0.35)' :
    pct >= 55     ? '#81C784' :
    pct >= 50     ? '#C8AA6E' :
    pct >= 45     ? '#FFB74D' :
                    '#EF9A9A'

  return (
    <div
      className={`${styles.row} ${winState === 'won' ? styles.rowWon : ''}`}
      style={{ animationDelay: `${0.2 + index * 0.09}s` }}
    >

      <div
        className={styles.roleBadge}
        style={{ background: rc.bg, borderColor: `${rc.color}55`, color: rc.color }}
      >
        <span>{rc.icon}</span>
        <span>{slot.role}</span>
      </div>

      <span className={styles.name}>{slot.nickname}</span>

      {total > 0 ? (
        <span className={styles.wrBadge} style={{ color: wrColor, borderColor: `${wrColor}55` }}>
          {pct}% · {total}G
        </span>
      ) : (
        <span className={styles.wrBadgeEmpty}>—</span>
      )}

      <span
        className={styles.divBadge}
        style={{ borderColor: `${div.color}55`, color: div.color, background: `${div.color}18` }}
      >
        {div.icon}&nbsp;{slot.division}
      </span>

      <span className={`${styles.badge} ${badgeClass}`}>{badgeLabel}</span>
    </div>
  )
}
