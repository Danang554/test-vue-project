# ========================================================
# Multi-Stage Dockerfile for Vue 3 SPA (test-vue-project)
# ========================================================

# --------------------------------------------------------
# Stage 1: Base Image (Node.js LTS Alpine)
# --------------------------------------------------------
FROM node:22-alpine AS base
WORKDIR /app

# Cache package dependencies
COPY package.json package-lock.json ./
RUN npm ci

# --------------------------------------------------------
# Stage 2: Development / Testing Environment (Vite Dev Server)
# - Live HMR hot-reloading
# - Dynamic port & backend proxying via .env
# - Background file logger writing to /app/logs
# --------------------------------------------------------
FROM base AS development
WORKDIR /app
COPY . .
RUN mkdir -p logs

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# --------------------------------------------------------
# Stage 3: Builder Stage for Production
# --------------------------------------------------------
FROM base AS build
WORKDIR /app
COPY . .

ARG VITE_PORT=5173
ARG VITE_BACKEND_URL=http://host.docker.internal:8080
ARG VITE_API_BASE_URL=
ARG VITE_APP_TITLE="Golang API Frontend Tester"

ENV VITE_PORT=$VITE_PORT
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APP_TITLE=$VITE_APP_TITLE

RUN npm run build

# --------------------------------------------------------
# Stage 4: Production Web Server (Nginx Alpine)
# - High performance static file serving
# - HTML5 History mode SPA fallback
# - Reverse proxy to Golang API & health check
# --------------------------------------------------------
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
