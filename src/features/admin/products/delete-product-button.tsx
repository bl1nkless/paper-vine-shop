"use client";

import React from "react";
import { deleteProductAction } from "./actions";

type Props = {
  id: string;
};

export function DeleteProductButton({ id }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    if (!confirm("Ви впевнені, що хочете видалити цей товар безповоротно?")) {
      e.preventDefault();
    }
  };

  return (
    <form action={deleteProductAction} onSubmit={handleSubmit} className="inline-block">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-full border border-red-200 px-4 py-2 text-xs uppercase tracking-[0.16em] text-red-600 transition hover:bg-red-50 hover:border-red-300 cursor-pointer font-medium"
      >
        Видалити
      </button>
    </form>
  );
}
