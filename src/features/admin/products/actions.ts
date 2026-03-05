"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  productFormSchema,
  updateProductFormSchema,
} from "@/domain/catalog/schemas";
import { prisma } from "@/infrastructure/db/prisma";
import { auth } from "@/auth";
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
    availability: getString(formData, "availability") || "made_to_order",
    status: getString(formData, "status") || "draft",
    isFeatured: formData.get("isFeatured") === "on",
    isNew: formData.get("isNew") === "on",
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
  const session = await requireOwnerSession();
  const parsed = productFormSchema.safeParse(getProductFormInput(formData));

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid product form.");
  }

  const data = parsed.data;
  const title = data.title;
  const slug = slugify(data.slug || title);

  const product = await prisma.product.create({
    data: {
      title,
      slug,
      categoryId: data.categoryId || "",
      priceCents: parseMoneyToCents(data.price || "0"),
      shortDescription: data.shortDescription || null,
      description: data.description || null,
      dimensions: data.dimensions || null,
      materials: (data.materials || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      care: data.care || null,
      availability: data.availability,
      status: data.status,
      isFeatured: data.isFeatured ?? false,
      isNew: data.isNew ?? false,
      createdById: session.user.id,
      updatedById: session.user.id,
    },
  });

  await upsertProductImage(product.id, data.imageUrl || "", title);

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

  const data = parsed.data;
  const slug = slugify(data.slug || data.title);

  await prisma.product.update({
    where: { id: data.id },
    data: {
      title: data.title,
      slug,
      categoryId: data.categoryId || "",
      priceCents: parseMoneyToCents(data.price || "0"),
      shortDescription: data.shortDescription || null,
      description: data.description || null,
      dimensions: data.dimensions || null,
      materials: (data.materials || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      care: data.care || null,
      availability: data.availability,
      status: data.status,
      isFeatured: data.isFeatured ?? false,
      isNew: data.isNew ?? false,
      updatedById: session.user.id,
    },
  });

  await upsertProductImage(data.id, data.imageUrl || "", data.title);

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

export async function deleteProductAction(formData: FormData) {
  await requireOwnerSession();
  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Missing product id.");
  }

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/catalog");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
}
