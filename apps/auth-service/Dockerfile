FROM node:20-alpine

# Install pnpm globally only (not prisma - it comes from dependencies)
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

    COPY apps/auth-service/package.json ./apps/auth-service/
    COPY packages/db-client/ ./packages/db-client/

    # Install all dependencies including devDependencies
    RUN pnpm install --no-frozen-lockfile
RUN pnpm exec prisma generate --schema=./packages/db-client/prisma/schema.prisma

COPY apps/auth-service/ ./apps/auth-service/

EXPOSE 3001

CMD ["pnpm", "exec", "tsx", "apps/auth-service/src/index.ts"]