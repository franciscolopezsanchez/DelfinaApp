FROM node:22-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-workspace.yaml ./
COPY packages/types ./packages/types
COPY apps/ws-server/package.json ./apps/ws-server/package.json
RUN pnpm install --frozen-lockfile
COPY apps/ws-server ./apps/ws-server
WORKDIR /app/apps/ws-server
RUN pnpm build

FROM node:22-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/apps/ws-server/dist ./dist
COPY --from=builder /app/apps/ws-server/package.json ./package.json
RUN pnpm install --prod
EXPOSE 8080
CMD ["node", "dist/index.js"]
