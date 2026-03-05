export type Money = {
  amount: number;
  currency: "UAH";
};

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  width?: number | null;
  height?: number | null;
};

export type ProductVariant = {
  id: string;
  title: string;
  sku?: string | null;
  size?: string | null;
  color?: string | null;
  price?: Money | null;
  availability: "in_stock" | "made_to_order" | "out_of_stock";
  sortOrder: number;
};

export type Category = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  dimensions?: string | null;
  materials?: string[] | null;
  care?: string | null;
  price: Money;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  isFeatured: boolean;
  isNew: boolean;
  status: "draft" | "published" | "archived";
  availability: "in_stock" | "made_to_order" | "out_of_stock";
  seoTitle?: string | null;
  seoDescription?: string | null;
};
