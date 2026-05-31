import { z } from "zod";

import { cartItemInputSchema } from "@/domain/cart/schemas";

const optionalTextField = z.string().trim().optional();

export const createOrderInputSchema = z.object({
  customerName: z.string().trim().min(1, "Customer name is required."),
  customerTelegram: optionalTextField,
  customerPhone: optionalTextField,
  customerComment: optionalTextField,
  items: z
    .array(cartItemInputSchema)
    .min(1, "Order must include at least one item."),
});
