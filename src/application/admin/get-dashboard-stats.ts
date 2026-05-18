import { prisma } from "@/infrastructure/db/prisma";

export async function getDashboardStats() {
  if (!process.env.DATABASE_URL) {
    return {
      totalProducts: 0,
      publishedProducts: 0,
      newOrders: 0,
    };
  }

  const [totalProducts, publishedProducts, newOrders] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: "published" } }),
    prisma.order.count({ where: { status: "new" } }),
  ]);

  return {
    totalProducts,
    publishedProducts,
    newOrders,
  };
}
