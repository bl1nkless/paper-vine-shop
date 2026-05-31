import { z } from "zod";

export const cartItemInputSchema = z.object({
  productId: z.string().trim().min(1, "Product is required."),
  productVariantId: z.string().trim().optional(),
  quantity: z.number().int().positive("Quantity must be greater than 0."),
});
