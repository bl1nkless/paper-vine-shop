import { groq } from "next-sanity";

export const productCardFields = groq`
  _id,
  title,
  price,
  dimensions,
  inStock,
  "slug": slug.current,
  category->{
    title,
    "slug": slug.current
  },
  "mainImage": mainImage,
  "mainImageUrl": mainImage.asset->url
`;

export const productDetailFields = groq`
  _id,
  title,
  price,
  dimensions,
  inStock,
  description,
  "slug": slug.current,
  category->{
    title,
    "slug": slug.current
  },
  "mainImage": mainImage,
  "mainImageUrl": mainImage.asset->url,
  "gallery": gallery[]{
    ...,
    "url": asset->url
  }
`;

export const allProductsQuery = groq`*[_type == "product"] | order(_createdAt desc) {
  ${productCardFields}
}`;

export const productBySlugQuery = groq`*[_type == "product" && slug.current == $slug][0]{
  ${productDetailFields}
}`;

export const categoriesQuery = groq`*[_type == "category"] | order(title asc) {
  _id,
  title,
  "slug": slug.current
}`;
