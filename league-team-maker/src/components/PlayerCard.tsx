import type { Player, Role } from '../types'
import { ROLES, ROLE_CONFIG, DIVISIONS, DIVISION_CONFIG } from '../constants/roles'
import styles from './PlayerCard.module.css'

interface Props {
  player: Player
  index: number
  onChange: (
    id: number,
    field: keyof Pick<Player, 'nickname' | 'mainRole' | 'secondaryRole' | 'division'>,
    value: string,
  ) => void
  onNicknameBlur?: (id: number, nickname: string) => void
}

export default function PlayerCard({ player, index, onChange, onNicknameBlur }: Props) {
  const divCfg = DIVISION_CONFIG[player.division]
  const nameId = `player-${player.id}-name`
  const divId = `player-${player.id}-division`

  return (
    <div className={styles.card} style={{ animationDelay: `${index * 0.05}s` }}>

      {/* Row 1: number · nickname · division */}
      <div className={styles.topRow}>
        <span className={styles.num} aria-hidden="true">{index + 1}</span>

        <label htmlFor={nameId} className={styles.srOnly}>
          Summoner {index + 1} name
        </label>
        <input
          id={nameId}
          className={styles.input}
          type="text"
          placeholder={`Summoner ${index + 1}`}
          value={player.nickname}
          maxLength={20}
          onChange={(e) => onChange(player.id, 'nickname', e.target.value)}
          onBlur={(e) => onNicknameBlur?.(player.id, e.target.value)}
        />

        <div className={styles.divWrap}>
          <span className={styles.divLabel} aria-hidden="true">Division</span>
          <select
            id={divId}
            className={styles.divSelect}
            value={player.division}
            aria-label={`Division for summoner ${index + 1}`}
            onChange={(e) => onChange(player.id, 'division', e.target.value)}
            style={{ borderColor: `${divCfg.color}99`, color: divCfg.color }}
          >
            {DIVISIONS.map((d) => (
              <option key={d} value={d}>
                {DIVISION_CONFIG[d].icon} {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: main role buttons */}
      <RoleButtonRow
        label="Main"
        playerId={player.id}
        playerIndex={index}
        selected={player.mainRole}
        onSelect={(r) => onChange(player.id, 'mainRole', r)}
      />

      {/* Row 3: secondary role buttons */}
      <RoleButtonRow
        label="Fill"
        playerId={player.id}
        playerIndex={index}
        selected={player.secondaryRole}
        onSelect={(r) => onChange(player.id, 'secondaryRole', r)}
        dim
      />
    </div>
  )
}

interface RoleRowProps {
  label: string
  playerId: number
  playerIndex: number
  selected: Role
  onSelect: (r: Role) => void
  dim?: boolean
}

function RoleButtonRow({ label, playerId, playerIndex, selected, onSelect, dim = false }: RoleRowProps) {
  const groupId = `player-${playerId}-${label.toLowerCase()}-role`
  return (
    <div className={styles.roleRow}>
      <span id={groupId} className={styles.roleRowLabel} aria-hidden="true">{label}</span>
      <div
        className={styles.roleBtns}
        role="group"
        aria-label={`${label} role for summoner ${playerIndex + 1}`}
      >
        {ROLES.map((r) => {
          const cfg = ROLE_CONFIG[r]
          const active = selected === r
          return (
            <button
              key={r}
              type="button"
              onClick={() => onSelect(r)}
              aria-pressed={active}
              aria-label={`${r} — ${cfg.label}`}
              className={[
                styles.roleBtn,
                active ? styles.roleBtnActive : '',
                dim && !active ? styles.roleBtnDim : '',
              ].join(' ')}
              style={active ? {
                borderColor: cfg.color,
                color: cfg.color,
                background: cfg.bg,
                boxShadow: `0 0 10px ${cfg.color}55`,
              } : undefined}
            >
              <span className={styles.roleBtnIcon} aria-hidden="true">{cfg.icon}</span>
              <span className={styles.roleBtnLabel}>{cfg.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
