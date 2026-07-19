# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root configurations
COPY package*.json ./
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install all dependencies (devDependencies needed for Vite build)
RUN npm ci

# Copy source code
COPY shared/ ./shared/
COPY frontend/ ./frontend/
COPY tsconfig.json ./

# Build frontend (and shared implicitly or explicitly)
RUN npm run build --workspace=frontend

# Production stage
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Nginx alpine image already runs as non-root optionally or we can leave as default for nginx
# Nginx healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
