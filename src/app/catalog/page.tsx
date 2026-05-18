import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getCatalogCategories, getCatalogProducts } from "@/application/catalog/get-products";
import { formatMoneyFromCents } from "@/lib/format-money";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Каталог виробів | Pletenie.Soul",
  description:
    "Каталог Pletenie.Soul тепер читає дані з Prisma/PostgreSQL і готовий до подальшої fullstack-міграції.",
};

export const dynamic = "force-dynamic";

const availabilityBadge = {
  in_stock: "В наявності",
  made_to_order: "Під замовлення",
  out_of_stock: "Немає в наявності",
} as const;

export default async function CatalogPage() {
  const [products, categories] = await Promise.all([
    getCatalogProducts(),
    getCatalogCategories(),
  ]);

  const whatsappHref = buildWhatsAppLink(
    "Вітаю! Хочу оформити замовлення в Pletenie.Soul.",
  );

  return (
    <div className="min-h-screen bg-[#edeae5] text-[#1f1f1f]">
      <Navbar />

      <main className="pt-24">
        <section className="px-4 pb-12 pt-16">
          <div className="mx-auto max-w-7xl">
            <p className="mb-4 text-center text-[10px] font-medium uppercase tracking-[0.3em] text-gray-500 md:text-xs">
              Prisma MVP Slice
            </p>
            <h1 className="serif-font text-center text-4xl md:text-6xl">
              Каталог виробів
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-gray-600 md:text-lg">
              Це вже не статичний масив: сторінка читає опубліковані товари та
              категорії з PostgreSQL через Prisma service layer.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 border-y border-[#dcd9d4] py-4">
              <span className="rounded-full bg-[#1f1f1f] px-4 py-2 text-xs uppercase tracking-wider text-white">
                Всі товари
              </span>
              {categories.map((category) => (
                <span
                  key={category.id}
                  className="rounded-full border border-[#d0ccc5] px-4 py-2 text-xs uppercase tracking-wider text-gray-600"
                >
                  {category.title}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-20">
          <div className="mx-auto max-w-7xl">
            {products.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-[#cfc9c1] bg-white/40 px-8 py-20 text-center">
                <p className="serif-font text-2xl text-[#1f1f1f]">
                  Поки немає опублікованих товарів
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-600">
                  Запусти `npm run db:seed` після міграції, і тут одразу
                  з&apos;являться тестові позиції з бази.
                </p>
                <Link
                  href="/admin/products"
                  className="mt-8 inline-flex rounded-full bg-[#1f1f1f] px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-[#3a3a3a]"
                >
                  Відкрити адмінку
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product, index) => (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-[2rem] bg-white/60 shadow-[0_18px_40px_rgba(40,30,20,0.08)] transition hover:-translate-y-1"
                    style={{ animationDelay: `${index * 0.06}s` }}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#ddd7cf]">
                      <Image
                        src={product.imageUrl}
                        alt={product.imageAlt}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#1f1f1f] backdrop-blur">
                        {product.isNew ? "New" : availabilityBadge[product.availability]}
                      </div>
                    </div>

                    <div className="space-y-4 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.25em] text-gray-500">
                            {product.categoryTitle}
                          </p>
                          <h2 className="serif-font mt-2 text-2xl text-[#1f1f1f]">
                            {product.title}
                          </h2>
                        </div>
                        <p className="text-sm font-semibold text-[#1f1f1f]">
                          {formatMoneyFromCents(product.priceCents)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-gray-500">
                          slug: {product.slug}
                        </span>
                        <Link
                          href={whatsappHref}
                          target="_blank"
                          className="rounded-full border border-[#1f1f1f] px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[#1f1f1f] transition hover:bg-[#1f1f1f] hover:text-white"
                        >
                          Замовити
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
