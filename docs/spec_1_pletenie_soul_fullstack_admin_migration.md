# SPEC-1-Pletenie-Soul-Fullstack-Admin-Migration

## Background

Pletenie.Soul сейчас является интернет-магазином авторских изделий из бумажной лозы: корзины, сумки и декор ручной работы. Проект уже построен как современный Next.js App Router frontend с TypeScript и Tailwind CSS, а управление контентом вынесено в Sanity CMS.

Текущая модель данных в Sanity минимальная и хорошо подходит для прямой миграции в собственную базу данных:

- `category`: `title`, `slug`
- `product`: `title`, `slug`, `price`, `mainImage`, `gallery`, `category`, `description`, `dimensions`, `inStock`

Текущий пользовательский путь выглядит как каталог товаров с карточками, страницами товара и быстрым заказом. Следующий архитектурный шаг — убрать зависимость от Sanity Studio и превратить проект в полноценное full-stack приложение с собственной админ-панелью, базой данных, авторизацией, загрузкой изображений, управлением товарами и Telegram-based коммуникацией с клиентами.

Для MVP предполагается, что онлайн-оплата не является обязательной первой фазой: сначала важнее заменить Sanity, сохранить текущий публичный каталог, дать владельцу удобный CRUD для товаров/категорий, принимать заявки с сайта и переводить дальнейшее общение с клиентом в Telegram.


## Requirements

### Must Have

- Администратор может войти в защищённую админ-панель.
- Администратор может создавать, редактировать, удалять и скрывать товары.
- Администратор может управлять категориями товаров.
- Администратор может загружать главное изображение товара и галерею изображений.
- Администратор может менять цену, наличие, размеры и описание товара.
- Публичный каталог продолжает работать без Sanity и берёт данные из собственной базы данных.
- Страница товара позволяет добавить товар в корзину.
- Сайт сохраняет SEO-friendly URL через slug для товаров и категорий.
- Сайт поддерживает корзину без пользовательского аккаунта.
- Корзина хранит выбранные товары, количество и выбранный вариант/размер, если он есть.
- Клиент может отправить заказ из корзины через форму: имя, Telegram username или телефон, комментарий.
- Система хранит заказы, созданные с сайта, в собственной базе данных.
- Администратор может просматривать список заказов в админке.
- После создания заказа владелец получает Telegram-уведомление через Telegram Bot.
- После создания заказа клиент видит кнопку для открытия Telegram-чата с владельцем.
- Приложение разворачивается на Vercel.
- Основная база данных — managed PostgreSQL.
- Изображения хранятся в S3-compatible object storage, например Cloudflare R2, AWS S3 или Supabase Storage.

### Should Have

- Админка показывает простую dashboard-страницу: количество товаров, товаров в наличии, новых заявок и последних действий.
- Товары можно фильтровать по категории, наличию и статусу публикации.
- Заказы имеют статусы: `new`, `telegram_opened`, `contacted`, `in_progress`, `completed`, `cancelled`.
- Система валидирует slug и не допускает дубликатов.
- Система автоматически создаёт slug из названия, но позволяет редактировать его вручную.
- Изображения автоматически оптимизируются для публичного сайта через Next.js Image.
- Данные из Sanity можно импортировать один раз через migration script.
- Админка должна быть достаточно простой, чтобы ей мог пользоваться не технический владелец магазина.

### Could Have

- Несколько ролей пользователей: `owner`, `admin`, `editor`. В MVP используется один `owner`, но схема БД должна поддерживать расширение ролей.
- История изменений товара.
- Drag-and-drop сортировка галереи товара.
- Сортировка товаров вручную для управления витриной.
- Email-уведомления владельцу о новой заявке.
- Telegram-уведомления владельцу о новой заявке с кнопкой открытия заказа в админке.
- Экспорт заказов в CSV.
- Серверное хранение незавершённых корзин для аналитики abandoned carts.
- Промокоды или скидки.

### Won't Have in MVP

- Полноценная онлайн-оплата картой.
- Сложный складской учёт.
- Интеграция с CRM.
- Многоязычность.
- Marketplace-логика с несколькими продавцами.
- Нативное мобильное приложение.


## Method

### 1. Target Architecture

Целевая архитектура меняется с CMS-driven storefront на full-stack commerce application.

Главная нерешённая проблема из предыдущего SPEC — раздвоение источников данных и ответственности. Раньше конфликт был между `src/data/catalog.ts` и Sanity. В новой архитектуре нужно устранить не только локальный каталог, но и зависимость от Sanity как production source of truth.

Новый production source of truth:

```text
PostgreSQL
```

Sanity становится только временным migration source, если в нём уже есть актуальные товары. После миграции production-страницы и админка не должны читать Sanity напрямую.

```text
Public Storefront
  -> Application Services
    -> Domain Models
      -> PostgreSQL via Prisma
      -> Object Storage via S3/R2
      -> Telegram Bot API

Admin Panel
  -> Server Actions / Route Handlers
    -> Application Services
      -> PostgreSQL via Prisma
      -> Object Storage via S3/R2
      -> Next.js Cache Revalidation
```

### 2. Proposed Stack

Recommended MVP stack:

```text
Framework: Next.js App Router
Language: TypeScript
UI: Tailwind CSS + existing components
Auth: Auth.js
Database: Managed PostgreSQL
ORM: Prisma ORM
Validation: Zod
Image storage: Cloudflare R2 or another S3-compatible object storage
Admin mutations: Server Actions where practical, Route Handlers for upload/order API boundaries
Notifications: Telegram Bot API
Deployment: Vercel
```

Why Prisma over Drizzle for this project:

- easier contractor handoff;
- clear schema file;
- mature migration workflow;
- strong compatibility with Auth.js adapters;
- good fit for a small commerce admin panel.

Drizzle is also a valid option, but Prisma is the safer default for a contractor-built MVP where maintainability and onboarding speed matter more than maximum query-level control.

### 3. Source-of-Truth Rules

Allowed production sources:

```text
Products      -> PostgreSQL
Categories    -> PostgreSQL
Images        -> Object storage + image metadata in PostgreSQL
Orders        -> PostgreSQL
Admin users   -> PostgreSQL/Auth.js
Settings      -> PostgreSQL
Telegram config -> environment variables + optional settings table
```

Forbidden production sources after migration:

```text
src/data/catalog.ts
Sanity GROQ queries
Sanity schemas as runtime app model
hardcoded products/categories/prices in React components
```

Sanity is allowed only in:

```text
scripts/migrate-from-sanity.ts
scripts/legacy/*
docs/legacy/*
```

### 4. Proposed Folder Structure

```text
src/
  app/
    (store)/
      layout.tsx
      page.tsx
      catalog/
        page.tsx
      product/
        [slug]/page.tsx
      cart/
        page.tsx
      checkout/
        page.tsx
      order-success/
        [orderNumber]/page.tsx

    admin/
      layout.tsx
      page.tsx
      login/page.tsx
      products/
        page.tsx
        new/page.tsx
        [id]/edit/page.tsx
      categories/
        page.tsx
      orders/
        page.tsx
        [id]/page.tsx
      settings/page.tsx

    api/
      auth/[...nextauth]/route.ts
      orders/route.ts
      admin/
        uploads/presign/route.ts
      telegram/
        webhook/route.ts

  auth.ts

  domain/
    catalog/
      types.ts
      schemas.ts
    cart/
      types.ts
      schemas.ts
    orders/
      types.ts
      schemas.ts
    users/
      types.ts

  application/
    catalog/
      get-products.ts
      get-product-by-slug.ts
      get-categories.ts
      create-product.ts
      update-product.ts
      delete-product.ts
    cart/
      create-order-from-cart.ts
      calculate-cart.ts
    orders/
      get-orders.ts
      get-order-by-id.ts
      update-order-status.ts
    settings/
      get-site-settings.ts
      update-site-settings.ts

  infrastructure/
    db/
      prisma.ts
    storage/
      r2-client.ts
      create-presigned-upload-url.ts
    telegram/
      send-order-notification.ts
      build-telegram-links.ts

  features/
    storefront/
      home/
      catalog/
      product/
      cart/
      checkout/
    admin/
      products/
      categories/
      orders/
      settings/

  components/
    layout/
    commerce/
    admin/
    ui/

  lib/
    cn.ts
    format-money.ts
    slug.ts
    seo.ts
```

