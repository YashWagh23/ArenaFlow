# ArenaFlow

ArenaFlow is a real-time Stadium Operations Digital Twin and Incident Command Center Simulator. It is designed to model stadium crowds, track safety indexes, simulate various emergency scenarios, and generate AI-driven mitigation playbooks using the Gemini API.

## Problem Statement

Managing massive crowds, safety incidents, transit delays, and medical emergencies at large-scale venues (like stadiums during major tournaments) is incredibly complex. Standard operating procedures are often static, and operators lack a unified real-time dashboard that bridges telemetry monitoring, scenario simulation, and dynamic response generation. 

ArenaFlow solves this by providing a high-fidelity digital twin dashboard that integrates active telemetry monitoring, timeline scrubbing, simulated incident response, and AI-powered operational advice.

---

## Features

- **Live Digital Twin Map**: Interactive 2D stadium map representing crowd densities and safety levels across multiple gates and seating zones.
- **Incident Command Center**: View active alerts, execute step-by-step mitigation plans, and coordinate across medical, transit, operations, and security departments.
- **Scenario Simulator**: Simulate adverse weather (heavy rain), gate scanner failures, metro transit delays, security threats, cardiac emergencies, and match-end egress.
- **AI Copilot & Executive Briefings**: Ingests live telemetry anomalies and requests real-time mitigation playbooks and executive summaries from the Gemini API.
- **Real-Time Synchronization**: Backend events and timelines synced seamlessly to all dashboard clients via WebSocket (Socket.io).
- **Interactive Control**: Full timeline scrubbing, speed playback controls (play/pause), and state reset capabilities.

---

## Tech Stack

### Monorepo Workspaces
- **Frontend**: React (v18), Vite, TypeScript, Tailwind CSS, Framer Motion, Socket.io-client, Lucide Icons.
- **Backend**: Fastify, TypeScript, Socket.io, dotenv.
- **Shared**: Common TypeScript type definitions, constants, and utilities.

---

## Folder Structure

```text
ArenaFlow/
├── backend/                  # Fastify server & simulation engine
│   ├── src/
│   │   ├── ai/               # Gemini API Integration
│   │   ├── simulation/       # Simulation Engine & Scenario configs
│   │   └── server.ts         # Server entry point
│   ├── tests/                # Backend simulation test scripts
│   ├── package.json
│   └── tsconfig.json
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # StadiumMap, Dashboard, Sidebar panels
│   │   ├── context/          # WebSocket contexts
│   │   ├── pages/            # View pages (Overview, Digital Twin, etc.)
│   │   └── main.tsx
│   ├── tests/                # Frontend component testing
│   ├── package.json
│   └── vite.config.ts
├── shared/                   # Shared types and utility logic
│   ├── src/
│   │   ├── constants.ts
│   │   ├── types.ts
│   │   └── index.ts
│   └── package.json
├── package.json              # Monorepo workspaces configuration
└── package-lock.json
```

---

## Installation

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd ArenaFlow
   ```

2. Install dependencies for all workspaces at once:
   ```bash
   npm install
   ```

---

## Running Locally

To run the application locally:

### 1. Set Up Environment Variables
Create a `.env` file in the `backend` folder:
```ini
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```
*(If `GEMINI_API_KEY` is not provided, the server will automatically fall back to mock data, allowing you to use all features offline).*

Create a `.env` file in the `frontend` folder:
```ini
VITE_WS_URL=http://localhost:5000
```

### 2. Start the Development Servers
Run the backend and frontend in separate terminals from the root directory:

**Start Backend:**
```bash
npm run dev:backend
```

**Start Frontend:**
```bash
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Screenshots Placeholder

*Screenshots demonstrating the Stadium Digital Twin, Scenario controls, and AI Briefings panel will be placed here.*

---

## Future Improvements

- **Multi-Stadium Dashboard**: Aggregate data from multiple arenas concurrently for tournament-wide operations.
- **Enhanced AI Action Execution**: Let the AI automatically suggest and trigger simulation control steps.
- **High-Fidelity 3D Digital Twin**: Upgrade the 2D Stadium Map to a 3D WebGL/Three.js-powered digital model.
- **Historical Reporting**: Export post-incident audit reports and performance metrics.
