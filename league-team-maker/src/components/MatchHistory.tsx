import { useState } from 'react'
import { loadMatches, clearHistory } from '../utils/matchHistory'
import type { MatchRecord } from '../utils/matchHistory'
import styles from './MatchHistory.module.css'

function relativeTime(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60_000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7)   return `${days}d ago`
  return new Date(ts).toLocaleDateString()
}

function MatchCard({ match }: { match: MatchRecord }) {
  const [open, setOpen] = useState(false)
  const winTeam  = match.winner === 'blue' ? match.blue : match.red
  const loseTeam = match.winner === 'blue' ? match.red  : match.blue
  const winColor  = match.winner === 'blue' ? '#C8AA6E' : '#CF6679'
  const loseColor = match.winner === 'blue' ? '#CF6679' : '#C8AA6E'

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader} onClick={() => setOpen((p) => !p)}>
        <span className={styles.time}>{relativeTime(match.timestamp)}</span>

        <div className={styles.teamPreview}>
          <span className={styles.teamIcon} style={{ color: match.winner === 'blue' ? '#C8AA6E' : '#CF6679' }}>
            {match.winner === 'blue' ? '🔵' : '🔴'}
          </span>
          <span className={styles.teamNames}>
            {match.blue.map((p) => p.nickname).join(', ')}
          </span>
        </div>

        <span className={styles.vs}>vs</span>

        <div className={styles.teamPreview}>
          <span className={styles.teamIcon} style={{ color: match.winner === 'red' ? '#C8AA6E' : '#CF6679' }}>
            {match.winner === 'red' ? '🔵' : '🔴'}
          </span>
          <span className={styles.teamNames}>
            {match.red.map((p) => p.nickname).join(', ')}
          </span>
        </div>

        <span className={styles.expandBtn}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div className={styles.cardBody}>
          <div className={styles.teamCol}>
            <div className={styles.teamColHeader} style={{ color: winColor }}>
              🏆 {match.winner === 'blue' ? 'Blue' : 'Red'} — VICTORY
            </div>
            {winTeam.map((p) => (
              <div key={p.nickname} className={styles.playerRow}>
                <span className={styles.pRole}>{p.role}</span>
                <span className={styles.pName}>{p.nickname}</span>
                <span className={styles.pDiv}>{p.division}</span>
              </div>
            ))}
          </div>

          <div className={styles.vsCol}>VS</div>

          <div className={styles.teamCol}>
            <div className={styles.teamColHeader} style={{ color: loseColor }}>
              {match.winner === 'blue' ? '🔴 Red' : '🔵 Blue'} — DEFEAT
            </div>
            {loseTeam.map((p) => (
              <div key={p.nickname} className={styles.playerRow}>
                <span className={styles.pRole}>{p.role}</span>
                <span className={styles.pName}>{p.nickname}</span>
                <span className={styles.pDiv}>{p.division}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function MatchHistory() {
  const [matches, setMatches] = useState<MatchRecord[]>(() => loadMatches())

  function handleClear() {
    if (!confirm('Clear all match history?')) return
    clearHistory()
    setMatches([])
  }

  if (matches.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📜</div>
        <div className={styles.emptyText}>No matches recorded yet.</div>
        <div className={styles.emptySub}>Mark match results in the Team Maker tab to start the history log.</div>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <span className={styles.count}>{matches.length} match{matches.length !== 1 ? 'es' : ''}</span>
        <button className={styles.clearBtn} onClick={handleClear}>🗑 Clear History</button>
      </div>
      <div className={styles.list}>
        {matches.map((m) => <MatchCard key={m.id} match={m} />)}
      </div>
    </div>
  )
}