### 5. Dependency Rules

Allowed dependencies:

```text
app -> features -> application -> domain
app -> application
application -> infrastructure
application -> domain
features -> components
features -> domain types
components -> domain types only when needed
infrastructure -> external SDKs
```

Forbidden dependencies:

```text
components -> infrastructure/db
components -> infrastructure/storage
components -> infrastructure/telegram
features -> Prisma Client
features -> Telegram Bot API
app route pages -> raw SQL/Prisma queries directly
UI -> database record shapes directly
admin UI -> public storefront data-fetching shortcuts
```

### 6. Database Schema

MVP schema should support one owner now and more roles later.

```prisma
// prisma/schema.prisma

enum UserRole {
  owner
  admin
  editor
}

enum ProductStatus {
  draft
  published
  archived
}

enum ProductAvailability {
  in_stock
  made_to_order
  out_of_stock
}

enum OrderStatus {
  new
  telegram_opened
  contacted
  in_progress
  completed
  cancelled
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  passwordHash  String?
  role          UserRole @default(owner)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  productsCreated Product[] @relation("ProductCreatedBy")
  productsUpdated Product[] @relation("ProductUpdatedBy")
}

model Category {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String?
  sortOrder   Int      @default(100)
  isVisible   Boolean  @default(true)
  seoTitle    String?
  seoDescription String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  products    Product[]
}

model Product {
  id             String              @id @default(cuid())
  title          String
  slug           String              @unique
  shortDescription String?
  description    String?
  priceCents     Int
  currency       String              @default("UAH")
  dimensions     String?
  materials      String[]
  care           String?
  availability   ProductAvailability @default(made_to_order)
  status         ProductStatus        @default(draft)
  isFeatured     Boolean             @default(false)
  isNew          Boolean             @default(false)
  sortOrder      Int                 @default(100)
  seoTitle       String?
  seoDescription String?
  categoryId     String
  createdById    String?
  updatedById    String?
  createdAt      DateTime            @default(now())
  updatedAt      DateTime            @updatedAt

  category       Category            @relation(fields: [categoryId], references: [id])
  images         ProductImage[]
  variants       ProductVariant[]
  orderItems     OrderItem[]
  createdBy      User?               @relation("ProductCreatedBy", fields: [createdById], references: [id])
  updatedBy      User?               @relation("ProductUpdatedBy", fields: [updatedById], references: [id])

  @@index([categoryId])
  @@index([status, availability])
}

model ProductImage {
  id          String   @id @default(cuid())
  productId   String
  storageKey  String
  publicUrl   String
  alt         String
  width       Int?
  height      Int?
  sortOrder   Int      @default(100)
  createdAt   DateTime @default(now())

  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
}

model ProductVariant {
  id           String              @id @default(cuid())
  productId    String
  title        String
  sku          String?
  priceCents   Int?
  size         String?
  color        String?
  availability ProductAvailability @default(made_to_order)
  sortOrder    Int                 @default(100)
  createdAt    DateTime            @default(now())
  updatedAt    DateTime            @updatedAt

  product      Product             @relation(fields: [productId], references: [id], onDelete: Cascade)
  orderItems   OrderItem[]

  @@index([productId])
}

model Order {
  id                String      @id @default(cuid())
  orderNumber       String      @unique
  status            OrderStatus @default(new)
  customerName      String
  customerTelegram  String?
  customerPhone     String?
  customerComment   String?
  subtotalCents     Int
  currency          String      @default("UAH")
  telegramOpenedAt  DateTime?
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  items             OrderItem[]

  @@index([status, createdAt])
}

model OrderItem {
  id                    String  @id @default(cuid())
  orderId               String
  productId             String?
  productVariantId      String?
  productTitleSnapshot  String
  variantTitleSnapshot  String?
  unitPriceCentsSnapshot Int
  quantity              Int
  lineTotalCents        Int

  order                 Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product               Product? @relation(fields: [productId], references: [id], onDelete: SetNull)
  productVariant        ProductVariant? @relation(fields: [productVariantId], references: [id], onDelete: SetNull)

  @@index([orderId])
  @@index([productId])
}

model SiteSettings {
  id                String   @id @default("site")
  brandName          String
  defaultLocale      String   @default("uk")
  telegramUsername   String?
  telegramBotChatId  String?
  email              String?
  phone              String?
  instagramUrl       String?
  facebookUrl        String?
  defaultSeoTitle    String?
  defaultSeoDescription String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}
```

Notes:

- Money is stored as integer cents to avoid floating-point price errors.
- `OrderItem` stores product title and price snapshots so historical orders do not change when product data is edited later.
- `ProductImage.publicUrl` is stored for rendering, while `storageKey` is stored for delete/replace operations.
- Auth.js adapter tables can be added if using OAuth/magic-link sessions. For a single-owner credentials MVP, `User` plus secure session handling is enough, but Auth.js integration should be used instead of a custom cookie system.

### 7. Cart Design

MVP cart should be guest-only and browser-persistent.

```text
Browser localStorage
  -> cart items: productId, variantId, quantity
  -> checkout page fetches latest product data by IDs
  -> server recalculates prices
  -> creates Order + OrderItems
```

Important rule:

```text
Client cart totals are display-only. Server recalculates all prices before creating the order.
```

This avoids trusting manipulated browser state.

Cart item type:

```ts
export type CartItemInput = {
  productId: string;
  variantId?: string;
  quantity: number;
};

export type CreateOrderInput = {
  customerName: string;
  customerTelegram?: string;
  customerPhone?: string;
  customerComment?: string;
  items: CartItemInput[];
};
```

### 8. Order and Telegram Flow

```plantuml
@startuml
actor Customer
participant "Storefront" as Store
participant "Cart" as Cart
participant "Next.js /api/orders" as API
participant "Application Service" as Service
participant "PostgreSQL" as DB
participant "Telegram Bot API" as TG
participant "Owner" as Owner

Customer -> Store: Add product to cart
Store -> Cart: Save item locally
Customer -> Store: Submit checkout form
Store -> API: POST customer info + cart items
API -> Service: createOrderFromCart(input)
Service -> DB: Load products and variants
Service -> Service: Recalculate totals
Service -> DB: Create Order + OrderItems
Service -> TG: Send owner notification
TG -> Owner: New order message
API -> Store: orderNumber + telegram link
Store -> Customer: Show success page + Open Telegram button
Customer -> TG: Opens chat with owner
Store -> API: Optional mark telegram_opened
API -> DB: Update order status
@enduml
```

Telegram message to owner should include:

```text
New order #{orderNumber}
Customer: name
Telegram: @username if provided
Phone: optional
Items:
- Product title x quantity — price
Comment: optional
Admin link: /admin/orders/{id}
```

Client Telegram link should be built from `SiteSettings.telegramUsername`:

```text
https://t.me/{telegramUsername}?text={encodedMessage}
```

If Telegram username is missing, the success page should still show the order number and tell the customer that the owner will contact them.

### 9. Admin Panel Structure

MVP admin sections:

```text
/admin
  Dashboard:
    - products count
    - published products count
    - new orders count
    - latest orders

/admin/products
  - list
  - search
  - filter by status/category/availability
  - create/edit/delete/archive
  - upload/reorder images

/admin/categories
  - create/edit/delete/hide
  - sort order

/admin/orders
  - list orders
  - filter by status
  - open order details
  - update status
  - copy/open Telegram contact

/admin/settings
  - brand name
  - Telegram username
  - email/phone/social links
  - default SEO
```

### 10. Admin Auth

MVP decision:

```text
One owner account, seeded by script or created through a protected one-time setup route.
```

Recommended implementation:

```text
Auth.js
  -> /admin/login
  -> protected /admin routes
  -> require role in {owner, admin, editor}
  -> MVP seeds only one owner
```

