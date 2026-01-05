<!-- Final project — stability pass only. No feature changes allowed. -->
<!-- Banner removed (external link). -->

[![CI](https://github.com/TacoLorrd/FinalProject/actions/workflows/ci.yml/badge.svg)](https://github.com/TacoLorrd/FinalProject/actions)
[![Coverage](https://codecov.io/gh/TacoLorrd/FinalProject/branch/main/graph/badge.svg)](https://codecov.io/gh/TacoLorrd/FinalProject)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232a?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-419BFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Recharts](https://img.shields.io/badge/Recharts-FF6B6B?style=flat)](https://recharts.org/)

# DeltaView 🏁  
### Formula 1 Data Dashboard

DeltaView is a fast, interactive Formula 1 dashboard built to explore race results, driver standings, and constructor performance across seasons.

I built this as a **Grade 11 final project** with a focus on:
- clean data flow  
- readable UI  
- performance & stability (no feature creep)

The goal wasn’t flashy animations — it was making F1 data **easy to understand and fun to explore**.

---

## 🚀 What it does

- **Season Dashboard**  
  View standings, trends, and key stats at a glance.

- **Drivers & Constructors**  
  Browse rankings, sort results, and drill into details.

- **Race Results**  
  Inspect individual races by year and event.

- **Compare Mode**  
  Put drivers or teams side-by-side and see who actually performed better.

- **Accessible UI**  
  Theme toggle, keyboard navigation, focus management — built properly.

- **Client-side caching**  
  API responses are cached in `localStorage` so the app can fall back if the network flakes.

- **Tested**  
  Unit tests with Vitest (jsdom where needed).

---

## 🧠 Tech Stack

- **Frontend:** React + TypeScript  
- **Build tool:** Vite  
- **Charts:** Recharts  
- **Testing:** Vitest + jsdom  
- **Data:** Formula 1 public API (wrapped + cached)

---

## ▶️ Run it locally

**Requirements:** Node.js v18+ (recommended), npm

```bash
npm install
npm run dev
