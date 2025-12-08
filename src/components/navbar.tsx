"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

import { buildWhatsAppLink } from "@/lib/whatsapp";

const navLinks = [
  { href: "/catalog", label: "Каталог" },
  { href: "/#about", label: "Про майстра" },
  { href: "/#benefits", label: "Догляд" },
  { href: "/#contacts", label: "Контакти" },
];

export function Navbar() {
  const pathname = usePathname();
  const whatsappHref = buildWhatsAppLink(
    "Вітаю! Хочу обговорити замовлення в Pletenie.Soul."
  );

  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#dcd9d4] bg-[#edeae5] backdrop-blur-md shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-12">
        <Link
          href="/"
          className="serif-font text-2xl font-semibold tracking-wide text-[#2d2d2d]"
        >
          Pletenie.Soul
        </Link>

        <div className="hidden items-center space-x-10 text-sm font-medium tracking-wide text-gray-600 md:flex">
          {navLinks.map((link) => {
            // Якоря (/#...) не подсвечиваются, только реальные страницы
            const isActive = link.href.startsWith("/#")
              ? false // якоря никогда не подсвечиваются как активные
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  // Базовые стили
                  "relative transition hover:text-black",
                  // Псевдоэлемент подчеркивания
                  "after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full",
                  "after:origin-left after:bg-black",
                  // Анимация появления слева направо
                  "after:scale-x-0 after:transition-transform after:duration-300",
                  "hover:after:scale-x-100",
                  // Активное состояние
                  isActive && "text-black after:scale-x-100"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href={whatsappHref}
            target="_blank"
            className="rounded-full bg-[#2d2d2d] px-6 py-2 text-xs uppercase tracking-widest text-white shadow-lg shadow-gray-400/20 transition duration-300 hover:bg-[#4a4a4a]"
          >
            Зв&apos;язатися
          </Link>
        </div>
      </nav>
    </header>
  );
}
