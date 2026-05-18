"use server";

import { redirect } from "next/navigation";

import { createAdminSessionCookie, getAdminSession } from "@/lib/admin-session";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/infrastructure/db/prisma";

type LoginState = {
  error?: string;
};

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return {
      error: "Вкажи email та пароль.",
    };
  }

  if (!process.env.DATABASE_URL) {
    return {
      error: "DATABASE_URL не налаштований. Спочатку підключи базу.",
    };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) {
    return {
      error: "Невірний email або пароль.",
    };
  }

  await createAdminSessionCookie({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  redirect("/admin");
}

export async function redirectLoggedInUser() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }
}
