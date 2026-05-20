import { ROLES, DIVISION_CONFIG } from '../constants/roles'
import type { Player, Role, Team, TeamSlot, AssignedAs } from '../types'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

/**
 * Assigns 10 players into two balanced 5v5 teams.
 *
 * Phase 1 — Role assignment (3 passes):
 *   Pass 1: fill each role with players whose mainRole matches
 *   Pass 2: fill remaining gaps with players whose secondaryRole matches
 *   Pass 3: autofill any leftover players into open slots
 *
 * Phase 2 — Rank balancing (greedy snake-draft):
 *   For each role's two candidates, the stronger player goes to
 *   whichever team currently has the lower cumulative rank score.
 */
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

  // Phase 2: greedy snake-draft to balance total rank score
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

/** Average division score for a team (used to display ~rank label). */
export function teamAvgScore(team: Team): number {
  const total = team.reduce((sum, s) => sum + DIVISION_CONFIG[s.division].score, 0)
  return Math.round((total / team.length) * 10) / 10
}
