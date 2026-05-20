import type { Role, RoleConfig, Division, DivisionConfig } from '../types'

/* ── Roles ── */
export const ROLES: Role[] = ['Top', 'Jungle', 'Mid', 'ADC', 'Support']

export const ROLE_CONFIG: Record<Role, RoleConfig> = {
  Top:     { icon: '⚔️',  label: 'Top', color: '#C8AA6E', bg: 'rgba(200,170,110,0.15)' },
  Jungle:  { icon: '🌿',  label: 'JGL', color: '#6CC86E', bg: 'rgba(108,200,110,0.15)' },
  Mid:     { icon: '🔮',  label: 'Mid', color: '#CCA8FF', bg: 'rgba(204,168,255,0.15)' },
  ADC:     { icon: '🏹',  label: 'ADC', color: '#E88899', bg: 'rgba(232,136,153,0.15)' },
  Support: { icon: '🛡️', label: 'SUP', color: '#64B5F6', bg: 'rgba(100,181,246,0.15)' },
}

/* ── Divisions ── */
export const DIVISIONS: Division[] = [
  'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum',
  'Emerald', 'Diamond', 'Master', 'Grandmaster', 'Challenger',
]

export const DIVISION_CONFIG: Record<Division, DivisionConfig> = {
  Iron:        { color: '#B5A498', icon: '🪨', score: 1  },
  Bronze:      { color: '#D4996E', icon: '🥉', score: 2  },
  Silver:      { color: '#9BB0C0', icon: '🥈', score: 3  },
  Gold:        { color: '#C8A84B', icon: '🥇', score: 4  },
  Platinum:    { color: '#38BFBF', icon: '💠', score: 5  },
  Emerald:     { color: '#6CC86E', icon: '💚', score: 6  },
  Diamond:     { color: '#96A5EE', icon: '💎', score: 7  },
  Master:      { color: '#D090EE', icon: '👑', score: 8  },
  Grandmaster: { color: '#E88899', icon: '🔥', score: 9  },
  Challenger:  { color: '#F4C874', icon: '⚡', score: 10 },
}

export const PLAYER_COUNT = 10
