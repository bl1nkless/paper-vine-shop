import { Instagram, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

import { buildWhatsAppLink } from "@/lib/whatsapp";

export function Footer() {
  const whatsappHref = buildWhatsAppLink(
    "Вітаю! Хочу замовити виріб з паперової лози."
  );

  return (
    <footer className="mt-16 border-t border-stone-200/80 bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-lg font-semibold text-stone-900">Pletenie.Soul</p>
          <p className="text-sm text-stone-500">
            Вироби з паперової лози, зроблені з турботою.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-stone-700">
          <Link
            href={whatsappHref}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-3 py-2 transition hover:-translate-y-0.5 hover:border-stone-300 hover:bg-white"
          >
            <MessageCircle size={16} />
            WhatsApp
          </Link>
          <Link
            href="mailto:hello@pletenie.ua"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-3 py-2 transition hover:-translate-y-0.5 hover:border-stone-300 hover:bg-white"
          >
            <Mail size={16} />
            hello@pletenie.ua
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-3 py-2 transition hover:-translate-y-0.5 hover:border-stone-300 hover:bg-white"
          >
            <Instagram size={16} />
            Instagram
          </Link>
        </div>
      </div>
    </footer>
  );
}
