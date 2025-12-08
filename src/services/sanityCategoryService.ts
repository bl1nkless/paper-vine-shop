import { client } from "@/sanity/lib/client";
import { categoriesQuery } from "@/sanity/queries";
import type { ProductCategory } from "@/types/product";

type SanityCategory = {
  _id: string;
  title: string;
  slug: string;
};

export async function getCategories(): Promise<ProductCategory[]> {
  const categories = await client.fetch<SanityCategory[]>(categoriesQuery);

  return categories.map((category) => ({
    title: category.title,
    slug: category.slug,
  }));
}
