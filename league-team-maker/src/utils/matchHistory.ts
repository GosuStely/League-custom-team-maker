const KEY = 'liga_match_history'
const MAX_RECORDS = 100

export interface MatchPlayer {
  nickname: string
  role: string
  division: string
}

export interface MatchRecord {
  id: string
  timestamp: number
  winner: 'blue' | 'red'
  blue: MatchPlayer[]
  red: MatchPlayer[]
}

function load(): MatchRecord[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function loadMatches(): MatchRecord[] {
  return load()
}

export function saveMatch(data: Omit<MatchRecord, 'id' | 'timestamp'>): void {
  const history = load()
  history.unshift({
    ...data,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    timestamp: Date.now(),
  })
  localStorage.setItem(KEY, JSON.stringify(history.slice(0, MAX_RECORDS)))
}

export function clearHistory(): void {
  localStorage.removeItem(KEY)
}
