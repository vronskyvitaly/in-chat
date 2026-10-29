FROM node:22-alpine

# Prisma engine требует openssl
RUN apk add --no-cache openssl

WORKDIR /app

# prisma.config.ts читает DATABASE_URL уже на этапе `prisma generate` — при сборке хватает заглушки,
# реальное значение приходит из окружения при запуске
ARG DATABASE_URL=postgresql://build:build@localhost:5432/build
ENV DATABASE_URL=$DATABASE_URL

COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

# Применяем миграции и стартуем (без prestart — сборка уже сделана)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
