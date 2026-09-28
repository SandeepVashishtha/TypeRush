# TYPE RACER

An arcade browser-based typing racing game built with **Next.js (App Router), React, JavaScript (ES6+ / JSX), Tailwind CSS, and HTML5 Canvas**. 

Your typing performance directly commands your racing machine: speed up with fast typing, charge nitro with combos, and trigger overdrive to outpace adaptive AI opponents across neon tracks.

---

## Gameplay Features

* **60 FPS HTML5 Canvas Racing Engine**:
  * Multi-lane racing track with animated road markings, parallax cyberpunk skyline, and checkered finish line.
  * Vector-rendered sports cars with glowing underglow neon, active headlights, tire smoke, and chassis vibration.
  * Dynamic visual effects: speed lines, camera screen shake, and twin plasma nitro exhaust flames.

* **Single-Line Horizontal Typestream**:
  * High-visibility marquee tape positioned prominently at the top of the screen.
  * Smooth horizontal auto-tracking with real-time word anticipation and current cursor centering.
  * Distinct character states: Neon Cyan for correct keys, Neon Pink for errors, and glowing caret for current letter.

* **4 Adaptive AI Difficulty Tiers**:
  * **Rookie**: 32–42 WPM (Cyber Dart)
  * **Pro**: 52–65 WPM (Viper GT)
  * **Champion**: 75–88 WPM (Thunderbolt)
  * **Legend**: 95–115 WPM (Phantom Mach-X)
  * Simulates natural human typing rhythms with speed bursts and realistic micro-hesitations.

* **Nitro & Combo Overdrive**:
  * Consecutive correct keystrokes build combos (`x5`, `x10`, `x20`, `x30+`).
  * Full nitro meter unlocks instant boost via `Shift` or `Spacebar` for a 1.65x acceleration burst.

* **Procedural Web Audio API Synthesizer**:
  * Real-time zero-asset audio synthesis: mechanical key clicks, countdown tones, nitro sweeps, and victory fanfares.
  * Global persistent sound mute/unmute control.

* **Career Records & Local Persistence**:
  * Tracks highest WPM, win rate, accuracy records, and recent match telemetry in `localStorage`.
  * Celebratory confetti blast and "NEW PERSONAL BEST!" badges on record breaks.

---

## Tech Stack

* **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
* **Library**: [React 18](https://react.dev/)
* **Language**: JavaScript (ES6+ / JSX)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Graphics**: HTML5 Canvas (2D Context)
* **Audio**: Native Web Audio API
* **Icons**: [Lucide React](https://lucide.dev/)
* **Effects**: Canvas Confetti

---

## Project Architecture

```text
├── app/
│   ├── globals.css           # Custom arcade glow styles & scanline utilities
│   ├── layout.js             # Root Layout with metadata & font imports
│   ├── page.js               # Landing lobby with difficulty & track selectors
│   ├── race/
│   │   └── page.js           # Main race arena screen
│   └── results/
│       └── page.js           # Podium results & telemetry breakdown
├── components/
│   ├── canvas/
│   │   └── GameCanvas.jsx    # 60 FPS HTML5 Canvas arcade racing renderer
│   ├── hud/
│   │   ├── Countdown.jsx     # 3-2-1-GO! countdown overlay
│   │   ├── RaceHUD.jsx       # Speedometer, WPM gauge, and mini track map
│   │   ├── NitroBar.jsx      # Nitro energy canister & activation indicator
│   │   └── ComboCounter.jsx  # Multiplier badge & milestone toast
│   ├── typing/
│   │   └── TypingArea.jsx    # Top single-line streaming typing marquee
│   └── ui/
│       └── LeaderboardModal.jsx # Career history & record telemetry modal
└── lib/
    ├── audio/
    └── soundSynth.js     # Procedural Web Audio synthesizer
    └── game/
        ├── aiEngine.js       # Adaptive AI driver simulation
        ├── constants.js      # Game constants & difficulty definitions
        ├── physics.js        # Vehicle speed & lerping acceleration models
        ├── statsStorage.js   # LocalStorage persistence manager
        ├── typingEngine.js   # WPM, accuracy, and metric calculations
        ├── useRaceEngine.js  # Race coordinator hook
        ├── useTypingEngine.js# Keyboard capture & combo engine
        └── words.js          # Curated typing passages collection
```

---

## Getting Started

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v18.17 or later)
* `npm` or `yarn`

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/SandeepVashishtha/TypeRush.git

# Navigate into the project folder
cd typerush

# Install dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## Game Controls & Shortcuts

| Action | Keybinding |
| :--- | :--- |
| **Typing Input** | Any standard letter, number, punctuation, or space |
| **Delete Typo** | `Backspace` |
| **Trigger Nitro** | `Shift` (or `Space` when meter is 100% full) |
| **Restart Match** | Click `RESTART` button on top right |
| **Exit to Main Menu** | `Escape` |
