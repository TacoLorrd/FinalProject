<!-- Final project – stability pass only. No feature changes allowed. -->

<!-- Banner image removed by maintainer (was linking to external site). -->

# DeltaView — Formula 1 Data Dashboard 🏁

A compact, interactive dashboard to explore Formula 1 seasons, driver standings, team standings, and race results. Built with React, Vite, TypeScript and Recharts — focused on clarity, fast local performance, and testability.

---

## Main features ✅

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

- **Select a Season:** Use the season selector to change the dataset (e.g., 2023, 2024).
- **Explore Charts:** Hover over data points to see exact values and tooltips.
- **Compare Entities:** Visit the Compare page to choose drivers or teams to view side-by-side statistics.
- **Local Caching:** When online requests fail, cached results (if available) will be used automatically — useful for flaky networks.

> Tip: If you want to inspect or tweak API calls, see `services/f1Service.ts` — it contains the small wrapper used to fetch and cache F1 data.

---

## Development & Testing 🛠️

- **Tech stack:** React, TypeScript, Vite, Recharts, Vitest
- **Run tests once:** `npm test -- --run`
- **Test environment:** Some tests use `/* @vitest-environment jsdom */` and require `jsdom` as a dev dependency (already added).

If you add new tests that require DOM globals, use `vi.stubGlobal(...)` or annotate with `@vitest-environment jsdom`.

---

## Contributing 🤝

1. Fork the repo and create a branch for your change.
2. Run the test suite and add tests for new behavior.
3. Submit a PR with a clear description and screenshots if applicable.

Please keep changes limited to small incremental improvements for the stability pass.

---

## License & Contact

No license specified in this repository. For questions or help, open an issue or contact the maintainer via the project's GitHub profile.

---

Thanks for checking out DeltaView — enjoy exploring the data! ✨
