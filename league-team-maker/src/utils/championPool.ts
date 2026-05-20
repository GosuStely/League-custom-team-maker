const KEY = 'liga_champion_pools'

type PoolStore = Record<string, string[]>

function load(): PoolStore {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
}

function save(store: PoolStore): void {
  localStorage.setItem(KEY, JSON.stringify(store))
}

export function getPool(nickname: string): string[] {
  const key = nickname.trim().toLowerCase()
  if (!key) return []
  return load()[key] ?? []
}

export function savePool(nickname: string, champions: string[]): void {
  const key = nickname.trim().toLowerCase()
  if (!key) return
  const store = load()
  store[key] = champions
  save(store)
}
