import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { ContactFooter } from "@/components/contact-footer";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata = {
  title: "Індивідуальне замовлення — Pletenie.Soul",
  description: "Замовте унікальний виріб з паперової лози за вашим ескізом",
};

export default function OrderPage() {
  const whatsappHref = buildWhatsAppLink(
    "Вітаю! Хочу обговорити індивідуальне замовлення."
  );
  const telegramHref = "https://t.me/pletenie_soul";

  return (
    <div className="flex min-h-screen flex-col bg-[#EDEAE5]">
      <Navbar />

      {/* Відступ для фіксованого хедера */}
      <div className="h-20" />

      {/* Main Content */}
      <main className="flex-grow">
        <section className="px-4 py-12 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
              {/* ЛІВА КОЛОНКА: Інформація */}
              <div className="fade-in-up" style={{ animationDelay: "0.1s" }}>
                <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.3em] text-gray-500 md:text-xs">
                  Індивідуальне замовлення
                </p>
                <h1 className="serif-font mb-8 text-4xl leading-tight text-[#1F1F1F] md:text-6xl">
                  Створю для вас <br />
                  <i className="font-light">унікальний виріб</i>
                </h1>

                <p className="mb-12 max-w-md text-lg font-light leading-relaxed text-gray-600">
                  У вас є особлива ідея або потрібен нестандартний розмір?
                  Напишіть мені, і ми разом створимо ідеальний виріб для вашого
                  дому.
                </p>

                <div className="mb-12 space-y-8">
                  <div>
                    <h4 className="mb-2 text-xs uppercase tracking-widest text-gray-400">
                      Як це працює
                    </h4>
                    <ul className="space-y-3 text-[#2D2D2D]">
                      <li className="flex items-start gap-3">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#778a54]" />
                        <span>
                          Ви описуєте свою ідею або надсилаєте референс
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#778a54]" />
                        <span>
                          Я розраховую вартість та терміни виготовлення
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#778a54]" />
                        <span>
                          Після узгодження починаю роботу над замовленням
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#778a54]" />
                        <span>
                          Відправляю готовий виріб з любов&apos;ю до вас!
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-2 text-xs uppercase tracking-widest text-gray-400">
                      Швидкий зв&apos;язок
                    </h4>
                    <div className="flex space-x-4">
                      <Link
                        href={whatsappHref}
                        target="_blank"
                        className="group flex items-center space-x-2 text-[#2D2D2D] transition hover:text-gray-600"
                      >
                        <span className="h-2 w-2 rounded-full bg-green-500 transition group-hover:bg-green-600" />
                        <span>WhatsApp</span>
                      </Link>
                      <Link
                        href={telegramHref}
                        target="_blank"
                        className="group flex items-center space-x-2 text-[#2D2D2D] transition hover:text-gray-600"
                      >
                        <span className="h-2 w-2 rounded-full bg-blue-500 transition group-hover:bg-blue-600" />
                        <span>Telegram</span>
                      </Link>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-xs uppercase tracking-widest text-gray-400">
                      Email для замовлень
                    </h4>
                    <Link
                      href="mailto:order@pletenie.ua"
                      className="serif-font text-2xl text-[#2D2D2D] transition hover:text-gray-600"
                    >
                      order@pletenie.ua
                    </Link>
                  </div>
                </div>
              </div>

              {/* ПРАВА КОЛОНКА: Форма та Фото */}
              <div
                className="fade-in-up space-y-8"
                style={{ animationDelay: "0.3s" }}
              >
                {/* Картка з фото */}
                <div className="relative h-64 overflow-hidden rounded-xl shadow-sm">
                  <Image
                    src="/artisan_working.png"
                    alt="Майстерня"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* Форма */}
                <div className="rounded-2xl border border-white bg-white p-8 shadow-lg shadow-gray-200/50 md:p-10">
                  <h3 className="serif-font mb-6 text-2xl">Залишити заявку</h3>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-1">
                        <label
                          htmlFor="name"
                          className="text-xs uppercase tracking-wider text-gray-500"
                        >
                          Ваше ім&apos;я
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full border-b border-[#A09C96] bg-transparent py-2 placeholder-gray-300 transition focus:border-[#2D2D2D] focus:outline-none"
                          placeholder="Марія"
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="phone"
                          className="text-xs uppercase tracking-wider text-gray-500"
                        >
                          Телефон або Telegram
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className="w-full border-b border-[#A09C96] bg-transparent py-2 placeholder-gray-300 transition focus:border-[#2D2D2D] focus:outline-none"
                          placeholder="+38 (099) ... або @username"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="message"
                        className="text-xs uppercase tracking-wider text-gray-500"
                      >
                        Опишіть ваше замовлення
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full resize-none border-b border-[#A09C96] bg-transparent py-2 placeholder-gray-300 transition focus:border-[#2D2D2D] focus:outline-none"
                        placeholder="Наприклад: хочу кошик для білизни 40x30x60 см, колір — натуральний..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="mt-4 w-full rounded-full bg-[#1F1F1F] py-4 text-xs uppercase tracking-widest text-white shadow-xl transition hover:bg-[#3E3E3E]"
                    >
                      Надіслати заявку
                    </button>
                    <p className="mt-4 text-center text-[10px] leading-tight text-gray-400">
                      Відповім протягом 24 годин. Зазвичай швидше 😊
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ContactFooter />
    </div>
  );
}
