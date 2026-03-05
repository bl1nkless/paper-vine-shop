"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  productFormSchema,
  updateProductFormSchema,
} from "@/domain/catalog/schemas";
import { auth } from "@/auth";
import { createProduct } from "@/application/catalog/create-product";
import { updateProduct } from "@/application/catalog/update-product";
import { archiveProduct } from "@/application/catalog/archive-product";
import { deleteProduct } from "@/application/catalog/delete-product";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function getVariants(formData: FormData) {
  const raw = getString(formData, "variants");

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((variant) => {
        if (!variant || typeof variant !== "object") {
          return false;
        }

        const candidate = variant as Record<string, unknown>;
        return Boolean(
          String(candidate.title || "").trim() ||
            String(candidate.sku || "").trim() ||
            String(candidate.size || "").trim() ||
            String(candidate.color || "").trim() ||
            String(candidate.priceOverride || "").trim(),
        );
      })
      .map((variant) => ({
        ...variant,
        sortOrder: Number((variant as Record<string, unknown>).sortOrder ?? 0),
      }));
  } catch {
    throw new Error("Invalid variants payload.");
  }
}

function getProductFormInput(formData: FormData) {
  return {
    title: getString(formData, "title"),
    slug: getString(formData, "slug"),
    categoryId: getString(formData, "categoryId"),
    price: getString(formData, "price"),
    shortDescription: getString(formData, "shortDescription") || undefined,
    description: getString(formData, "description") || undefined,
    dimensions: getString(formData, "dimensions") || undefined,
    imageUrl: getString(formData, "imageUrl") || undefined,
    materials: getString(formData, "materials") || undefined,
    care: getString(formData, "care") || undefined,
    seoTitle: getString(formData, "seoTitle") || undefined,
    seoDescription: getString(formData, "seoDescription") || undefined,
    availability: getString(formData, "availability") || "made_to_order",
    status: getString(formData, "status") || "draft",
    isFeatured: formData.get("isFeatured") === "on",
    isNew: formData.get("isNew") === "on",
    variants: getVariants(formData),
  };
}

async function requireOwnerSession() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (session.user.role !== "owner") {
    redirect("/admin/login");
  }

  return session;
}

export async function createProductAction(formData: FormData) {
  const session = await requireOwnerSession();
  const parsed = productFormSchema.safeParse(getProductFormInput(formData));

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid product form.");
  }

  await createProduct(parsed.data, session.user.id);

  revalidatePath("/catalog");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProductAction(formData: FormData) {
  const session = await requireOwnerSession();
  const parsed = updateProductFormSchema.safeParse({
    id: getString(formData, "id"),
    ...getProductFormInput(formData),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid product form.");
  }

  await updateProduct(parsed.data, session.user.id);

  revalidatePath("/catalog");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function archiveProductAction(formData: FormData) {
  await requireOwnerSession();
  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Missing product id.");
  }

  await archiveProduct(id);

  revalidatePath("/catalog");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  await requireOwnerSession();
  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Missing product id.");
  }

  await deleteProduct(id);

  revalidatePath("/catalog");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
}
