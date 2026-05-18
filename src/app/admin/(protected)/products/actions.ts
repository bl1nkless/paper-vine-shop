"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/infrastructure/db/prisma";
import { requireAdminSession } from "@/lib/admin-session";
import { slugify } from "@/lib/slug";

function parseMoneyToCents(rawValue: string) {
  const normalized = rawValue.replace(",", ".").trim();
  const numeric = Number(normalized);

  if (!Number.isFinite(numeric) || numeric < 0) {
    throw new Error("Некоректна ціна.");
  }

  return Math.round(numeric * 100);
}

function getString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

async function upsertProductImage(productId: string, imageUrl: string, title: string) {
  const existingImage = await prisma.productImage.findFirst({
    where: { productId },
    orderBy: { sortOrder: "asc" },
  });

  if (!imageUrl) {
    return;
  }

  if (existingImage) {
    await prisma.productImage.update({
      where: { id: existingImage.id },
      data: {
        publicUrl: imageUrl,
        storageKey: imageUrl,
        alt: title,
      },
    });
    return;
  }

  await prisma.productImage.create({
    data: {
      productId,
      publicUrl: imageUrl,
      storageKey: imageUrl,
      alt: title,
    },
  });
}

export async function createProductAction(formData: FormData) {
  const session = await requireAdminSession();
  const title = getString(formData, "title");
  const slug = slugify(getString(formData, "slug") || title);
  const categoryId = getString(formData, "categoryId");
  const price = getString(formData, "price");
  const imageUrl = getString(formData, "imageUrl");

  if (!title || !slug || !categoryId || !price) {
    throw new Error("Title, slug, category and price are required.");
  }

  const product = await prisma.product.create({
    data: {
      title,
      slug,
      categoryId,
      priceCents: parseMoneyToCents(price),
      shortDescription: getString(formData, "shortDescription") || null,
      description: getString(formData, "description") || null,
      dimensions: getString(formData, "dimensions") || null,
      materials: getString(formData, "materials")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      care: getString(formData, "care") || null,
      availability: (getString(formData, "availability") || "made_to_order") as
        | "in_stock"
        | "made_to_order"
        | "out_of_stock",
      status: (getString(formData, "status") || "draft") as
        | "draft"
        | "published"
        | "archived",
      isFeatured: formData.get("isFeatured") === "on",
      isNew: formData.get("isNew") === "on",
      createdById: session.userId,
      updatedById: session.userId,
    },
  });

  await upsertProductImage(product.id, imageUrl, title);

  revalidatePath("/catalog");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProductAction(formData: FormData) {
  const session = await requireAdminSession();
  const id = getString(formData, "id");
  const title = getString(formData, "title");
  const slug = slugify(getString(formData, "slug") || title);
  const categoryId = getString(formData, "categoryId");
  const price = getString(formData, "price");
  const imageUrl = getString(formData, "imageUrl");

  if (!id || !title || !slug || !categoryId || !price) {
    throw new Error("Missing required product fields.");
  }

  await prisma.product.update({
    where: { id },
    data: {
      title,
      slug,
      categoryId,
      priceCents: parseMoneyToCents(price),
      shortDescription: getString(formData, "shortDescription") || null,
      description: getString(formData, "description") || null,
      dimensions: getString(formData, "dimensions") || null,
      materials: getString(formData, "materials")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      care: getString(formData, "care") || null,
      availability: (getString(formData, "availability") || "made_to_order") as
        | "in_stock"
        | "made_to_order"
        | "out_of_stock",
      status: (getString(formData, "status") || "draft") as
        | "draft"
        | "published"
        | "archived",
      isFeatured: formData.get("isFeatured") === "on",
      isNew: formData.get("isNew") === "on",
      updatedById: session.userId,
    },
  });

  await upsertProductImage(id, imageUrl, title);

  revalidatePath("/catalog");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function archiveProductAction(formData: FormData) {
  await requireAdminSession();
  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Missing product id.");
  }

  await prisma.product.update({
    where: { id },
    data: {
      status: "archived",
    },
  });

  revalidatePath("/catalog");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
}
