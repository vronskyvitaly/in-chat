# in-chat

Веб-мессенджер в реальном времени: чат между пользователями с обменом сообщениями и изображениями, онлайн-статусами и лентой постов.

Проект состоит из двух приложений в одном репозитории:

- **`front/`** — клиент на **Next.js 16** (React 19, Redux Toolkit, Tailwind CSS 4, NextAuth, socket.io-client)
- **`server/`** — бэкенд на **Express** + **Prisma** (PostgreSQL), realtime через **socket.io**, хранение файлов в **S3**

## Стек

| Слой | Технологии |
|------|-----------|
| Frontend | Next.js 16, React 19, Redux Toolkit, React Hook Form + Zod, Tailwind CSS 4, NextAuth |
| Backend | Node.js, Express, socket.io, Prisma ORM, JWT, bcrypt, Multer |
| БД | PostgreSQL |
| Хранилище | S3-совместимое (обложки, изображения сообщений) |

## Структура

```
.
├── front/    # Next.js фронтенд
└── server/   # Express + Prisma бэкенд
```

## Требования

- Node.js 20+
- PostgreSQL (локально или удалённо)
- S3-совместимое хранилище (для загрузки изображений)

## Запуск

### 1. Backend (`server/`)

```bash
cd server
npm install
# создайте .env (см. переменные ниже)
npm run prisma:migrate   # применить миграции к БД
npm run dev              # запуск на http://localhost:3001
```

Переменные окружения `server/.env`:

```env
PORT=3001
DATABASE_URL=postgres://user:password@host:5432/dbname
JWT_SECRET=...
SESSION_SECRET=...
S3_ACCESS_KEY=...
S3_SECRET_ACCCESS_KEY=...
S3_BASKET_NAME=...
```

### 2. Frontend (`front/`)

```bash
cd front
npm install
# создайте .env (см. переменные ниже)
npm run dev              # запуск на http://localhost:3000
```

Переменные окружения `front/.env`:

```env
NEXT_PUBLIC=http://localhost:3000
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_EXPRESS_SERVER=http://localhost:3001/
NEXT_PUBLIC_EXPRESS_URL_WS=http://localhost:3001/
```

## Полезные команды

**Backend**

| Команда | Действие |
|---------|----------|
| `npm run dev` | Dev-режим с автоперезапуском (tsx watch) |
| `npm run build` | Сборка (Prisma generate + tsc) |
| `npm start` | Продакшн-запуск из `dist/` |
| `npm run prisma:migrate` | Применить миграции |
| `npm run prisma:studio` | Prisma Studio |

**Frontend**

| Команда | Действие |
|---------|----------|
| `npm run dev` | Dev-сервер Next.js |
| `npm run build` | Продакшн-сборка |
| `npm start` | Запуск собранного приложения |
| `npm run lint` | ESLint |

## Примечания

- Файлы `.env` не хранятся в репозитории (см. `.gitignore`) — секреты задаются локально или в окружении деплоя.
- Сгенерированный Prisma-клиент (`server/src/generated`) исключён из git и создаётся командой `prisma generate`.
