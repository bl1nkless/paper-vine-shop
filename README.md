# Paper Vine Shop

Next.js застосунок для бренду `Pletenie.Soul` з каталогом виробів із паперової лози, сторінкою індивідуального замовлення, адмінкою та підготовленою fullstack-основою на Prisma/PostgreSQL.

![Головний екран](public/hero-bg.jpg)

## Що вже є в проєкті

- публічний сайт на `Next.js` App Router;
- каталог, який читає товари та категорії з PostgreSQL через Prisma;
- сторінка індивідуального замовлення з швидким переходом у WhatsApp / Telegram;
- адмін-вхід на `next-auth`-сумісній сесійній логіці;
- Sanity Studio для контентних сценаріїв;
- seed-скрипти для початкового власника та тестових даних;
- Docker-конфіг для локального PostgreSQL.

## Технології

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `Prisma 7`
- `PostgreSQL`
- `next-auth` beta
- `Sanity`

## Структура

- `src/app` — маршрути застосунку, публічні сторінки, адмінка, Studio.
- `src/application` — use-case шар для каталогу та адмін-функцій.
- `src/infrastructure` — Prisma та інші інфраструктурні адаптери.
- `src/lib` — утиліти, сесія адміна, форматування, посилання месенджерів.
- `prisma` — схема БД та seed-дані.
- `scripts` — допоміжні скрипти, зокрема створення owner-користувача.
- `docs` — архітектурні та міграційні специфікації.
- `sanity` — конфіг Sanity Studio.

## Швидкий старт

### 1. Встановити залежності

```bash
npm install
```

### 2. Підняти PostgreSQL

```bash
docker compose up -d postgres
```

### 3. Створити `.env`

Найпростіше почати з копії прикладу:

```bash
cp .env.example .env
```

Мінімально для локального запуску потрібні:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/paper_vine_shop?schema=public"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
OWNER_EMAIL="owner@example.com"
OWNER_INITIAL_PASSWORD="change-me-before-production"
NEXT_PUBLIC_TELEGRAM_USERNAME=""
```

Опціонально:

- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_OWNER_CHAT_ID` — якщо потрібні Telegram-нотифікації.
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_READ_TOKEN` — якщо використовуєте Sanity не лише локально.
- `S3_REGION`, `S3_ENDPOINT`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_BASE_URL` — якщо підключається зовнішнє object storage.

### 4. Згенерувати Prisma client і підготувати БД

```bash
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed-owner
npm run db:seed
```

### 5. Запустити dev-сервер

```bash
npm run dev
```

Після старту застосунок буде доступний на [http://localhost:3000](http://localhost:3000).

## Корисні маршрути

- `/` — головна сторінка.
- `/catalog` — каталог товарів з БД.
- `/order` — сторінка індивідуального замовлення.
- `/admin/login` — вхід в адмінку.
- `/admin` — адмін-панель.
- `/studio` — Sanity Studio.

## NPM-скрипти

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:generate
npm run db:migrate
npm run db:seed-owner
npm run db:seed
```

## Поточний стан

Проєкт уже переведений на Prisma/PostgreSQL для каталогу та частини адмін-функцій. У репозиторії також є документи в `docs/`, які описують архітектуру та наступні кроки fullstack-міграції.
