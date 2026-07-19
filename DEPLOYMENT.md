# ArenaFlow Deployment Guide

## Local Development
Requires Node.js v20+.
```bash
npm install
npm run dev:backend
npm run dev:frontend
```

## Docker Production Deployment
The entire stack is containerized for zero-downtime production environments.
```bash
docker compose up --build -d
```
The frontend is exposed on port `8080` and the backend on `5000`.

## Environment Variables
Create a `.env` file in the `backend/` directory:
- `PORT` - Fastify HTTP Port (Default: 5000)
- `GEMINI_API_KEY` - Optional. Used for AI Playbook Generation. If omitted, mock fallbacks are used safely.

## Troubleshooting
- **Cannot connect to Socket:** Verify the backend is healthy via `http://localhost:5000/health`.
- **Nginx 404 on reload:** Ensure the SPA fallback `try_files` directive is active in `nginx.conf`.
