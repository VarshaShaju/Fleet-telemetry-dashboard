# EV Fleet Telemetry Dashboard  

A modern React + TypeScript dashboard for monitoring real-time telemetry of electric vehicle fleets.  
It simulates live data for up to 10 EVs, showing vehicle health, performance, and location on an interactive dashboard.  

## Features  

- **Real-time Telemetry**  
  - Vehicle speed, battery, tire pressure, efficiency, motor temperature, etc.  
  - Mock data simulation with realistic trends and noise.  

- **Interactive Map**  
  - Vehicles displayed with Leaflet markers.  
  - Status colors: moving, charging, idle, offline.  
  - Tooltips & popups for quick vehicle info.  

- **Alert System**  
  - Randomly generated alerts (e.g. low battery, speeding).  
  - Notifications center with acknowledge & clear actions.  

- **Charts & Analytics**  
  - Efficiency line chart (kWh / 100km per month).  
  - Stable per-vehicle random seed for consistent values.  

- **Customizable Dashboard**  
  - Drag & drop panels (overview, vehicles, alerts).  
  - Responsive grid layout (desktop & mobile).  

- **UI & Theming**  
  - TailwindCSS styling with custom palettes.  
  - Dark / light theme toggle.  
  - Language switcher (English / German).  

- **Robust Architecture**  
  - Zustand stores (`fleetStore`, `uiStore`, `layoutStore`) for state.  
  - Context for theming.  
  - Clean separation: components, hooks, stores, services.  

- **Testing**  
  - React Testing Library + Jest unit tests for components, stores, and hooks.  
  - Mocking i18n, Leaflet, and stores for clean test runs.  

---

## Getting Started  

### 1. Clone & Install  
```bash
git clone https://github.com/VarshaShaju/Fleet-telemetry-dashboard.git
cd Fleet-telemetry-dashboard
npm install
```

### 2. Run Development Server  
```bash
npm run dev
```
App runs at http://localhost:5173 (Vite default).  

### 3. Mock Data  
Mock telemetry is enabled via an environment variable.  
```bash
# .env
VITE_ENABLE_MOCK_DATA=true
```
This triggers `initializeMockData()` in `src/services/mockData.ts`, generating continuous random updates.  

---

## Project Structure (actual)

```
.
├─ public/
├─ src/
│  ├─ components/            # UI (charts, panels, sidebar, header, map, etc.)
│  ├─ contexts/              # ThemeContext (dark/light)
│  ├─ hooks/                 # useTelemetry, useOfflineDetector, etc.
│  ├─ services/              # mockData (telemetry emitter)
│  ├─ stores/                # Zustand stores: fleet, UI, layout
│─ i18n.ts                # i18next setup
│─ index.css              # Tailwind layers + custom utilities
│─ main.tsx               # Vite entry (loads mocks if enabled)
│─ App.tsx                # App shell + providers
│─ setupTests.ts          # jest-dom setup (expect.extend)
├─ .env.example
├─ jest.config.js
├─ postcss.config.js
├─ tailwind.config.js
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite-env.d.ts
├─ package.json
└─ README.md
```

 Tests are co-located with source (e.g., `src/components/layout/tests`, `src/stores/tests`). There is no top-level `tests/` folder.

---

## Running Tests  

```bash
npm test
```

Covers:  
- **Stores** → selecting vehicles, filtering/sorting, alerts, online/offline gating.  
- **Components** → Sidebar, HeaderBar, MapPanel, AlertCenter.  
- **UI interactions** → Filter/sort, acknowledge alerts, theme toggle.  

---

## Internationalization  

- Default: **English**  
- Toggle: **German (Deutsch)** via the header dropdown.  
- Strings are handled by `i18n.ts`.  

---

## Tech Stack  

- **React 18 + TypeScript** – UI framework  
- **Zustand** – State management  
- **TailwindCSS** – Styling  
- **Recharts** – Charts & graphs  
- **Leaflet + React-Leaflet** – Maps  
- **i18next** – Internationalization  
- **Jest + React Testing Library** – Unit testing  
- **Vite** – Fast build tool  

---

## Deployment  

### Production Build  
```bash
npm run build
```

### Preview Build  
```bash
npm run preview
```

The production build in `dist/` can be hosted on Netlify, Vercel, or any static host.  

---

## Future Enhancements  

- Connect to a real WebSocket backend (replace mock events)  
- Historical analytics (battery trends, mileage over time)  
- Role-based authentication  
- Export reports (CSV/PDF)  

---

## Author  

Built with ❤️ by Varsha Shaju
