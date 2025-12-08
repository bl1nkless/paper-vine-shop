"use client";

import React from "react";
import {
  ArrowRight,
  Droplets,
  Instagram,
  Leaf,
  MessageCircle,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import Image from "next/image";

type Category = {
  id: number;
  title: string;
  image: string;
  count: string;
};

type Product = {
  id: number;
  title: string;
  price: string;
  image: string;
  tag: string;
};

type Benefit = {
  icon: React.ReactNode;
  title: string;
  desc: string;
};

const categories: Category[] = [
  {
    id: 1,
    title: "Кошики для білизни",
    image: "/basket_white.png",
    count: "12 товарів",
  },
  {
    id: 2,
    title: "Сумки та шопери",
    image: "/bag_tote.png",
    count: "8 товарів",
  },
  {
    id: 3,
    title: "Декор та зберігання",
    image: "/decor_boxes.png",
    count: "24 товари",
  },
];

const products: Product[] = [
  {
    id: 1,
    title: 'Кошик "Прованс" білий',
    price: "1 500 ₴",
    image: "/basket_provence.png",
    tag: "В наявності",
  },
  {
    id: 2,
    title: "Таця для сніданку",
    price: "800 ₴",
    image: "/decor_boxes.png",
    tag: "Під замовлення",
  },
  {
    id: 3,
    title: "Набір скриньок (3 шт)",
    price: "2 200 ₴",
    image: "/basket_white.png",
    tag: "В наявності",
  },
  {
    id: 4,
    title: 'Сумка-шопер "Літо"',
    price: "1 200 ₴",
    image: "/bag_tote.png",
    tag: "New",
  },
];

const benefits: Benefit[] = [
  {
    icon: <Leaf className="h-8 w-8 text-green-700" />,
    title: "Екологічно",
    desc: "Тільки безпечні матеріали: чистий папір та морилки на водній основі.",
  },
  {
    icon: <Droplets className="h-8 w-8 text-blue-700" />,
    title: "Вологостійкі",
    desc: "Спеціальна обробка дозволяє протирати вироби вологою тканиною.",
  },
  {
    icon: <Sparkles className="h-8 w-8 text-amber-600" />,
    title: "Унікально",
    desc: "Кожен виріб створюється вручну в єдиному екземплярі.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 selection:bg-stone-200">
      <Navbar />

      <section className="relative flex min-h-[600px] h-screen items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-stone-300">
          <Image
            src="/hero-bg.jpg"
            alt="Вироби з паперової лози"
            fill
            className="object-cover opacity-80"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50/30 via-transparent to-stone-50/90" />

        <div className="relative z-10 mx-auto mt-10 max-w-4xl px-4 text-center">
          <span className="mb-4 block animate-fade-in-up text-sm uppercase tracking-[0.2em] text-stone-700">
            Ручна робота • Еко-матеріали
          </span>
          <h1 className="mb-6 font-serif text-5xl leading-tight text-stone-900 md:text-7xl">
            Затишок, сплетений <br /> з любов&apos;ю
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-light text-stone-700 md:text-xl">
            Створюю кошики, сумки та декор з паперової лози, які роблять ваш дім
            теплішим та організованішим.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/catalog"
              className="flex items-center justify-center gap-2 rounded-full bg-stone-900 px-8 py-4 text-lg text-white shadow-lg transition hover:scale-[1.01] hover:bg-stone-800 hover:shadow-xl"
            >
              Дивитися каталог <ArrowRight size={20} />
            </a>
            <a
              href="/order"
              className="rounded-full border border-stone-200 bg-white px-8 py-4 text-lg text-stone-900 shadow-md transition hover:bg-stone-50"
            >
              Індивідуальне замовлення
            </a>
          </div>
        </div>
      </section>

      <section id="categories" className="bg-stone-50 py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl text-stone-800 md:text-4xl">
              Популярні категорії
            </h2>
            <div className="mx-auto h-0.5 w-16 bg-stone-400" />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-xl"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/20 transition duration-300 group-hover:bg-black/30" />
                <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                  <h3 className="font-serif text-2xl mb-1">{cat.title}</h3>
                  <p className="text-sm opacity-90">{cat.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="benefits"
        className="border-y border-stone-100 bg-white py-16"
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            {benefits.map((item, idx) => (
              <div key={idx} className="p-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-50">
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl mb-2">{item.title}</h3>
                <p className="font-light text-stone-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl py-20 px-4">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl text-stone-800 md:text-4xl">
              Новинки в наявності
            </h2>
            <p className="text-stone-500">
              Вироби, готові до відправки вже завтра
            </p>
          </div>
          <a
            href="/catalog"
            className="hidden items-center gap-2 border-b border-stone-800 pb-1 text-stone-800 transition hover:border-stone-600 hover:text-stone-600 md:flex"
          >
            Весь каталог <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-stone-100">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute left-3 top-3 rounded-sm bg-white/90 px-3 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur">
                  {product.tag}
                </div>
                <div className="absolute left-0 right-0 bottom-0 translate-y-full p-4 transition duration-300 group-hover:translate-y-0">
                  <button className="flex w-full items-center justify-center gap-2 rounded bg-white py-3 font-medium text-stone-900 shadow-lg transition hover:bg-stone-50">
                    <ShoppingBag size={18} /> Детальніше
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-stone-900 transition group-hover:text-stone-600">
                  {product.title}
                </h3>
                <p className="mt-1 font-serif text-lg text-stone-500">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <a
            href="/catalog"
            className="rounded-full bg-stone-100 px-8 py-3 text-stone-800 transition hover:bg-stone-200"
          >
            Дивитися всі роботи
          </a>
        </div>
      </section>

      <section id="about" className="bg-stone-100 py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 md:flex-row">
          <div className="relative w-full md:w-1/2">
            <div className="absolute -left-4 -top-4 h-full w-full rounded-lg border-2 border-stone-300" />
            <Image
              src="/author.jpg"
              alt="Майстер за роботою"
              fill
              className="rounded-lg object-cover shadow-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="w-full space-y-6 md:w-1/2">
            <h2 className="font-serif text-4xl text-stone-800">Про майстра</h2>
            <p className="text-lg leading-relaxed text-stone-600">
              &ldquo;Привіт! Мене звати Олена. Вже понад 5 років я плету затишок
              для ваших осель. Все почалося з одного кошика для доньки, а
              переросло в справжню любов до паперової лози. У кожному виробі —
              частинка мого тепла.&rdquo;
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-stone-400" />
                <span className="text-stone-700">
                  Понад 500 задоволених клієнтів
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-stone-400" />
                <span className="text-stone-700">
                  Індивідуальний підхід до кожного замовлення
                </span>
              </div>
            </div>
            <button className="mt-4 border-b-2 border-stone-300 pb-1 text-stone-900 transition-colors hover:border-stone-900">
              Читати повну історію →
            </button>
          </div>
        </div>
      </section>

      <footer id="contacts" className="bg-stone-900 text-stone-300 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-white">Pletenie.Soul</h3>
            <p className="text-sm leading-relaxed opacity-70">
              Авторські плетені вироби з паперової лози.
              <br />
              Естетика, порядок та затишок у вашому домі.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="transition hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="transition hover:text-white">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-medium uppercase tracking-wider text-white">
              Меню
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/catalog" className="transition hover:text-white">
                  Каталог товарів
                </a>
              </li>
              <li>
                <a href="/order" className="transition hover:text-white">
                  Індивідуальне замовлення
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Оплата та доставка
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Догляд за виробами
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-medium uppercase tracking-wider text-white">
              Контакти
            </h4>
            <ul className="space-y-3 text-sm">
              <li>Київ, Україна (Доставка по всій Україні)</li>
              <li>
                <a
                  href="tel:+380990000000"
                  className="transition hover:text-white"
                >
                  +38 (099) 000-00-00
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@pletenie.ua"
                  className="transition hover:text-white"
                >
                  hello@pletenie.ua
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-7xl border-t border-stone-800 px-4 pt-8 text-center text-xs opacity-50">
          © 2024 Pletenie.Soul. Усі права захищено. Сайт зроблено з
          любов&apos;ю.
        </div>
      </footer>

      <a
        href="https://wa.me/380990000000"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-green-600 p-4 text-white shadow-xl transition-transform hover:scale-110 hover:bg-green-700"
        aria-label="Написати в WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
}
