import Link from "next/link";
import { ProductStatus, ProductAvailability } from "@prisma/client";

import { getAdminProducts, getAdminCategories } from "@/application/admin/get-admin-products";
import { ProductFilters } from "@/features/admin/products/product-filters";
import { ProductTable } from "@/features/admin/products/product-table";

type Props = {
  searchParams?: Promise<{
    status?: string;
    categoryId?: string;
    availability?: string;
    q?: string;
  }>;
};

export default async function AdminProductsPage({ searchParams }: Props) {
  const params = await searchParams;

  const status =
    params?.status === ProductStatus.draft ||
    params?.status === ProductStatus.published ||
    params?.status === ProductStatus.archived
      ? (params.status as ProductStatus)
      : undefined;

  const availability =
    params?.availability === ProductAvailability.in_stock ||
    params?.availability === ProductAvailability.made_to_order ||
    params?.availability === ProductAvailability.out_of_stock
      ? (params.availability as ProductAvailability)
      : undefined;

  const categoryId = params?.categoryId || undefined;
  const q = params?.q?.trim() || undefined;

  const [products, categories] = await Promise.all([
    getAdminProducts({ status, availability, categoryId, q }),
    getAdminCategories(),
  ]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
            CRUD MVP
          </p>
          <h2 className="serif-font mt-3 text-4xl text-stone-900">Товари</h2>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex rounded-full bg-stone-900 px-5 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-stone-800"
        >
          Додати товар
        </Link>
      </div>

      <ProductFilters
        q={q}
        status={status}
        categoryId={categoryId}
        availability={availability}
        categories={categories}
      />

      <ProductTable products={products} />
    </section>
  );
}
