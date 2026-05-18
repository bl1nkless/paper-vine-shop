import { prisma } from "@/infrastructure/db/prisma";

export type CatalogProduct = {
  id: string;
  slug: string;
  title: string;
  categoryTitle: string;
  priceCents: number;
  imageUrl: string;
  imageAlt: string;
  availability: "in_stock" | "made_to_order" | "out_of_stock";
  isNew: boolean;
};

export async function getCatalogProducts() {
  if (!process.env.DATABASE_URL) {
    return [] satisfies CatalogProduct[];
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        status: "published",
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
      },
    });

    return products.map((product) => ({
      id: product.id,
      slug: product.slug,
      title: product.title,
      categoryTitle: product.category.title,
      priceCents: product.priceCents,
      imageUrl: product.images[0]?.publicUrl || "/hero-bg.jpg",
      imageAlt: product.images[0]?.alt || product.title,
      availability: product.availability,
      isNew: product.isNew,
    })) satisfies CatalogProduct[];
  } catch (error) {
    console.error("Failed to load catalog products from Prisma", error);
    return [] satisfies CatalogProduct[];
  }
}

export async function getCatalogCategories() {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    return prisma.category.findMany({
      where: { isVisible: true },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });
  } catch (error) {
    console.error("Failed to load categories from Prisma", error);
    return [];
  }
}
