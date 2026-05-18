import { randomBytes, scryptSync } from "node:crypto";

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${hash}`;
}

async function main() {
  const ownerEmail = process.env.OWNER_EMAIL || "owner@example.com";
  const ownerPassword =
    process.env.OWNER_INITIAL_PASSWORD || "change-me-before-production";

  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {
      role: "owner",
      passwordHash: hashPassword(ownerPassword),
    },
    create: {
      email: ownerEmail,
      name: "Shop Owner",
      role: "owner",
      passwordHash: hashPassword(ownerPassword),
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "koshyky" },
      update: {},
      create: {
        title: "Кошики",
        slug: "koshyky",
        description: "Кошики для дому та зберігання",
      },
    }),
    prisma.category.upsert({
      where: { slug: "sumky-ta-shopery" },
      update: {},
      create: {
        title: "Сумки та шопери",
        slug: "sumky-ta-shopery",
        description: "Ручні сумки та шопери з паперової лози",
      },
    }),
    prisma.category.upsert({
      where: { slug: "dekor" },
      update: {},
      create: {
        title: "Декор",
        slug: "dekor",
        description: "Декоративні вироби для дому",
      },
    }),
  ]);

  const products = [
    {
      title: 'Кошик "Прованс"',
      slug: "koshyk-provence",
      priceCents: 150000,
      shortDescription: "Місткий кошик для спальні або ванної кімнати.",
      description:
        "Ручне плетіння з паперової лози, захищене вологостійким покриттям.",
      availability: "in_stock",
      status: "published",
      isFeatured: true,
      isNew: true,
      categoryId: categories[0].id,
      image: "/basket_provence.png",
    },
    {
      title: 'Сумка-шопер "Літо"',
      slug: "sumka-shoper-lito",
      priceCents: 120000,
      shortDescription: "Легка сумка для прогулянок і відпочинку.",
      description: "Міцна ручна робота для щоденного використання.",
      availability: "made_to_order",
      status: "published",
      isFeatured: true,
      isNew: false,
      categoryId: categories[1].id,
      image: "/bag_tote.png",
    },
    {
      title: "Набір коробів для зберігання",
      slug: "nabir-korobiv-dlya-zberigannya",
      priceCents: 220000,
      shortDescription: "Декор і порядок в одному комплекті.",
      description: "Три короби різного розміру для дому або майстерні.",
      availability: "in_stock",
      status: "published",
      isFeatured: false,
      isNew: false,
      categoryId: categories[2].id,
      image: "/decor_boxes.png",
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        title: product.title,
        priceCents: product.priceCents,
        shortDescription: product.shortDescription,
        description: product.description,
        availability: product.availability,
        status: product.status,
        isFeatured: product.isFeatured,
        isNew: product.isNew,
        categoryId: product.categoryId,
        updatedById: owner.id,
      },
      create: {
        title: product.title,
        slug: product.slug,
        priceCents: product.priceCents,
        shortDescription: product.shortDescription,
        description: product.description,
        materials: ["paper vine", "water-based stain"],
        availability: product.availability,
        status: product.status,
        isFeatured: product.isFeatured,
        isNew: product.isNew,
        categoryId: product.categoryId,
        createdById: owner.id,
        updatedById: owner.id,
        images: {
          create: {
            storageKey: product.image,
            publicUrl: product.image,
            alt: product.title,
          },
        },
      },
    });
  }

  await prisma.siteSettings.upsert({
    where: { id: "site" },
    update: {
      brandName: "Pletenie.Soul",
      telegramUsername: process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || null,
    },
    create: {
      id: "site",
      brandName: "Pletenie.Soul",
      telegramUsername: process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || null,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
