import { useState, useRef, useEffect, useMemo } from 'react'
import type { Role } from '../types'
import { ROLES, ROLE_CONFIG } from '../constants/roles'
import type { Champion } from '../data/champions'
import { getChampionsForRole } from '../data/champions'
import { getPool } from '../utils/championPool'
import {
  calculateTeamSynergy,
  calculateWinProb,
  generateProTeam,
  gradeColor,
  compIcon,
  type TeamComp,
  type SynergyResult,
} from '../utils/synergyCalc'
import styles from './CompSynergyCalculator.module.css'

interface SlotProps {
  role: Role
  champion: Champion | null
  onSelect: (c: Champion) => void
  onClear: () => void
  playerName: string
  onPlayerNameChange: (name: string) => void
}

function ChampionSlot({ role, champion, onSelect, onClear, playerName, onPlayerNameChange }: SlotProps) {
  const [open, setOpen]     = useState(false)
  const [query, setQuery]   = useState('')
  const inputRef            = useRef<HTMLInputElement>(null)
  const containerRef        = useRef<HTMLDivElement>(null)
  const rc                  = ROLE_CONFIG[role]

  const pool    = playerName.trim() ? getPool(playerName) : []
  const hasPool = pool.length > 0

  const options = useMemo(() => {
    let list = getChampionsForRole(role)
    if (hasPool) list = list.filter((c) => pool.includes(c.name))
    if (!query.trim()) return list
    const q = query.toLowerCase()
    return list.filter((c) => c.name.toLowerCase().includes(q))
  }, [role, query, hasPool, pool])

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function openDropdown() {
    setOpen(true)
    setQuery('')
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function pick(c: Champion) {
    onSelect(c)
    setOpen(false)
    setQuery('')
  }

  const dmgBadge = (c: Champion) => {
    if (c.damageType === 'physical') return { label: 'AD', color: '#E88899' }
    if (c.damageType === 'magic')    return { label: 'AP', color: '#CCA8FF' }
    return { label: '~',  color: '#C8AA6E' }
  }

  return (
    <div className={styles.slot} ref={containerRef}>
      <div className={styles.slotMain}>
      <div className={styles.roleTag} style={{ background: rc.bg, borderColor: `${rc.color}55`, color: rc.color }}>
        <span>{rc.icon}</span>
        <span>{rc.label}</span>
      </div>

      {champion ? (
        <div className={styles.selectedChamp}>
          <span className={styles.champName}>{champion.name}</span>
          <span
            className={styles.dmgBadge}
            style={{ color: dmgBadge(champion).color, borderColor: `${dmgBadge(champion).color}55` }}
          >
            {dmgBadge(champion).label}
          </span>
          <button className={styles.clearBtn} onClick={onClear} title="Remove champion">×</button>
        </div>
      ) : (
        <button className={styles.addBtn} onClick={openDropdown}>
          + Add Champion
        </button>
      )}

      </div>
      <div className={styles.slotPlayerRow}>
        <input
          className={styles.playerInput}
          placeholder="Player (optional)…"
          value={playerName}
          onChange={(e) => onPlayerNameChange(e.target.value)}
        />
        {hasPool && (
          <span className={styles.poolBadge}>🎯 {pool.length}</span>
        )}
      </div>

      {open && (
        <div className={styles.dropdown}>
          <input
            ref={inputRef}
            className={styles.searchInput}
            placeholder={`Search ${role}…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className={styles.optionList}>
            {options.length === 0 && (
              <div className={styles.noResults}>No champions found</div>
            )}
            {options.map((c) => {
              const badge = dmgBadge(c)
              return (
                <button key={c.name} className={styles.option} onClick={() => pick(c)}>
                  <span className={styles.optionName}>{c.name}</span>
                  <span className={styles.optionBadge} style={{ color: badge.color, borderColor: `${badge.color}55` }}>
                    {badge.label}
                  </span>
                  <span className={styles.optionTraits}>
                    {c.traits.slice(0, 3).join(' · ')}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

interface SynergyPanelProps {
  result: SynergyResult
  side: 'blue' | 'red'
}

function SynergyPanel({ result, side }: SynergyPanelProps) {
  const isBlue = side === 'blue'
  const accent = isBlue ? '#C8AA6E' : '#CF6679'

  if (result.filledSlots === 0) return null

  const gColor = gradeColor(result.grade)
  const icon   = compIcon(result.detectedComp)

  const bars: Array<{ label: string; value: number; max: number }> = [
    { label: 'Damage Balance', value: result.breakdown.damageBalance,  max: 30 },
    { label: 'CC Chain',       value: result.breakdown.cc,             max: 20 },
    { label: 'Frontline',      value: result.breakdown.frontline,      max: 20 },
    { label: 'Comp Cohesion',  value: result.breakdown.compCohesion,   max: 20 },
    { label: 'Combo Potential',value: result.breakdown.comboPotential, max: 10 },
  ]

  return (
    <div className={styles.synergyPanel}>
      <div className={styles.scoreRow}>
        <div className={styles.scoreCircle} style={{ borderColor: gColor, boxShadow: `0 0 14px ${gColor}44` }}>
          <span className={styles.scoreNum} style={{ color: gColor }}>{result.score}</span>
          <span className={styles.scoreGrade} style={{ color: gColor }}>{result.grade}</span>
        </div>
        <div className={styles.compInfo}>
          <div className={styles.compLabel}>
            <span>{icon}</span>
            <span>{result.detectedComp}</span>
          </div>
          {result.comboLabel && (
            <div className={styles.comboLabel} style={{ color: accent }}>✦ {result.comboLabel}</div>
          )}
          <div className={styles.dmgSplit}>
            <span style={{ color: '#CCA8FF' }}>AP {result.damageTypes.magic}</span>
            <span className={styles.dmgDivider}>·</span>
            <span style={{ color: '#E88899' }}>AD {result.damageTypes.physical}</span>
          </div>
        </div>
      </div>

      <div className={styles.scoreBarWrap}>
        <div
          className={styles.scoreBarFill}
          style={{ width: `${result.score}%`, background: `linear-gradient(90deg, ${accent}88, ${accent})` }}
        />
      </div>

      <div className={styles.breakdownList}>
        {bars.map(({ label, value, max }) => (
          <div key={label} className={styles.breakdownRow}>
            <span className={styles.bLabel}>{label}</span>
            <div className={styles.bBarWrap}>
              <div
                className={styles.bBarFill}
                style={{
                  width: `${(value / max) * 100}%`,
                  background: accent,
                  opacity: 0.75,
                }}
              />
            </div>
            <span className={styles.bVal} style={{ color: accent }}>{value}/{max}</span>
          </div>
        ))}
      </div>

      {result.filledSlots < 5 && (
        <div className={styles.fillHint}>{result.filledSlots}/5 champions selected</div>
      )}
    </div>
  )
}

interface WinBarProps {
  blueResult: SynergyResult
  redResult:  SynergyResult
}

function WinBar({ blueResult, redResult }: WinBarProps) {
  const filled = blueResult.filledSlots + redResult.filledSlots
  if (filled < 4) return null

  const win = calculateWinProb(blueResult, redResult)

  return (
    <div className={styles.winSection}>
      <div className={styles.winTitle}>Win Probability</div>

      <div className={styles.winBarOuter}>
        <div className={styles.winBarBlue}  style={{ flex: win.blue }} />
        <div className={styles.winBarRed}   style={{ flex: win.red }} />
      </div>

      <div className={styles.winLabels}>
        <span className={styles.winLabelBlue}>🔵 {win.blue}%</span>
        <span className={styles.winLabelRed}>{win.red}% 🔴</span>
      </div>

      {win.factors.length > 0 && (
        <div className={styles.factorList}>
          {win.factors.map((f) => {
            const fav    = f.delta > 0 ? 'blue' : f.delta < 0 ? 'red' : 'neutral'
            const valStr = f.delta > 0 ? `+${f.delta}%` : `${f.delta}%`
            const color  = fav === 'blue' ? '#C8AA6E' : fav === 'red' ? '#CF6679' : '#888'
            return (
              <div key={f.label} className={styles.factorRow}>
                <span className={styles.factorLabel}>{f.label}</span>
                <span style={{ color, fontWeight: 700 }}>
                  {fav === 'blue' ? '🔵' : fav === 'red' ? '🔴' : '–'} {valStr}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

type TeamState = TeamComp

function emptyTeam(): TeamState {
  return Object.fromEntries(ROLES.map((r) => [r, null])) as TeamState
}

export default function CompSynergyCalculator() {
  const [blueTeam, setBlueTeam] = useState<TeamState>(emptyTeam)
  const [redTeam,  setRedTeam]  = useState<TeamState>(emptyTeam)
  const [buildingBlue, setBuildingBlue] = useState(false)
  const [buildingRed,  setBuildingRed]  = useState(false)
  const [bluePlayerNames, setBluePlayerNames] = useState<Partial<Record<Role, string>>>({})
  const [redPlayerNames,  setRedPlayerNames]  = useState<Partial<Record<Role, string>>>({})

  function setBlueChamp(role: Role, champ: Champion | null) {
    setBlueTeam((prev) => ({ ...prev, [role]: champ }))
  }
  function setRedChamp(role: Role, champ: Champion | null) {
    setRedTeam((prev) => ({ ...prev, [role]: champ }))
  }

  const blueSynergy = useMemo(() => calculateTeamSynergy(blueTeam), [blueTeam])
  const redSynergy  = useMemo(() => calculateTeamSynergy(redTeam),  [redTeam])

  function handleProTeam(side: 'blue' | 'red') {
    const current   = side === 'blue' ? blueTeam : redTeam
    const blacklist = Object.values(side === 'blue' ? redTeam : blueTeam)
      .filter(Boolean)
      .map((c) => c!.name)

    if (side === 'blue') setBuildingBlue(true)
    else                 setBuildingRed(true)

    setTimeout(() => {
      const result = generateProTeam(current, blacklist)
      if (side === 'blue') { setBlueTeam(result as TeamState); setBuildingBlue(false) }
      else                  { setRedTeam(result  as TeamState); setBuildingRed(false)  }
    }, 0)
  }

  function resetAll() {
    setBlueTeam(emptyTeam())
    setRedTeam(emptyTeam())
    setBluePlayerNames({})
    setRedPlayerNames({})
  }

  return (
    <div className={styles.calculator}>

      <div className={styles.header}>
        <span className={styles.headerIcon}>⚗️</span>
        <h2 className={styles.headerTitle}>Comp Synergy Calculator</h2>
        <p className={styles.headerSub}>Build comps · Analyze synergies · Compare win chances</p>
        <div className="divider" />
      </div>

      <div className={styles.teamsGrid}>

        <div className={styles.teamColumn}>
          <div className={`${styles.teamHeader} ${styles.teamHeaderBlue}`}>
            <span>🔵</span>
            <span className={styles.teamName}>Blue Team</span>
            <button
              className={`${styles.proBtn} ${styles.proBtnBlue}`}
              onClick={() => handleProTeam('blue')}
              disabled={buildingBlue}
              title="Auto-fill remaining slots with the highest-synergy meta picks"
            >
              {buildingBlue
                ? <><span className={styles.proSpinner} />Building…</>
                : '⚡ Pro Comp'}
            </button>
          </div>
          <div className={styles.slotList}>
            {ROLES.map((role) => (
              <ChampionSlot
                key={role}
                role={role}
                champion={blueTeam[role] ?? null}
                onSelect={(c) => setBlueChamp(role, c)}
                onClear={() => setBlueChamp(role, null)}
                playerName={bluePlayerNames[role] ?? ''}
                onPlayerNameChange={(name) => setBluePlayerNames((p) => ({ ...p, [role]: name }))}
              />
            ))}
          </div>
          <SynergyPanel result={blueSynergy} side="blue" />
        </div>

        <div className={styles.vsCol}>
          <div className={styles.vsText}>VS</div>
        </div>

        <div className={styles.teamColumn}>
          <div className={`${styles.teamHeader} ${styles.teamHeaderRed}`}>
            <span>🔴</span>
            <span className={styles.teamName}>Red Team</span>
            <button
              className={`${styles.proBtn} ${styles.proBtnRed}`}
              onClick={() => handleProTeam('red')}
              disabled={buildingRed}
              title="Auto-fill remaining slots with the highest-synergy meta picks"
            >
              {buildingRed
                ? <><span className={styles.proSpinner} />Building…</>
                : '⚡ Pro Comp'}
            </button>
          </div>
          <div className={styles.slotList}>
            {ROLES.map((role) => (
              <ChampionSlot
                key={role}
                role={role}
                champion={redTeam[role] ?? null}
                onSelect={(c) => setRedChamp(role, c)}
                onClear={() => setRedChamp(role, null)}
                playerName={redPlayerNames[role] ?? ''}
                onPlayerNameChange={(name) => setRedPlayerNames((p) => ({ ...p, [role]: name }))}
              />
            ))}
          </div>
          <SynergyPanel result={redSynergy} side="red" />
        </div>

      </div>

      <WinBar blueResult={blueSynergy} redResult={redSynergy} />

      <div className={styles.resetRow}>
        <button className={styles.resetBtn} onClick={resetAll}>
          🗑 Reset All
        </button>
      </div>

    </div>
  )
}
