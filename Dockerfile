# syntax=docker/dockerfile:1

# ---------- Stage 1: build frontend ----------
FROM node:24-alpine AS frontend-build
WORKDIR /app/frontend

# CRA inlines REACT_APP_* vars at build time
ARG REACT_APP_GOOGLE_CLIENT_ID
ENV REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/public ./public
COPY frontend/src ./src
RUN npm run build

# ---------- Stage 2: install backend production deps ----------
FROM node:24-alpine AS backend-build
WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

COPY backend/index.js backend/migrate.js ./
COPY backend/migrations ./migrations

# ---------- Stage 3: compose the final app ----------
FROM node:24-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY --from=backend-build /app/backend ./
COPY --from=frontend-build /app/frontend/build ./public

USER node
EXPOSE 5000
CMD ["node", "index.js"]
