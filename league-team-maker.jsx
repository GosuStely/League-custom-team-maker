import { useState } from "react";

const ROLES = ["Top", "Jungle", "Mid", "ADC", "Support"];

const ROLE_CONFIG = {
  Top:     { icon: "⚔️",  color: "#C8AA6E", bg: "rgba(200,170,110,0.15)" },
  Jungle:  { icon: "🌿",  color: "#4CAF50", bg: "rgba(76,175,80,0.15)"   },
  Mid:     { icon: "🔮",  color: "#BB86FC", bg: "rgba(187,134,252,0.15)" },
  ADC:     { icon: "🏹",  color: "#CF6679", bg: "rgba(207,102,121,0.15)" },
  Support: { icon: "🛡️", color: "#64B5F6", bg: "rgba(100,181,246,0.15)" },
};

function generateTeams(players) {
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  const assigned = new Set();
  const slots = Object.fromEntries(ROLES.map((r) => [r, []]));

  // Pass 1 — main role
  for (const role of ROLES) {
    for (const p of shuffled) {
      if (!assigned.has(p.id) && p.mainRole === role && slots[role].length < 2) {
        slots[role].push({ ...p, assignedAs: "Main" });
        assigned.add(p.id);
      }
    }
  }
  // Pass 2 — secondary role
  for (const role of ROLES) {
    for (const p of shuffled) {
      if (!assigned.has(p.id) && p.secondaryRole === role && slots[role].length < 2) {
        slots[role].push({ ...p, assignedAs: "Secondary" });
        assigned.add(p.id);
      }
    }
  }
  // Pass 3 — autofill
  for (const role of ROLES) {
    for (const p of shuffled) {
      if (!assigned.has(p.id) && slots[role].length < 2) {
        slots[role].push({ ...p, assignedAs: "Autofill" });
        assigned.add(p.id);
      }
    }
  }

  const team1 = ROLES.map((role) => ({ role, ...slots[role][0] }));
  const team2 = ROLES.map((role) => ({ role, ...slots[role][1] }));
  return [team1, team2];
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Rajdhani:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #080C18;
    font-family: 'Rajdhani', sans-serif;
    color: #C8B896;
  }

  /* ─── Layout ─── */
  .app {
    min-height: 100vh;
    background:
      radial-gradient(ellipse at 15% 15%, rgba(200,170,110,0.06) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 85%, rgba(100,181,246,0.06) 0%, transparent 55%),
      linear-gradient(160deg, #080C18 0%, #0D1628 60%, #080C18 100%);
    padding: 32px 20px 60px;
    position: relative;
    overflow-x: hidden;
  }

  .app::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      repeating-linear-gradient(0deg,   transparent, transparent 60px, rgba(200,170,110,0.018) 60px, rgba(200,170,110,0.018) 61px),
      repeating-linear-gradient(90deg,  transparent, transparent 60px, rgba(200,170,110,0.018) 60px, rgba(200,170,110,0.018) 61px);
    pointer-events: none;
    z-index: 0;
  }

  .content {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
  }

  /* ─── Header ─── */
  .header { text-align: center; margin-bottom: 44px; }

  .crown {
    font-size: 36px;
    display: block;
    margin-bottom: 4px;
    animation: floatCrown 3s ease-in-out infinite;
  }

  .title {
    font-family: 'Cinzel', serif;
    font-size: clamp(26px, 5vw, 52px);
    font-weight: 700;
    background: linear-gradient(135deg, #785A28 0%, #C8AA6E 30%, #F0E6D3 50%, #C8AA6E 70%, #785A28 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 5px;
    text-transform: uppercase;
    animation: shimmerTitle 4s linear infinite;
  }

  .subtitle {
    margin-top: 10px;
    font-size: 12px;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: #785A28;
  }

  .hdivider {
    width: 360px;
    max-width: 90%;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #C8AA6E 50%, transparent 100%);
    margin: 14px auto 0;
    position: relative;
  }

  .hdivider::before, .hdivider::after {
    content: '◆';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #C8AA6E;
    font-size: 8px;
  }
  .hdivider::before { left: 0; }
  .hdivider::after  { right: 0; }

  /* ─── Players Grid ─── */
  .players-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 36px;
  }

  @media (max-width: 720px) {
    .players-grid { grid-template-columns: 1fr; }
  }

  .player-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    background: linear-gradient(135deg, rgba(18,26,44,0.92), rgba(12,18,32,0.92));
    border: 1px solid rgba(200,170,110,0.18);
    border-radius: 6px;
    backdrop-filter: blur(8px);
    opacity: 0;
    animation: fadeUp 0.35s ease forwards;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }

  .player-card:hover {
    border-color: rgba(200,170,110,0.45);
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(0,0,0,0.35), 0 0 12px rgba(200,170,110,0.08);
  }

  .player-num {
    font-family: 'Cinzel', serif;
    font-size: 16px;
    font-weight: 700;
    color: rgba(200,170,110,0.45);
    width: 24px;
    text-align: center;
    flex-shrink: 0;
  }

  .player-input {
    flex: 1;
    min-width: 0;
    background: rgba(0,0,0,0.35);
    border: 1px solid rgba(200,170,110,0.18);
    border-radius: 4px;
    padding: 8px 12px;
    color: #E8D8B8;
    font-family: 'Rajdhani', sans-serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.5px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .player-input::placeholder { color: rgba(200,170,110,0.22); }

  .player-input:focus {
    border-color: rgba(200,170,110,0.55);
    box-shadow: 0 0 0 2px rgba(200,170,110,0.08);
  }

  .role-wrap {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex-shrink: 0;
  }

  .role-lbl {
    font-size: 9px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(200,170,110,0.35);
    text-align: center;
  }

  .role-sel {
    background: rgba(0,0,0,0.45);
    border-radius: 4px;
    padding: 6px 8px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px;
    font-weight: 700;
    outline: none;
    cursor: pointer;
    width: 100px;
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
    text-align: center;
  }

  .role-sel option { background: #0D1628; }

  .role-sel:focus { box-shadow: 0 0 0 2px rgba(200,170,110,0.15); }

  /* ─── Generate Button ─── */
  .gen-section { text-align: center; margin-bottom: 44px; }

  .error-msg {
    color: #EF9A9A;
    font-size: 12px;
    letter-spacing: 1px;
    margin-bottom: 12px;
    animation: fadeUp 0.3s ease;
  }

  .gen-btn {
    position: relative;
    overflow: hidden;
    padding: 18px 56px;
    background: linear-gradient(135deg, #785A28 0%, #C8AA6E 50%, #785A28 100%);
    background-size: 200% auto;
    border: none;
    border-radius: 4px;
    font-family: 'Cinzel', serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #080C18;
    cursor: pointer;
    box-shadow: 0 0 30px rgba(200,170,110,0.3), inset 0 1px 0 rgba(255,255,255,0.25);
    animation: btnPulse 3s ease-in-out infinite;
    transition: transform 0.25s, box-shadow 0.25s, background-position 0.4s;
  }

  .gen-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.28) 50%, transparent 100%);
    transition: left 0.5s ease;
  }

  .gen-btn:not(:disabled):hover::before { left: 100%; }

  .gen-btn:not(:disabled):hover {
    transform: translateY(-3px);
    box-shadow: 0 0 60px rgba(200,170,110,0.7), 0 12px 30px rgba(0,0,0,0.4);
    background-position: right center;
  }

  .gen-btn:not(:disabled):active { transform: translateY(-1px); }

  .gen-btn:disabled { opacity: 0.55; cursor: not-allowed; animation: none; }

  .spinner {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid rgba(8,12,24,0.3);
    border-top-color: #080C18;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
    margin-right: 10px;
    vertical-align: middle;
  }

  /* ─── Legend ─── */
  .legend {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-top: 16px;
    flex-wrap: wrap;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    color: rgba(200,184,150,0.5);
    letter-spacing: 0.5px;
  }

  /* ─── Teams Section ─── */
  .teams-heading {
    font-family: 'Cinzel', serif;
    font-size: 22px;
    font-weight: 700;
    text-align: center;
    letter-spacing: 4px;
    text-transform: uppercase;
    background: linear-gradient(90deg, #C8AA6E, #F0E6D3, #C8AA6E);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 10px;
    opacity: 0;
    animation: fadeUp 0.5s ease 0.05s forwards;
  }

  .teams-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 24px;
  }

  @media (max-width: 720px) {
    .teams-grid { grid-template-columns: 1fr; }
  }

  /* ─── Team Card ─── */
  .team-card {
    border-radius: 8px;
    overflow: hidden;
    opacity: 0;
    box-shadow: 0 20px 60px rgba(0,0,0,0.55);
  }

  .tc-blue {
    border: 1px solid rgba(200,170,110,0.35);
    animation: cardReveal 0.65s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.15s forwards;
  }

  .tc-red {
    border: 1px solid rgba(100,181,246,0.35);
    animation: cardReveal 0.65s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.35s forwards;
  }

  .team-header {
    padding: 18px 22px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'Cinzel', serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .th-blue {
    background: linear-gradient(135deg, rgba(200,170,110,0.14) 0%, rgba(200,170,110,0.04) 100%);
    border-bottom: 1px solid rgba(200,170,110,0.2);
    color: #C8AA6E;
  }

  .th-red {
    background: linear-gradient(135deg, rgba(100,181,246,0.14) 0%, rgba(100,181,246,0.04) 100%);
    border-bottom: 1px solid rgba(100,181,246,0.2);
    color: #64B5F6;
  }

  .team-body { background: rgba(10,14,24,0.9); }

  /* ─── Player Row ─── */
  .prow {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 13px 22px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    opacity: 0;
    animation: slideIn 0.4s ease forwards;
    transition: background 0.2s;
  }

  .prow:last-child { border-bottom: none; }
  .prow:hover { background: rgba(255,255,255,0.025); }

  .rbadge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.3px;
    min-width: 108px;
    flex-shrink: 0;
  }

  .pname {
    flex: 1;
    font-size: 16px;
    font-weight: 600;
    color: #EAD9BC;
    letter-spacing: 0.5px;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .abadge {
    font-size: 10px;
    padding: 3px 9px;
    border-radius: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    flex-shrink: 0;
  }

  .ab-main      { background: rgba(76,175,80,0.2);   color: #81C784; border: 1px solid rgba(76,175,80,0.35);   }
  .ab-secondary { background: rgba(255,193,7,0.2);   color: #FFD54F; border: 1px solid rgba(255,193,7,0.35);   }
  .ab-autofill  { background: rgba(244,67,54,0.2);   color: #EF9A9A; border: 1px solid rgba(244,67,54,0.35);   }

  /* ─── Regenerate ─── */
  .regen-btn {
    display: block;
    margin: 28px auto 0;
    background: transparent;
    border: 1px solid rgba(200,170,110,0.35);
    border-radius: 4px;
    padding: 11px 28px;
    font-family: 'Cinzel', serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(200,170,110,0.75);
    cursor: pointer;
    transition: all 0.3s ease;
    opacity: 0;
    animation: fadeUp 0.4s ease 0.8s forwards;
  }

  .regen-btn:hover {
    background: rgba(200,170,110,0.08);
    border-color: rgba(200,170,110,0.65);
    color: #C8AA6E;
    box-shadow: 0 0 20px rgba(200,170,110,0.18);
  }

  /* ─── Keyframes ─── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes cardReveal {
    from { opacity: 0; transform: scale(0.88) translateY(24px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-18px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes btnPulse {
    0%, 100% { box-shadow: 0 0 24px rgba(200,170,110,0.28), inset 0 1px 0 rgba(255,255,255,0.22); }
    50%       { box-shadow: 0 0 52px rgba(200,170,110,0.62), 0 0 90px rgba(200,170,110,0.18), inset 0 1px 0 rgba(255,255,255,0.22); }
  }

  @keyframes shimmerTitle {
    0%   { background-position: 0%   center; }
    100% { background-position: 200% center; }
  }

  @keyframes floatCrown {
    0%, 100% { transform: translateY(0);    }
    50%       { transform: translateY(-6px); }
  }
`;

/* ─────────────────────────────────── helpers ── */
const delay = (i, base = 0, step = 0.05) => ({
  animationDelay: `${base + i * step}s`,
});

function badgeClass(type) {
  if (!type) return "abadge ab-autofill";
  const t = type.toLowerCase();
  if (t === "main")      return "abadge ab-main";
  if (t === "secondary") return "abadge ab-secondary";
  return "abadge ab-autofill";
}

function badgeLabel(type) {
  if (!type) return "Auto";
  const t = type.toLowerCase();
  if (t === "main")      return "Main";
  if (t === "secondary") return "Fill";
  return "Auto";
}

/* ─────────────────────────────────── App ── */
export default function App() {
  const [players, setPlayers] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      nickname: "",
      mainRole: ROLES[i % 5],
      secondaryRole: ROLES[(i + 2) % 5],
    }))
  );
  const [teams, setTeams]           = useState(null);
  const [isWorking, setIsWorking]   = useState(false);
  const [error, setError]           = useState("");
  const [revealKey, setRevealKey]   = useState(0);

  const update = (id, field, value) =>
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  const doGenerate = (playerList) => {
    setIsWorking(true);
    setTimeout(() => {
      setTeams(generateTeams(playerList));
      setRevealKey((k) => k + 1);
      setIsWorking(false);
    }, 900);
  };

  const handleCreate = () => {
    const missing = players.filter((p) => !p.nickname.trim()).length;
    if (missing > 0) {
      setError(`⚠  ${missing} summoner name${missing > 1 ? "s" : ""} still empty`);
      return;
    }
    setError("");
    doGenerate(players.map((p) => ({ ...p, nickname: p.nickname.trim() })));
  };

  const handleShuffle = () => {
    doGenerate(players.map((p) => ({ ...p, nickname: p.nickname.trim() })));
  };

  return (
    <div className="app">
      <style>{CSS}</style>

      <div className="content">

        {/* ── Header ── */}
        <div className="header">
          <span className="crown">👑</span>
          <h1 className="title">League Team Maker</h1>
          <p className="subtitle">Balanced 5v5 Team Generator</p>
          <div className="hdivider" />
        </div>

        {/* ── Player Cards ── */}
        <div className="players-grid">
          {players.map((p, i) => {
            const mCfg = ROLE_CONFIG[p.mainRole];
            const sCfg = ROLE_CONFIG[p.secondaryRole];
            return (
              <div key={p.id} className="player-card" style={delay(i)}>
                <span className="player-num">{i + 1}</span>

                <input
                  className="player-input"
                  type="text"
                  placeholder={`Summoner ${i + 1}`}
                  value={p.nickname}
                  maxLength={20}
                  onChange={(e) => update(p.id, "nickname", e.target.value)}
                />

                {/* Main role */}
                <div className="role-wrap">
                  <span className="role-lbl">Main</span>
                  <select
                    className="role-sel"
                    value={p.mainRole}
                    onChange={(e) => update(p.id, "mainRole", e.target.value)}
                    style={{
                      border: `1px solid ${mCfg.color}66`,
                      color: mCfg.color,
                    }}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_CONFIG[r].icon} {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Secondary role */}
                <div className="role-wrap">
                  <span className="role-lbl">Fill</span>
                  <select
                    className="role-sel"
                    value={p.secondaryRole}
                    onChange={(e) => update(p.id, "secondaryRole", e.target.value)}
                    style={{
                      border: `1px solid ${sCfg.color}44`,
                      color: sCfg.color + "AA",
                    }}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_CONFIG[r].icon} {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Generate button ── */}
        <div className="gen-section">
          {error && <div className="error-msg">{error}</div>}
          <button className="gen-btn" onClick={handleCreate} disabled={isWorking}>
            {isWorking ? (
              <>
                <span className="spinner" />
                Assembling Teams…
              </>
            ) : (
              "⚔  Create Balanced Teams  ⚔"
            )}
          </button>

          <div className="legend">
            <div className="legend-item">
              <span className="abadge ab-main">Main</span> preferred role
            </div>
            <div className="legend-item">
              <span className="abadge ab-secondary">Fill</span> secondary role
            </div>
            <div className="legend-item">
              <span className="abadge ab-autofill">Auto</span> autofilled
            </div>
          </div>
        </div>

        {/* ── Teams ── */}
        {teams && !isWorking && (
          <div key={revealKey}>
            <div className="hdivider" style={{ marginBottom: 0 }} />
            <h2 className="teams-heading" style={{ marginTop: 24 }}>
              ⚔ Teams Assembled ⚔
            </h2>
            <div className="hdivider" />

            <div className="teams-grid">
              {teams.map((team, ti) => {
                const isBlue = ti === 0;
                return (
                  <div
                    key={ti}
                    className={`team-card ${isBlue ? "tc-blue" : "tc-red"}`}
                  >
                    {/* header */}
                    <div className={`team-header ${isBlue ? "th-blue" : "th-red"}`}>
                      <span>{isBlue ? "🔵" : "🔴"}</span>
                      Team {isBlue ? "Blue" : "Red"}
                    </div>

                    {/* players */}
                    <div className="team-body">
                      {team.map((slot, pi) => {
                        const rc = ROLE_CONFIG[slot.role];
                        return (
                          <div
                            key={slot.role}
                            className="prow"
                            style={delay(pi, 0.2, 0.09)}
                          >
                            <div
                              className="rbadge"
                              style={{
                                background: rc.bg,
                                border: `1px solid ${rc.color}55`,
                                color: rc.color,
                              }}
                            >
                              <span>{rc.icon}</span>
                              <span>{slot.role}</span>
                            </div>

                            <span className="pname">
                              {slot?.nickname ?? "???"}
                            </span>

                            <span className={badgeClass(slot?.assignedAs)}>
                              {badgeLabel(slot?.assignedAs)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="regen-btn" onClick={handleShuffle} disabled={isWorking}>
              🔄 &nbsp;Shuffle Teams Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
