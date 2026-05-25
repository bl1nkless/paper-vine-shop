import { redirectLoggedInUser } from "./actions";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  await redirectLoggedInUser();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#f4efe7,transparent_55%),linear-gradient(180deg,#eae3d9_0%,#f7f4ef_100%)] px-4 py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_24px_80px_rgba(60,40,20,0.12)] backdrop-blur">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
          Admin Access
        </p>
        <h1 className="serif-font mt-4 text-4xl text-stone-900">
          Pletenie.Soul
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-stone-600">
          Перший owner login для migration MVP. Після `db:seed-owner`
          використовуй `OWNER_EMAIL` та `OWNER_INITIAL_PASSWORD` з `.env`.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
