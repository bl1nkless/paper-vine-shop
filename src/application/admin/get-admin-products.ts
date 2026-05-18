import { prisma } from "@/infrastructure/db/prisma";

export async function getAdminProducts() {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  return prisma.product.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
  });
}

export async function getAdminProductById(id: string) {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  return prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getAdminCategories() {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  return prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });
}
