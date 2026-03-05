import { prisma } from "@/infrastructure/db/prisma";

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
      variants: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });
}
