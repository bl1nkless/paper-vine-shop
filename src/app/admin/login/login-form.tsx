"use client";

import { useActionState } from "react";

import { loginAction } from "./actions";

const initialState = {
  error: "",
};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-400"
          placeholder="owner@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500"
        >
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-400"
          placeholder="change-me-before-production"
        />
      </div>

      {state.error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-stone-900 px-5 py-3 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Входимо..." : "Увійти в адмінку"}
      </button>
    </form>
  );
}
