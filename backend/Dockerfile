# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package configurations
COPY package*.json ./
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install dependencies (including devDependencies needed for build)
RUN npm ci

# Copy source code
COPY shared/ ./shared/
COPY backend/ ./backend/
COPY tsconfig.json ./

# Build backend (which will use shared if needed)
RUN npm run build --workspace=backend

# Production stage
FROM node:20-alpine

ENV NODE_ENV=production

# Install curl for healthcheck if needed, but alpine has wget
RUN apk add --no-cache wget

USER node
WORKDIR /home/node/app

# Copy package configurations
COPY --chown=node:node package*.json ./
COPY --chown=node:node shared/package.json ./shared/
COPY --chown=node:node backend/package.json ./backend/
COPY --chown=node:node frontend/package.json ./frontend/

# Install production dependencies
RUN npm ci --omit=dev --workspace=backend

# Copy built artifacts from builder
COPY --from=builder --chown=node:node /app/shared/dist ./shared/dist
COPY --from=builder --chown=node:node /app/shared/package.json ./shared/
COPY --from=builder --chown=node:node /app/backend/dist ./backend/dist
COPY --from=builder --chown=node:node /app/backend/package.json ./backend/

WORKDIR /home/node/app/backend

EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Start the Fastify server directly using node
CMD ["node", "dist/server.js"]
