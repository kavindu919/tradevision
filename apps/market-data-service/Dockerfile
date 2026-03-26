FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

RUN pnpm config set registry https://registry.npmmirror.com
RUN pnpm config set fetch-retries 20
RUN pnpm config set fetch-retry-mintimeout 30000
RUN pnpm config set fetch-retry-maxtimeout 180000
RUN pnpm config set fetch-timeout 180000

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/market-data-service/package.json ./apps/market-data-service/

RUN pnpm install --no-frozen-lockfile

COPY apps/market-data-service/ ./apps/market-data-service/

EXPOSE 3002

CMD ["pnpm", "exec", "tsx", "apps/market-data-service/src/index.ts"]