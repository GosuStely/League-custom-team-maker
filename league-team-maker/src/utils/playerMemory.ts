import type { Division, Role } from '../types'

const STORAGE_KEY = 'liga_player_memory'

export interface PlayerProfile {
  mainRole: Role
  secondaryRole: Role
  division: Division
}

type PlayerMemory = Record<string, PlayerProfile>

function load(): PlayerMemory {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function lookupPlayer(nickname: string): PlayerProfile | null {
  const key = nickname.trim().toLowerCase()
  if (!key) return null
  return load()[key] ?? null
}

export function saveAllPlayers(
  players: Array<{ nickname: string; mainRole: Role; secondaryRole: Role; division: Division }>,
): void {
  const memory = load()
  for (const p of players) {
    const key = p.nickname.trim().toLowerCase()
    if (key) {
      memory[key] = { mainRole: p.mainRole, secondaryRole: p.secondaryRole, division: p.division }
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memory))
}
