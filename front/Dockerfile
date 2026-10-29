FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:22-alpine AS build
WORKDIR /app

# NEXT_PUBLIC_* встраиваются в бандл при сборке
ARG NEXT_PUBLIC_EXPRESS_SERVER
ARG NEXT_PUBLIC_EXPRESS_URL_WS
ENV NEXT_PUBLIC_EXPRESS_SERVER=$NEXT_PUBLIC_EXPRESS_SERVER
ENV NEXT_PUBLIC_EXPRESS_URL_WS=$NEXT_PUBLIC_EXPRESS_URL_WS
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
