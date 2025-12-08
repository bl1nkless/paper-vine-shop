import { Check, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { ProductCard as ProductCardType } from "@/types/product";

type Props = {
  product: ProductCardType;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU").format(price);

export function ProductCard({ product }: Props) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white/90 shadow-[0_20px_60px_rgba(31,26,23,0.06)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(31,26,23,0.10)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-stone-100 via-stone-50 to-stone-100">
        {product.mainImageUrl ? (
          <Image
            src={product.mainImageUrl}
            alt={product.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-stone-400">
            Фото появится скоро
          </div>
        )}
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-stone-800 shadow-sm backdrop-blur">
          {product.inStock ? (
            <>
              <Check size={14} className="text-green-600" />
              В наличии
            </>
          ) : (
            <>
              <Clock size={14} className="text-amber-600" />
              Под заказ
            </>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm uppercase tracking-[0.18em] text-stone-500">
            {product.category?.title || "Изделие"}
          </p>
          <p className="text-lg font-semibold text-stone-900">
            {formatPrice(product.price)} ₽
          </p>
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold leading-tight text-stone-900">
            {product.title}
          </h3>
          {product.dimensions && (
            <p className="text-sm text-stone-500">{product.dimensions}</p>
          )}
        </div>
        <span className="text-sm font-semibold text-stone-800 underline-offset-4 group-hover:underline">
          Смотреть детали
        </span>
      </div>
    </Link>
  );
}
