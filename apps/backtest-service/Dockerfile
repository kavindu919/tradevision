FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

RUN pnpm config set registry https://registry.npmmirror.com
RUN pnpm config set fetch-retries 20
RUN pnpm config set fetch-retry-mintimeout 30000
RUN pnpm config set fetch-retry-maxtimeout 180000
RUN pnpm config set fetch-timeout 180000

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/backtest-service/package.json ./apps/backtest-service/
COPY packages/db-client/ ./packages/db-client/
COPY packages/indicators/ ./packages/indicators/

RUN pnpm install --no-frozen-lockfile
RUN pnpm exec prisma generate --schema=./packages/db-client/prisma/schema.prisma

COPY apps/backtest-service/ ./apps/backtest-service/

EXPOSE 3003

CMD ["pnpm", "exec", "tsx", "apps/backtest-service/src/index.ts"]