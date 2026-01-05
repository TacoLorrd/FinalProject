<!-- Final project – stability pass only. No feature changes allowed. -->

<!-- Banner image removed by maintainer (was linking to external site). -->

<!-- Badges: CI (GitHub Actions), Coverage (Codecov), Languages -->

[![CI](https://github.com/TacoLorrd/FinalProject/actions/workflows/ci.yml/badge.svg)](https://github.com/TacoLorrd/FinalProject/actions)
[![coverage](https://codecov.io/gh/TacoLorrd/FinalProject/branch/main/graph/badge.svg)](https://codecov.io/gh/TacoLorrd/FinalProject)

[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-%23419BFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Recharts](https://img.shields.io/badge/Recharts-FF6B6B.svg?style=flat&logo=apacheecharts&logoColor=white)](https://recharts.org/)

# DeltaView — Formula 1 Data Dashboard 🏁

Hi! I'm a Grade 11 student and made this small project to explore Formula 1 data. It's a simple, interactive dashboard that helps you look at seasons, driver rankings, team standings, and race results. I built it with TypeScript, React, Vite, and Recharts — the goal was to keep things fast, clear, and easy to play with.

---

## Main features ✅

- **Interactive Dashboard:** Quickly view season standings, trends over time, and key numbers that matter.
- **Drivers & Teams Pages:** Browse driver and constructor standings, see details, and sort stuff.
- **Races View:** Check results for each race — who won, who scored points, tiny details.
- **Compare Page:** Put drivers or teams side-by-side and spot who did better across seasons.
- **Nice and Accessible UI:** Theme toggle, keyboard-friendly focus trap, and small components.
- **Client-side caching:** API responses get cached to `localStorage` so the app can still show something if the network flairs up.
- **Tests:** Uses Vitest for unit tests (some tests use a jsdom environment for DOM APIs).

- **Interactive Dashboard:** Quickly view season standings, trends over time, and key metrics.
- **Drivers & Teams Pages:** Browse driver and constructor standings, with sorting and quick lookups.
- **Races View:** Inspect individual race results by year and event.
- **Compare Page:** Side-by-side comparisons of drivers/teams across seasons.
- **Accessible UI:** Theme toggle, keyboard-friendly focus trap, and small, focused components.
- **Client-side caching:** API responses are cached to `localStorage` so the app can fall back to cached data if a network request fails.
- **Tests:** Uses Vitest for unit tests (including jsdom environment for DOM-dependent tests).

---

## Quick Start — Run Locally ▶️

**Prerequisites:** Node.js (recommended v18+), npm

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:5173 in your browser.

3. Build for production:

   ```bash
   npm run build
   npm run preview
   ```

4. Run tests:

   ```bash
   npm test
   ```

   Note: Tests that use the DOM require `jsdom` (added as a devDependency). If you see errors mentioning `jsdom`, run `npm install` to update your lockfile.

---

## How to use the site — user guide 💡

- **Pick a Season:** There's a season selector — use it to switch years (like 2022 or 2024).
- **Hover for details:** Hover charts to see exact numbers and quick tooltips.
- **Compare things:** Use the Compare page to choose two drivers or teams and see them together.
- **Offline-friendly:** If a network request fails, the app will try to show cached results instead of just crashing.

> Tip: The API calls are in `services/f1Service.ts` if you want to tweak them.

- **Select a Season:** Use the season selector to change the dataset (e.g., 2023, 2024).
- **Explore Charts:** Hover over data points to see exact values and tooltips.
- **Compare Entities:** Visit the Compare page to choose drivers or teams to view side-by-side statistics.
- **Local Caching:** When online requests fail, cached results (if available) will be used automatically — useful for flaky networks.

> Tip: If you want to inspect or tweak API calls, see `services/f1Service.ts` — it contains the small wrapper used to fetch and cache F1 data.

---

## Development & Testing 🛠️

- **Stack:** TypeScript, React, Vite, Recharts, Vitest
- **Install:** `npm install`
- **Dev server:** `npm run dev`
- **Build:** `npm run build` and `npm run preview`
- **Run tests once:** `npm test -- --run`
- **Coverage:** Tests can generate coverage reports (Codecov badge at the top shows coverage for the `main` branch).

If you add tests that need DOM globals, use `vi.stubGlobal(...)` or add `/* @vitest-environment jsdom */` to the test file.

- **Tech stack:** React, TypeScript, Vite, Recharts, Vitest
- **Run tests once:** `npm test -- --run`
- **Test environment:** Some tests use `/* @vitest-environment jsdom */` and require `jsdom` as a dev dependency (already added).

If you add new tests that require DOM globals, use `vi.stubGlobal(...)` or annotate with `@vitest-environment jsdom`.

---

## Contributing 🤝

Hey — if you want to help, that's awesome! Please fork the repo, make a branch, add tests for what you change, and open a PR. Keep changes small and add a screenshot if you change the UI.

1. Fork the repo and create a branch for your change.
2. Run the test suite and add tests for new behavior.
3. Submit a PR with a clear description and screenshots if applicable.

Please keep changes limited to small incremental improvements for the stability pass.

---

## License & Contact

No license is specified for this repo. If you want to use anything here, ask me first (open an issue). For help, open an issue or contact the maintainer on GitHub.

---

Thanks for checking out DeltaView — enjoy exploring the data! ✨
