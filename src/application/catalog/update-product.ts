import { z } from "zod";
import { prisma } from "@/infrastructure/db/prisma";
import { slugify } from "@/lib/slug";
import { updateProductFormSchema } from "@/domain/catalog/schemas";
import { upsertProductImage } from "./upsert-product-image";
import { parseMoneyToCents } from "./product-utils";

export type UpdateProductPayload = z.infer<typeof updateProductFormSchema>;

export async function updateProduct(data: UpdateProductPayload, updatedById: string) {
  const slug = slugify(data.slug || data.title);
  const variantData = data.variants.map((variant) => ({
    title: variant.title,
    sku: variant.sku || null,
    size: variant.size || null,
    color: variant.color || null,
    priceCents: variant.priceOverride ? parseMoneyToCents(variant.priceOverride) : null,
    availability: variant.availability,
    sortOrder: variant.sortOrder,
  }));

  const product = await prisma.product.update({
    where: { id: data.id },
    data: {
      title: data.title,
      slug,
      categoryId: data.categoryId || "",
      priceCents: parseMoneyToCents(data.price || "0"),
      shortDescription: data.shortDescription || null,
      description: data.description || null,
      dimensions: data.dimensions || null,
      materials: (data.materials || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      care: data.care || null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      availability: data.availability,
      status: data.status,
      isFeatured: data.isFeatured ?? false,
      isNew: data.isNew ?? false,
      updatedById,
      variants: {
        deleteMany: {},
        ...(variantData.length ? { createMany: { data: variantData } } : {}),
      },
    },
  });

  await upsertProductImage(data.id, data.imageUrl || "", data.title);

  return product;
}
