import { prisma } from "@/infrastructure/db/prisma";

export async function archiveProduct(id: string) {
  return prisma.product.update({
    where: { id },
    data: {
      status: "archived",
    },
  });
}
