import type { CartItemInput } from "@/domain/cart/types";
import { Money } from "../catalog/types";

export type CreateOrderInput = {
  customerName: string;
  customerTelegram?: string | null;
  customerPhone?: string | null;
  customerComment?: string | null;
  items: CartItemInput[];
};

export type OrderItem = { 
    id: string;
    productId?: string | null;
    productVariantId?: string | null;
    productTitle: string;
    variantTitle?: string | null;
    unitPrice: Money;
    quantity: number;
    lineTotal: Money;
}

export type Order = { 
  id: string;
  orderNumber: string;
  status:
    | "new"
    | "telegram_opened"
    | "contacted"
    | "in_progress"
    | "completed"
    | "cancelled";
  customerName: string;
  customerTelegram?: string | null;
  customerPhone?: string | null;
  customerComment?: string | null;
  subtotal: Money;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}