import Link from "next/link";
import { formatMoneyFromCents } from "@/lib/format-money";
import { archiveProductAction } from "./actions";
import { DeleteProductButton } from "./delete-product-button";
import { availabilityLabel, statusLabel } from "./product-labels";

type Product = {
  id: string;
  title: string;
  priceCents: number;
  availability: keyof typeof availabilityLabel;
  status: keyof typeof statusLabel;
  updatedAt: Date;
  category: {
    title: string;
  };
  _count: {
    variants: number;
  };
};

type Props = {
  products: Product[];
};

export function ProductTable({ products }: Props) {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_12px_32px_rgba(40,30,20,0.08)]">
      <table className="min-w-full divide-y divide-stone-200 text-sm">
        <thead className="bg-stone-50 text-left text-xs uppercase tracking-[0.2em] text-stone-500">
          <tr>
            <th className="px-6 py-4">Товар</th>
            <th className="px-6 py-4">Категорія</th>
            <th className="px-6 py-4">Ціна</th>
            <th className="px-6 py-4">Наявність</th>
            <th className="px-6 py-4">Варіанти</th>
            <th className="px-6 py-4">Статус</th>
            <th className="px-6 py-4">Оновлено</th>
            <th className="px-6 py-4">Дії</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4">
                <div className="font-medium text-stone-900">{product.title}</div>
              </td>
              <td className="px-6 py-4 text-stone-600">{product.category.title}</td>
              <td className="px-6 py-4 text-stone-600">
                {formatMoneyFromCents(product.priceCents)}
              </td>
              <td className="px-6 py-4 text-stone-600">
                {availabilityLabel[product.availability]}
              </td>
              <td className="px-6 py-4 text-stone-600">
                {product._count.variants}
              </td>
              <td className="px-6 py-4">
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs uppercase tracking-[0.16em] text-stone-600">
                  {statusLabel[product.status]}
                </span>
              </td>
              <td className="px-6 py-4 text-xs text-stone-500">
                {product.updatedAt.toLocaleDateString("uk-UA")}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="rounded-full border border-stone-300 px-4 py-2 text-xs uppercase tracking-[0.16em] text-stone-700 transition hover:bg-stone-100"
                  >
                    Редагувати
                  </Link>
                  {product.status !== "archived" && (
                    <form action={archiveProductAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <button
                        type="submit"
                        className="rounded-full bg-stone-100 px-4 py-2 text-xs uppercase tracking-[0.16em] text-stone-600 transition hover:bg-stone-200 cursor-pointer"
                      >
                        Архівувати
                      </button>
                    </form>
                  )}
                  {product.status !== "published" && (
                    <DeleteProductButton id={product.id} />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 ? (
        <div className="px-6 py-10 text-sm text-stone-500">
          Не знайдено товарів за пошуком або вибраними фільтрами.
        </div>
      ) : null}
    </div>
  );
}
