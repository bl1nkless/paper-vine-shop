import { z } from "zod";

export const productStatusSchema = z.enum(["draft", "published", "archived"]);

export const productAvailabilitySchema = z.enum([
  "in_stock",
  "made_to_order",
  "out_of_stock",
]);

const optionalTextField = z.string().trim().optional();

export const productVariantFormSchema = z.object({
  id: z.string().trim().optional(),
  title: z.string().trim().min(1, "Variant title is required."),
  sku: optionalTextField,
  size: optionalTextField,
  color: optionalTextField,
  priceOverride: optionalTextField,
  availability: productAvailabilitySchema,
  sortOrder: z.coerce.number().int().min(0),
});

export const productFormSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required."),
    slug: z.string().trim().optional(),
    categoryId: z.string().trim().optional(),
    price: z.string().trim().optional(),
    shortDescription: optionalTextField,
    description: optionalTextField,
    dimensions: optionalTextField,
    imageUrl: optionalTextField,
    materials: optionalTextField,
    care: optionalTextField,
    seoTitle: optionalTextField,
    seoDescription: optionalTextField,
    availability: productAvailabilitySchema,
    status: productStatusSchema,
    isFeatured: z.boolean().optional(),
    isNew: z.boolean().optional(),
    variants: z.array(productVariantFormSchema).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.status === "published") {
      const checkRequired = (field: keyof typeof data, fieldName: string, customMessage?: string) => {
        const val = data[field];
        if (!val || (typeof val === "string" && !val.trim())) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: customMessage || `${fieldName} is required when product is published.`,
          });
        }
      };

      checkRequired("slug", "Slug");
      checkRequired("categoryId", "Category");
      checkRequired("price", "Price");
      checkRequired("imageUrl", "Image", "Published products must include an image.");
    }
  });

export const updateProductFormSchema = productFormSchema.extend({
  id: z.string().trim().min(1, "Product id is required."),
});
