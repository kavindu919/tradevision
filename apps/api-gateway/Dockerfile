FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

# Configure pnpm with Aliyun mirror for faster downloads on slow internet
# Also increase all network timeouts significantly
RUN pnpm config set registry https://registry.npmmirror.com
RUN pnpm config set fetch-retries 20
RUN pnpm config set fetch-retry-mintimeout 30000
RUN pnpm config set fetch-retry-maxtimeout 180000
RUN pnpm config set fetch-timeout 180000

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/api-gateway/package.json ./apps/api-gateway/

RUN pnpm install --no-frozen-lockfile

COPY apps/api-gateway/ ./apps/api-gateway/

EXPOSE 3000

CMD ["pnpm", "exec", "tsx", "apps/api-gateway/src/index.ts"]