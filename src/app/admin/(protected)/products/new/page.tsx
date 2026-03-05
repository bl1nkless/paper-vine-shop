import { getAdminCategories } from "@/application/admin/get-admin-products";

import { createProductAction } from "@/features/admin/products/actions";
import { ProductForm } from "../product-form";

export default async function AdminNewProductPage() {
  const categories = await getAdminCategories();

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Create Product
        </p>
        <h2 className="serif-font mt-3 text-4xl text-stone-900">
          Новий товар
        </h2>
      </div>

      <div className="rounded-[2rem] bg-white p-8 shadow-[0_12px_32px_rgba(40,30,20,0.08)]">
        <ProductForm
          action={createProductAction}
          categories={categories}
          submitLabel="Створити товар"
          initialValues={{
            price: "1500",
            materials: "paper vine, water-based stain",
            availability: "made_to_order",
            status: "draft",
          }}
        />
      </div>
    </section>
  );
}
