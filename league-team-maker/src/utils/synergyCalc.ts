import type { Role } from '../types'
import { ROLES } from '../constants/roles'
import type { Champion, ChampTrait } from '../data/champions'
import { getChampionsForRole, findChampion } from '../data/champions'

export type TeamComp = Partial<Record<Role, Champion | null>>

export interface SynergyBreakdown {
  damageBalance: number
  cc: number
  frontline: number
  compCohesion: number
  comboPotential: number
}

export interface SynergyResult {
  score: number
  grade: string
  detectedComp: string
  breakdown: SynergyBreakdown
  allTraits: ChampTrait[]
  damageTypes: { magic: number; physical: number }
  filledSlots: number
  comboLabel?: string
}

export interface WinFactor {
  label: string
  delta: number
}

export interface WinProbResult {
  blue: number
  red: number
  factors: WinFactor[]
}

const SYNERGY_PAIRS: Array<{ champs: string[]; bonus: number; label: string }> = [
  { champs: ['Orianna', 'Malphite'],      bonus: 20, label: 'Ball Delivery' },
  { champs: ['Orianna', 'Amumu'],         bonus: 20, label: 'Ball Delivery' },
  { champs: ['Orianna', 'Hecarim'],       bonus: 16, label: 'Ball Delivery' },
  { champs: ['Orianna', 'Zac'],           bonus: 15, label: 'Ball Delivery' },
  { champs: ['Yasuo', 'Malphite'],        bonus: 22, label: 'Last Breath' },
  { champs: ['Yasuo', 'Amumu'],           bonus: 20, label: 'Last Breath' },
  { champs: ['Yasuo', 'Jarvan IV'],       bonus: 16, label: 'Last Breath' },
  { champs: ['Yasuo', 'Hecarim'],         bonus: 16, label: 'Last Breath' },
  { champs: ['Yone', 'Malphite'],         bonus: 20, label: 'Last Breath' },
  { champs: ['Yone', 'Amumu'],            bonus: 20, label: 'Last Breath' },
  { champs: ['Amumu', 'Miss Fortune'],    bonus: 22, label: 'Wombo Combo' },
  { champs: ['Amumu', 'Jinx'],            bonus: 16, label: 'Wombo Combo' },
  { champs: ['Sejuani', 'Miss Fortune'],  bonus: 20, label: 'Wombo Combo' },
  { champs: ['Zac', 'Miss Fortune'],      bonus: 18, label: 'Wombo Combo' },
  { champs: ['Malphite', 'Miss Fortune'], bonus: 18, label: 'Wombo Combo' },
  { champs: ["Kog'Maw", 'Lulu'],          bonus: 22, label: 'Protect the Carry' },
  { champs: ["Kog'Maw", 'Nami'],          bonus: 20, label: 'Protect the Carry' },
  { champs: ['Jinx', 'Lulu'],             bonus: 18, label: 'Protect the Carry' },
  { champs: ['Vayne', 'Lulu'],            bonus: 20, label: 'Protect the Carry' },
  { champs: ['Vayne', 'Soraka'],          bonus: 16, label: 'Protect the Carry' },
  { champs: ['Jinx', 'Zilean'],           bonus: 16, label: 'Immortal Carry' },
  { champs: ['Samira', 'Leona'],          bonus: 20, label: 'All-In Brawl' },
  { champs: ['Samira', 'Nautilus'],       bonus: 20, label: 'All-In Brawl' },
  { champs: ['Samira', 'Thresh'],         bonus: 18, label: 'All-In Brawl' },
  { champs: ['Thresh', 'Kalista'],        bonus: 22, label: 'Thresh Rend' },
  { champs: ['Blitzcrank', 'Miss Fortune'], bonus: 18, label: 'Hook & Barrage' },
  { champs: ['Renata Glasc', 'Jinx'],     bonus: 20, label: 'Battle Frenzy' },
  { champs: ['Renata Glasc', 'Samira'],   bonus: 18, label: 'Battle Frenzy' },
  { champs: ['Annie', 'Amumu'],           bonus: 16, label: 'Double Engage' },
  { champs: ['Hecarim', 'Orianna'],       bonus: 16, label: 'Ball Delivery' },
]

