import { ProductStatus, ProductAvailability, Prisma } from "@prisma/client";
import { prisma } from "@/infrastructure/db/prisma";

export type AdminProductFilters = {
  status?: ProductStatus;
  availability?: ProductAvailability;
  categoryId?: string;
  q?: string;
};

export async function getAdminProducts(filters: AdminProductFilters = {}) {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  const where: Prisma.ProductWhereInput = {};
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.availability) {
    where.availability = filters.availability;
  }
  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }
  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { slug: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  return prisma.product.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }],
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
      _count: {
        select: {
          variants: true,
        },
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
