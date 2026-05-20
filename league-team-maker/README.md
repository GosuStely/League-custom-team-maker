# League Team Maker

Balanced 5v5 team generator for League of Legends.

## Quick start

```bash
cd league-team-maker
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── types/          # Shared TypeScript interfaces (Player, Team, Role…)
├── constants/      # ROLES array and ROLE_CONFIG (icons, colours)
├── utils/          # generateTeams() algorithm
├── components/
│   ├── Header          – animated title
│   ├── PlayerCard      – nickname input + role selectors
│   ├── Legend          – Main / Fill / Auto badge guide
│   ├── TeamCard        – one team column (blue or red)
│   ├── PlayerRow       – single player row inside a TeamCard
│   └── TeamsSection    – wraps both TeamCards + shuffle button
├── App.tsx         # Root component, all state lives here
└── index.css       # Global CSS variables, keyframes, shared helpers
```
