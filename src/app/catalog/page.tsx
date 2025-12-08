import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Navbar } from "@/components/navbar";

type Product = {
  title: string;
  subtitle: string;
  price: string;
  image: string;
  badge?: { text: string; tone: "dark" | "light" };
  soldOut?: boolean;
  delay: number;
};

const filters = ["Всі роботи", "Кошики", "Сумки та шопери", "Декор для дому"];

const products: Product[] = [
  {
    title: 'Сумка "Олівія"',
    subtitle: "Пляжна колекція",
    price: "2 500 ₴",
    image: "/bag_tote.png",
    badge: { text: "New", tone: "light" },
    delay: 0.1,
  },
  {
    title: "Набір кошиків S",
    subtitle: "Зберігання",
    price: "1 200 ₴",
    image: "/basket_white.png",
    badge: { text: "В наявності", tone: "light" },
    delay: 0.15,
  },
  {
    title: 'Шопер "Літо"',
    subtitle: "Сумки",
    price: "2 100 ₴",
    image: "/bag_tote.png",
    badge: { text: "Під замовлення", tone: "light" },
    delay: 0.2,
  },
  {
    title: "Серветниця",
    subtitle: "Сервірування",
    price: "600 ₴",
    image: "/decor_boxes.png",
    badge: { text: "В наявності", tone: "light" },
    delay: 0.25,
  },
  {
    title: "Ваза для сухоцвітів",
    subtitle: "Декор",
    price: "1 000 ₴",
    image: "/basket_provence.png",
    badge: { text: "New", tone: "light" },
    delay: 0.3,
  },
  {
    title: "Кошик для білизни",
    subtitle: "Ванна",
    price: "2 900 ₴",
    image: "/basket_white.png",
    badge: { text: "Під замовлення", tone: "light" },
    delay: 0.35,
  },
  {
    title: 'Скринька "Бохо"',
    subtitle: "Зберігання",
    price: "550 ₴",
    image: "/decor_boxes.png",
    badge: { text: "В наявності", tone: "light" },
    delay: 0.4,
  },
  {
    title: "Сумка-кошик",
    subtitle: "Сумки",
    price: "1 900 ₴",
    image: "/bag_tote.png",
    badge: { text: "Під замовлення", tone: "light" },
    delay: 0.45,
  },
  {
    title: "Кругла таця",
    subtitle: "Кухня",
    price: "850 ₴",
    image: "/basket_provence.png",
    badge: { text: "В наявності", tone: "light" },
    soldOut: false,
    delay: 0.5,
  },
];

const socials = [
  {
    label: "Facebook",
    href: "#",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.281.11-.705.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.486-.276a2.478 2.478 0 0 1-.919-.598 2.48 2.48 0 0 1-.599-.92c-.11-.281-.24-.705-.276-1.485-.038-.843-.047-1.096-.047-3.232 0-2.136.009-2.388.047-3.231.036-.78.166-1.203.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "#",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
      </svg>
    ),
  },
];

export const metadata: Metadata = {
  title: "Каталог виробів | Pletenie.Soul",
  description:
    "Повний каталог Pletenie.Soul: кошики, сумки, шопери та декор з паперової лози, створені вручну.",
};

