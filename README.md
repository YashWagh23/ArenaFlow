<div align="center">
  <h1>ArenaFlow</h1>
  <p><strong>Real-time AI-Powered Stadium Operations & Incident Command Center</strong></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Fastify](https://img.shields.io/badge/Fastify-000000?style=flat&logo=fastify&logoColor=white)](https://www.fastify.io/)
</div>

<br />


<br />

## 📖 Overview

Managing massive crowds, safety incidents, transit delays, and medical emergencies at large-scale venues (like stadiums during major tournaments) is incredibly complex. Standard operating procedures are often static, and operators lack a unified real-time dashboard that bridges telemetry monitoring, scenario simulation, and dynamic response generation. 

**ArenaFlow** solves this by providing a high-fidelity digital twin dashboard that integrates active telemetry monitoring, timeline scrubbing, simulated incident response, and AI-powered operational advice using the Gemini API.

---

## ✨ Features

- **Live Digital Twin Map**: Interactive 2D stadium map representing crowd densities and safety levels across multiple gates and seating zones.
- **Incident Command Center**: View active alerts, execute step-by-step mitigation plans, and coordinate across medical, transit, operations, and security departments.
- **Scenario Simulator**: Simulate adverse weather (heavy rain), gate scanner failures, metro transit delays, security threats, cardiac emergencies, and match-end egress.
- **AI Copilot & Executive Briefings**: Ingests live telemetry anomalies and requests real-time mitigation playbooks and executive summaries from the Gemini API.
- **Real-Time Synchronization**: Backend events and timelines synced seamlessly to all dashboard clients via WebSocket (Socket.io).
- **Interactive Control**: Full timeline scrubbing, speed playback controls (play/pause), and state reset capabilities.

---

## 🎥 Demo


---

## 🏗️ Architecture

ArenaFlow is built as a robust Monorepo encompassing a real-time event-driven Node.js backend and a highly responsive React frontend. 

1. **Simulation Engine (Backend)**: Runs a continuous internal tick-loop generating realistic stadium telemetry (crowd density, gate flow, incidents). 
2. **WebSocket Gateway**: Streams live telemetry at high frequency (1Hz) to all connected operational clients.
3. **AI Orchestrator**: Monitors state changes and triggers the Gemini LLM for dynamic playbook generation when incidents occur.
4. **Command Dashboard (Frontend)**: Consumes WebSocket streams, updating the Digital Twin Map, KPI counters, and AI Copilot timeline smoothly with zero perceived latency.

---

## 💻 Tech Stack

### Frontend
- **React (v18)** - UI Library
- **Vite** - Build Tool & Dev Server
- **TypeScript** - Type Safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Fluid animations and transitions
- **Socket.io-client** - Real-time WebSocket subscriptions

### Backend
- **Fastify** - High-performance web framework
- **Socket.io** - Real-time WebSocket server
- **TypeScript** - Type Safety
- **Google Gemini API** - LLM Integration for AI playbooks

---

## 🚀 Installation

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YashWagh23/ArenaFlow.git
   cd ArenaFlow
   ```

2. **Install dependencies for all workspaces at once:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   
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

4. **Start the Development Servers:**

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

## 🖼️ Screenshots


---

## 🗺️ Roadmap

- [x] High-fidelity 2D Digital Twin Map
- [x] AI-Generated Incident Playbooks
- [x] Scenario Simulation Engine (Weather, Transit, Medical)
- [ ] **Multi-Stadium Dashboard**: Aggregate data from multiple arenas concurrently for tournament-wide operations.
- [ ] **Enhanced AI Action Execution**: Let the AI automatically suggest and trigger simulation control steps.
- [ ] **High-Fidelity 3D Digital Twin**: Upgrade the 2D Stadium Map to a 3D WebGL/Three.js-powered digital model.
- [ ] **Historical Reporting**: Export post-incident audit reports and performance metrics.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
