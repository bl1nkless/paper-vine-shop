import Link from "next/link";

import { getAdminProducts } from "@/application/admin/get-admin-products";
import { formatMoneyFromCents } from "@/lib/format-money";

import { archiveProductAction } from "./actions";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

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

      <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_12px_32px_rgba(40,30,20,0.08)]">
        <table className="min-w-full divide-y divide-stone-200 text-sm">
          <thead className="bg-stone-50 text-left text-xs uppercase tracking-[0.2em] text-stone-500">
            <tr>
              <th className="px-6 py-4">Товар</th>
              <th className="px-6 py-4">Категорія</th>
              <th className="px-6 py-4">Ціна</th>
              <th className="px-6 py-4">Статус</th>
              <th className="px-6 py-4">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-stone-900">{product.title}</div>
                  <div className="text-xs text-stone-500">{product.slug}</div>
                </td>
                <td className="px-6 py-4 text-stone-600">{product.category.title}</td>
                <td className="px-6 py-4 text-stone-600">
                  {formatMoneyFromCents(product.priceCents)}
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs uppercase tracking-[0.16em] text-stone-600">
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-full border border-stone-300 px-4 py-2 text-xs uppercase tracking-[0.16em] text-stone-700 transition hover:bg-stone-100"
                    >
                      Редагувати
                    </Link>
                    <form action={archiveProductAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-stone-300 px-4 py-2 text-xs uppercase tracking-[0.16em] text-stone-700 transition hover:bg-stone-100"
                      >
                        Архівувати
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 ? (
          <div className="px-6 py-10 text-sm text-stone-500">
            База ще порожня. Після `npm run db:seed` тут з&apos;являться тестові товари.
          </div>
        ) : null}
      </div>
    </section>
  );
}
