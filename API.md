# ArenaFlow API Documentation

## HTTP Endpoints (Fastify)

### `GET /health`
- **Description:** Verifies server is alive and accepting connections.
- **Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": 1721382400000,
  "connections": 42
}
```

### `GET /ready`
- **Description:** Verifies backend has initialized the simulation clock.
- **Response:** `200 OK` or `503 Service Unavailable`.

### `GET /metrics`
- **Description:** Returns Prometheus-style telemetry.

---

## Socket.io Events

### Client -> Server (Emits)

#### `trigger_scenario`
- **Payload:** `scenarioId: string` (e.g., `'metro-delay'`)
- **Description:** Manually injects an anomaly into the current tick.

#### `execute_step`
- **Payload:** `{ eventId: string, stepId: string }`
- **Description:** Executes a single step of an approved AI playbook.

#### `request_briefing`
- **Payload:** `None`
- **Description:** Generates an on-demand executive summary from Gemini.

### Server -> Client (Listens)

#### `stadium_state`
- **Payload:** `StadiumState` object
- **Description:** Broadcasts every 1s containing all zone metrics.

#### `executive_briefing`
- **Payload:** `string` (Markdown text)
- **Description:** AI-generated summary response.
