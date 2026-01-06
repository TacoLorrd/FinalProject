# DeltaView

Formula 1 data dashboard built as a school project using React, TypeScript, and Vite.

---

## 🚀 Running the site (local development)

The project files live in the subfolder `deltaview-—-formula-1-data-dashboard (2)`. There are two common ways to run the site locally:

### Option A — Change into the project folder (recommended)

1. Open a terminal and run:

```bash
cd "deltaview-—-formula-1-data-dashboard (2)"
npm install
npm run dev -- --host 0.0.0.0
```

2. Open your browser at: `http://localhost:3000/` (the dev server defaults to port 3000).

> Tip: From inside a Dev Container you can open the host browser with: `$BROWSER http://localhost:3000/`

### Option B — Run from the repository root (no cd)

If you prefer to stay in the repo root, prefix npm commands with `--prefix`:

```bash
npm --prefix "deltaview-—-formula-1-data-dashboard (2)" install
npm --prefix "deltaview-—-formula-1-data-dashboard (2)" run dev -- --host 0.0.0.0
```

This does the same thing as Option A and is handy for scripted workflows.

---

## ✅ Build & Test

- Build for production:

```bash
cd "deltaview-—-formula-1-data-dashboard (2)"
npm run build
```

- Run unit tests (Vitest):

```bash
cd "deltaview-—-formula-1-data-dashboard (2)"
npm test -- --run
```

> Note: Tests that depend on a DOM use `jsdom` as a dev dependency — it is already included in this project.

---

## 🔧 Troubleshooting

- Error "Could not read package.json" — make sure you run commands from the project folder or use the `--prefix` approach shown above.
- Dev server not reachable — ensure the server started with `--host 0.0.0.0` (or use the network URL shown in the server output).

---

If you'd like, I can also add a short "How to contribute" section or a troubleshooting FAQ — tell me your preference.
