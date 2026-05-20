export type Role = 'Top' | 'Jungle' | 'Mid' | 'ADC' | 'Support'

export type Division =
  | 'Iron' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  | 'Emerald' | 'Diamond' | 'Master' | 'Grandmaster' | 'Challenger'

export interface RoleConfig {
  icon: string
  label: string
  color: string
  bg: string
}

export interface DivisionConfig {
  color: string
  icon: string
  score: number
}

export interface Player {
  id: number
  nickname: string
  mainRole: Role
  secondaryRole: Role
  division: Division
}

export type AssignedAs = 'Main' | 'Secondary' | 'Autofill'

export interface TeamSlot {
  role: Role
  id: number
  nickname: string
  mainRole: Role
  secondaryRole: Role
  division: Division
  assignedAs: AssignedAs
}

export type Team = TeamSlot[]