Authorization rule:

```ts
export function assertAdmin(user: { role?: string } | null) {
  if (!user || !["owner", "admin", "editor"].includes(user.role ?? "")) {
    throw new Error("Unauthorized");
  }
}
```

For MVP, only `owner` exists. `admin` and `editor` remain in the schema for future expansion.

### 11. Image Upload Flow

Use direct-to-storage uploads so large image files do not pass through the Next.js serverless function body.

```plantuml
@startuml
actor Owner
participant "Admin UI" as UI
participant "Next.js /api/admin/uploads/presign" as API
participant "R2/S3" as Storage
participant "PostgreSQL" as DB

Owner -> UI: Select image
UI -> API: Request presigned PUT URL
API -> API: Verify admin session
API -> Storage: Generate short-lived upload URL
API -> UI: Return upload URL + storageKey
UI -> Storage: PUT image file
UI -> API: Save product image metadata
API -> DB: Store publicUrl, storageKey, alt, sortOrder
@enduml
```

Rules:

- accept only image MIME types;
- limit max file size;
- require alt text before publishing product;
- store image metadata in PostgreSQL;
- use Next.js Image for rendering public image URLs;
- optionally add background compression later.

### 12. Storefront Rendering and Caching

Core pages:

```text
/                         -> featured products + categories
/catalog                  -> published products + categories
/product/[slug]           -> product detail
/cart                     -> client cart UI
/checkout                 -> checkout form
/order-success/[number]   -> confirmation and Telegram CTA
```

Cache tags:

```text
products
product:{slug}
categories
settings
orders-admin
```

Admin mutations should revalidate affected tags/paths:

```text
create/update/archive product -> products, product:{slug}, /catalog, /product/{slug}, /
create/update category        -> categories, /catalog, /
update settings               -> settings, layout-dependent pages
create order                  -> orders-admin only
```

### 13. Application Services

Examples:

```ts
// src/application/catalog/get-products.ts
export async function getPublishedProducts(filters?: ProductFilters) {
  const products = await productRepository.findPublished(filters);
  return products.map(productSchema.parse);
}
```

```ts
// src/application/cart/create-order-from-cart.ts
export async function createOrderFromCart(input: CreateOrderInput) {
  const parsed = createOrderInputSchema.parse(input);

  const products = await productRepository.findOrderableProducts(parsed.items);
  const calculated = calculateCart({ items: parsed.items, products });

  const order = await orderRepository.createFromCalculatedCart({
    customer: parsed,
    calculated,
  });

  await sendOrderNotification(order);

  return order;
}
```

Service rules:

- services validate input with Zod;
- services return domain DTOs, not Prisma records;
- services own business logic;
- UI only calls services/actions, not repositories directly;
- repositories are infrastructure details.

### 14. Migration From Current Architecture

The previous SPEC correctly identified the architecture smell: production pages must not depend on multiple data sources or leak infrastructure details into UI.

New migration direction:

```text
src/data/catalog.ts + Sanity
  -> migration script
    -> PostgreSQL
      -> application services
        -> storefront + admin
```

Migration tasks:

```text
1. Export existing Sanity products/categories if needed.
2. Normalize images and upload/copy them to R2/S3.
3. Insert categories into PostgreSQL.
4. Insert products into PostgreSQL.
5. Insert product images and variants.
6. Verify slugs and SEO fields.
7. Switch storefront reads to application services backed by PostgreSQL.
8. Remove production reads from Sanity and src/data/catalog.ts.
```

Acceptance rule:

```text
A product should be editable in the new admin panel and immediately affect the storefront without changing code or Sanity content.
```

### 15. Architecture Diagram

```plantuml
@startuml
skinparam componentStyle rectangle

package "Next.js App Router" {
  [Public Storefront]
  [Admin Panel]
  [Route Handlers]
  [Server Actions]
}

package "Feature Modules" {
  [Catalog UI]
  [Product UI]
  [Cart UI]
  [Checkout UI]
  [Admin Products UI]
  [Admin Orders UI]
}

package "Application Services" {
  [Catalog Service]
  [Product Admin Service]
  [Cart/Order Service]
  [Settings Service]
}

package "Domain" {
  [Product]
  [Category]
  [Cart]
  [Order]
  [User Role]
  [Zod Schemas]
}

package "Infrastructure" {
  [Prisma Repositories]
  [PostgreSQL]
  [R2/S3 Storage]
  [Telegram Bot API]
  [Auth.js]
}

[Public Storefront] --> [Catalog UI]
[Public Storefront] --> [Product UI]
[Public Storefront] --> [Cart UI]
[Public Storefront] --> [Checkout UI]
[Admin Panel] --> [Admin Products UI]
[Admin Panel] --> [Admin Orders UI]

[Catalog UI] --> [Catalog Service]
[Product UI] --> [Catalog Service]
[Cart UI] --> [Cart/Order Service]
[Checkout UI] --> [Cart/Order Service]
[Admin Products UI] --> [Product Admin Service]
[Admin Orders UI] --> [Cart/Order Service]

[Catalog Service] --> [Product]
[Catalog Service] --> [Category]
[Product Admin Service] --> [Product]
[Cart/Order Service] --> [Cart]
[Cart/Order Service] --> [Order]

[Catalog Service] --> [Prisma Repositories]
[Product Admin Service] --> [Prisma Repositories]
[Cart/Order Service] --> [Prisma Repositories]
[Product Admin Service] --> [R2/S3 Storage]
[Cart/Order Service] --> [Telegram Bot API]
[Admin Panel] --> [Auth.js]
[Prisma Repositories] --> [PostgreSQL]
@enduml
```



## Implementation

### Phase 0 — Freeze Current Architecture Problem

Goal: не начинать новую админку поверх старого раздвоения данных.

Tasks:

```bash
git checkout -b architecture/fullstack-admin-migration
npm run lint
npm run build
```

Create:

```text
docs/architecture.md
```

Add rules:

```text
- PostgreSQL is the only future production source of truth.
- Sanity is legacy/migration-only after cutover.
- src/data/catalog.ts is seed/test-only after cutover.
- UI must not import Prisma, storage SDKs or Telegram SDK/API helpers.
- Storefront and admin must access data through application services.
```

Acceptance criteria:

- Current build state is known.
- Existing data sources are documented.
- Team agrees that the migration target is PostgreSQL, not Sanity.

---

### Phase 1 — Add Database and Prisma Foundation

Goal: introduce PostgreSQL schema before changing the UI.

Tasks:

```bash
npm install prisma @prisma/client
npx prisma init
```

Create or update:

```text
prisma/schema.prisma
src/infrastructure/db/prisma.ts
.env.example
```

`.env.example`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
OWNER_EMAIL="owner@example.com"
OWNER_INITIAL_PASSWORD="change-me-before-production"
TELEGRAM_BOT_TOKEN=""
TELEGRAM_OWNER_CHAT_ID=""
NEXT_PUBLIC_TELEGRAM_USERNAME=""
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME=""
R2_PUBLIC_BASE_URL=""
```

`src/infrastructure/db/prisma.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

Commands:

```bash
npx prisma migrate dev --name init_fullstack_schema
npx prisma generate
```

Production deploy command:

```bash
npx prisma migrate deploy
```

Acceptance criteria:

- Prisma schema exists.
- Initial migration exists.
- Local database can be migrated.
- `npx prisma studio` opens and shows core tables.

---

### Phase 2 — Seed One Owner Account

Goal: make admin access possible without public registration.

Tasks:

```bash
npm install bcryptjs
npm install -D @types/bcryptjs tsx
```

Create:

```text
scripts/seed-owner.ts
```

Example:

```ts
import bcrypt from "bcryptjs";
import { prisma } from "../src/infrastructure/db/prisma";

async function main() {
  const email = process.env.OWNER_EMAIL;
  const password = process.env.OWNER_INITIAL_PASSWORD;

  if (!email || !password) {
    throw new Error("OWNER_EMAIL and OWNER_INITIAL_PASSWORD are required");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "owner" },
    create: {
      email,
      passwordHash,
      role: "owner",
      name: "Owner",
    },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
```

