FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.8.0 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
# docker-compose overrides CMD with: pnpm dev --host
# --host binds Vite to 0.0.0.0 so it's reachable outside the container
CMD ["pnpm", "dev", "--host"]
