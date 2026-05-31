"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

import { signIn, auth } from "@/auth";

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

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "Невірний email або пароль.",
      };
    }

    throw error;
  }

  redirect("/admin");
}

export async function redirectLoggedInUser() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }
}