Add package script:

```json
{
  "scripts": {
    "db:seed-owner": "tsx scripts/seed-owner.ts"
  }
}
```

Acceptance criteria:

- One owner can be created from environment variables.
- There is no public signup page.
- Password is hashed before storage.

---

### Phase 3 — Implement Auth.js Credentials Login

Goal: protect `/admin` with email/password login.

Tasks:

```bash
npm install next-auth
```

Create:

```text
src/auth.ts
src/app/api/auth/[...nextauth]/route.ts
src/app/admin/login/page.tsx
src/middleware.ts
```

`src/auth.ts`:

```ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/infrastructure/db/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);

        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
```

`src/app/api/auth/[...nextauth]/route.ts`:

```ts
export { GET, POST } from "@/auth";
```

Admin layout guard:

```tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "owner") {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
```

Acceptance criteria:

- `/admin` redirects anonymous users to `/admin/login`.
- Owner can log in with email/password.
- Non-owner roles are not needed in MVP, but schema supports them.

---

### Phase 4 — Create Domain Schemas and DTOs

Goal: keep UI independent from Prisma record shapes.

Create:

```text
src/domain/catalog/types.ts
src/domain/catalog/schemas.ts
src/domain/cart/types.ts
src/domain/cart/schemas.ts
src/domain/orders/types.ts
src/domain/orders/schemas.ts
```

Core domain types:

```ts
export type Money = {
  amountCents: number;
  currency: "UAH";
};

export type ProductAvailability = "in_stock" | "made_to_order" | "out_of_stock";
export type ProductStatus = "draft" | "published" | "archived";

export type ProductVariant = {
  id: string;
  title: string;
  sku?: string | null;
  price: Money;
  size?: string | null;
  color?: string | null;
  availability: ProductAvailability;
  sortOrder: number;
};

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  sortOrder: number;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  price: Money;
  category: {
    id: string;
    title: string;
    slug: string;
  };
  images: ProductImage[];
  variants: ProductVariant[];
  availability: ProductAvailability;
  status: ProductStatus;
  isFeatured: boolean;
  isNew: boolean;
};
```

Cart input schema:

```ts
import { z } from "zod";

export const cartItemInputSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1).optional(),
  quantity: z.number().int().min(1).max(99),
});

export const createOrderInputSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerTelegram: z.string().max(64).optional(),
  customerPhone: z.string().max(32).optional(),
  customerComment: z.string().max(1000).optional(),
  items: z.array(cartItemInputSchema).min(1),
});
```

Acceptance criteria:

- UI imports domain DTOs, not Prisma types.
- Order inputs are validated before DB writes.
- Cart totals are calculated on the server.

---

### Phase 5 — Build Product and Category Admin CRUD

Goal: replace Sanity Studio for catalog management.

Create services:

```text
src/application/catalog/create-product.ts
src/application/catalog/update-product.ts
src/application/catalog/archive-product.ts
src/application/catalog/get-admin-products.ts
src/application/catalog/create-category.ts
src/application/catalog/update-category.ts
```

Admin pages:

```text
src/app/admin/products/page.tsx
src/app/admin/products/new/page.tsx
src/app/admin/products/[id]/edit/page.tsx
src/app/admin/categories/page.tsx
```

Product form fields:

```text
title
slug
category
shortDescription
description
price
availability
status
isFeatured
isNew
dimensions
materials
care
SEO title
SEO description
images
variants[]
```

Variant form fields:

```text
title
sku
size
color
price override
availability
sortOrder
```

Rules:

- product can be saved as `draft` without images;
- product cannot be published without category, price, at least one image and slug;
- variant price is optional; if missing, use product base price;
- deleting a product should default to archive, not hard delete;
- slug must be unique.

Acceptance criteria:

- Owner can create/edit/archive products.
- Owner can create/edit/hide categories.
- Storefront only shows `published` products and visible categories.

---

### Phase 6 — Implement Image Uploads to R2/S3

Goal: replace Sanity image management.

Install:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

Create:

```text
src/infrastructure/storage/r2-client.ts
src/infrastructure/storage/create-presigned-upload-url.ts
src/app/api/admin/uploads/presign/route.ts
```

Upload rules:

```text
allowed MIME: image/jpeg, image/png, image/webp, image/avif
max size MVP: 8 MB
path format: products/{productId}/{randomId}.{ext}
presigned URL expiry: short, e.g. 5 minutes
```

Route handler flow:

```text
1. Verify admin session.
2. Validate filename, MIME type and size.
3. Generate storage key.
4. Generate presigned PUT URL.
5. Return uploadUrl, storageKey, publicUrl.
6. Admin UI uploads directly to storage.
7. Product form saves ProductImage metadata to PostgreSQL.
```

Acceptance criteria:

- Large files do not pass through the Next.js server.
- Owner can upload product images from admin form.
- Product images render on storefront from public object URL.
- R2/S3 CORS is configured for browser uploads.

---

### Phase 7 — Migrate Data From Sanity and/or Static Catalog

Goal: move existing content into PostgreSQL.

Create:

```text
scripts/migrate-from-sanity.ts
scripts/migrate-from-static-catalog.ts
```

Migration order:

```text
1. Categories
2. Products
3. Product images
4. Product variants if available
5. Site settings
6. SEO fields
```

Migration rules:

- preserve existing slugs to avoid SEO breakage;
- deduplicate categories by slug;
- convert prices to integer cents;
- map old `inStock: boolean` to `in_stock` or `out_of_stock`;
- map missing availability to `made_to_order`;
- copy image metadata where possible;
- log every skipped or incomplete product.

Acceptance criteria:

- Existing catalog appears in PostgreSQL.
- Slugs match the old storefront URLs.
- Storefront can render migrated products from application services.
- Sanity is no longer needed for normal content editing.

---

### Phase 8 — Switch Storefront to PostgreSQL Services

Goal: make public pages read from the new source of truth.

Update:

```text
src/app/(store)/page.tsx
src/app/(store)/catalog/page.tsx
src/app/(store)/product/[slug]/page.tsx
src/features/storefront/*
```

Service examples:

```text
getPublishedProducts()
getFeaturedProducts()
getProductBySlug(slug)
getProductSlugs()
getVisibleCategories()
getSiteSettings()
```

Rules:

- no public page imports Sanity;
- no public page imports `src/data/catalog.ts`;
- route files fetch through application services;
- services return domain DTOs;
- UI renders only DTOs.

Acceptance criteria:

- Home, catalog and product pages render from PostgreSQL.
- Product pages still have SEO metadata.
- Missing product returns 404.
- `npm run build` passes.

---

### Phase 9 — Build Cart and Checkout

Goal: support multi-item order without online payment.

Create:

```text
src/features/storefront/cart/cart-provider.tsx
src/features/storefront/cart/cart-drawer.tsx
src/features/storefront/cart/use-cart.ts
src/app/(store)/cart/page.tsx
src/app/(store)/checkout/page.tsx
src/app/api/orders/route.ts
src/application/cart/calculate-cart.ts
src/application/cart/create-order-from-cart.ts
```

Cart behavior:

```text
- cart stored in localStorage;
- add-to-cart works from product page and product card if appropriate;
- cart supports quantity update/remove;
- checkout loads latest server product data;
- unavailable products are blocked at checkout;
- server recalculates final totals;
- successful checkout clears local cart.
```

Checkout fields:

```text
customerName: required
customerTelegram: optional but recommended
customerPhone: optional fallback
customerComment: optional
```

Order number generation:

```text
PV-YYYYMMDD-XXXX
```

Acceptance criteria:

- Customer can add multiple products to cart.
- Customer can submit order without creating an account.
- Order and order items are stored in PostgreSQL.
- Price snapshots are stored on order items.

---

### Phase 10 — Add Telegram Notification and Customer CTA

Goal: move communication to Telegram.

Create:

```text
src/infrastructure/telegram/send-order-notification.ts
src/infrastructure/telegram/build-telegram-links.ts
```

Owner notification:

