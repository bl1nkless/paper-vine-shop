import { z } from "zod";

export const productStatusSchema = z.enum(["draft", "published", "archived"]);

export const productAvailabilitySchema = z.enum([
  "in_stock",
  "made_to_order",
  "out_of_stock",
]);

const optionalTextField = z.string().trim().optional();

export const productFormSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required."),
    slug: z.string().trim().min(1, "Slug is required."),
    categoryId: z.string().trim().min(1, "Category is required."),
    price: z.string().trim().min(1, "Price is required."),
    shortDescription: optionalTextField,
    description: optionalTextField,
    dimensions: optionalTextField,
    imageUrl: optionalTextField,
    materials: optionalTextField,
    care: optionalTextField,
    availability: productAvailabilitySchema,
    status: productStatusSchema,
    isFeatured: z.boolean().optional(),
    isNew: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "published" && !data.imageUrl?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["imageUrl"],
        message: "Published products must include an image.",
      });
    }
  });

export const updateProductFormSchema = productFormSchema.extend({
  id: z.string().trim().min(1, "Product id is required."),
});
