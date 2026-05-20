import type { Role } from '../types'

export type DamageType = 'physical' | 'magic' | 'mixed'

export type ChampTrait =
  | 'engage'
  | 'peel'
  | 'poke'
  | 'dive'
  | 'burst'
  | 'cc'
  | 'aoe'
  | 'splitpush'
  | 'sustain'
  | 'assassin'
  | 'tank'
  | 'bruiser'
  | 'hypercarry'
  | 'waveclear'
  | 'mobility'
  | 'shield'
  | 'heal'
  | 'teamfight'
  | 'skirmish'

export interface Champion {
  name: string
  roles: Role[]
  damageType: DamageType
  traits: ChampTrait[]
}

export const CHAMPIONS: Champion[] = [
  // ── A ───────────────────────────────────────────────────────────────────
  { name: 'Aatrox',        roles: ['Top'],                      damageType: 'physical', traits: ['bruiser','cc','sustain','teamfight'] },
  { name: 'Ahri',          roles: ['Mid'],                      damageType: 'magic',    traits: ['burst','mobility','cc','skirmish','poke'] },
  { name: 'Akali',         roles: ['Mid','Top'],                damageType: 'magic',    traits: ['assassin','burst','dive','mobility','skirmish'] },
  { name: 'Akshan',        roles: ['Mid','ADC'],                damageType: 'physical', traits: ['poke','mobility','skirmish'] },
  { name: 'Alistar',       roles: ['Support'],                  damageType: 'mixed',    traits: ['engage','cc','tank','teamfight','heal','peel'] },
  { name: 'Ambessa',       roles: ['Top','Jungle'],             damageType: 'physical', traits: ['bruiser','dive','skirmish','mobility','cc'] },
  { name: 'Amumu',         roles: ['Jungle','Support'],         damageType: 'magic',    traits: ['tank','engage','aoe','cc','teamfight'] },
  { name: 'Anivia',        roles: ['Mid'],                      damageType: 'magic',    traits: ['cc','aoe','waveclear','poke','teamfight'] },
  { name: 'Annie',         roles: ['Mid','Support'],            damageType: 'magic',    traits: ['engage','burst','cc','aoe','teamfight'] },
  { name: 'Aphelios',      roles: ['ADC'],                      damageType: 'physical', traits: ['hypercarry','poke','aoe','teamfight'] },
  { name: 'Ashe',          roles: ['ADC'],                      damageType: 'physical', traits: ['cc','poke','teamfight'] },
  { name: 'Aurelion Sol',  roles: ['Mid'],                      damageType: 'magic',    traits: ['aoe','poke','waveclear','teamfight','cc'] },
  { name: 'Aurora',        roles: ['Top','Mid'],                damageType: 'magic',    traits: ['poke','mobility','skirmish','cc'] },
  { name: 'Azir',          roles: ['Mid'],                      damageType: 'magic',    traits: ['aoe','poke','waveclear','teamfight','cc','mobility'] },

  // ── B ───────────────────────────────────────────────────────────────────
  { name: 'Bard',          roles: ['Support'],                  damageType: 'magic',    traits: ['cc','mobility','peel','teamfight'] },
  { name: "Bel'Veth",      roles: ['Jungle'],                   damageType: 'physical', traits: ['hypercarry','skirmish','mobility','dive'] },
  { name: 'Blitzcrank',    roles: ['Support'],                  damageType: 'physical', traits: ['cc','engage','tank'] },
  { name: 'Brand',         roles: ['Support','Mid'],            damageType: 'magic',    traits: ['aoe','burst','poke','teamfight'] },
  { name: 'Braum',         roles: ['Support'],                  damageType: 'physical', traits: ['engage','cc','peel','tank','shield'] },
  { name: 'Briar',         roles: ['Jungle'],                   damageType: 'physical', traits: ['dive','bruiser','skirmish','sustain'] },

  // ── C ───────────────────────────────────────────────────────────────────
  { name: 'Caitlyn',       roles: ['ADC'],                      damageType: 'physical', traits: ['poke','hypercarry','cc','waveclear'] },
  { name: 'Camille',       roles: ['Top','Jungle'],             damageType: 'physical', traits: ['dive','mobility','skirmish','splitpush','cc'] },
  { name: 'Cassiopeia',    roles: ['Mid'],                      damageType: 'magic',    traits: ['poke','aoe','cc','sustain','teamfight'] },
  { name: "Cho'Gath",      roles: ['Top'],                      damageType: 'magic',    traits: ['tank','sustain','cc','teamfight'] },
  { name: 'Corki',         roles: ['Mid','ADC'],                damageType: 'mixed',    traits: ['poke','burst','mobility','waveclear'] },

  // ── D ───────────────────────────────────────────────────────────────────
  { name: 'Darius',        roles: ['Top'],                      damageType: 'physical', traits: ['bruiser','cc','dive','splitpush','teamfight'] },
  { name: 'Diana',         roles: ['Jungle','Mid'],             damageType: 'magic',    traits: ['engage','burst','aoe','dive','cc'] },
  { name: 'Dr. Mundo',     roles: ['Top','Jungle'],             damageType: 'physical', traits: ['tank','sustain','bruiser','splitpush'] },
  { name: 'Draven',        roles: ['ADC'],                      damageType: 'physical', traits: ['hypercarry','burst','skirmish','cc'] },

  // ── E ───────────────────────────────────────────────────────────────────
  { name: 'Ekko',          roles: ['Mid','Jungle'],             damageType: 'magic',    traits: ['assassin','burst','mobility','skirmish','aoe'] },
  { name: 'Elise',         roles: ['Jungle'],                   damageType: 'magic',    traits: ['burst','cc','dive','skirmish','mobility'] },
  { name: 'Evelynn',       roles: ['Jungle'],                   damageType: 'magic',    traits: ['assassin','burst','skirmish','mobility'] },
  { name: 'Ezreal',        roles: ['ADC'],                      damageType: 'physical', traits: ['poke','mobility','skirmish'] },

  // ── F ───────────────────────────────────────────────────────────────────
  { name: 'Fiddlesticks',  roles: ['Jungle','Support'],         damageType: 'magic',    traits: ['aoe','cc','burst','teamfight'] },
  { name: 'Fiora',         roles: ['Top'],                      damageType: 'physical', traits: ['splitpush','skirmish','mobility','bruiser'] },
  { name: 'Fizz',          roles: ['Mid'],                      damageType: 'magic',    traits: ['assassin','dive','burst','mobility','cc'] },

  // ── G ───────────────────────────────────────────────────────────────────
  { name: 'Galio',         roles: ['Mid','Support'],            damageType: 'magic',    traits: ['tank','engage','cc','teamfight','peel'] },
  { name: 'Gangplank',     roles: ['Top'],                      damageType: 'physical', traits: ['poke','aoe','splitpush','skirmish','cc'] },
  { name: 'Garen',         roles: ['Top'],                      damageType: 'physical', traits: ['tank','bruiser','waveclear'] },
  { name: 'Gnar',          roles: ['Top'],                      damageType: 'mixed',    traits: ['cc','poke','skirmish','tank','engage','aoe'] },
  { name: 'Gragas',        roles: ['Jungle','Top','Support'],   damageType: 'magic',    traits: ['engage','cc','tank','aoe','poke'] },
  { name: 'Graves',        roles: ['Jungle'],                   damageType: 'physical', traits: ['skirmish','burst','bruiser'] },
  { name: 'Gwen',          roles: ['Top'],                      damageType: 'magic',    traits: ['bruiser','skirmish','dive','sustain'] },

  // ── H ───────────────────────────────────────────────────────────────────
  { name: 'Hecarim',       roles: ['Jungle'],                   damageType: 'physical', traits: ['engage','dive','aoe','mobility','cc','teamfight'] },
  { name: 'Heimerdinger',  roles: ['Mid','Top','Support'],      damageType: 'magic',    traits: ['poke','waveclear','cc','aoe'] },
  { name: 'Hwei',          roles: ['Mid','Support'],            damageType: 'magic',    traits: ['poke','aoe','cc','waveclear','teamfight'] },

  // ── I ───────────────────────────────────────────────────────────────────
  { name: 'Illaoi',        roles: ['Top'],                      damageType: 'physical', traits: ['bruiser','splitpush','sustain','aoe'] },
  { name: 'Irelia',        roles: ['Top','Mid'],                damageType: 'physical', traits: ['bruiser','dive','mobility','skirmish','cc'] },
  { name: 'Ivern',         roles: ['Jungle','Support'],         damageType: 'magic',    traits: ['shield','heal','peel','cc'] },

  // ── J ───────────────────────────────────────────────────────────────────
  { name: 'Janna',         roles: ['Support'],                  damageType: 'magic',    traits: ['shield','peel','cc','heal'] },
  { name: 'Jarvan IV',     roles: ['Jungle'],                   damageType: 'physical', traits: ['tank','engage','cc','teamfight'] },
  { name: 'Jax',           roles: ['Top','Jungle'],             damageType: 'physical', traits: ['splitpush','skirmish','bruiser','hypercarry'] },
  { name: 'Jayce',         roles: ['Top','Mid'],                damageType: 'mixed',    traits: ['poke','burst','skirmish','waveclear'] },
  { name: 'Jhin',          roles: ['ADC'],                      damageType: 'physical', traits: ['poke','cc','teamfight','burst'] },
  { name: 'Jinx',          roles: ['ADC'],                      damageType: 'physical', traits: ['hypercarry','aoe','teamfight','poke'] },

  // ── K ───────────────────────────────────────────────────────────────────
  { name: "K'Sante",       roles: ['Top'],                      damageType: 'mixed',    traits: ['tank','engage','mobility','cc','teamfight'] },
  { name: "Kai'Sa",        roles: ['ADC'],                      damageType: 'mixed',    traits: ['hypercarry','mobility','skirmish','dive'] },
  { name: 'Kalista',       roles: ['ADC'],                      damageType: 'physical', traits: ['skirmish','mobility','teamfight'] },
  { name: 'Karma',         roles: ['Support','Mid'],            damageType: 'magic',    traits: ['shield','poke','peel','cc','waveclear'] },
  { name: 'Kassadin',      roles: ['Mid'],                      damageType: 'magic',    traits: ['assassin','burst','mobility','skirmish'] },
  { name: 'Katarina',      roles: ['Mid'],                      damageType: 'magic',    traits: ['assassin','aoe','mobility','teamfight'] },
  { name: 'Kayle',         roles: ['Top','Mid'],                damageType: 'mixed',    traits: ['hypercarry','waveclear','teamfight','shield'] },
  { name: 'Kayn',          roles: ['Jungle'],                   damageType: 'mixed',    traits: ['assassin','mobility','skirmish','dive','sustain'] },
  { name: 'Kennen',        roles: ['Top','Mid'],                damageType: 'magic',    traits: ['aoe','cc','teamfight','poke','mobility'] },
  { name: "Kha'Zix",       roles: ['Jungle'],                   damageType: 'physical', traits: ['assassin','burst','dive','skirmish','mobility'] },
  { name: 'Kindred',       roles: ['Jungle'],                   damageType: 'physical', traits: ['skirmish','mobility','teamfight','poke'] },
  { name: 'Kled',          roles: ['Top'],                      damageType: 'physical', traits: ['bruiser','dive','skirmish','cc','mobility'] },
  { name: "Kog'Maw",       roles: ['ADC'],                      damageType: 'mixed',    traits: ['hypercarry','poke','aoe','teamfight'] },

  // ── L ───────────────────────────────────────────────────────────────────
  { name: 'LeBlanc',       roles: ['Mid'],                      damageType: 'magic',    traits: ['assassin','burst','mobility','skirmish'] },
  { name: 'Lee Sin',       roles: ['Jungle'],                   damageType: 'physical', traits: ['dive','skirmish','mobility','cc'] },
  { name: 'Leona',         roles: ['Support'],                  damageType: 'physical', traits: ['engage','cc','tank','teamfight'] },
  { name: 'Lillia',        roles: ['Jungle','Mid'],             damageType: 'magic',    traits: ['cc','aoe','mobility','poke'] },
  { name: 'Lissandra',     roles: ['Mid'],                      damageType: 'magic',    traits: ['engage','cc','aoe','teamfight','dive'] },
  { name: 'Lucian',        roles: ['ADC','Mid'],                damageType: 'physical', traits: ['mobility','skirmish','poke','burst'] },
  { name: 'Lulu',          roles: ['Support','Mid'],            damageType: 'magic',    traits: ['shield','peel','heal','cc','teamfight'] },
  { name: 'Lux',           roles: ['Mid','Support'],            damageType: 'magic',    traits: ['poke','cc','burst','waveclear'] },

  // ── M ───────────────────────────────────────────────────────────────────
  { name: 'Malphite',      roles: ['Top','Support'],            damageType: 'magic',    traits: ['tank','engage','aoe','cc','teamfight'] },
  { name: 'Malzahar',      roles: ['Mid'],                      damageType: 'magic',    traits: ['cc','waveclear','poke','aoe'] },
  { name: 'Maokai',        roles: ['Top','Support','Jungle'],   damageType: 'magic',    traits: ['tank','engage','cc','teamfight','sustain'] },
  { name: 'Master Yi',     roles: ['Jungle'],                   damageType: 'physical', traits: ['hypercarry','skirmish','mobility','dive'] },
  { name: 'Milio',         roles: ['Support'],                  damageType: 'magic',    traits: ['shield','peel','heal','cc'] },
  { name: 'Miss Fortune',  roles: ['ADC'],                      damageType: 'physical', traits: ['aoe','poke','teamfight','burst'] },
  { name: 'Mordekaiser',   roles: ['Top'],                      damageType: 'magic',    traits: ['bruiser','tank','cc','teamfight','dive'] },
  { name: 'Morgana',       roles: ['Support','Mid'],            damageType: 'magic',    traits: ['cc','peel','shield','poke','aoe'] },

  // ── N ───────────────────────────────────────────────────────────────────
  { name: 'Naafiri',       roles: ['Mid','Jungle'],             damageType: 'physical', traits: ['assassin','burst','dive','skirmish','mobility'] },
  { name: 'Nami',          roles: ['Support'],                  damageType: 'magic',    traits: ['heal','sustain','cc','peel','poke','teamfight'] },
  { name: 'Nasus',         roles: ['Top'],                      damageType: 'physical', traits: ['tank','splitpush','bruiser','cc'] },
  { name: 'Nautilus',      roles: ['Support'],                  damageType: 'mixed',    traits: ['engage','cc','tank','teamfight'] },
  { name: 'Neeko',         roles: ['Mid','Support'],            damageType: 'magic',    traits: ['cc','aoe','burst','poke','teamfight'] },
  { name: 'Nidalee',       roles: ['Jungle'],                   damageType: 'magic',    traits: ['poke','skirmish','mobility'] },
  { name: 'Nilah',         roles: ['ADC'],                      damageType: 'physical', traits: ['hypercarry','skirmish','dive','cc'] },
  { name: 'Nocturne',      roles: ['Jungle'],                   damageType: 'physical', traits: ['assassin','dive','cc','mobility'] },
  { name: 'Nunu & Willump',roles: ['Jungle'],                   damageType: 'magic',    traits: ['tank','engage','cc','sustain','aoe','teamfight'] },

  // ── O ───────────────────────────────────────────────────────────────────
  { name: 'Olaf',          roles: ['Top','Jungle'],             damageType: 'physical', traits: ['bruiser','dive','skirmish','sustain'] },
  { name: 'Orianna',       roles: ['Mid'],                      damageType: 'magic',    traits: ['aoe','poke','cc','teamfight'] },
  { name: 'Ornn',          roles: ['Top'],                      damageType: 'mixed',    traits: ['tank','engage','cc','teamfight'] },

  // ── P ───────────────────────────────────────────────────────────────────
  { name: 'Pantheon',      roles: ['Top','Jungle','Support'],   damageType: 'physical', traits: ['cc','poke','dive','burst','skirmish'] },
  { name: 'Poppy',         roles: ['Top','Jungle','Support'],   damageType: 'physical', traits: ['tank','cc','engage','teamfight'] },
  { name: 'Pyke',          roles: ['Support'],                  damageType: 'physical', traits: ['assassin','cc','engage','mobility'] },

  // ── Q ───────────────────────────────────────────────────────────────────
  { name: 'Qiyana',        roles: ['Mid','Jungle'],             damageType: 'physical', traits: ['assassin','burst','dive','mobility','cc'] },
  { name: 'Quinn',         roles: ['Top','ADC'],                damageType: 'physical', traits: ['poke','mobility','skirmish','splitpush'] },

  // ── R ───────────────────────────────────────────────────────────────────
  { name: 'Rammus',        roles: ['Jungle'],                   damageType: 'physical', traits: ['tank','engage','cc','teamfight'] },
  { name: "Rek'Sai",       roles: ['Jungle'],                   damageType: 'physical', traits: ['dive','cc','skirmish','mobility','bruiser'] },
  { name: 'Rell',          roles: ['Support'],                  damageType: 'mixed',    traits: ['engage','cc','tank','teamfight','aoe'] },
  { name: 'Renata Glasc',  roles: ['Support'],                  damageType: 'magic',    traits: ['cc','peel','shield','teamfight','aoe'] },
  { name: 'Renekton',      roles: ['Top'],                      damageType: 'physical', traits: ['bruiser','cc','dive','skirmish'] },
  { name: 'Rengar',        roles: ['Jungle','Top'],             damageType: 'physical', traits: ['assassin','burst','dive','mobility','skirmish'] },
  { name: 'Riven',         roles: ['Top'],                      damageType: 'physical', traits: ['bruiser','skirmish','mobility','dive','cc'] },
  { name: 'Rumble',        roles: ['Top','Jungle'],             damageType: 'magic',    traits: ['aoe','poke','teamfight','cc'] },
  { name: 'Ryze',          roles: ['Mid'],                      damageType: 'magic',    traits: ['waveclear','poke','aoe','cc','teamfight'] },

  // ── S ───────────────────────────────────────────────────────────────────
  { name: 'Samira',        roles: ['ADC'],                      damageType: 'physical', traits: ['hypercarry','dive','skirmish','aoe'] },
  { name: 'Sejuani',       roles: ['Jungle'],                   damageType: 'magic',    traits: ['tank','engage','cc','teamfight','aoe'] },
  { name: 'Seraphine',     roles: ['Support','Mid','ADC'],      damageType: 'magic',    traits: ['aoe','poke','cc','heal','shield','teamfight'] },
  { name: 'Sett',          roles: ['Top','Jungle','Support'],   damageType: 'physical', traits: ['bruiser','engage','teamfight','cc'] },
  { name: 'Shaco',         roles: ['Jungle','Support'],         damageType: 'physical', traits: ['assassin','burst','dive','mobility','skirmish'] },
  { name: 'Shen',          roles: ['Top','Support'],            damageType: 'mixed',    traits: ['tank','peel','cc','teamfight','shield'] },
  { name: 'Shyvana',       roles: ['Jungle'],                   damageType: 'mixed',    traits: ['bruiser','aoe','dive','skirmish'] },
  { name: 'Singed',        roles: ['Top'],                      damageType: 'magic',    traits: ['tank','sustain','cc','splitpush','poke'] },
  { name: 'Sion',          roles: ['Top','Support'],            damageType: 'physical', traits: ['tank','engage','cc','teamfight','aoe'] },
  { name: 'Sivir',         roles: ['ADC'],                      damageType: 'physical', traits: ['waveclear','teamfight','poke'] },
  { name: 'Skarner',       roles: ['Jungle'],                   damageType: 'physical', traits: ['tank','engage','cc','teamfight','skirmish'] },
  { name: 'Smolder',       roles: ['ADC','Mid'],                damageType: 'mixed',    traits: ['poke','hypercarry','waveclear','teamfight'] },
  { name: 'Sona',          roles: ['Support'],                  damageType: 'magic',    traits: ['heal','shield','sustain','peel','cc','aoe','teamfight'] },
  { name: 'Soraka',        roles: ['Support'],                  damageType: 'magic',    traits: ['heal','sustain','peel','cc'] },
  { name: 'Sylas',         roles: ['Mid','Jungle'],             damageType: 'magic',    traits: ['burst','cc','sustain','mobility','engage'] },
  { name: 'Syndra',        roles: ['Mid'],                      damageType: 'magic',    traits: ['burst','cc','poke','teamfight'] },

  // ── T ───────────────────────────────────────────────────────────────────
  { name: 'Tahm Kench',    roles: ['Support','Top'],            damageType: 'magic',    traits: ['tank','peel','cc','sustain'] },
  { name: 'Taliyah',       roles: ['Jungle','Mid'],             damageType: 'magic',    traits: ['poke','cc','waveclear'] },
  { name: 'Talon',         roles: ['Mid','Jungle'],             damageType: 'physical', traits: ['assassin','burst','dive','mobility'] },
  { name: 'Taric',         roles: ['Support'],                  damageType: 'physical', traits: ['tank','peel','cc','shield','heal','teamfight'] },
  { name: 'Teemo',         roles: ['Top'],                      damageType: 'magic',    traits: ['poke','splitpush'] },
  { name: 'Thresh',        roles: ['Support'],                  damageType: 'mixed',    traits: ['engage','cc','peel','teamfight'] },
  { name: 'Tristana',      roles: ['ADC'],                      damageType: 'physical', traits: ['hypercarry','dive','mobility','burst'] },
  { name: 'Tryndamere',    roles: ['Top'],                      damageType: 'physical', traits: ['splitpush','skirmish','hypercarry','mobility'] },
  { name: 'Twisted Fate',  roles: ['Mid'],                      damageType: 'magic',    traits: ['cc','waveclear','teamfight','poke'] },

  // ── U ───────────────────────────────────────────────────────────────────
  { name: 'Udyr',          roles: ['Jungle'],                   damageType: 'mixed',    traits: ['tank','bruiser','cc','skirmish','engage'] },
  { name: 'Urgot',         roles: ['Top'],                      damageType: 'physical', traits: ['bruiser','tank','cc','teamfight'] },

  // ── V ───────────────────────────────────────────────────────────────────
  { name: 'Varus',         roles: ['ADC'],                      damageType: 'mixed',    traits: ['poke','cc','teamfight'] },
  { name: 'Vayne',         roles: ['ADC','Top'],                damageType: 'physical', traits: ['hypercarry','skirmish','cc','mobility'] },
  { name: 'Veigar',        roles: ['Mid','Support'],            damageType: 'magic',    traits: ['burst','cc','poke','aoe'] },
  { name: "Vel'Koz",       roles: ['Mid','Support'],            damageType: 'magic',    traits: ['poke','aoe','cc','waveclear'] },
  { name: 'Vex',           roles: ['Mid'],                      damageType: 'magic',    traits: ['burst','cc','poke','aoe'] },
  { name: 'Vi',            roles: ['Jungle'],                   damageType: 'physical', traits: ['dive','cc','engage','skirmish'] },
  { name: 'Viego',         roles: ['Jungle'],                   damageType: 'physical', traits: ['skirmish','burst','mobility','bruiser'] },
  { name: 'Viktor',        roles: ['Mid'],                      damageType: 'magic',    traits: ['aoe','poke','waveclear','teamfight','cc'] },
  { name: 'Volibear',      roles: ['Top','Jungle'],             damageType: 'mixed',    traits: ['tank','engage','cc','dive'] },

  // ── W ───────────────────────────────────────────────────────────────────
  { name: 'Warwick',       roles: ['Jungle','Top'],             damageType: 'physical', traits: ['bruiser','cc','skirmish','sustain'] },
  { name: 'Wukong',        roles: ['Top','Jungle'],             damageType: 'physical', traits: ['bruiser','engage','aoe','cc','teamfight'] },

  // ── X ───────────────────────────────────────────────────────────────────
  { name: 'Xayah',         roles: ['ADC'],                      damageType: 'physical', traits: ['cc','skirmish','teamfight'] },
  { name: 'Xerath',        roles: ['Mid','Support'],            damageType: 'magic',    traits: ['poke','cc','waveclear','aoe'] },
  { name: 'Xin Zhao',      roles: ['Jungle'],                   damageType: 'physical', traits: ['dive','cc','skirmish','bruiser','engage'] },

  // ── Y ───────────────────────────────────────────────────────────────────
  { name: 'Yasuo',         roles: ['Mid','Top'],                damageType: 'physical', traits: ['skirmish','mobility','teamfight','hypercarry','cc'] },
  { name: 'Yone',          roles: ['Mid','Top'],                damageType: 'mixed',    traits: ['skirmish','mobility','teamfight','hypercarry','cc','aoe'] },
  { name: 'Yorick',        roles: ['Top'],                      damageType: 'physical', traits: ['splitpush','bruiser','sustain'] },
  { name: 'Yuumi',         roles: ['Support'],                  damageType: 'magic',    traits: ['heal','sustain','peel','shield'] },

  // ── Z ───────────────────────────────────────────────────────────────────
  { name: 'Zac',           roles: ['Jungle'],                   damageType: 'magic',    traits: ['tank','engage','cc','teamfight','aoe'] },
  { name: 'Zed',           roles: ['Mid'],                      damageType: 'physical', traits: ['assassin','burst','dive','mobility'] },
  { name: 'Zeri',          roles: ['ADC'],                      damageType: 'physical', traits: ['hypercarry','mobility','skirmish'] },
  { name: 'Ziggs',         roles: ['Mid','ADC','Support'],      damageType: 'magic',    traits: ['poke','aoe','waveclear','cc'] },
  { name: 'Zilean',        roles: ['Support'],                  damageType: 'magic',    traits: ['cc','sustain','peel','poke'] },
  { name: 'Zoe',           roles: ['Mid'],                      damageType: 'magic',    traits: ['poke','cc','burst'] },
  { name: 'Zyra',          roles: ['Support','Mid'],            damageType: 'magic',    traits: ['aoe','cc','poke','teamfight'] },
]

export function getChampionsForRole(role: Role): Champion[] {
  return CHAMPIONS.filter((c) => c.roles.includes(role)).sort((a, b) =>
    a.name.localeCompare(b.name),
  )
}

export function findChampion(name: string): Champion | undefined {
  return CHAMPIONS.find((c) => c.name === name)
}
