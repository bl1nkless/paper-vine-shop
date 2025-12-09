import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";

import { buildWhatsAppLink } from "@/lib/whatsapp";

export function Hero() {
  const whatsappHref = buildWhatsAppLink(
    "Вітаю! Хочу переглянути каталог Pletenie.Soul."
  );

  return (
    <section className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white/80 px-6 py-12 shadow-xl shadow-stone-900/5 sm:px-12 sm:py-16">
      <div className="absolute left-8 top-8 h-28 w-28 rounded-full bg-gradient-to-br from-[#d8c9b8] to-[#b4a08c] opacity-40 blur-3xl" />
      <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-gradient-to-br from-[#dca07a] to-[#7c8a54] opacity-30 blur-3xl" />
      <div className="relative grid gap-10 lg:grid-cols-[1fr,320px] lg:items-center">
        <div className="space-y-6">
          <span className="pill">ручна робота • paper vine</span>
          <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl">
            Pletenie.Soul — інтер&apos;єрні кошики, сумки та декор з паперової
            лози
          </h1>
          <p className="max-w-2xl text-lg text-stone-600">
            Ніжні фактури, натуральні відтінки, продумана форма. Всі вироби
            плетуться вручну, тому ви отримуєте унікальну річ, створену
            спеціально для вашого дому.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="#catalog"
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-stone-900/15 transition hover:-translate-y-0.5 hover:bg-stone-800"
            >
              До каталогу
              <ArrowRight size={16} />
            </Link>
            <Link
              href={whatsappHref}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-400"
            >
              <MessageCircle size={16} />
              Обговорити замовлення
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="card-surface relative overflow-hidden rounded-2xl">
            <div className="absolute left-6 top-6 h-14 w-14 rounded-full bg-gradient-to-br from-[#c96f4a]/30 to-[#7d8a54]/30 blur-3xl" />
            <div className="flex aspect-square items-end justify-between bg-gradient-to-br from-stone-100 via-stone-200/70 to-stone-100 p-6">
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Scandi-boho
                </span>
                <p className="text-2xl font-semibold leading-tight">
                  Кошик
                  <br />
                  «Прованс»
                </p>
                <p className="text-sm text-stone-500">30×40×20 см</p>
              </div>
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/90 shadow-inner shadow-stone-900/5">
                <span className="text-lg font-semibold text-stone-800">
                  2 500 ₴
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 text-sm text-stone-600">
            <span className="h-2 w-2 rounded-full bg-[#c56744]" />
            Доставка та пакування обговорюються індивідуально
          </div>
        </div>
      </div>
    </section>
  );
}
