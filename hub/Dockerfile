# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install compilation tools for native node modules (like better-sqlite3)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

# Copy production artifacts
COPY --from=builder /app/.output ./.output

# Make sure SQLite db directory exists inside the container
RUN mkdir -p /app/db

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production

CMD ["node", ".output/server/index.mjs"]
