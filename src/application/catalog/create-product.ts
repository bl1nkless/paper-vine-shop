import { z } from "zod";
import { prisma } from "@/infrastructure/db/prisma";
import { slugify } from "@/lib/slug";
import { productFormSchema } from "@/domain/catalog/schemas";
import { upsertProductImage } from "./upsert-product-image";
import { parseMoneyToCents } from "./product-utils";

export type CreateProductPayload = z.infer<typeof productFormSchema>;

export async function createProduct(data: CreateProductPayload, createdById: string) {
  const title = data.title;
  const slug = slugify(data.slug || title);
  const variantData = data.variants.map((variant) => ({
    title: variant.title,
    sku: variant.sku || null,
    size: variant.size || null,
    color: variant.color || null,
    priceCents: variant.priceOverride ? parseMoneyToCents(variant.priceOverride) : null,
    availability: variant.availability,
    sortOrder: variant.sortOrder,
  }));

  const product = await prisma.product.create({
    data: {
      title,
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
      createdById,
      updatedById: createdById,
      variants: variantData.length
        ? {
            createMany: {
              data: variantData,
            },
          }
        : undefined,
    },
  });

  await upsertProductImage(product.id, data.imageUrl || "", title);

  return product;
}
