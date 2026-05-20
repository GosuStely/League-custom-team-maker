import { useEffect, useState } from 'react'
import type { Player, Team } from './types'
import { ROLES, DIVISIONS, PLAYER_COUNT } from './constants/roles'
import { generateTeams } from './utils/generateTeams'
import { lookupPlayer, saveAllPlayers } from './utils/playerMemory'
import Header from './components/Header'
import PlayerCard from './components/PlayerCard'
import Legend from './components/Legend'
import TeamsSection from './components/TeamsSection'
import CompSynergyCalculator from './components/CompSynergyCalculator'
import styles from './App.module.css'

type AppTab = 'team-maker' | 'synergy'

function createInitialPlayers(): Player[] {
  return Array.from({ length: PLAYER_COUNT }, (_, i) => ({
    id: i,
    nickname: '',
    mainRole: ROLES[i % 5],
    secondaryRole: ROLES[(i + 2) % 5],
    division: DIVISIONS[3],
  }))
}

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('team-maker')
  const [players, setPlayers] = useState<Player[]>(createInitialPlayers)
  const [teams, setTeams] = useState<[Team, Team] | null>(null)
  const [isWorking, setIsWorking] = useState(false)
  const [error, setError] = useState('')
  const [revealKey, setRevealKey] = useState(0)
  const [playerList, setPlayerList] = useState<string>('')
  const [showTextArea, setShowTextArea] = useState<boolean>(false)
  const [segments, setSegments] = useState<string[]>([])


  const handlePlayerListChange = (text: string) => {
    setPlayerList(text)
    const segments = text.split(/joined the lobby/)
    setSegments(segments)
    setPlayers((prev) =>
      prev.map((p, i) => {
        const nickname = (segments[i] ?? '').trim()
        const profile = lookupPlayer(nickname)
        return {
          ...p,
          nickname,
          ...(profile
            ? { mainRole: profile.mainRole, secondaryRole: profile.secondaryRole, division: profile.division }
            : {}),
        }
      }),
    )
  }

  const updatePlayer = (
    id: number,
    field: keyof Pick<Player, 'nickname' | 'mainRole' | 'secondaryRole' | 'division'>,
    value: string,
  ) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const handleNicknameBlur = (id: number, nickname: string) => {
    const profile = lookupPlayer(nickname)
    if (!profile) return
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, mainRole: profile.mainRole, secondaryRole: profile.secondaryRole, division: profile.division }
          : p,
      ),
    )
  }

  const runGeneration = (playerList: Player[]) => {
    setIsWorking(true)
    setTimeout(() => {
      setTeams(generateTeams(playerList))
      setRevealKey((k) => k + 1)
      setIsWorking(false)
    }, 900)
  }

  const handleCreate = () => {
    const missing = players.filter((p) => !p.nickname.trim()).length
    if (missing > 0) {
      setError(`⚠  ${missing} summoner name${missing > 1 ? 's' : ''} still empty`)
      return
    }
    setError('')
    const trimmed = players.map((p) => ({ ...p, nickname: p.nickname.trim() }))
    saveAllPlayers(trimmed)
    runGeneration(trimmed)
  }

  const handleShuffle = () => {
    runGeneration(players.map((p) => ({ ...p, nickname: p.nickname.trim() })))
  }

  return (
    <div className={styles.app}>
      <div className={styles.content}>
        <Header />

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'team-maker' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('team-maker')}
          >
            ⚔ Team Maker
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'synergy' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('synergy')}
          >
            ⚗️ Comp Synergy
          </button>
        </div>

        {activeTab === 'synergy' && <CompSynergyCalculator />}

        {activeTab === 'team-maker' && (
          <>
            {showTextArea ? (
              <div>
                <textarea onChange={(e) => handlePlayerListChange(e.target.value)} className={styles.joinedLobby} />
                <input type='text' value={segments.length - 1} className={styles.segmentCount} />
              </div>
            ) :
              <button onClick={() => setShowTextArea(!showTextArea)} className={styles.btn}>HAHAHAH</button>
            }
            <div
              className={styles.playersGrid}
              role="group"
              aria-label="Player roster — enter summoner names and roles"
            >
              {players.map((player, i) => (
                <PlayerCard key={player.id} player={player} index={i} onChange={updatePlayer} onNicknameBlur={handleNicknameBlur} />
              ))}
            </div>

            <div className={styles.genSection}>
              {error && <p className={styles.error} role="alert">{error}</p>}
              <button
                className={styles.genBtn}
                onClick={handleCreate}
                disabled={isWorking}
                aria-busy={isWorking}
              >
                {isWorking
                  ? <><span className={styles.spinner} aria-hidden="true" />Assembling Teams…</>
                  : '⚔  Create Balanced Teams  ⚔'}
              </button>
              <Legend />
            </div>

            {teams && !isWorking && (
              <>
                <div className="divider" style={{ marginBottom: 0 }} />
                <TeamsSection teams={teams} revealKey={revealKey} onShuffle={handleShuffle} />
              </>
            )}
          </>
        )}
      </div>
    </div >
  )
}
