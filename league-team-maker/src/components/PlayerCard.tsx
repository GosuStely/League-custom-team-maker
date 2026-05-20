import { useState, useRef, useEffect, useMemo } from 'react'
import type { Player, Role } from '../types'
import { ROLES, ROLE_CONFIG, DIVISIONS, DIVISION_CONFIG } from '../constants/roles'
import { CHAMPIONS } from '../data/champions'
import { getPool, savePool } from '../utils/championPool'
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
  const divCfg  = DIVISION_CONFIG[player.division]
  const nameId  = `player-${player.id}-name`
  const divId   = `player-${player.id}-division`
  const [poolOpen,  setPoolOpen]  = useState(false)
  const [poolQuery, setPoolQuery] = useState('')
  const [pool, setPool]           = useState<string[]>(() => getPool(player.nickname))
  const poolInputRef              = useRef<HTMLInputElement>(null)
  const poolContainerRef          = useRef<HTMLDivElement>(null)
  const [dropOpen, setDropOpen]   = useState(false)

  useEffect(() => {
    setPool(getPool(player.nickname))
  }, [player.nickname])

  useEffect(() => {
    if (!dropOpen) return
    function handler(e: MouseEvent) {
      if (poolContainerRef.current && !poolContainerRef.current.contains(e.target as Node)) {
        setDropOpen(false)
        setPoolQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropOpen])

  const filteredChamps = useMemo(() => {
    const q = poolQuery.toLowerCase()
    return CHAMPIONS.filter(
      (c) => c.name.toLowerCase().includes(q) && !pool.includes(c.name),
    ).slice(0, 40)
  }, [poolQuery, pool])

  function addToPool(name: string) {
    const next = [...pool, name]
    setPool(next)
    savePool(player.nickname, next)
    setPoolQuery('')
    poolInputRef.current?.focus()
  }

  function removeFromPool(name: string) {
    const next = pool.filter((n) => n !== name)
    setPool(next)
    savePool(player.nickname, next)
  }

  function openDrop() {
    setDropOpen(true)
    setPoolQuery('')
    setTimeout(() => poolInputRef.current?.focus(), 0)
  }

  return (
    <div className={styles.card} style={{ animationDelay: `${index * 0.05}s` }}>

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

      <RoleButtonRow
        label="Main"
        playerId={player.id}
        playerIndex={index}
        selected={player.mainRole}
        onSelect={(r) => onChange(player.id, 'mainRole', r)}
      />

      <RoleButtonRow
        label="Fill"
        playerId={player.id}
        playerIndex={index}
        selected={player.secondaryRole}
        onSelect={(r) => onChange(player.id, 'secondaryRole', r)}
        dim
      />

      <div className={styles.poolSection}>
        <button
          className={styles.poolToggle}
          onClick={() => setPoolOpen((p) => !p)}
          type="button"
        >
          <span>🎯 Champion Pool</span>
          {pool.length > 0 && <span className={styles.poolCount}>{pool.length}</span>}
          <span className={styles.poolChevron}>{poolOpen ? '▲' : '▼'}</span>
        </button>

        {poolOpen && (
          <div className={styles.poolBody} ref={poolContainerRef}>
            <div className={styles.poolTags}>
              {pool.map((name) => (
                <span key={name} className={styles.poolTag}>
                  {name}
                  <button
                    className={styles.poolTagRemove}
                    onClick={() => removeFromPool(name)}
                    type="button"
                    aria-label={`Remove ${name}`}
                  >×</button>
                </span>
              ))}
              {pool.length === 0 && (
                <span className={styles.poolEmpty}>No champions added yet</span>
              )}
            </div>

            <div className={styles.poolAdd}>
              <input
                ref={poolInputRef}
                className={styles.poolSearch}
                placeholder="Search champion…"
                value={poolQuery}
                onChange={(e) => setPoolQuery(e.target.value)}
                onFocus={openDrop}
              />
              {dropOpen && filteredChamps.length > 0 && (
                <div className={styles.poolDropdown}>
                  {filteredChamps.map((c) => (
                    <button
                      key={c.name}
                      className={styles.poolOption}
                      onMouseDown={(e) => { e.preventDefault(); addToPool(c.name) }}
                      type="button"
                    >
                      {c.name}
                      <span className={styles.poolOptionRole}>
                        {c.roles.join(' · ')}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

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
          const cfg    = ROLE_CONFIG[r]
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
