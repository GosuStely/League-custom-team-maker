import { useState, useMemo } from 'react'
import { loadAllRecords, winRatePct } from '../utils/winTracker'
import { loadMatches } from '../utils/matchHistory'
import type { MatchRecord } from '../utils/matchHistory'
import styles from './Leaderboard.module.css'

type SortKey = 'winRate' | 'wins' | 'losses' | 'games'

function computeStreak(key: string, matches: MatchRecord[]): number {
  const relevant = matches.filter((m) =>
    m.blue.some((p) => p.nickname.toLowerCase() === key) ||
    m.red.some((p) => p.nickname.toLowerCase() === key),
  )
  if (relevant.length === 0) return 0

  const won = (m: MatchRecord) =>
    m.winner === 'blue'
      ? m.blue.some((p) => p.nickname.toLowerCase() === key)
      : m.red.some((p) => p.nickname.toLowerCase() === key)

  const firstWon = won(relevant[0])
  let streak = 0
  for (const m of relevant) {
    if (won(m) === firstWon) streak++
    else break
  }
  return firstWon ? streak : -streak
}

function streakLabel(streak: number): string {
  if (streak === 0) return '—'
  return streak > 0 ? `🔥 ${streak}W` : `❄️ ${Math.abs(streak)}L`
}

function streakColor(streak: number): string {
  if (streak >= 3) return '#C8AA6E'
  if (streak > 0)  return '#81C784'
  if (streak <= -3) return '#CF6679'
  if (streak < 0)  return '#EF9A9A'
  return 'rgba(200,184,150,0.4)'
}

const RANK_ICONS = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const [sortKey, setSortKey] = useState<SortKey>('winRate')
  const [sortAsc, setSortAsc]  = useState(false)

  const matches = useMemo(() => loadMatches(), [])
  const raw     = useMemo(() => loadAllRecords(), [])

  const rows = useMemo(() => {
    return raw
      .map((r) => ({
        ...r,
        games:   r.wins + r.losses,
        winRate: winRatePct(r) ?? 0,
        streak:  computeStreak(r.key, matches),
      }))
      .filter((r) => r.games > 0)
      .sort((a, b) => {
        const dir = sortAsc ? 1 : -1
        if (sortKey === 'winRate') return (b.winRate - a.winRate) * dir || (b.games - a.games)
        if (sortKey === 'wins')    return (b.wins    - a.wins)    * dir
        if (sortKey === 'losses')  return (b.losses  - a.losses)  * dir
        return (b.games - a.games) * dir
      })
  }, [raw, matches, sortKey, sortAsc])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((p) => !p)
    else { setSortKey(key); setSortAsc(false) }
  }

  function colClass(key: SortKey) {
    return [styles.th, sortKey === key ? styles.thActive : ''].join(' ')
  }

  if (rows.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📊</div>
        <div className={styles.emptyText}>No games recorded yet.</div>
        <div className={styles.emptySub}>Mark match results in the Team Maker tab to build the leaderboard.</div>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>#</th>
              <th className={`${styles.th} ${styles.thName}`}>Player</th>
              <th className={colClass('wins')}    onClick={() => toggleSort('wins')}>W {sortKey === 'wins'    ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th className={colClass('losses')}  onClick={() => toggleSort('losses')}>L {sortKey === 'losses'  ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th className={colClass('games')}   onClick={() => toggleSort('games')}>G {sortKey === 'games'   ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th className={colClass('winRate')} onClick={() => toggleSort('winRate')}>Win% {sortKey === 'winRate' ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th className={styles.th}>Streak</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const isTop = i < 3
              const wrColor =
                row.winRate >= 55 ? '#81C784' :
                row.winRate >= 50 ? '#C8AA6E' :
                row.winRate >= 45 ? '#FFB74D' : '#EF9A9A'

              return (
                <tr key={row.key} className={`${styles.row} ${isTop ? styles.rowTop : ''}`}>
                  <td className={styles.tdRank}>
                    {i < 3 ? RANK_ICONS[i] : <span className={styles.rankNum}>{i + 1}</span>}
                  </td>
                  <td className={styles.tdName}>
                    {isTop && <span className={styles.topGlow} />}
                    {row.displayName}
                  </td>
                  <td className={styles.tdNum} style={{ color: '#81C784' }}>{row.wins}</td>
                  <td className={styles.tdNum} style={{ color: '#EF9A9A' }}>{row.losses}</td>
                  <td className={styles.tdNum}>{row.games}</td>
                  <td className={styles.tdWr} style={{ color: wrColor }}>{row.winRate}%</td>
                  <td className={styles.tdStreak} style={{ color: streakColor(row.streak) }}>
                    {streakLabel(row.streak)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
