import type { TeamSlot } from '../types'
import { ROLE_CONFIG, DIVISION_CONFIG } from '../constants/roles'
import styles from './PlayerRow.module.css'

interface Props {
  slot: TeamSlot
  index: number
}

export default function PlayerRow({ slot, index }: Props) {
  const rc  = ROLE_CONFIG[slot.role]
  const div = DIVISION_CONFIG[slot.division]

  const badgeClass =
    slot.assignedAs === 'Main'      ? styles.badgeMain :
    slot.assignedAs === 'Secondary' ? styles.badgeSecondary :
                                      styles.badgeAutofill

  const badgeLabel =
    slot.assignedAs === 'Main' ? 'Main' : slot.assignedAs === 'Secondary' ? 'Fill' : 'Auto'

  return (
    <div className={styles.row} style={{ animationDelay: `${0.2 + index * 0.09}s` }}>

      {/* Role */}
      <div
        className={styles.roleBadge}
        style={{ background: rc.bg, borderColor: `${rc.color}55`, color: rc.color }}
      >
        <span>{rc.icon}</span>
        <span>{slot.role}</span>
      </div>

      {/* Summoner name */}
      <span className={styles.name}>{slot.nickname}</span>

      {/* Division badge */}
      <span
        className={styles.divBadge}
        style={{ borderColor: `${div.color}55`, color: div.color, background: `${div.color}18` }}
      >
        {div.icon}&nbsp;{slot.division}
      </span>

      {/* Assignment type */}
      <span className={`${styles.badge} ${badgeClass}`}>{badgeLabel}</span>
    </div>
  )
}
