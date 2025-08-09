# GrindTracker 🏁

[![Version](https://img.shields.io/badge/Version-0.1.0-blueviolet)](./package.json)


[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-%5E4-FF6384?logo=chart.js&logoColor=white)](https://www.chartjs.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-✦-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#license)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

## Overview
GrindTracker is a modern, browser‑based goal tracker and productivity companion. It helps you create clear goals, break them into daily tasks, and stay motivated with a built‑in gamification system (XP, levels, streaks, milestones). Visual progress is front‑and‑center with monthly charts and a GitHub‑style heatmap, and the UI is fully responsive with dark/light themes.

- 100% client‑side; your data is stored in the browser (localStorage)
- Fast, frictionless UX optimized for daily use
- Built with Next.js 15 + React 18 and a clean component architecture

## Key Features
- Goal creation and management
  - One‑time or recurring goals
  - Activate/Pause goals and edit details inline
- Daily task tracking
  - Quick task creation per goal
  - Real‑time completion updates across Dashboard, Today’s Grind, and Stats
- Gamification system
  - Earn XP for completions; level up with celebratory visuals
  - Track streaks and milestone achievements
- Monthly statistics
  - Interactive Chart.js monthly view with goal filters and month navigation
  - Summary metrics: Completed, Active Days, Best Day
- GitHub‑style contribution heatmap
  - Responsive heatmap shows intensity of daily work, updated in real time
- Dark/Light themes
  - Theme‑aware surfaces, focus rings, and accessible contrast
- Responsive design
  - Optimized layouts for mobile, tablet, and desktop

## Technology Stack
- Framework: **Next.js 15** (App Router)
- UI: **React 18**, **Tailwind CSS** (+ custom CSS variables/utilities)
- Charts: **Chart.js** (via `react-chartjs-2`)
- Animation: **Framer Motion**
- State & Storage: React Context + **localStorage** (browser‑only)

## Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm (or pnpm/yarn)

### Installation
```bash
# 1) Clone the repo
git clone https://github.com/your-org/grindtracker.git
cd grindtracker

# 2) Install dependencies
npm install

# 3) Run in development
npm run dev
# App will be available at http://localhost:3000
```

### Production build
```bash
npm run build
npm run start
```

> Note: GrindTracker is browser‑only. No database or server config is required.

## Usage Guide
- Create a goal
  - Click “New Goal”, choose one‑time or recurring, add optional deadline
- Add daily tasks
  - From Dashboard or Goals, click “Add Task” for any goal
- Complete tasks
  - Check items off in “Today’s Grind”; XP/levels/streaks update instantly
- View progress
  - Open the Stats section for the monthly chart, summary metrics, and heatmap
- Switch theme
  - Use the theme toggle in the navbar (dark/light)

## Screenshots
> Replace placeholders with real screenshots or GIFs.

- Dashboard
  - ![Dashboard Screenshot](docs/screenshots/dashboard.png)
- Goals
  - ![Goals Screenshot](docs/screenshots/goals.png)
- Monthly Stats
  - ![Stats Screenshot](docs/screenshots/stats.png)

## Project Structure (high‑level)
```
src/
  app/
    sections/        # Dashboard, Goals, Daily, Stats (Monthly)
    globals.css      # Tailwind + theme variables and utilities
    layout.js        # Root layout and providers
    page.js          # Home page composition
  components/        # Reusable UI (Navbar, Modal, ProgressBar, Heatmap, etc.)
  context/           # App/Theme contexts and persistence
  lib/               # Date and storage utilities
```

## Contributing
Contributions are very welcome! To propose changes:
1. Fork the repository and create a feature branch
2. Write clear, focused commits and open a pull request
3. If applicable, include/update tests and screenshots

Guidelines:
- Keep PRs scope‑focused and small where possible
- Match existing code style (lint before committing)
- Prioritize accessibility (focus states, contrast, keyboard use)

## License
This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 GrindTracker contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

If you build something cool with GrindTracker, share it with us—PRs and ideas are always welcome! ✨