const COMP_COUNTERS: Record<string, string[]> = {
  'Poke Siege':        ['Engage Heavy', 'Wombo Combo', 'Engage + AOE'],
  'Engage Heavy':      ['Poke Siege', 'Protect the Carry'],
  'Engage + AOE':      ['Poke Siege', 'Protect the Carry'],
  'Wombo Combo':       ['Poke Siege'],
  'Protect the Carry': ['Engage Heavy', 'Engage + AOE', 'Wombo Combo'],
  'Dive Squad':        ['Protect the Carry', 'Poke Siege'],
  'Sustain Poke':      ['Burst Heavy', 'Dive Squad'],
  'Burst Heavy':       ['Sustain Poke'],
}

function countTrait(comp: TeamComp, trait: ChampTrait): number {
  return Object.values(comp).filter((c) => c?.traits.includes(trait)).length
}

function names(comp: TeamComp): string[] {
  return Object.values(comp).filter(Boolean).map((c) => c!.name)
}

function getAllTraits(comp: TeamComp): ChampTrait[] {
  const set = new Set<ChampTrait>()
  Object.values(comp).forEach((c) => c?.traits.forEach((t) => set.add(t)))
  return Array.from(set)
}

function getDamageTypes(comp: TeamComp): { magic: number; physical: number } {
  const result = { magic: 0, physical: 0 }
  Object.values(comp).forEach((c) => {
    if (!c) return
    if (c.damageType === 'magic' || c.damageType === 'mixed') result.magic++
    if (c.damageType === 'physical' || c.damageType === 'mixed') result.physical++
  })
  return result
}

function detectComp(comp: TeamComp): { comp: string; label?: string } {
  const engage     = countTrait(comp, 'engage')
  const poke       = countTrait(comp, 'poke')
  const aoe        = countTrait(comp, 'aoe')
  const peel       = countTrait(comp, 'peel') + countTrait(comp, 'shield') + countTrait(comp, 'heal')
  const hypercarry = countTrait(comp, 'hypercarry')
  const dive       = countTrait(comp, 'dive') + countTrait(comp, 'assassin')
  const sustain    = countTrait(comp, 'sustain') + countTrait(comp, 'heal')
  const burst      = countTrait(comp, 'burst')
  const teamfight  = countTrait(comp, 'teamfight')

  const champNames = names(comp)

  const wombo = SYNERGY_PAIRS.find(
    (p) => p.label === 'Wombo Combo' && p.champs.every((n) => champNames.includes(n)),
  )
  if (wombo) return { comp: 'Wombo Combo', label: wombo.label }

  if (engage >= 2 && aoe >= 2)              return { comp: 'Engage + AOE' }
  if (engage >= 3)                          return { comp: 'Engage Heavy' }
  if (hypercarry >= 1 && peel >= 3)         return { comp: 'Protect the Carry' }
  if (hypercarry >= 1 && peel >= 2)         return { comp: 'Protect the Carry' }
  if (poke >= 3)                            return { comp: 'Poke Siege' }
  if (dive >= 3)                            return { comp: 'Dive Squad' }
  if (burst >= 3)                           return { comp: 'Burst Heavy' }
  if (teamfight >= 3 && engage >= 1)        return { comp: 'Teamfight' }
  if (sustain >= 2 && poke >= 2)            return { comp: 'Sustain Poke' }
  return { comp: 'Balanced' }
}

function getGrade(score: number): string {
  if (score >= 88) return 'S+'
  if (score >= 78) return 'S'
  if (score >= 66) return 'A'
  if (score >= 54) return 'B'
  if (score >= 42) return 'C'
  return 'D'
}

