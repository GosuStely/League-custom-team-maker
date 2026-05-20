const WIN_STORAGE_KEY = 'liga_win_records'

export interface WinRecord {
  wins: number
  losses: number
}

type WinStore = Record<string, WinRecord>

function load(): WinStore {
  try {
    return JSON.parse(localStorage.getItem(WIN_STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function save(store: WinStore): void {
  localStorage.setItem(WIN_STORAGE_KEY, JSON.stringify(store))
}

export function getWinRecord(nickname: string): WinRecord {
  const key = nickname.trim().toLowerCase()
  if (!key) return { wins: 0, losses: 0 }
  return load()[key] ?? { wins: 0, losses: 0 }
}

export function recordResult(winners: string[], losers: string[]): void {
  const store = load()
  for (const n of winners) {
    const key = n.trim().toLowerCase()
    if (!key) continue
    const rec = store[key] ?? { wins: 0, losses: 0 }
    store[key] = { wins: rec.wins + 1, losses: rec.losses }
  }
  for (const n of losers) {
    const key = n.trim().toLowerCase()
    if (!key) continue
    const rec = store[key] ?? { wins: 0, losses: 0 }
    store[key] = { wins: rec.wins, losses: rec.losses + 1 }
  }
  save(store)
}

export function winRatePct(record: WinRecord): number | null {
  const total = record.wins + record.losses
  if (total === 0) return null
  return Math.round((record.wins / total) * 100)
}