const whatsappHref = buildWhatsAppLink(
  "Вітаю! Хочу оформити замовлення в Pletenie.Soul."
);

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-[#edeae5] text-[#1f1f1f]">
      <Navbar />

      <main className="flex-grow pt-24">
        <section className="fade-in px-4 pb-12 pt-16">
          <div className="mx-auto max-w-7xl text-center">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-gray-500 md:text-xs">
              Ручна робота • Еко-матеріали
            </p>
            <h1 className="serif-font mb-10 text-4xl text-[#1f1f1f] md:text-6xl">
              Каталог виробів
            </h1>

            <div className="mt-8 flex flex-col items-center justify-between border-y border-[#dcd9d4] py-4 md:flex-row">
              <div className="scrollbar-hide flex w-full justify-center space-x-6 overflow-x-auto pb-2 text-sm font-medium text-[#1f1f1f] md:justify-start md:space-x-8 md:pb-0">
                {filters.map((filter, index) => (
                  <button
                    key={filter}
                    type="button"
                    className={`whitespace-nowrap ${
                      index === 0
                        ? "text-[#1f1f1f]"
                        : "text-gray-500 transition hover:text-[#1f1f1f]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="hidden items-center text-sm text-gray-500 md:flex">
                <span className="mr-2">Сортувати:</span>
                <select className="cursor-pointer bg-transparent pl-0 pr-6 font-medium text-[#1f1f1f] focus:outline-none focus:ring-0">
                  <option>За новизною</option>
                  <option>Спочатку дешевші</option>
                  <option>Спочатку дорожчі</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.title}
                  className="group cursor-pointer fade-in-up"
                  style={{ animationDelay: `${product.delay}s` }}
                >
                  <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-lg bg-[#e3e0db]">
                    {product.badge && (
                      <span
                        className={`absolute left-4 top-4 z-10 px-3 py-1 text-[10px] uppercase tracking-wider ${
                          product.badge.tone === "dark"
                            ? "bg-[#2d2d2d] text-white"
                            : "bg-white/90 text-black backdrop-blur"
                        }`}
                      >
                        {product.badge.text}
                      </span>
                    )}
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className={`object-cover transition duration-700 ease-in-out group-hover:scale-105 ${
                        product.soldOut ? "grayscale opacity-70" : ""
                      }`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/5 transition duration-500 group-hover:bg-black/0" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className={`serif-font mb-1 text-xl transition ${
                          product.soldOut
                            ? "text-gray-500"
                            : "text-[#1f1f1f] group-hover:text-gray-600"
                        }`}
                      >
                        {product.title}
                      </h3>
                      <p
                        className={`text-xs uppercase tracking-wider ${
                          product.soldOut ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {product.subtitle}
                      </p>
                    </div>
                    <span
                      className={`font-medium ${
                        product.soldOut
                          ? "text-gray-500 line-through"
                          : "text-[#1f1f1f]"
                      }`}
                    >
                      {product.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-0 bg-[#e3e0db] px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="serif-font mb-6 text-3xl text-[#1f1f1f] md:text-5xl">
              Не знайшли те, що шукали?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600">
              Я з радістю сплету для вас виріб за індивідуальними розмірами та в
              потрібному кольорі, щоб він ідеально вписався у ваш інтер&apos;єр.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href={whatsappHref}
                target="_blank"
                className="rounded-full bg-[#1f1f1f] px-10 py-4 text-xs uppercase tracking-widest text-white shadow-xl transition hover:bg-[#3e3e3e]"
              >
                Замовити розрахунок
              </Link>
              <Link
                href="/palette"
                className="rounded-full border border-[#1f1f1f] px-10 py-4 text-xs uppercase tracking-widest text-[#1f1f1f] transition hover:bg-white"
              >
                Переглянути палітру
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#1a1a1a] px-4 pb-10 pt-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
            <div className="md:col-span-1">
              <div className="serif-font mb-6 text-2xl font-bold text-[#edeae5]">
                Pletenie.Soul
              </div>
              <p className="text-sm font-light leading-loose text-gray-400">
                Затишок, сплетений з любов&apos;ю. Екологічні матеріали та ручна
                робота для вашого дому.
              </p>
            </div>

            <div>
              <h4 className="mb-6 text-xs font-semibold uppercase tracking-widest text-[#edeae5]">
                Навігація
              </h4>
              <ul className="space-y-4 text-sm font-light text-gray-400">
                <li>
                  <Link href="/catalog" className="transition hover:text-white">
                    Каталог
                  </Link>
                </li>
                <li>
                  <Link href="/#about" className="transition hover:text-white">
                    Про майстра
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#contacts"
                    className="transition hover:text-white"
                  >
                    Оплата та доставка
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#benefits"
                    className="transition hover:text-white"
                  >
                    Догляд за виробами
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-xs font-semibold uppercase tracking-widest text-[#edeae5]">
                Контакти
              </h4>
              <ul className="space-y-4 text-sm font-light text-gray-400">
                <li>
                  <a
                    href="mailto:hello@pletenie.ua"
                    className="transition hover:text-white"
                  >
                    hello@pletenie.ua
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+380990000000"
                    className="transition hover:text-white"
                  >
                    +38 (099) 000-00-00
                  </a>
                </li>
                <li className="pt-2">м. Київ, Україна</li>
                <li className="text-xs text-gray-500">
                  Доставка по всій Україні
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-xs font-semibold uppercase tracking-widest text-[#edeae5]">
                Ми в соцмережах
              </h4>
              <div className="flex space-x-4">
                {socials.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition duration-300 hover:bg-white hover:text-black"
                    aria-label={social.label}
                  >
                    {social.svg}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between border-t border-gray-800 pt-8 text-xs font-light text-gray-500 md:flex-row">
            <p>© 2024 Pletenie.Soul. Усі права захищено.</p>
            <div className="mt-4 flex space-x-6 md:mt-0">
              <Link href="#" className="transition hover:text-white">
                Політика конфіденційності
              </Link>
              <Link href="#" className="transition hover:text-white">
                Договір оферти
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
