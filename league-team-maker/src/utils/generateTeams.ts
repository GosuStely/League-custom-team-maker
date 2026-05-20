import { ROLES, DIVISION_CONFIG } from '../constants/roles'
import type { Player, Role, Team, TeamSlot, AssignedAs } from '../types'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function generateTeams(players: Player[]): [Team, Team] {
  const shuffled = shuffle(players)
  const assigned = new Set<number>()

  const slots: Record<Role, Array<Omit<TeamSlot, 'role'>>> = {
    Top: [], Jungle: [], Mid: [], ADC: [], Support: [],
  }

  const fillPass = (getRole: (p: Player) => Role, label: AssignedAs) => {
    for (const role of ROLES) {
      for (const p of shuffled) {
        if (slots[role].length >= 2) break
        if (assigned.has(p.id)) continue
        if (getRole(p) !== role) continue
        slots[role].push({
          id: p.id, nickname: p.nickname,
          mainRole: p.mainRole, secondaryRole: p.secondaryRole,
          division: p.division, assignedAs: label,
        })
        assigned.add(p.id)
      }
    }
  }

  fillPass((p) => p.mainRole,      'Main')
  fillPass((p) => p.secondaryRole, 'Secondary')

  for (const role of ROLES) {
    for (const p of shuffled) {
      if (slots[role].length >= 2) break
      if (assigned.has(p.id)) continue
      slots[role].push({
        id: p.id, nickname: p.nickname,
        mainRole: p.mainRole, secondaryRole: p.secondaryRole,
        division: p.division, assignedAs: 'Autofill' as AssignedAs,
      })
      assigned.add(p.id)
    }
  }

  const team1: Team = []
  const team2: Team = []
  let score1 = 0
  let score2 = 0

  for (const role of ROLES) {
    const [a, b] = slots[role] as [Omit<TeamSlot,'role'>, Omit<TeamSlot,'role'>]
    const sa = DIVISION_CONFIG[a.division].score
    const sb = DIVISION_CONFIG[b.division].score
    const [stronger, weaker] = sa >= sb ? [a, b] : [b, a]
    const [sStrong, sWeak]   = sa >= sb ? [sa, sb] : [sb, sa]

    if (score1 <= score2) {
      team1.push({ role, ...stronger })
      team2.push({ role, ...weaker })
      score1 += sStrong
      score2 += sWeak
    } else {
      team1.push({ role, ...weaker })
      team2.push({ role, ...stronger })
      score1 += sWeak
      score2 += sStrong
    }
  }

  return [team1, team2]
}

export function teamAvgScore(team: Team): number {
  const total = team.reduce((sum, s) => sum + DIVISION_CONFIG[s.division].score, 0)
  return Math.round((total / team.length) * 10) / 10
}
