import { notFound } from "next/navigation";

import {
  getAdminCategories,
  getAdminProductById,
} from "@/application/admin/get-admin-products";

import { ProductForm } from "../../product-form";
import { updateProductAction } from "@/features/admin/products/actions";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getAdminCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Update Product
        </p>
        <h2 className="serif-font mt-3 text-4xl text-stone-900">
          {product.title}
        </h2>
      </div>

      <div className="rounded-[2rem] bg-white p-8 shadow-[0_12px_32px_rgba(40,30,20,0.08)]">
        <ProductForm
          action={updateProductAction}
          categories={categories}
          submitLabel="Зберегти зміни"
          initialValues={{
            id: product.id,
            title: product.title,
            slug: product.slug,
            categoryId: product.categoryId,
            price: String(product.priceCents / 100),
            shortDescription: product.shortDescription || "",
            description: product.description || "",
            dimensions: product.dimensions || "",
            materials: product.materials.join(", "),
            care: product.care || "",
            imageUrl: product.images[0]?.publicUrl || "",
            availability: product.availability,
            status: product.status,
            isFeatured: product.isFeatured,
            isNew: product.isNew,
          }}
        />
      </div>
    </section>
  );
}