export function calculateTeamSynergy(comp: TeamComp): SynergyResult {
  const filled = Object.values(comp).filter(Boolean).length

  if (filled === 0) {
    return {
      score: 0, grade: '–', detectedComp: '–',
      breakdown: { damageBalance: 0, cc: 0, frontline: 0, compCohesion: 0, comboPotential: 0 },
      allTraits: [], damageTypes: { magic: 0, physical: 0 }, filledSlots: 0,
    }
  }

  const dt = getDamageTypes(comp)

  let damageBalance = 0
  if (dt.magic >= 2 && dt.physical >= 2)      damageBalance = 30
  else if (dt.magic >= 1 && dt.physical >= 1) damageBalance = 18
  else                                         damageBalance = 5

  const ccCount = countTrait(comp, 'cc')
  const ccScore = Math.min(ccCount * 5, 20)

  const frontlineCount =
    countTrait(comp, 'tank') +
    countTrait(comp, 'engage') +
    Math.min(countTrait(comp, 'bruiser'), 2)
  const frontlineScore = Math.min(frontlineCount * 3, 20)

  const engage     = countTrait(comp, 'engage')
  const poke       = countTrait(comp, 'poke')
  const peel       = countTrait(comp, 'peel') + countTrait(comp, 'shield') + countTrait(comp, 'heal')
  const hypercarry = countTrait(comp, 'hypercarry')
  const dive       = countTrait(comp, 'dive') + countTrait(comp, 'assassin')
  const teamfight  = countTrait(comp, 'teamfight')
  const sustain    = countTrait(comp, 'sustain') + countTrait(comp, 'heal')
  const aoe        = countTrait(comp, 'aoe')

  let compCohesion = 0
  if (engage >= 2 && teamfight >= 3)     compCohesion = 20
  else if (hypercarry >= 1 && peel >= 3) compCohesion = 20
  else if (hypercarry >= 1 && peel >= 2) compCohesion = 16
  else if (poke >= 3)                    compCohesion = 17
  else if (engage >= 2 && aoe >= 2)      compCohesion = 18
  else if (dive >= 3)                    compCohesion = 15
  else if (teamfight >= 3)               compCohesion = 13
  else if (sustain >= 2 && poke >= 1)    compCohesion = 12
  else                                   compCohesion = 7

  let comboPotential = 0
  let comboLabel: string | undefined

  if (engage >= 1 && aoe >= 1) comboPotential += 4

  const champNames = names(comp)
  let bestPairBonus = 0
  for (const pair of SYNERGY_PAIRS) {
    if (pair.champs.every((n) => champNames.includes(n)) && pair.bonus > bestPairBonus) {
      bestPairBonus = pair.bonus
      comboLabel = pair.label
    }
  }
  if (bestPairBonus > 0) {
    comboPotential += Math.min(Math.round(bestPairBonus / 4), 6)
  }
  comboPotential = Math.min(comboPotential, 10)

  const raw   = damageBalance + ccScore + frontlineScore + compCohesion + comboPotential
  const score = Math.min(Math.round(raw), 100)

  const { comp: detectedComp } = detectComp(comp)

  return {
    score,
    grade: getGrade(score),
    detectedComp,
    breakdown: { damageBalance, cc: ccScore, frontline: frontlineScore, compCohesion, comboPotential },
    allTraits: getAllTraits(comp),
    damageTypes: dt,
    filledSlots: filled,
    comboLabel,
  }
}

export function calculateWinProb(
  blueResult: SynergyResult,
  redResult:  SynergyResult,
): WinProbResult {
  const factors: WinFactor[] = []

  const scoreDiff    = blueResult.score - redResult.score
  const synergyDelta = Math.max(-15, Math.min(15, Math.round(scoreDiff * 0.15)))
  factors.push({ label: 'Synergy Score', delta: synergyDelta })

  const blueCompRaw  = blueResult.detectedComp
  const redCompRaw   = redResult.detectedComp
  const blueCounters = (COMP_COUNTERS[blueCompRaw] ?? []).includes(redCompRaw)
  const redCounters  = (COMP_COUNTERS[redCompRaw]  ?? []).includes(blueCompRaw)
  const compDelta    = blueCounters ? 8 : redCounters ? -8 : 0
  if (compDelta !== 0) {
    factors.push({ label: 'Comp Matchup', delta: compDelta })
  }

  const blueBal  = Math.min(blueResult.damageTypes.magic, blueResult.damageTypes.physical)
  const redBal   = Math.min(redResult.damageTypes.magic,  redResult.damageTypes.physical)
  const dmgDelta = Math.max(-4, Math.min(4, (blueBal - redBal) * 2))
  if (Math.abs(dmgDelta) >= 2) {
    factors.push({ label: 'Damage Variety', delta: dmgDelta })
  }

  const blueCCScore = blueResult.breakdown.cc
  const redCCScore  = redResult.breakdown.cc
  const ccDelta     = Math.max(-5, Math.min(5, Math.round((blueCCScore - redCCScore) * 0.25)))
  if (Math.abs(ccDelta) >= 1) {
    factors.push({ label: 'CC Advantage', delta: ccDelta })
  }

  const totalDelta = synergyDelta + compDelta + dmgDelta + ccDelta
  const blue = Math.max(30, Math.min(70, Math.round(50 + totalDelta)))
  const red  = 100 - blue

  return { blue, red, factors }
}

export function gradeColor(grade: string): string {
  switch (grade) {
    case 'S+': return '#FFD700'
    case 'S':  return '#C8AA6E'
    case 'A':  return '#81C784'
    case 'B':  return '#64B5F6'
    case 'C':  return '#FFB74D'
    case 'D':  return '#EF9A9A'
    default:   return '#888'
  }
}

