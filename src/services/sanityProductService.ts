import type { Image } from "sanity";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { allProductsQuery, productBySlugQuery } from "@/sanity/queries";
import type { ProductCard, ProductDetail } from "@/types/product";

type SanityProduct = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  dimensions?: string;
  inStock?: boolean;
  mainImage?: Image;
  mainImageUrl?: string;
  category?: {
    title: string;
    slug: string;
  };
  description?: ProductDetail["description"];
  gallery?: (Image & { url?: string })[];
};

const mapSanityProduct = (item: SanityProduct): ProductCard => ({
  id: item._id,
  title: item.title,
  slug: item.slug,
  price: item.price,
  dimensions: item.dimensions,
  inStock: item.inStock,
  mainImageUrl: item.mainImageUrl || urlFor(item.mainImage),
  category: item.category
    ? { title: item.category.title, slug: item.category.slug }
    : undefined,
});

const mapSanityProductDetail = (item: SanityProduct): ProductDetail => ({
  ...mapSanityProduct(item),
  description: item.description,
  gallery: item.gallery?.map((image, index) => ({
    url: image.url || urlFor(image),
    alt: `${item.title} ${index + 1}`,
  })),
});

export async function getProducts(): Promise<ProductCard[]> {
  const products = await client.fetch<SanityProduct[]>(allProductsQuery);
  return products.map(mapSanityProduct);
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  const product = await client.fetch<SanityProduct | null>(productBySlugQuery, {
    slug,
  });

  if (!product) return null;

  return mapSanityProductDetail(product);
}
