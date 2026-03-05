import Link from "next/link";
import { ProductStatus, ProductAvailability } from "@prisma/client";

type Category = {
  id: string;
  title: string;
};

type Props = {
  q?: string;
  status?: ProductStatus;
  categoryId?: string;
  availability?: ProductAvailability;
  categories: Category[];
};

export function ProductFilters({ q, status, categoryId, availability, categories }: Props) {
  return (
    <form method="GET" className="flex flex-wrap items-end gap-4 rounded-2xl bg-white p-5 shadow-[0_12px_32px_rgba(40,30,20,0.04)]">
      <div className="flex flex-col gap-2 min-w-[200px] flex-1">
        <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Пошук</label>
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Назва або slug"
          className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-400"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Статус</label>
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-400"
        >
          <option value="">Всі статуси</option>
          <option value="draft">Чернетка</option>
          <option value="published">Опубліковано</option>
          <option value="archived">Архів</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Категорія</label>
        <select
          name="categoryId"
          defaultValue={categoryId ?? ""}
          className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-400"
        >
          <option value="">Всі категорії</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Наявність</label>
        <select
          name="availability"
          defaultValue={availability ?? ""}
          className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-400"
        >
          <option value="">Вся наявність</option>
          <option value="in_stock">В наявності</option>
          <option value="made_to_order">Під замовлення</option>
          <option value="out_of_stock">Немає в наявності</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-full bg-stone-900 px-5 py-2.5 text-xs uppercase tracking-wider text-white transition hover:bg-stone-800 cursor-pointer"
        >
          Застосувати
        </button>

        {(status || availability || categoryId || q) && (
          <Link
            href="/admin/products"
            className="rounded-full border border-stone-300 px-5 py-2.5 text-xs uppercase tracking-wider text-stone-700 transition hover:bg-stone-100 flex items-center justify-center"
          >
            Скинути
          </Link>
        )}
      </div>
    </form>
  );
}
