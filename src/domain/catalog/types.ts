// Domain DTO types for catalog will live here.


export type Money = { 
    amount: number;
    currency: "UAH";
}


export type ProductImage = { 
    id: string;
    url: string;
    alt: string;
    width?: number | null;
    height?: number | null;
} 

export type ProductVariant = {
    id: string; 
    title: string;
    sku?: string | null;
    size?: string | null;
    price?: Money | null;
}

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
  price: Money;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  isFeatured: boolean;
  isNew: boolean;
  status: "draft" | "published" | "archived";
  availability: "in_stock" | "made_to_order" | "out_of_stock";
};