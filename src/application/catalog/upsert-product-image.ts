import { prisma } from "@/infrastructure/db/prisma";

export async function upsertProductImage(productId: string, imageUrl: string, title: string) {
  const existingImage = await prisma.productImage.findFirst({
    where: { productId },
    orderBy: { sortOrder: "asc" },
  });

  if (!imageUrl) {
    return;
  }

  if (existingImage) {
    await prisma.productImage.update({
      where: { id: existingImage.id },
      data: {
        publicUrl: imageUrl,
        storageKey: imageUrl,
        alt: title,
      },
    });
    return;
  }

  await prisma.productImage.create({
    data: {
      productId,
      publicUrl: imageUrl,
      storageKey: imageUrl,
      alt: title,
    },
  });
}
