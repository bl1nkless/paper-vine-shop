import type { PortableTextBlock } from "@portabletext/types";

export type ProductCategory = {
  title: string;
  slug: string;
};

export type ProductCard = {
  id: string;
  title: string;
  slug: string;
  price: number;
  dimensions?: string;
  inStock?: boolean;
  mainImageUrl?: string;
  category?: ProductCategory;
};

export type ProductDetail = ProductCard & {
  description?: PortableTextBlock[];
  gallery?: {
    url?: string;
    alt?: string;
  }[];
};