export function compIcon(comp: string): string {
  switch (comp) {
    case 'Wombo Combo':       return '💥'
    case 'Engage + AOE':      return '⚡'
    case 'Engage Heavy':      return '🔥'
    case 'Protect the Carry': return '🛡️'
    case 'Poke Siege':        return '🎯'
    case 'Dive Squad':        return '🗡️'
    case 'Burst Heavy':       return '⚡'
    case 'Teamfight':         return '⚔️'
    case 'Sustain Poke':      return '💚'
    case 'Balanced':          return '⚖️'
    default:                  return '🔮'
  }
}

const META_POOL: Record<Role, string[]> = {
  Top: [
    "K'Sante", 'Malphite', 'Ornn', 'Sion', 'Maokai',
    'Aatrox', 'Renekton', 'Sett', 'Darius', 'Urgot',
    'Camille', 'Jax', 'Gnar', 'Kennen', 'Rumble',
    'Gangplank', 'Jayce', 'Fiora', 'Wukong', 'Gragas',
  ],
  Jungle: [
    'Amumu', 'Sejuani', 'Zac', 'Jarvan IV', 'Hecarim',
    "Lee Sin", 'Vi', "Rek'Sai", 'Xin Zhao', 'Vi',
    "Graves", "Viego", "Kha'Zix", "Bel'Veth", 'Nidalee',
    'Nocturne', 'Taliyah', 'Diana', 'Kindred', 'Nunu & Willump',
  ],
  Mid: [
    'Orianna', 'Viktor', 'Azir', 'Aurelion Sol', 'Cassiopeia',
    'Syndra', 'Lissandra', 'Vex', 'Twisted Fate', 'Ryze',
    'Ahri', 'LeBlanc', 'Zed', 'Akali', 'Kassadin',
    'Yasuo', 'Yone', 'Irelia', 'Sylas', 'Ekko',
  ],
  ADC: [
    'Jinx', 'Caitlyn', 'Jhin', 'Miss Fortune', 'Aphelios',
    "Kai'Sa", 'Xayah', 'Zeri', 'Tristana', 'Samira',
    'Ashe', 'Varus', 'Sivir', "Kog'Maw", 'Draven',
    'Twitch', 'Lucian', 'Ezreal', 'Vayne', 'Nilah',
  ],
  Support: [
    'Thresh', 'Nautilus', 'Leona', 'Rell', 'Alistar',
    'Lulu', 'Nami', 'Soraka', 'Janna', 'Milio',
    'Renata Glasc', 'Sona', 'Karma', 'Bard', 'Seraphine',
    'Taric', 'Blitzcrank', 'Pyke', 'Shen', 'Zilean',
  ],
}

export function generateProTeam(
  currentComp: TeamComp,
  blacklist: string[] = [],
  iterations = 500,
): TeamComp {
  const emptyRoles = ROLES.filter((r) => !currentComp[r])
  if (emptyRoles.length === 0) return currentComp

  const usedNames = Object.values(currentComp)
    .filter(Boolean)
    .map((c) => c!.name)
  const excluded = new Set([...blacklist, ...usedNames])

  const candidatesByRole: Record<string, Champion[]> = {}
  for (const role of emptyRoles) {
    const metaFiltered = META_POOL[role]
      .filter((n) => !excluded.has(n))
      .map((n) => findChampion(n))
      .filter(Boolean) as Champion[]

    candidatesByRole[role] =
      metaFiltered.length > 0
        ? metaFiltered
        : getChampionsForRole(role).filter((c) => !excluded.has(c.name))
  }

  let bestComp: TeamComp = { ...currentComp }
  let bestScore = calculateTeamSynergy(currentComp).score

  for (let i = 0; i < iterations; i++) {
    const trial: TeamComp = { ...currentComp }
    const pickedThisRun   = new Set<string>()

    for (const role of emptyRoles) {
      const pool = candidatesByRole[role].filter((c) => !pickedThisRun.has(c.name))
      if (pool.length === 0) continue
      const champ = pool[Math.floor(Math.random() * pool.length)]
      trial[role] = champ
      pickedThisRun.add(champ.name)
    }

    const score = calculateTeamSynergy(trial).score
    if (score > bestScore) {
      bestScore = score
      bestComp  = { ...trial }
    }
  }

  return bestComp
}
