import Link from "next/link";

import { getDashboardStats } from "@/application/admin/get-dashboard-stats";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <section className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Fullstack Migration
        </p>
        <h2 className="serif-font mt-3 text-4xl text-stone-900">
          Перший адміністративний зріз
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-stone-600">
          Тут уже зібрані перші 4 кроки зі спеки: Prisma schema, DB-backed
          catalog, owner login та CRUD-основа для товарів.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Усього товарів", value: stats.totalProducts },
          { label: "Опубліковано", value: stats.publishedProducts },
          { label: "Нові замовлення", value: stats.newOrders },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[2rem] bg-white p-6 shadow-[0_12px_32px_rgba(40,30,20,0.08)]"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              {item.label}
            </p>
            <p className="serif-font mt-3 text-4xl text-stone-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-[0_12px_32px_rgba(40,30,20,0.08)]">
        <h3 className="serif-font text-2xl text-stone-900">Що вже працює</h3>
        <div className="mt-4 grid gap-3 text-sm text-stone-600 md:grid-cols-2">
          <p>1. `prisma/schema.prisma` описує MVP-модель магазину.</p>
          <p>2. `/catalog` читає published products із PostgreSQL.</p>
          <p>3. `/admin/login` авторизує owner через сесійну cookie.</p>
          <p>4. `/admin/products` дозволяє створювати, редагувати й архівувати.</p>
        </div>
        <Link
          href="/admin/products"
          className="mt-6 inline-flex rounded-full bg-stone-900 px-5 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-stone-800"
        >
          Перейти до товарів
        </Link>
      </div>
    </section>
  );
}
