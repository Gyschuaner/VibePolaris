FROM node:22-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund

FROM node:22-alpine AS builder

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm prune --omit=dev --ignore-scripts --no-audit --no-fund

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package.json package-lock.json ./

EXPOSE 3000
COPY lib/xiaobei/store.ts ./lib/xiaobei/store.ts
COPY scripts/xiaobei-invites.ts ./scripts/xiaobei-invites.ts
CMD ["npm", "run", "start", "--", "-H", "0.0.0.0"]
