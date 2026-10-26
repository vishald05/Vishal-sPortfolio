# MatchMoji — Memory Match Game

Tiny memory (concentration) game built with React and Vite. Flip emoji cards, match pairs, earn points, and try to finish in the fewest moves.

**Live demo:*https://matchmoji.onrender.com/* 

Run locally (instructions below).

**Tech stack:** React 19, Vite, plain CSS

**Features**
- Score and move counter
- Shuffle & start a new game
- Win message when all pairs matched
- Simple, readable implementation using a custom hook

**Quick Start**
1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Lint source (ESLint):

```bash
npm run lint
```

**Project Structure (key files)**
- `package.json`: project scripts and dependencies ([package.json](package.json))
- Main entry: [index.html](index.html) -> [src/main.jsx](src/main.jsx)
- App root: [src/App.jsx](src/App.jsx)
- Game logic hook: [src/hooks/useGameLogic.js](src/hooks/useGameLogic.js)
- Card component: [src/components/Card.jsx](src/components/Card.jsx)
- Header & UI: [src/components/GameHeader.jsx](src/components/GameHeader.jsx)
- Win message: [src/components/WinMessage.jsx](src/components/WinMessage.jsx)
- Styles: [src/index.css](src/index.css)

How it works (brief)
- The game values (emoji pairs) are defined in `src/App.jsx` and passed to the `useGameLogic` hook.
- `useGameLogic` handles shuffling, flipping, matching, scoring, moves counting, and determining win state.
- Components are intentionally small and focused: `Card` renders a single card, `GameHeader` shows score/moves, and `WinMessage` displays when the game is complete.

Customization ideas
- Replace emoji set in `src/App.jsx` to change game theme.
- Add timer or leaderboard to track best scores.
- Persist best score to `localStorage`.

Contributing
- Bug reports and small improvements are welcome. Open an issue or submit a PR.

License
- MIT 

Enjoy! If you want, I can also add a small GIF screenshot, tests, or a CI step to build and preview the app.
