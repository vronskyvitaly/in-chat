# IN CHAT

Социальная сеть и мессенджер: профили с обложками, друзья, фотоальбомы, лента постов с лайками и комментариями и чат в реальном времени.

![Страница профиля](https://github.com/vronskyvitaly/in-chat/releases/download/v0.1.0/profile-page.png)

Проект состоит из двух приложений в одном репозитории:

- **`front/`** — клиент на Next.js 16 (App Router, React 19, Redux Toolkit, Tailwind CSS 4)
- **`server/`** — бэкенд на Express + Prisma (PostgreSQL), realtime через Socket.IO, файлы в S3

## Возможности

| Раздел | Что умеет |
|--------|-----------|
| **Профиль** | Обложка (загрузка изображения, готовые градиенты, выбор цвета), аватар, статус, город, семейное положение, языки; подробная информация в модальном окне |
| **Мессенджер** | Личная переписка в реальном времени, отправка изображений, онлайн-статусы, счётчики непрочитанного |
| **Друзья** | Заявки в друзья, подтверждение и удаление, список друзей, друзья онлайн |
| **Фото** | Загрузка и удаление снимков, просмотр по годам, комментарии к фото |
| **Лента** | Создание постов с изображениями, лайки, комментарии |
| **Поиск** | Поиск пользователей по имени |

![Страница фотографий](https://github.com/vronskyvitaly/in-chat/releases/download/v0.1.0/photos-page.png)

## Стек

| Слой | Технологии |
|------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript, Redux Toolkit + RTK Query, React Hook Form + Zod, Tailwind CSS 4, NextAuth, socket.io-client, Axios, react-icons, react-toastify |
| **Backend** | Node.js, Express, TypeScript, Socket.IO, Prisma ORM, JWT (jsonwebtoken), bcrypt, Multer, Swagger (swagger-jsdoc + swagger-ui-express) |
| **База данных** | PostgreSQL |
| **Хранилище** | S3-совместимое — Yandex Object Storage (`@aws-sdk/client-s3`) |
| **Инструменты** | ESLint, Prettier, Prisma CLI, tsx |

## Структура

```
.
├── front/                  # Next.js фронтенд
│   └── src/
│       ├── app/            # App Router: страницы и API-роуты NextAuth
│       ├── common/         # Общие страницы, компоненты, константы
│       └── features/       # Фичи: auth, chat, posts, friends, photos, users, comments
└── server/                 # Express + Prisma бэкенд
    ├── prisma/             # Схема и миграции
    └── src/
        ├── router/         # auth, users, posts, chat, friends, photos, swagger
        ├── lib/            # S3-клиент и утилиты
        └── middleware/     # Проверка access-токена
```

## Требования

- Node.js 20+
- PostgreSQL (локально или удалённо)
- S3-совместимое хранилище — для обложек, фото и изображений в сообщениях
- Yarn 1.22 для фронтенда (пакетный менеджер зафиксирован в `front/package.json`), npm для бэкенда

## Быстрый старт

### 1. Backend (`server/`)

```bash
cd server
npm install
# создайте .env — см. таблицу ниже
npm run prisma:migrate    # применить миграции к БД
npm run dev               # http://localhost:3001
```

### 2. Frontend (`front/`)

```bash
cd front
yarn install
# создайте .env — см. таблицу ниже
yarn dev                  # http://localhost:3000
```

Бэкенд нужно запускать первым: фронтенд ходит в него за данными и WebSocket-соединением.

## Переменные окружения

### `server/.env`

| Переменная | Назначение |
|------------|------------|
| `PORT` | Порт бэкенда (например, `3001`) |
| `DATABASE_URL` | Строка подключения к PostgreSQL: `postgres://user:password@host:5432/dbname` |
| `JWT_SECRET` | Секрет для подписи access/refresh токенов |
| `S3_ACCESS_KEY` | Access key S3-хранилища |
| `S3_SECRET_ACCCESS_KEY` | Secret key S3-хранилища |
| `S3_BASKET_NAME` | Имя бакета |

> Имя `S3_SECRET_ACCCESS_KEY` содержит опечатку (три «C») — код читает именно этот ключ, поэтому в `.env` его нужно указывать в таком виде.

Регион (`ru-central1`) и эндпоинт (`https://storage.yandexcloud.net`) заданы в коде — см. `server/src/lib/s3-bucket/instanse/index.ts`.

### `front/.env`

| Переменная | Назначение |
|------------|------------|
| `NEXTAUTH_SECRET` | Секрет NextAuth для шифрования сессии |
| `NEXTAUTH_URL` | URL фронтенда, например `http://localhost:3000` |
| `NEXT_PUBLIC_EXPRESS_SERVER` | Адрес бэкенда со слэшем на конце: `http://localhost:3001/` |
| `NEXT_PUBLIC_EXPRESS_URL_WS` | Адрес WebSocket-сервера: `http://localhost:3001/` |

## Команды

**Backend** (`server/`, npm)

| Команда | Действие |
|---------|----------|
| `npm run dev` | Dev-режим: `prisma generate` + автоперезапуск через tsx watch |
| `npm run build` | Сборка: `prisma generate` + `tsc` |
| `npm start` | Продакшн-запуск из `dist/` (перед стартом выполняется сборка) |
| `npm run prisma:migrate` | Применить миграции (`migrate deploy`) |
| `npm run prisma:generate` | Сгенерировать Prisma-клиент |
| `npm run prisma:studio` | Открыть Prisma Studio |
| `npm run prisma:reset` | Сбросить БД и применить миграции заново |

**Frontend** (`front/`, Yarn)

| Команда | Действие |
|---------|----------|
| `yarn dev` | Dev-сервер Next.js |
| `yarn build` | Продакшн-сборка |
| `yarn start` | Запуск собранного приложения |
| `yarn lint` | ESLint |

## API

Бэкенд поднимается на `http://localhost:3001` и монтирует роуты:

| Префикс | Назначение |
|---------|------------|
| `/api/auth` | Регистрация, вход, refresh-токены |
| `/api` | Пользователи, посты, чат, друзья, фотографии |
| `/api-docs` | Swagger UI с описанием эндпоинтов |

Realtime построен на Socket.IO: события сгруппированы по фичам (`auth`, `chat`, `posts`, `friends`, `photos`, `users`) — см. `front/src/common/constants/socket-events`.

Авторизация — по email и паролю: NextAuth (Credentials) на фронте, JWT + bcrypt и refresh-токены в БД на бэкенде.

## Модели данных

Prisma-схема (`server/prisma/schema.prisma`) описывает: `User`, `UserRefreshToken`, `Chat`, `ChatMember`, `Message`, `Post`, `Like`, `Comment`, `Photo`, `PhotoComment`, `Friendship` и перечисления `ChatType`, `FriendshipStatus`.

## Примечания

- Файлы `.env` не хранятся в репозитории (см. `.gitignore`) — секреты задаются локально или в окружении деплоя.
- Сгенерированный Prisma-клиент (`server/src/generated`) исключён из git и создаётся командой `prisma generate` — она запускается автоматически при `npm install`, `npm run dev` и `npm run build`.