```ts
export async function sendOrderNotification(input: {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerTelegram?: string | null;
  customerPhone?: string | null;
  totalText: string;
  itemsText: string;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_OWNER_CHAT_ID;

  if (!token || !chatId) {
    return;
  }

  const text = [
    `New order ${input.orderNumber}`,
    `Customer: ${input.customerName}`,
    input.customerTelegram ? `Telegram: ${input.customerTelegram}` : null,
    input.customerPhone ? `Phone: ${input.customerPhone}` : null,
    "",
    input.itemsText,
    "",
    `Total: ${input.totalText}`,
    `${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders/${input.orderId}`,
  ]
    .filter(Boolean)
    .join("
");

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });
}
```

Customer CTA:

```ts
export function buildCustomerTelegramUrl(input: {
  telegramUsername: string;
  orderNumber: string;
}) {
  const message = encodeURIComponent(
    `Добрий день! Я оформив(ла) замовлення ${input.orderNumber}.`
  );

  return `https://t.me/${input.telegramUsername}?text=${message}`;
}
```

Acceptance criteria:

- Owner receives Telegram message after order creation.
- Customer sees Telegram button on success page.
- If Telegram config is missing, order still gets created.
- Admin can update order status to `telegram_opened` or `contacted`.

---

### Phase 11 — Build Orders Admin

Goal: make order management possible without external tools.

Create:

```text
src/app/admin/orders/page.tsx
src/app/admin/orders/[id]/page.tsx
src/application/orders/get-orders.ts
src/application/orders/get-order-by-id.ts
src/application/orders/update-order-status.ts
```

Order list columns:

```text
orderNumber
createdAt
customerName
customerTelegram/customerPhone
items count
total
status
```

Order detail:

```text
customer info
items with snapshots
current product links if product still exists
comment
status history later
admin notes later
```

Acceptance criteria:

- Owner can see all orders.
- Owner can filter by status.
- Owner can update order status.
- Owner can open Telegram contact quickly.

---

### Phase 12 — Remove Sanity From Production Path

Goal: finish the architectural cutover.

Tasks:

```text
- remove Sanity reads from storefront;
- remove Sanity Studio route if no longer needed;
- move Sanity files to legacy folder or delete them;
- remove unused Sanity packages after confirming no imports remain;
- quarantine src/data/catalog.ts as test fixture or delete it.
```

Search checks:

```bash
rg "sanity|next-sanity|groq|defineQuery" src/app src/features src/application src/components
rg "src/data/catalog|@/data/catalog" src/app src/features src/application src/components
rg "prisma" src/components src/features
```

Expected:

```text
- no production storefront/admin read from Sanity;
- no production page reads from static catalog;
- Prisma appears only in infrastructure/repository/service boundaries;
- UI does not import Prisma directly.
```

Acceptance criteria:

- PostgreSQL is the only editable production catalog source.
- Admin panel replaces Sanity Studio for product/category/order work.
- Build and lint pass.

---

### Phase 13 — Production Deployment on Vercel

Goal: deploy stable full-stack MVP.

Vercel environment variables:

```text
DATABASE_URL
AUTH_SECRET
NEXT_PUBLIC_SITE_URL
TELEGRAM_BOT_TOKEN
TELEGRAM_OWNER_CHAT_ID
NEXT_PUBLIC_TELEGRAM_USERNAME
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
R2_PUBLIC_BASE_URL
```

Deployment steps:

```text
1. Create managed PostgreSQL database.
2. Create R2/S3 bucket and public image domain.
3. Configure R2/S3 CORS for browser uploads.
4. Set Vercel environment variables.
5. Run prisma migrate deploy in deployment pipeline.
6. Run owner seed once with secure temporary password.
7. Change owner password after first login.
8. Test admin login.
9. Test image upload.
10. Test product publish.
11. Test cart checkout.
12. Test Telegram notification.
```

Acceptance criteria:

- Production site renders from PostgreSQL.
- Owner can manage products from `/admin`.
- Customer can place cart order.
- Owner receives Telegram notification.
- No Sanity dependency is needed for production operations.

## Milestones

### Milestone 1 — Full-stack Foundation

Includes:

```text
Phase 0 — Freeze Current Architecture Problem
Phase 1 — Add Database and Prisma Foundation
Phase 2 — Seed One Owner Account
Phase 3 — Implement Auth.js Credentials Login
Phase 4 — Create Domain Schemas and DTOs
```

Done when:

```text
- PostgreSQL schema exists.
- Owner login works.
- /admin is protected.
- Domain DTOs exist.
- Build and lint pass.
```

Risk: medium. Main risk is auth/session correctness.

---

### Milestone 2 — Admin Catalog Replacement

Includes:

```text
Phase 5 — Build Product and Category Admin CRUD
Phase 6 — Implement Image Uploads to R2/S3
```

Done when:

```text
- Owner can create/edit/archive products.
- Owner can manage categories.
- Owner can upload product images.
- Product variants can be created and edited.
```

Risk: high. Main risk is product form complexity and image handling.

---

### Milestone 3 — Data Migration and Storefront Cutover

Includes:

```text
Phase 7 — Migrate Data From Sanity and/or Static Catalog
Phase 8 — Switch Storefront to PostgreSQL Services
```

Done when:

```text
- Existing catalog is in PostgreSQL.
- Home/catalog/product pages read from PostgreSQL.
- Slugs remain stable.
- No storefront page reads Sanity or src/data/catalog.ts.
```

Risk: high. Main risk is broken product URLs or incomplete migrated image data.

---

### Milestone 4 — Cart, Orders and Telegram

Includes:

```text
Phase 9 — Build Cart and Checkout
Phase 10 — Add Telegram Notification and Customer CTA
Phase 11 — Build Orders Admin
```

Done when:

```text
- Customer can create multi-item order from cart.
- Server recalculates totals.
- Order is stored with price snapshots.
- Owner receives Telegram notification.
- Owner can manage order statuses in admin.
```

Risk: medium. Main risk is order integrity and edge cases around unavailable products.

---

### Milestone 5 — Production Hardening and Sanity Removal

Includes:

```text
Phase 12 — Remove Sanity From Production Path
Phase 13 — Production Deployment on Vercel
```

Done when:

```text
- Sanity is not required for production.
- Static catalog is deleted or quarantined.
- Production deployment works on Vercel.
- Admin/product/cart/order flows pass QA.
```

Risk: medium. Main risk is hidden imports from old architecture.

## Gathering Results

### 1. Architecture Validation

Run:

```bash
npm run lint
npm run build
rg "sanity|next-sanity|groq|defineQuery" src/app src/features src/application src/components
rg "src/data/catalog|@/data/catalog" src/app src/features src/application src/components
rg "prisma" src/components src/features
```

Pass criteria:

```text
- No production UI imports Sanity.
- No production UI imports static catalog.
- No feature/component imports Prisma directly.
- Storefront and admin use application services.
```

### 2. Admin Validation

Test cases:

| Scenario | Expected Result |
|---|---|
| Anonymous user opens `/admin` | Redirected to `/admin/login` |
| Owner logs in | Dashboard opens |
| Owner creates draft product | Product saved but hidden from storefront |
| Owner publishes valid product | Product appears in catalog |
| Owner publishes product without image | Validation blocks publish |
| Owner archives product | Product disappears from storefront |
| Owner creates variant | Variant is selectable/orderable |
| Owner uploads image | Image appears on product page |

### 3. Storefront Validation

Test cases:

| Scenario | Expected Result |
|---|---|
| Open home page | Featured PostgreSQL products render |
| Open catalog | Published products render |
| Open product slug | Product detail renders with variants |
| Open missing product slug | 404 |
| Add product to cart | Cart count updates |
| Change quantity | Totals update client-side |
| Submit checkout | Server creates order and recalculates totals |
| Product price changed before checkout | Server uses latest price |
| Product becomes unavailable before checkout | Checkout blocks item |

### 4. Telegram Validation

Test cases:

| Scenario | Expected Result |
|---|---|
| Valid bot token and chat ID | Owner receives new order message |
| Missing bot token | Order still created, notification skipped/logged |
| Customer clicks Telegram CTA | Telegram opens prefilled message |
| Owner changes order status | Status updates in admin |

### 5. Production Readiness Checklist

```text
[ ] PostgreSQL is production source of truth.
[ ] Sanity is removed from production reads.
[ ] Static catalog is deleted or quarantined.
[ ] Owner login works.
[ ] Product CRUD works.
[ ] Category CRUD works.
[ ] Variant CRUD works.
[ ] Image upload works.
[ ] Cart works.
[ ] Checkout creates order.
[ ] Telegram owner notification works.
[ ] Orders admin works.
[ ] Product SEO metadata works.
[ ] Slugs are stable.
[ ] Build passes.
[ ] Lint passes.
[ ] Vercel env vars are configured.
[ ] Prisma production migrations run with `migrate deploy`.
```

### 6. Success Definition

The project is successful when it moves from:

```text
Next.js storefront with Sanity/static-data dependency
```

to:

```text
Full-stack Next.js commerce app with PostgreSQL-backed admin panel
```

where:

- owner manages products, categories, variants and images in `/admin`;
- customers can add products to cart and submit an order;
- owner receives Telegram notifications;
- Sanity is not required for production;
- UI receives clean domain models;
- database writes go through validated application services;
- contractors can implement future features without reintroducing source-of-truth duplication.

## Contractor-ready Backlog

### Epic 1 — Full-stack Foundation

#### Issue 1.1 — Create architecture branch and baseline checks

**Goal:** зафиксировать текущее рабочее состояние перед миграцией.

**Depends on:** none.

**Files:**

```text
docs/architecture.md
.env.example
README.md
```

**Tasks:**

```text
- Create branch: architecture/fullstack-admin-migration.
- Run npm run lint.
- Run npm run build.
- Document current data sources: Sanity, static catalog, hardcoded config.
- Add architecture rules to docs/architecture.md.
- Add initial .env.example for database, auth, Telegram and R2/S3.
```

**Acceptance Criteria:**

```text
- npm run lint result is known and documented.
- npm run build result is known and documented.
- docs/architecture.md states PostgreSQL as future production source of truth.
- docs/architecture.md explicitly marks Sanity and src/data/catalog.ts as legacy/migration sources.
- .env.example contains DATABASE_URL, AUTH_SECRET, owner credentials, Telegram and R2/S3 variables.
```

---

#### Issue 1.2 — Add Prisma and PostgreSQL schema

**Goal:** create the database foundation for products, categories, variants, orders, settings and users.

**Depends on:** Issue 1.1.

**Files:**

```text
prisma/schema.prisma
src/infrastructure/db/prisma.ts
package.json
.env.example
```

**Tasks:**

```text
- Install prisma and @prisma/client.
- Initialize Prisma.
- Add User, Category, Product, ProductImage, ProductVariant, Order, OrderItem and SiteSettings models.
- Add enums: UserRole, ProductStatus, ProductAvailability, OrderStatus.
- Add indexes for product category/status and order status/createdAt.
- Add reusable Prisma client singleton for Next.js development.
- Generate initial migration.
```

**Acceptance Criteria:**

```text
- npx prisma generate succeeds.
- npx prisma migrate dev --name init_fullstack_schema succeeds locally.
- npx prisma studio opens and shows all expected tables.
- Money is stored as integer cents.
- OrderItem stores product title and price snapshots.
```

---

#### Issue 1.3 — Seed one owner account

**Goal:** create the initial owner without public registration.

**Depends on:** Issue 1.2.

**Files:**

```text
scripts/seed-owner.ts
package.json
.env.example
```

**Tasks:**

```text
- Install bcryptjs and tsx.
- Create seed-owner script.
- Read OWNER_EMAIL and OWNER_INITIAL_PASSWORD from env.
- Hash password with bcrypt before storing.
- Upsert owner user with role owner.
- Add npm script db:seed-owner.
```

**Acceptance Criteria:**

```text
- npm run db:seed-owner creates or updates one owner user.
- Password is never stored as plain text.
- Re-running the script is idempotent.
- No public signup route exists.
```

---

#### Issue 1.4 — Implement Auth.js email/password admin login

**Goal:** protect `/admin` with owner login.

**Depends on:** Issue 1.3.

**Files:**

```text
src/auth.ts
src/app/api/auth/[...nextauth]/route.ts
src/app/admin/login/page.tsx
src/app/admin/layout.tsx
src/middleware.ts
src/types/next-auth.d.ts
```

**Tasks:**

```text
- Install next-auth.
- Configure Credentials provider.
- Validate login input with Zod.
- Compare password with bcrypt.
- Add role to JWT/session.
- Create /admin/login page.
- Redirect unauthenticated users from /admin to /admin/login.
- Allow only owner for MVP.
```

**Acceptance Criteria:**

```text
- Anonymous user opening /admin is redirected to /admin/login.
- Owner can log in with seeded email/password.
- Wrong credentials return safe error.
- Session includes user role.
- /admin pages are inaccessible without a valid session.
```

---

#### Issue 1.5 — Add domain DTOs and validation schemas

**Goal:** prevent Prisma record shapes from leaking into UI.

**Depends on:** Issue 1.2.

**Files:**

```text
src/domain/catalog/types.ts
src/domain/catalog/schemas.ts
src/domain/cart/types.ts
src/domain/cart/schemas.ts
src/domain/orders/types.ts
src/domain/orders/schemas.ts
src/domain/users/types.ts
```

**Tasks:**

```text
- Define Product, Category, ProductImage, ProductVariant and Money DTOs.
- Define CartItemInput and CreateOrderInput.
- Define Order and OrderItem DTOs.
- Add Zod schemas for product forms and checkout input.
- Keep domain layer free from React, Next.js, Prisma and Telegram imports.
```

**Acceptance Criteria:**

```text
- Domain files do not import Prisma.
- Domain files do not import React or Next.js.
- Cart item quantity is validated.
- Checkout requires customerName and at least one cart item.
- Product publish validation requires slug, category, price and image.
```

---

### Epic 2 — Admin Catalog Replacement

#### Issue 2.1 — Build category admin CRUD

**Goal:** allow owner to manage product categories without Sanity.

**Depends on:** Issues 1.4, 1.5.

**Files:**

```text
src/app/admin/categories/page.tsx
src/features/admin/categories/category-list.tsx
src/features/admin/categories/category-form.tsx
src/application/catalog/create-category.ts
src/application/catalog/update-category.ts
src/application/catalog/delete-category.ts
src/application/catalog/get-admin-categories.ts
src/lib/slug.ts
```

**Tasks:**

```text
- Create category list page.
- Add create/edit form.
- Generate slug from title.
- Allow manual slug editing.
- Validate unique slug.
- Support isVisible and sortOrder.
- Prevent hard delete if products are attached, unless explicitly handled.
```

**Acceptance Criteria:**

```text
- Owner can create category.
- Owner can edit category title, slug, visibility and sort order.
- Duplicate slug is blocked.
- Hidden category does not appear in public storefront.
- Category with products is not accidentally hard-deleted.
```

---

#### Issue 2.2 — Build product admin list

**Goal:** give owner a searchable product management table.

**Depends on:** Issues 1.4, 1.5, 2.1.

**Files:**

```text
src/app/admin/products/page.tsx
src/features/admin/products/product-table.tsx
src/features/admin/products/product-filters.tsx
src/application/catalog/get-admin-products.ts
```

**Tasks:**

```text
- Create products table.
- Show title, category, price, status, availability, variants count and updatedAt.
- Add filters by status, category and availability.
- Add search by title/slug.
- Add links to create and edit product pages.
```

**Acceptance Criteria:**

```text
- Owner can see all products including drafts and archived products.
- Filters work.
- Search works.
- Product rows link to edit page.
- Public storefront rules are not reused for admin list.
```

---

#### Issue 2.3 — Build product create/edit form

**Goal:** replace Sanity product editing with a custom admin form.

**Depends on:** Issues 2.1, 2.2.

**Files:**

```text
src/app/admin/products/new/page.tsx
src/app/admin/products/[id]/edit/page.tsx
src/features/admin/products/product-form.tsx
src/features/admin/products/product-variant-editor.tsx
src/application/catalog/create-product.ts
src/application/catalog/update-product.ts
src/application/catalog/archive-product.ts
src/application/catalog/get-admin-product-by-id.ts
```

**Tasks:**

```text
- Add product create page.
- Add product edit page.
- Support title, slug, category, descriptions, price, status and availability.
- Support dimensions, materials and care.
- Support isFeatured and isNew.
- Support SEO title and SEO description.
- Support variants: title, sku, size, color, price override, availability and sortOrder.
- Archive instead of hard delete by default.
```

**Acceptance Criteria:**

```text
- Owner can create draft product.
- Owner can publish product only when required fields are valid.
- Product slug is unique.
- Variant can be added, edited and removed.
- Variant price override is optional.
- Archived product disappears from storefront but remains visible in admin.
```

---

#### Issue 2.4 — Implement direct image upload to R2/S3

**Goal:** replace Sanity asset management.

**Depends on:** Issue 2.3.

**Files:**

```text
src/infrastructure/storage/r2-client.ts
src/infrastructure/storage/create-presigned-upload-url.ts
src/app/api/admin/uploads/presign/route.ts
src/features/admin/products/product-image-uploader.tsx
src/application/catalog/update-product-images.ts
```

**Tasks:**

```text
- Install AWS S3 SDK packages.
- Configure R2/S3 client.
- Create presign route protected by admin session.
- Validate MIME type and size.
- Generate storage key under products/{productId}/.
- Return uploadUrl, storageKey and publicUrl.
- Upload directly from browser to object storage.
- Save ProductImage metadata to PostgreSQL.
- Support alt text and sort order.
```

**Acceptance Criteria:**

```text
- Owner can upload product image from admin.
- Image is uploaded directly to R2/S3, not through Next.js request body.
- Product image metadata is saved in PostgreSQL.
- Product cannot be published without at least one image with alt text.
- Public product page can render uploaded image.
```

---

### Epic 3 — Data Migration and Storefront Cutover

#### Issue 3.1 — Create migration scripts from legacy data

**Goal:** migrate existing Sanity/static catalog content into PostgreSQL.

**Depends on:** Issues 1.2, 2.1, 2.3, 2.4.

**Files:**

```text
scripts/migrate-from-sanity.ts
scripts/migrate-from-static-catalog.ts
scripts/migration-utils.ts
```

**Tasks:**

```text
- Read categories and products from current source.
- Preserve existing slugs.
- Convert prices to cents.
- Map inStock boolean to ProductAvailability.
- Create categories first.
- Create products second.
- Create variants if legacy data contains variant-like fields.
- Create image metadata or log images requiring manual migration.
- Log skipped/incomplete records.
```

**Acceptance Criteria:**

```text
- Existing categories are present in PostgreSQL.
- Existing products are present in PostgreSQL.
- Product slugs match old storefront URLs.
- Migration can be re-run safely in development.
- Migration report lists warnings and skipped fields.
```

---

#### Issue 3.2 — Implement public catalog services backed by PostgreSQL

**Goal:** create the application-service read layer for storefront.

**Depends on:** Issue 1.5.

**Files:**

```text
src/application/catalog/get-published-products.ts
src/application/catalog/get-featured-products.ts
src/application/catalog/get-product-by-slug.ts
src/application/catalog/get-product-slugs.ts
src/application/catalog/get-visible-categories.ts
src/application/settings/get-site-settings.ts
src/application/catalog/mappers.ts
```

**Tasks:**

```text
- Query only published products for storefront.
- Query only visible categories for storefront.
- Map Prisma records to domain DTOs.
- Include category, images and variants.
- Sort by sortOrder and updatedAt where appropriate.
- Return null for missing product slug.
```

**Acceptance Criteria:**

```text
- Services return domain DTOs, not Prisma records.
- Draft and archived products are excluded from storefront services.
- Hidden categories are excluded from storefront categories.
- Product service includes variants and ordered images.
```

---

#### Issue 3.3 — Switch home, catalog and product pages to PostgreSQL services

**Goal:** remove Sanity/static catalog reads from public pages.

**Depends on:** Issues 3.1, 3.2.

**Files:**

```text
src/app/(store)/page.tsx
src/app/(store)/catalog/page.tsx
src/app/(store)/product/[slug]/page.tsx
src/features/storefront/home/*
src/features/storefront/catalog/*
src/features/storefront/product/*
src/lib/seo.ts
```

**Tasks:**

```text
- Update home page to use getFeaturedProducts and getVisibleCategories.
- Update catalog page to use getPublishedProducts and getVisibleCategories.
- Update product page to use getProductBySlug.
- Implement generateStaticParams from getProductSlugs if suitable.
- Implement generateMetadata from product SEO fields.
- Render variants on product page.
- Render Add to Cart instead of WhatsApp CTA.
```

**Acceptance Criteria:**

```text
- Home page renders PostgreSQL data.
- Catalog page renders PostgreSQL data.
- Product page renders PostgreSQL data.
- Missing product returns 404.
- Product SEO metadata works.
- No public page imports Sanity or src/data/catalog.ts.
```

---

#### Issue 3.4 — Quarantine or remove old data sources

**Goal:** prevent source-of-truth regression.

**Depends on:** Issue 3.3.

**Files:**

```text
src/data/catalog.ts
docs/legacy/*
scripts/legacy/*
package.json
```

**Tasks:**

```text
- Search for production imports of src/data/catalog.ts.
- Search for production imports of Sanity clients/queries.
- Move static catalog to tests/fixtures or delete it.
- Move Sanity-specific scripts to scripts/legacy if still needed.
- Remove unused Sanity dependencies only after imports are gone.
```

**Acceptance Criteria:**

```text
- rg "src/data/catalog|@/data/catalog" shows no production usage.
- rg "sanity|next-sanity|groq|defineQuery" shows no storefront/admin production reads.
- Product editing works only through new admin panel.
- PostgreSQL is the only production catalog source.
```

---

### Epic 4 — Cart, Checkout, Orders and Telegram

#### Issue 4.1 — Build guest cart UI and localStorage persistence

**Goal:** support multi-product cart before checkout.

**Depends on:** Issue 3.3.

**Files:**

```text
src/features/storefront/cart/cart-provider.tsx
src/features/storefront/cart/use-cart.ts
src/features/storefront/cart/cart-drawer.tsx
src/app/(store)/cart/page.tsx
src/components/commerce/add-to-cart-button.tsx
```

**Tasks:**

```text
- Store cart items in localStorage.
- Cart item shape: productId, variantId, quantity.
- Add product to cart from product page.
- Support variant selection before add-to-cart if variants exist.
- Support quantity update.
- Support remove item.
- Show cart count in header.
```

**Acceptance Criteria:**

```text
- Cart persists after page refresh.
- Customer can add product with selected variant.
- Customer can update quantity.
- Customer can remove item.
- Cart count updates correctly.
```

---

#### Issue 4.2 — Build cart calculation service

**Goal:** calculate cart totals on the server using latest product data.

**Depends on:** Issues 1.5, 3.2.

**Files:**

```text
src/application/cart/calculate-cart.ts
src/application/cart/get-cart-preview.ts
src/domain/cart/types.ts
src/domain/cart/schemas.ts
```

**Tasks:**

```text
- Accept cart item input.
- Load products and variants from PostgreSQL.
- Reject missing products.
- Reject draft/archived products.
- Reject unavailable products or variants.
- Use variant price override when present.
- Use product base price otherwise.
- Return calculated lines and totals.
```

**Acceptance Criteria:**

```text
- Server never trusts client price.
- Unavailable item blocks checkout.
- Variant price override is respected.
- Quantity limits are enforced.
- Cart total is returned in cents and formatted in UI.
```

---

#### Issue 4.3 — Build checkout form and order creation API

**Goal:** let customer submit a cart order without account or online payment.

**Depends on:** Issues 4.1, 4.2.

**Files:**

```text
src/app/(store)/checkout/page.tsx
src/features/storefront/checkout/checkout-form.tsx
src/app/api/orders/route.ts
src/application/cart/create-order-from-cart.ts
src/application/orders/generate-order-number.ts
```

**Tasks:**

```text
- Build checkout page.
- Collect customerName, customerTelegram, customerPhone and customerComment.
- Require customerName.
- Require at least Telegram or phone unless business decides Telegram-only is enough.
- POST checkout payload to /api/orders.
- Validate input with Zod.
- Recalculate cart server-side.
- Create Order and OrderItems in transaction.
- Store product title and price snapshots.
- Return orderNumber and success redirect URL.
- Clear cart after success.
```

**Acceptance Criteria:**

```text
- Customer can submit checkout from cart.
- Empty cart cannot be submitted.
- Order is created in PostgreSQL.
- OrderItems contain price/title snapshots.
- Client is redirected to success page.
- Cart clears after successful order.
```

---

#### Issue 4.4 — Add Telegram owner notification and customer CTA

**Goal:** move post-order communication to Telegram.

**Depends on:** Issue 4.3.

**Files:**

```text
src/infrastructure/telegram/send-order-notification.ts
src/infrastructure/telegram/build-telegram-links.ts
src/app/(store)/order-success/[orderNumber]/page.tsx
src/application/orders/mark-telegram-opened.ts
```

**Tasks:**

```text
- Send Telegram Bot API message to owner after order creation.
- Message should include order number, customer, items, total and admin link.
- Build customer t.me link using NEXT_PUBLIC_TELEGRAM_USERNAME or SiteSettings.
- Show Telegram CTA on success page.
- Allow order creation to succeed even if Telegram notification fails.
- Optionally mark order as telegram_opened when customer clicks CTA.
```

**Acceptance Criteria:**

```text
- Owner receives Telegram message for new order.
- Customer sees order number on success page.
- Customer can open Telegram with prefilled message.
- Missing Telegram config does not break checkout.
- Notification failures are logged safely.
```

---

#### Issue 4.5 — Build orders admin

**Goal:** manage orders inside custom admin panel.

**Depends on:** Issue 4.3.

**Files:**

```text
src/app/admin/orders/page.tsx
src/app/admin/orders/[id]/page.tsx
src/features/admin/orders/order-table.tsx
src/features/admin/orders/order-status-select.tsx
src/application/orders/get-orders.ts
src/application/orders/get-order-by-id.ts
src/application/orders/update-order-status.ts
```

**Tasks:**

```text
- Create order list page.
- Show order number, date, customer, contacts, total and status.
- Add filter by status.
- Create order detail page.
- Show items with snapshots.
- Show links to current product if product still exists.
- Allow owner to update status.
- Add quick Telegram contact action.
```

**Acceptance Criteria:**

```text
- Owner can view all orders.
- Owner can filter orders by status.
- Owner can open order detail.
- Owner can update order status.
- Owner can quickly contact customer via Telegram when username exists.
```

---

### Epic 5 — Settings, SEO and Production Hardening

#### Issue 5.1 — Build site settings admin

**Goal:** remove hardcoded business settings from UI.

**Depends on:** Issue 1.4.

**Files:**

```text
src/app/admin/settings/page.tsx
src/features/admin/settings/settings-form.tsx
src/application/settings/get-site-settings.ts
src/application/settings/update-site-settings.ts
src/config/site.ts
```

**Tasks:**

```text
- Seed default SiteSettings row with id site.
- Build settings form.
- Support brandName, telegramUsername, email, phone, social links and default SEO.
- Use settings in footer/header/contact areas where needed.
- Keep env fallback for technical secrets only.
```

**Acceptance Criteria:**

```text
- Owner can update Telegram username without code change.
- Owner can update brand/contact/social links without code change.
- Footer/header do not use placeholder contact data.
- Default SEO can be changed from admin.
```

---

#### Issue 5.2 — Add cache invalidation after admin mutations

**Goal:** make storefront reflect admin changes quickly.

**Depends on:** Issues 2.3, 3.3, 5.1.

**Files:**

```text
src/application/cache/revalidate-catalog.ts
src/application/cache/revalidate-settings.ts
src/application/catalog/create-product.ts
src/application/catalog/update-product.ts
src/application/catalog/archive-product.ts
src/application/catalog/create-category.ts
src/application/catalog/update-category.ts
src/application/settings/update-site-settings.ts
```

**Tasks:**

```text
- Add revalidatePath/revalidateTag helpers.
- Revalidate /, /catalog and affected /product/[slug] after product changes.
- Revalidate / and /catalog after category changes.
- Revalidate layout-dependent paths after settings changes.
- Keep revalidation close to mutation services.
```

**Acceptance Criteria:**

```text
- Publishing product updates storefront without full redeploy.
- Editing category updates catalog without full redeploy.
- Editing settings updates public UI without full redeploy.
- Revalidation does not run from UI components directly.
```

---

#### Issue 5.3 — Add production QA checks and architecture guardrails

**Goal:** prevent regression to old architecture.

**Depends on:** Issues 3.4, 4.5, 5.2.

**Files:**

```text
docs/qa-checklist.md
package.json
```

**Tasks:**

```text
- Add QA checklist for home, catalog, product, cart, checkout, admin and Telegram.
- Add search checks for Sanity/static catalog imports.
- Add search checks for Prisma imports in UI layers.
- Document required manual test flow.
- Run npm run lint and npm run build.
```

**Acceptance Criteria:**

```text
- docs/qa-checklist.md exists.
- Checklist includes admin login, product CRUD, image upload, cart, checkout, Telegram and orders admin.
- rg checks confirm no production Sanity/static catalog reads.
- rg checks confirm no Prisma imports in components/features.
- npm run lint passes.
- npm run build passes.
```

---

#### Issue 5.4 — Deploy full-stack MVP to Vercel

**Goal:** launch PostgreSQL-backed admin/storefront MVP.

**Depends on:** Issues 5.1, 5.2, 5.3.

**Files:**

```text
vercel.json
.env.example
docs/deployment.md
```

**Tasks:**

```text
- Create managed PostgreSQL database.
- Create R2/S3 bucket.
- Configure public image base URL.
- Configure R2/S3 CORS.
- Set Vercel environment variables.
- Run prisma migrate deploy in production deployment flow.
- Seed owner once.
- Test admin login in production.
- Test product publish.
- Test image upload.
- Test cart checkout.
- Test Telegram notification.
```

**Acceptance Criteria:**

```text
- Production app deploys successfully.
- Production database migrations apply successfully.
- Owner can log in to /admin.
- Product can be created and published in production.
- Image upload works in production.
- Customer can place order from cart.
- Owner receives Telegram notification.
- Sanity is not required for production operation.
```

---

### Suggested PR Order

```text
PR 1: Issue 1.1 — Architecture baseline
PR 2: Issues 1.2 + 1.3 — Database and owner seed
PR 3: Issue 1.4 — Admin auth
PR 4: Issue 1.5 — Domain DTOs and validation
PR 5: Issue 2.1 — Category admin
PR 6: Issues 2.2 + 2.3 — Product admin CRUD and variants
PR 7: Issue 2.4 — Image upload
PR 8: Issue 3.1 — Legacy data migration scripts
PR 9: Issues 3.2 + 3.3 — Storefront PostgreSQL cutover
PR 10: Issue 3.4 — Remove/quarantine old sources
PR 11: Issues 4.1 + 4.2 — Cart and server calculation
PR 12: Issue 4.3 — Checkout/order creation
PR 13: Issue 4.4 — Telegram integration
PR 14: Issue 4.5 — Orders admin
PR 15: Issues 5.1 + 5.2 — Settings and revalidation
PR 16: Issues 5.3 + 5.4 — QA and production deployment
```

### Definition of Done for Every PR

```text
- Code follows dependency rules.
- No unrelated refactors.
- New server input is validated with Zod.
- New DB changes include Prisma migration.
- UI does not import Prisma directly.
- npm run lint passes.
- npm run build passes.
- PR description includes screenshots or screen recording for UI changes.
- PR description lists manual test steps.
