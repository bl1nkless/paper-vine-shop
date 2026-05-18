import Link from "next/link";

import { requireAdminSession } from "@/lib/admin-session";

import { logoutAction } from "./logout-action";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireAdminSession();

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
              Admin Panel
            </p>
            <h1 className="serif-font text-2xl text-stone-900">Pletenie.Soul</h1>
          </div>

          <nav className="flex items-center gap-3 text-sm text-stone-600">
            <Link href="/admin" className="rounded-full px-4 py-2 hover:bg-stone-100">
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="rounded-full px-4 py-2 hover:bg-stone-100"
            >
              Products
            </Link>
            <span className="hidden rounded-full bg-stone-100 px-4 py-2 md:inline-flex">
              {session.email}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full border border-stone-300 px-4 py-2 transition hover:bg-stone-900 hover:text-white"
              >
                Вийти
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
    </div>
  );
}
